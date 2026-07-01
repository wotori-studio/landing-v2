"use client";

import { useEffect } from "react";

export type CaseData = {
  title: string;
  meta: string;
  desc: string;
  video?: string;
  poster?: string;
  images?: { full: string; thumb: string }[];
  facts?: { label: string; value: string }[];
  link?: { href: string; label: string };
};

export default function CaseModal({
  data,
  onClose,
}: {
  data: CaseData;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="ws-modal"
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
      onClick={onClose}
    >
      <div className="ws-modal__panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="ws-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <header className="ws-modal__head">
          <p className="ws-modal__meta">{data.meta}</p>
          <h3 className="ws-modal__title">{data.title}</h3>
          <p className="ws-modal__desc">{data.desc}</p>
          {data.link && (
            <a
              className="ws-btn ws-btn--ghost ws-modal__link"
              href={data.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.link.label}
            </a>
          )}
        </header>

        {data.facts && data.facts.length > 0 && (
          <dl className="ws-modal__facts">
            {data.facts.map((f) => (
              <div className="ws-fact" key={f.label}>
                <dt className="ws-fact__label">{f.label}</dt>
                <dd className="ws-fact__value">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {data.video && (
          <div className="ws-modal__video">
            <video
              src={data.video}
              poster={data.poster}
              controls
              playsInline
              preload="metadata"
            />
          </div>
        )}

        {data.images && data.images.length > 0 && (
          <div className="ws-modal__gallery">
            {data.images.map((img, i) => (
              <a
                key={img.full}
                className="ws-shot"
                href={img.full}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.thumb} alt={`${data.title} render ${i + 1}`} loading="lazy" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
