import { Logo } from "@/components/logo";
import { MIRROR_LINKS } from "@/lib/links";

const ECOSYSTEM = [
  { label: "Ekza", href: MIRROR_LINKS.ekza },
  { label: "Ekza Avatar", href: MIRROR_LINKS.avatars },
  { label: "Ekza Stellar", href: MIRROR_LINKS.stellar },
  { label: "Ekza Space", href: MIRROR_LINKS.space },
];

const SOCIAL = [
  { label: "Discord", href: MIRROR_LINKS.discord },
  { label: "Telegram", href: MIRROR_LINKS.telegram },
  { label: "X", href: MIRROR_LINKS.twitter },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-mirror-void">
      <div className="mir-seam" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <Logo variant="full" />
            <p className="max-w-xs text-sm text-mirror-silver">
              Point the camera at a friend. They become an Ekza avatar. Hit
              record.
            </p>
            <p className="mir-kicker">prototype · iphone · on-device</p>
          </div>

          <div className="flex flex-wrap gap-10">
            <div className="flex flex-col gap-3">
              <p className="font-display text-xs uppercase tracking-[0.24em] text-mirror-silver/70">
                Ecosystem
              </p>
              <ul className="flex flex-col gap-2 text-sm text-mirror-silver">
                {ECOSYSTEM.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-mirror-chrome"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-display text-xs uppercase tracking-[0.24em] text-mirror-silver/70">
                Community
              </p>
              <ul className="flex flex-col gap-2 text-sm text-mirror-silver">
                {SOCIAL.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-mirror-chrome"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-mirror-silver/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            A{" "}
            <a
              href={MIRROR_LINKS.wotori}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mirror-silver transition hover:text-mirror-chrome"
            >
              Wotori Studio
            </a>{" "}
            project · part of the{" "}
            <a
              href={MIRROR_LINKS.ekza}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mirror-silver transition hover:text-mirror-chrome"
            >
              Ekza
            </a>{" "}
            ecosystem
          </p>
          <p>© {new Date().getFullYear()} Ekza Mirror</p>
        </div>
      </div>
    </footer>
  );
}
