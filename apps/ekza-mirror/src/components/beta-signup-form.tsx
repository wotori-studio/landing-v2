"use client";

import { useId, useState, type FormEvent } from "react";

type SignupSource = "hero" | "final_cta";
type SubmitStatus = "idle" | "submitting" | "success" | "error";
type ShareStatus = "idle" | "shared" | "copied" | "manual";

type BetaSignupResponse = {
  ok?: boolean;
  message?: string;
  shareUrl?: string;
};

export function BetaSignupForm({
  source,
  className = "",
}: {
  source: SignupSource;
  className?: string;
}) {
  const inputId = useId();
  const noteId = `${inputId}-note`;
  const statusId = `${inputId}-status`;
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams(window.location.search);

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/beta-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") || ""),
          website: String(data.get("website") || ""),
          source,
          referralCode: params.get("ref") || "",
          utmSource: params.get("utm_source") || "",
          utmMedium: params.get("utm_medium") || "",
          utmCampaign: params.get("utm_campaign") || "",
          utmTerm: params.get("utm_term") || "",
          utmContent: params.get("utm_content") || "",
          referrerUrl: document.referrer,
        }),
      });
      const result = (await response
        .json()
        .catch(() => ({}))) as BetaSignupResponse;

      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(result.message || "We couldn't add you. Please try again.");
        return;
      }

      setShareUrl(result.shareUrl || "https://mirror.ekza.io");
      setStatus("success");
      setMessage(
        "You're on the beta list. Watch your inbox for the next wave."
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage("We couldn't add you. Check your connection and try again.");
    }
  }

  async function shareInvite() {
    const url = shareUrl || "https://mirror.ekza.io";
    const shareData = {
      title: "Ekza Mirror beta",
      text: "Point an iPhone at a friend. Turn them into an Ekza avatar. Join me in the beta.",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("shared");
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("manual");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`rounded-2xl border border-mirror-acid/30 bg-mirror-acid/[0.07] p-4 text-left sm:p-5 ${className}`.trim()}
        role="status"
      >
        <p className="font-display text-base font-semibold text-mirror-chrome">
          You&apos;re in.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-mirror-silver">
          {message}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={shareInvite}
            className="mir-btn-secondary min-h-11 px-4 py-2 text-xs"
          >
            Invite your test partner
          </button>
          <span className="text-xs text-mirror-silver/80" aria-live="polite">
            {shareStatus === "copied" ? "Invite link copied." : null}
            {shareStatus === "shared" ? "Invite ready to send." : null}
            {shareStatus === "manual" ? (
              <a
                href={shareUrl}
                className="text-mirror-chrome underline decoration-mirror-acid/60 underline-offset-4"
              >
                Open your invite link
              </a>
            ) : null}
          </span>
        </div>
      </div>
    );
  }

  return (
    <form className={className} onSubmit={submit}>
      <label htmlFor={inputId} className="sr-only">
        Email for your Ekza Mirror beta invitation
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={254}
          disabled={status === "submitting"}
          aria-describedby={`${noteId} ${statusId}`}
          placeholder="you@email.com"
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-mirror-chrome/20 bg-mirror-void/70 px-4 py-3 text-base text-mirror-chrome shadow-inner shadow-black/20 outline-none transition placeholder:text-mirror-silver/55 hover:border-mirror-chrome/35 focus:border-mirror-acid/70 focus:ring-2 focus:ring-mirror-acid/20 disabled:cursor-wait disabled:opacity-65"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="mir-btn-primary min-h-12 shrink-0 px-4 py-3 text-xs sm:px-6 sm:text-sm"
        >
          {status === "submitting" ? "Joining…" : "Join beta"}
        </button>
      </div>

      <div
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`${inputId}-website`}>Website</label>
        <input
          id={`${inputId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p
        id={noteId}
        className="mt-2.5 text-xs leading-relaxed text-mirror-silver/75"
      >
        Beta invites and essential App Store launch news only. Unsubscribe
        anytime.{" "}
        <a
          href="/privacy"
          className="text-mirror-silver underline decoration-mirror-silver/40 underline-offset-4 transition hover:text-mirror-chrome"
        >
          Privacy
        </a>
        .
      </p>
      <p
        id={statusId}
        className={`mt-2 min-h-5 text-sm ${
          status === "error" ? "text-red-300" : "text-mirror-silver"
        }`}
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
