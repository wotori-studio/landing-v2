import React from "react";

interface ProgramLink {
  label: string;
  href: string;
  external?: boolean;
}

interface ProgramPageProps {
  eyebrow: string;
  headline: string;
  oneLiner: string;
  body: string;
  deckHtmlHref: string;
  deckPdfHref: string;
  links?: ProgramLink[];
}

// Unlisted per-program landing used in accelerator applications.
// Not linked from site navigation; noindex is set by the route's metadata.
export function ProgramPage({
  eyebrow,
  headline,
  oneLiner,
  body,
  deckHtmlHref,
  deckPdfHref,
  links = [],
}: ProgramPageProps) {
  return (
    <main className="flex min-h-[calc(100svh-5rem)] items-center bg-ekza-surface font-ekza text-ekza-on dark:bg-[#0c0e12]">
      <div className="container mx-auto max-w-3xl px-6 py-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
          {eyebrow}
        </p>
        <h1 className="font-headline text-4xl font-bold leading-[1.05] tracking-tight text-ekza-on dark:text-white sm:text-5xl">
          {headline}
        </h1>
        <p className="mt-6 text-xl font-light text-ekza-on dark:text-white/90">
          {oneLiner}
        </p>
        <p className="mt-4 text-base leading-relaxed text-ekza-on-muted dark:text-white/70">
          {body}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={deckHtmlHref}
            className="inline-flex items-center rounded-full bg-ekza-primary px-6 py-3 text-sm font-semibold text-ekza-on-primary transition hover:-translate-y-0.5 hover:shadow-ekza-glow dark:bg-cyan-400 dark:text-black"
          >
            View the deck
          </a>
          <a
            href={deckPdfHref}
            className="inline-flex items-center rounded-full border border-ekza-border/40 px-6 py-3 text-sm font-semibold text-ekza-on transition hover:-translate-y-0.5 dark:border-white/20 dark:text-white"
          >
            Download PDF
          </a>
        </div>

        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="link font-medium"
              >
                {link.label} <span aria-hidden>→</span>
              </a>
            ))}
          </div>
        )}

        <p className="mt-12 text-sm text-ekza-on-muted dark:text-white/50">
          Dmitrii Sobolev (Wotori) · Founder ·{" "}
          <a href="mailto:wotorimovako@gmail.com" className="link">
            wotorimovako@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}

export default ProgramPage;
