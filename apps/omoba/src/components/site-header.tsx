"use client";

import { OMOBA_LINKS } from "@/lib/links";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const nav = [
  { label: "Vision", href: "#evolution" },
  { label: "Creators", href: "#creators" },
  { label: "Web3", href: "#tech" },
  { label: "Ecosystem", href: "#ecosystem" },
];

export function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-omoba-void/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-white sm:text-xl"
        >
          O-MOBA
          <span className="ml-1 text-xs font-normal text-omoba-accent/90">
            omoba.io
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-omoba-accent"
            >
              {item.label}
            </a>
          ))}
          <a
            href={OMOBA_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 transition hover:text-white"
            aria-label="O-MOBA on GitHub — open source"
            title="Open source on GitHub"
          >
            <GitHubIcon className="h-5 w-5" />
            <span className="hidden lg:inline">GitHub</span>
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={OMOBA_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white md:hidden"
            aria-label="O-MOBA on GitHub"
          >
            <GitHubIcon className="h-6 w-6" />
          </a>
          <a
            href={OMOBA_LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="omoba-btn-primary px-4 py-2 text-xs sm:px-6 sm:text-sm"
          >
            Join community
          </a>
        </div>
      </div>
    </header>
  );
}
