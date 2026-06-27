"use client";

import { useEffect } from "react";

export type CaseData = {
  title: string;
  meta: string;
  desc: string;
  video?: string;
  poster?: string;
  images: { full: string; thumb: string }[];
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
        </header>

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
      </div>
    </div>
  );
}
