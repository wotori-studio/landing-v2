import { OMOBA_LINKS } from "@/lib/links";

const social = [
  { label: "GitHub (open source)", href: OMOBA_LINKS.github },
  { label: "Twitter", href: OMOBA_LINKS.twitter },
  { label: "Discord", href: OMOBA_LINKS.discord },
  { label: "Telegram", href: OMOBA_LINKS.telegram },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-omoba-void py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 text-center sm:px-6">
        <div>
          <p className="font-display text-2xl font-bold text-white">O-MOBA</p>
          <p className="text-sm text-omoba-accent">omoba.io</p>
          <p className="mt-3 text-xs uppercase tracking-widest text-slate-500">
            Currently in early stages of development
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-omoba-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
          <a href="/privacy" className="hover:text-slate-300">
            Privacy policy
          </a>
          <a href="/terms" className="hover:text-slate-300">
            Terms of service
          </a>
        </div>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} O-MOBA
        </p>
      </div>
    </footer>
  );
}
