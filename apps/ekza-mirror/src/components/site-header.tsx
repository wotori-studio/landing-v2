"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { MIRROR_LINKS } from "@/lib/links";

const NAV = [
  { label: "How", href: "#how" },
  { label: "Avatars", href: "#avatars" },
  { label: "Lens", href: "#lens" },
  { label: "Tech", href: "#tech" },
  { label: "Roadmap", href: "#roadmap" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-mirror-void/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <a
          href="#top"
          className="rounded-lg transition hover:opacity-90"
          aria-label="Ekza Mirror — home"
        >
          <Logo variant="full" />
        </a>

        <nav
          className="hidden items-center gap-7 text-sm text-mirror-silver md:flex"
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-mirror-chrome"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={MIRROR_LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="mir-btn-primary px-4 py-2 text-xs sm:px-6 sm:text-sm"
          >
            Get on the list
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mir-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-lg border border-white/15 p-2 text-mirror-silver transition hover:border-white/30 hover:text-mirror-chrome md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* motif 1 — the seam runs under the header */}
      <div className="mir-seam" aria-hidden="true" />

      <nav
        id="mir-mobile-nav"
        aria-label="Primary mobile"
        hidden={!open}
        className="border-b border-white/5 bg-mirror-void/95 backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-white/5 py-3 text-sm text-mirror-silver transition hover:text-mirror-chrome"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
