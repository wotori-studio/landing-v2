import { Reveal } from "@/components/motion";

type Phase = {
  key: string;
  label: string;
  live: boolean;
  headline: string;
  items: string[];
};

const PHASES: Phase[] = [
  {
    key: "now",
    label: "now",
    live: true,
    headline: "The prototype runs.",
    items: [
      "Procedural volumetric avatar",
      "ARKit body-tracking runtime",
      "Avatar resolver — descriptors + provenance",
    ],
  },
  {
    key: "next",
    label: "next",
    live: false,
    headline: "Real characters step in.",
    items: [
      "VRM → ARKit USDZ retarget",
      "Real rigged Ekza characters",
      "In-app capture",
    ],
  },
  {
    key: "later",
    label: "later",
    live: false,
    headline: "More people, more worlds.",
    items: ["Multi-person tracking", "Share to feed", "Universe packs"],
  },
];

export function SectionRoadmap() {
  return (
    <section
      id="roadmap"
      className="relative overflow-hidden border-t border-mirror-chrome/10 bg-mirror-deep py-24 sm:py-32"
    >
      <div
        className="mir-grain pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal as="p" className="mir-kicker">
            where this goes
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold tracking-[-0.02em] text-mirror-chrome sm:text-4xl md:text-5xl"
          >
            Now, next, <span className="mir-grad">later</span>.
          </Reveal>
          <Reveal
            as="p"
            delay={140}
            className="mt-5 max-w-xl text-base leading-relaxed text-mirror-silver sm:text-lg"
          >
            Only the first column is real today. The other two are promises with
            dates we have not earned yet.
          </Reveal>
        </div>

        <div className="relative mt-16">
          {/* horizontal rail — desktop */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[7px] hidden h-px md:block"
            style={{
              backgroundImage: "var(--mir-prism)",
              opacity: 0.4,
              maskImage:
                "linear-gradient(90deg, #000 0%, #000 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, #000 0%, #000 70%, transparent 100%)",
            }}
          />

          <ol className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {PHASES.map((phase, i) => (
              <Reveal
                as="li"
                key={phase.key}
                delay={i * 110}
                className="relative pl-8 md:pl-0"
              >
                {/* vertical rail — mobile */}
                <span
                  aria-hidden="true"
                  className={`absolute left-[7px] top-6 w-px md:hidden ${
                    i < PHASES.length - 1 ? "-bottom-10" : "bottom-0"
                  }`}
                  style={{ backgroundImage: "var(--mir-prism)", opacity: 0.16 }}
                />

                <div className="absolute left-0 top-0 md:relative md:left-auto md:top-auto">
                  {phase.live ? (
                    <span className="relative flex h-[15px] w-[15px] items-center justify-center">
                      <span className="bg-prism absolute inline-flex h-full w-full rounded-full opacity-35 motion-safe:animate-ping" />
                      <span className="bg-prism relative block h-[13px] w-[13px] rounded-full ring-[5px] ring-mirror-deep" />
                    </span>
                  ) : (
                    <span className="relative flex h-[15px] w-[15px] items-center justify-center">
                      <span className="block h-[9px] w-[9px] rounded-full border border-mirror-silver/50 bg-mirror-deep ring-[5px] ring-mirror-deep" />
                    </span>
                  )}
                </div>

                <div className="md:mt-7">
                  <p className="flex flex-wrap items-center gap-3">
                    <span
                      className={`font-display text-[0.72rem] font-semibold uppercase tracking-[0.32em] ${
                        phase.live
                          ? "text-mirror-chrome"
                          : "text-mirror-silver/70"
                      }`}
                    >
                      {phase.label}
                    </span>
                    {phase.live && (
                      <span className="bg-prism rounded-full px-2.5 py-0.5 font-display text-[0.62rem] font-bold uppercase tracking-[0.18em] text-mirror-void">
                        live
                      </span>
                    )}
                  </p>

                  <h3
                    className={`mt-4 font-display text-xl font-semibold ${
                      phase.live
                        ? "text-mirror-chrome"
                        : "text-mirror-chrome/80"
                    }`}
                  >
                    {phase.headline}
                  </h3>

                  <ul className="mt-5 space-y-3">
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        className={`mir-glass rounded-xl px-4 py-3 text-sm leading-snug ${
                          phase.live
                            ? "text-mirror-chrome"
                            : "text-mirror-silver opacity-80"
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
