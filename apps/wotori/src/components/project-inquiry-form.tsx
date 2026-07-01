"use client";

import { useState } from "react";
import { useI18n } from "../lib/i18n-provider";

const BUDGET_KEYS = ["budget0", "budget1", "budget2", "budget3"];

type Status = "idle" | "submitting" | "success" | "error";

export default function ProjectInquiryForm() {
  const { t } = useI18n();
  const k = (key: string) => t(`wotori.studio.form.${key}`);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      budget: String(data.get("budget") || ""),
      timeline: String(data.get("timeline") || ""),
      message: String(data.get("message") || ""),
      company_url: String(data.get("company_url") || ""), // honeypot
    };

    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/inquiries/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({ ok: false }));
      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.message || k("errorGeneric"));
      }
    } catch {
      setStatus("error");
      setErrorMsg(k("errorGeneric"));
    }
  }

  if (status === "success") {
    return (
      <div className="ws-form ws-form--success" role="status">
        <p className="ws-form__successTitle">{k("successTitle")}</p>
        <p className="ws-form__successBody">{k("successBody")}</p>
      </div>
    );
  }

  return (
    <form className="ws-form" onSubmit={onSubmit} noValidate>
      <div className="ws-form__row">
        <label className="ws-field">
          <span className="ws-field__label">{k("nameLabel")}</span>
          <input
            className="ws-field__input"
            name="name"
            type="text"
            required
            maxLength={200}
            autoComplete="name"
            placeholder={k("namePlaceholder")}
          />
        </label>
        <label className="ws-field">
          <span className="ws-field__label">{k("emailLabel")}</span>
          <input
            className="ws-field__input"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder={k("emailPlaceholder")}
          />
        </label>
      </div>

      <div className="ws-form__row">
        <label className="ws-field">
          <span className="ws-field__label">{k("budgetLabel")}</span>
          <select className="ws-field__input ws-field__select" name="budget" defaultValue="">
            <option value="" disabled hidden>
              {k("budgetPlaceholder")}
            </option>
            {BUDGET_KEYS.map((key) => (
              <option key={key} value={k(key)}>
                {k(key)}
              </option>
            ))}
          </select>
        </label>
        <label className="ws-field">
          <span className="ws-field__label">{k("timelineLabel")}</span>
          <input
            className="ws-field__input"
            name="timeline"
            type="text"
            maxLength={200}
            placeholder={k("timelinePlaceholder")}
          />
        </label>
      </div>

      <label className="ws-field">
        <span className="ws-field__label">{k("messageLabel")}</span>
        <textarea
          className="ws-field__input ws-field__textarea"
          name="message"
          required
          maxLength={4000}
          rows={5}
          placeholder={k("messagePlaceholder")}
        />
      </label>

      {/* Honeypot — hidden from humans, tempting to bots */}
      <div className="ws-honeypot" aria-hidden="true">
        <label>
          Company URL
          <input name="company_url" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p className="ws-form__error" role="alert">
          {errorMsg}
        </p>
      )}

      <div className="ws-form__actions">
        <button
          type="submit"
          className="ws-btn ws-btn--primary"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? k("submitting") : k("submit")}
          {status !== "submitting" && (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <span className="ws-form__privacy">{k("privacy")}</span>
      </div>
    </form>
  );
}
