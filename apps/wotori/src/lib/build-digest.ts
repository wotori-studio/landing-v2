import { createServerClient } from "./supabase";

// Same bot heuristic + production-domain filter used in the traffic analysis,
// so the digest counts real humans, not crawlers or preview deploys.
const BOT =
  /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|python|curl|wget|go-http|axios|node-fetch|okhttp|java\/|libwww|scrapy|semrush|ahrefs|dataforseo|bytespider|gptbot|claudebot|ccbot|amazonbot|petalbot|dotbot|mj12|yandex.*bot|facebookexternalhit|preview|monitor|uptime|pingdom|lighthouse|vercel|screaming/i;

const isProd = (d: string) =>
  /^(www\.)?(wotori\.io|wotori\.com|ekza\.io)$/.test(d);

type Row = {
  domain: string;
  user_agent: string | null;
  visitor_hash: string | null;
  country: string | null;
  created_at: string;
};

const DAY = 86_400_000;

function uniq(rows: Row[]): number {
  return new Set(rows.map((r) => r.visitor_hash).filter(Boolean)).size;
}

function delta(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "📈 new" : "➡️ 0%";
  const pct = Math.round(((current - previous) / previous) * 100);
  const arrow = pct > 0 ? "📈" : pct < 0 ? "📉" : "➡️";
  return `${arrow} ${pct >= 0 ? "+" : ""}${pct}%`;
}

/**
 * Builds a daily traffic digest (human-only) as a Telegram-ready string.
 * Returns null if the Supabase read fails.
 */
export async function buildDigest(): Promise<string | null> {
  try {
    const supabase = createServerClient();
    const since = new Date(Date.now() - 14 * DAY).toISOString();

    const { data, error } = await supabase
      .from("analytics_events")
      .select("domain,user_agent,visitor_hash,country,created_at")
      .gte("created_at", since);

    if (error) {
      console.error("[Digest] fetch error:", error);
      return null;
    }

    const rows = ((data ?? []) as Row[]).filter(
      (r) => isProd(r.domain) && r.user_agent && !BOT.test(r.user_agent)
    );

    const now = Date.now();
    const win = (a: number, b: number) =>
      rows.filter((r) => {
        const t = new Date(r.created_at).getTime();
        return t >= a && t < b;
      });

    const today = win(now - DAY, now + 1);
    const yesterday = win(now - 2 * DAY, now - DAY);
    const week = win(now - 7 * DAY, now + 1);
    const prevWeek = win(now - 14 * DAY, now - 7 * DAY);

    // Top countries over the last 7 days (daily numbers are too small).
    const cc: Record<string, number> = {};
    for (const r of week) {
      const k = r.country || "?";
      cc[k] = (cc[k] || 0) + 1;
    }
    const topCountries =
      Object.entries(cc)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k, v]) => `${k} ${v}`)
        .join(" · ") || "—";

    // Which site leads this week (unique humans per domain).
    const perDomain: Record<string, Row[]> = {};
    for (const r of week) {
      const key = r.domain.replace(/^www\./, "");
      (perDomain[key] = perDomain[key] || []).push(r);
    }
    const domLine =
      Object.entries(perDomain)
        .map(([d, rs]) => [d, uniq(rs)] as [string, number])
        .sort((a, b) => b[1] - a[1])
        .map(([d, u]) => `${d} ${u}`)
        .join(" · ") || "—";

    const uToday = uniq(today);
    const uYest = uniq(yesterday);
    const uWeek = uniq(week);
    const uPrev = uniq(prevWeek);

    return [
      "📊 wotori.io — daily digest",
      "",
      `👥 Today: ${uToday} unique (${delta(uToday, uYest)} vs yesterday ${uYest})`,
      `🗓 7-day: ${uWeek} unique (${delta(uWeek, uPrev)} vs prev week ${uPrev})`,
      `👁 Views 7d: ${week.length} human`,
      `🌍 Top 7d: ${topCountries}`,
      `🔗 Sites 7d: ${domLine}`,
    ].join("\n");
  } catch (err) {
    console.error("[Digest] unexpected error:", err);
    return null;
  }
}
