import { Reveal } from "@/components/motion";
import { MIRROR_LINKS } from "@/lib/links";

function DiscordIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}

export function SectionCta() {
  return (
    <section
      id="waitlist"
      className="mir-mesh relative overflow-hidden border-t border-mirror-chrome/10 py-24 sm:py-32"
    >
      <div
        className="mir-grain pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="relative">
          {/* prism light spilling out from behind the panel */}
          <div
            aria-hidden="true"
            className="bg-prism pointer-events-none absolute -inset-6 rounded-[40px] opacity-[0.14] blur-3xl sm:-inset-10"
          />

          <div className="bg-prism relative rounded-[28px] p-px">
            <div className="relative overflow-hidden rounded-[27px] bg-mirror-surface px-6 py-16 text-center sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="bg-prism pointer-events-none absolute -left-24 -top-32 h-72 w-72 rounded-full opacity-[0.12] blur-3xl"
              />

              <div className="relative">
                <p className="mir-kicker justify-center text-mirror-acid">
                  the list
                </p>

                <h2 className="mt-6 font-display text-4xl font-bold leading-[1.03] tracking-[-0.02em] text-mirror-chrome sm:text-5xl md:text-6xl">
                  Get on the <span className="mir-grad">list</span>.
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-base text-mirror-silver sm:text-lg">
                  We hand the first build to the people already in the room.
                  Point, wear, record — then tell us what broke.
                </p>

                <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={MIRROR_LINKS.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mir-btn-primary inline-flex items-center justify-center gap-2.5"
                  >
                    <DiscordIcon />
                    Join Discord
                  </a>
                  <a
                    href={MIRROR_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mir-btn-secondary inline-flex items-center justify-center gap-2.5"
                  >
                    <TelegramIcon />
                    Telegram
                  </a>
                  <a
                    href={MIRROR_LINKS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mir-btn-secondary inline-flex items-center justify-center gap-2.5"
                  >
                    <XIcon />
                    Follow on X
                  </a>
                </div>

                <div className="mx-auto mt-12 max-w-sm">
                  <div className="mir-seam" aria-hidden="true" />
                  <p className="mt-5 font-display text-[0.7rem] uppercase tracking-[0.22em] text-mirror-silver/70">
                    Prototype. iPhone only. Sign-ups get the first build.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
