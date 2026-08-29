import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";
import { checkBetaSignupRateLimit } from "@/lib/beta-signup-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SignupSource = "hero" | "final_cta" | "header";
type JsonObject = Record<string, unknown>;

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
  referralSecret: string;
};

class SupabaseRequestError extends Error {
  constructor(
    readonly operation: "referral_lookup" | "signup_insert",
    readonly status?: number
  ) {
    super(`Supabase ${operation} failed`);
  }
}

const SOURCES = new Set<SignupSource>(["hero", "final_cta", "header"]);
const EMAIL_PATTERN =
  /^(?=.{1,64}@)[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const REFERRAL_CODE_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;
const CONSENT_VERSION_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;
const MAX_REQUEST_BYTES = 16 * 1024;
const SUPABASE_TIMEOUT_MS = 8_000;
const DEFAULT_CONSENT_VERSION = "mirror-beta-v1";

function json(
  body: JsonObject,
  status = 200,
  extraHeaders?: Record<string, string>
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function replaceControlCharacters(value: string): string {
  let result = "";
  for (const character of value) {
    const code = character.charCodeAt(0);
    result += code <= 31 || code === 127 ? " " : character;
  }
  return result;
}

function getString(
  body: JsonObject,
  keys: readonly string[],
  maxLength: number
): string | null {
  for (const key of keys) {
    const value = body[key];
    if (typeof value !== "string") continue;

    const normalized = replaceControlCharacters(
      value.slice(0, maxLength)
    ).trim();
    if (normalized) return normalized;
  }

  return null;
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return null;
  }

  return email;
}

function getSource(body: JsonObject): SignupSource {
  const source = getString(body, ["source"], 32);
  return source && SOURCES.has(source as SignupSource)
    ? (source as SignupSource)
    : "hero";
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const candidates = [
    forwarded?.split(",")[0],
    request.headers.get("x-real-ip"),
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value && value.length <= 64 && isIP(value)) return value.toLowerCase();
  }

  return "unknown";
}

function normalizeReferrer(value: string | null): string | null {
  if (!value || value.length > 2048) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    url.username = "";
    url.password = "";
    url.hash = "";
    const normalized = url.toString();
    return normalized.length <= 2048 ? normalized : null;
  } catch {
    return null;
  }
}

function getConsentVersion(): string {
  const configured = process.env.BETA_SIGNUP_CONSENT_VERSION?.trim();
  return configured && CONSENT_VERSION_PATTERN.test(configured)
    ? configured
    : DEFAULT_CONSENT_VERSION;
}

function getSupabaseConfig(): SupabaseConfig | null {
  const rawUrl = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!rawUrl || !serviceRoleKey) {
    const missing = [
      !rawUrl && "SUPABASE_URL",
      !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter(Boolean);
    console.error(
      `[mirror-beta] Missing server configuration: ${missing.join(", ")}`
    );
    return null;
  }

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return {
      url: url.toString().replace(/\/$/, ""),
      serviceRoleKey,
      // A dedicated secret keeps codes stable across service-role rotations, but
      // is optional. The domain-separated fallback requires no new production
      // secret and cannot be confused with the Supabase credential itself.
      referralSecret: createHmac(
        "sha256",
        process.env.BETA_SIGNUP_REFERRAL_SECRET?.trim() || serviceRoleKey
      )
        .update("ekza-mirror-beta:referral-key:v1", "utf8")
        .digest("base64url"),
    };
  } catch {
    console.error("[mirror-beta] SUPABASE_URL is invalid");
    return null;
  }
}

function getReferralCode(email: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`ekza-mirror-beta:v1:${email}`, "utf8")
    .digest("base64url")
    .slice(0, 22);
}

function getRequestedReferralCode(body: JsonObject): string | null {
  const code = getString(
    body,
    ["referralCode", "referredByCode", "referred_by_code", "ref"],
    64
  );
  return code && REFERRAL_CODE_PATTERN.test(code) ? code : null;
}

function getShareUrl(request: NextRequest, referralCode?: string): string {
  const configured = process.env.MIRROR_PUBLIC_URL?.trim();
  let url: URL;

  try {
    url = new URL(configured || request.nextUrl.origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Unsupported public URL protocol");
    }
  } catch {
    url = new URL("https://mirror.ekza.io");
  }

  url.pathname = "/";
  url.search = "";
  url.hash = "";
  if (referralCode) url.searchParams.set("ref", referralCode);
  return url.toString();
}

function getSupabaseHeaders(config: SupabaseConfig): Record<string, string> {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    Accept: "application/json",
    "Accept-Profile": "public",
  };
}

async function resolveReferralCode(
  requestedCode: string | null,
  ownCode: string,
  config: SupabaseConfig
): Promise<string | null> {
  if (!requestedCode || requestedCode === ownCode) return null;

  const url = new URL(`${config.url}/rest/v1/mirror_beta_signups`);
  url.searchParams.set("select", "referral_code");
  url.searchParams.set("referral_code", `eq.${requestedCode}`);
  url.searchParams.set("limit", "1");

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: getSupabaseHeaders(config),
      cache: "no-store",
      signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
    });
  } catch {
    throw new SupabaseRequestError("referral_lookup");
  }

  if (!response.ok) {
    throw new SupabaseRequestError("referral_lookup", response.status);
  }

  let rows: unknown;
  try {
    rows = await response.json();
  } catch {
    throw new SupabaseRequestError("referral_lookup", response.status);
  }

  return Array.isArray(rows) && rows.length > 0 ? requestedCode : null;
}

async function insertSignup(
  payload: JsonObject,
  config: SupabaseConfig
): Promise<void> {
  const url = new URL(`${config.url}/rest/v1/mirror_beta_signups`);
  url.searchParams.set("on_conflict", "email");

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        ...getSupabaseHeaders(config),
        "Content-Type": "application/json",
        "Content-Profile": "public",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
    });
  } catch {
    throw new SupabaseRequestError("signup_insert");
  }

  if (!response.ok) {
    throw new SupabaseRequestError("signup_insert", response.status);
  }
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return json({ ok: false, message: "Invalid request." }, 413);
  }

  const rate = checkBetaSignupRateLimit(getClientIp(request));
  if (!rate.allowed) {
    return json(
      { ok: false, message: "Too many attempts. Please try again soon." },
      429,
      { "Retry-After": String(rate.retryAfter || 600) }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  if (!isJsonObject(body)) {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  // Honeypot: real users never fill this field. Give bots a normal-looking
  // response without writing anything or revealing that they were detected.
  if (getString(body, ["website", "company_url"], 256)) {
    return json({ ok: true, shareUrl: getShareUrl(request) });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return json(
      { ok: false, message: "Please enter a valid email address." },
      400
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return json(
      {
        ok: false,
        message: "Beta signup is temporarily unavailable. Please try again.",
      },
      503
    );
  }

  const referralCode = getReferralCode(email, config.referralSecret);

  try {
    const referredByCode = await resolveReferralCode(
      getRequestedReferralCode(body),
      referralCode,
      config
    );
    const bodyReferrer = getString(body, ["referrerUrl", "referrer_url"], 2048);

    await insertSignup(
      {
        email,
        source: getSource(body),
        referral_code: referralCode,
        referred_by_code: referredByCode,
        utm_source: getString(body, ["utmSource", "utm_source"], 200),
        utm_medium: getString(body, ["utmMedium", "utm_medium"], 200),
        utm_campaign: getString(body, ["utmCampaign", "utm_campaign"], 200),
        utm_term: getString(body, ["utmTerm", "utm_term"], 200),
        utm_content: getString(body, ["utmContent", "utm_content"], 200),
        referrer_url: normalizeReferrer(
          bodyReferrer || request.headers.get("referer")
        ),
        consent_version: getConsentVersion(),
        consented_at: new Date().toISOString(),
      },
      config
    );
  } catch (error) {
    if (error instanceof SupabaseRequestError) {
      console.error("[mirror-beta] Supabase request failed", {
        operation: error.operation,
        status: error.status || "network_or_invalid_response",
      });
    } else {
      console.error("[mirror-beta] Unexpected signup failure");
    }

    return json(
      {
        ok: false,
        message: "Beta signup is temporarily unavailable. Please try again.",
      },
      503
    );
  }

  // The same opaque response is returned for first-time and duplicate emails.
  return json({ ok: true, shareUrl: getShareUrl(request, referralCode) });
}
