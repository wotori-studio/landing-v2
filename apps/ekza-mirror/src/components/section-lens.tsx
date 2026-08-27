import { Reveal } from "@/components/motion";
import { MIRROR_LINKS } from "@/lib/links";

type NodeIcon = "ledger" | "avatar" | "mirror";

type ChainNode = {
  step: string;
  name: string;
  role: string;
  body: string;
  href: string;
  external: boolean;
  icon: NodeIcon;
  terminal?: boolean;
};

const CHAIN: ChainNode[] = [
  {
    step: "01",
    name: "Ekza Stellar",
    role: "ownership · lineage · revenue shares",
    body: "The ledger underneath. Who made the asset, what it was derived from, and who gets paid when it travels.",
    href: MIRROR_LINKS.stellar,
    external: true,
    icon: "ledger",
  },
  {
    step: "02",
    name: "Ekza Avatar",
    role: "portable 3D identity",
    body: "The catalog: VRM and USDZ avatars carrying provenance and a SHA-256 you can check. Six verified avatars on devnet today.",
    href: MIRROR_LINKS.avatars,
    external: true,
    icon: "avatar",
  },
  {
    step: "03",
    name: "Ekza Mirror",
    role: "you wear it in the real world",
    body: "Point the rear camera at a friend. ARKit finds their body, RealityKit draws the avatar on top, you hit record.",
    href: "/",
    external: false,
    icon: "mirror",
    terminal: true,
  },
];

function NodeGlyph({ icon }: { icon: NodeIcon }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (icon === "ledger") {
    return (
      <svg {...common}>
        <path d="M12 2.8 21 7l-9 4.2L3 7l9-4.2Z" />
        <path d="M3 12l9 4.2L21 12" opacity="0.6" />
        <path d="M3 16.6l9 4.2 9-4.2" opacity="0.35" />
      </svg>
    );
  }
  if (icon === "avatar") {
    return (
      <svg {...common}>
        <circle cx="12" cy="6" r="3" />
        <path d="M12 9v5" />
        <path d="M12 14 8.5 21M12 14l3.5 7" />
        <path d="M7 11.5 12 10l5 1.5" opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="M12 3v18" />
      <path
        d="M15.4 7.2h2.2v9.6h-2.2z"
        fill="currentColor"
        stroke="none"
        opacity="0.55"
      />
    </svg>
  );
}

export function SectionLens() {
  return (
    <section
      id="lens"
      className="relative overflow-hidden border-t border-mirror-chrome/10 bg-mirror-deep py-24 sm:py-32"
    >
      <div
        className="mir-grain pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div
        aria-hidden
        className="bg-prism pointer-events-none absolute left-1/2 top-0 h-64 w-[min(120vw,900px)] -translate-x-1/2 opacity-[0.13] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal as="p" className="mir-kicker text-mirror-aqua">
            why mirror exists
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold tracking-[-0.02em] text-mirror-chrome sm:text-4xl md:text-5xl"
          >
            The fun end of a <span className="mir-grad">serious chain</span>.
          </Reveal>
          <Reveal
            as="p"
            delay={140}
            className="mt-5 max-w-xl text-base leading-relaxed text-mirror-silver sm:text-lg"
          >
            Ekza is about owning a 3D identity and carrying it anywhere. That is
            hard to feel in a wallet. So we built the end of the chain you can
            point at a friend.
          </Reveal>
        </div>

        {/* the chain rail — desktop only, aligns with the grid columns below */}
        <Reveal
          delay={180}
          className="relative mt-16 hidden md:block"
          aria-hidden="true"
        >
          <div className="relative flex items-center gap-6">
            <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
              style={{
                backgroundImage: "var(--mir-prism)",
                opacity: 0.55,
                maskImage:
                  "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              }}
            />
            {CHAIN.map((node) => (
              <div
                key={node.step}
                className="relative flex flex-1 justify-center"
              >
                {node.terminal ? (
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="bg-prism absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping" />
                    <span className="bg-prism relative h-3 w-3 rounded-full ring-4 ring-mirror-deep" />
                  </span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-mirror-silver/60 ring-4 ring-mirror-deep" />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <ol className="mt-12 grid grid-cols-1 gap-y-6 md:mt-4 md:grid-cols-3 md:gap-6 md:gap-y-0">
          {CHAIN.map((node, i) => (
            <Reveal
              as="li"
              key={node.name}
              delay={200 + i * 90}
              className="relative"
            >
              {/* stub up to the desktop rail */}
              <span
                aria-hidden="true"
                className="bg-prism absolute -top-4 left-1/2 hidden h-4 w-px opacity-45 md:block"
              />
              {/* mobile connector between stacked nodes */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="bg-prism absolute -top-6 left-8 h-6 w-px opacity-45 md:hidden"
                />
              )}

              <a
                href={node.href}
                {...(node.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { "aria-current": "page" as const })}
                className="group block h-full rounded-[17px]"
              >
                <div
                  className={`h-full rounded-[17px] p-px ${
                    node.terminal ? "bg-prism" : "bg-mirror-chrome/10"
                  }`}
                >
                  <div
                    className={`mir-glass mir-glass-hover flex h-full flex-col p-6 ${
                      node.terminal ? "!bg-mirror-surface" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          node.terminal
                            ? "text-mirror-chrome"
                            : "text-mirror-silver transition group-hover:text-mirror-chrome"
                        }
                      >
                        <NodeGlyph icon={node.icon} />
                      </span>
                      <span className="font-display text-xs font-semibold tracking-[0.3em] text-mirror-silver/50">
                        {node.step}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-lg font-semibold text-mirror-chrome">
                      {node.terminal ? (
                        <span className="mir-grad">{node.name}</span>
                      ) : (
                        node.name
                      )}
                    </h3>
                    <p className="mt-1 font-display text-[0.7rem] uppercase tracking-[0.24em] text-mirror-silver/70">
                      {node.role}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-mirror-silver">
                      {node.body}
                    </p>

                    <p className="mt-6 flex items-center gap-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
                      {node.terminal ? (
                        <span className="bg-prism rounded-full px-3 py-1 text-mirror-void">
                          you are here
                        </span>
                      ) : (
                        <span className="text-mirror-aqua transition group-hover:text-mirror-chrome">
                          {node.href.replace("https://", "")}
                          <span aria-hidden="true"> ↗</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </ol>

        <Reveal
          as="p"
          delay={480}
          className="mt-10 max-w-2xl text-sm text-mirror-silver/80"
        >
          One chain, three surfaces. Stellar keeps the receipts, Avatar keeps
          the identity, Mirror puts it on a human being standing in your
          kitchen.
        </Reveal>
      </div>
    </section>
  );
}
