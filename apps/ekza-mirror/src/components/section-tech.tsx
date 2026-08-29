import { Reveal } from "@/components/motion";

const PIPELINE = [
  {
    tag: "tracking",
    title: "ARKit body tracking",
    body: "ARBodyTrackingConfiguration on the rear camera finds a real person and returns a 3D skeleton. We smooth the joints so the avatar moves like a body, not a spreadsheet.",
  },
  {
    tag: "rendering",
    title: "RealityKit avatar",
    body: "A volumetric avatar is drawn on top of those joints, in the same space as the room. Procedural today; real rigged Ekza characters are the next milestone.",
  },
];

const REQUIREMENTS = [
  { value: "iOS 17+", label: "minimum system" },
  { value: "A12 Bionic", label: "chip, or newer" },
  { value: "Rear camera", label: "body tracking input" },
  { value: "No simulator", label: "device only" },
];

const LIMITS = [
  {
    head: "One person at a time",
    body: "Body tracking locks onto a single skeleton. Multi-person is on the roadmap, not in the build.",
  },
  {
    head: "Full body in frame",
    body: "Legs included. Step back until the whole person fits, or the skeleton will not lock.",
  },
  {
    head: "Good light helps",
    body: "Dim rooms make the joints jitter. Daylight or a lamp behind you gets you clean motion.",
  },
  {
    head: "The avatar covers, it does not erase",
    body: "We draw the avatar over the person. We do not rebuild the background behind them, so expect an edge, not a magic trick.",
  },
];

function OnDeviceGlyph() {
  return (
    <svg
      viewBox="0 0 168 100"
      role="img"
      aria-label="Diagram: camera frames loop inside the iPhone and never reach the cloud"
      className="h-auto w-full max-w-[280px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="8" width="54" height="84" rx="10" />
      <path d="M27 8h16" opacity="0.7" />
      <circle cx="35" cy="50" r="17" strokeDasharray="3 5" opacity="0.75" />
      <path d="M40 30l-5 3 5 3" />
      <circle cx="35" cy="47" r="4" opacity="0.9" />
      <path d="M35 51v9M35 55l-5 6M35 55l5 6" opacity="0.9" />
      <path
        d="M112 62a9 9 0 0 1 1-17.9 13 13 0 0 1 24.6 3.7A9 9 0 0 1 136 62z"
        strokeDasharray="4 5"
        opacity="0.4"
      />
      <path d="M96 78 154 30" opacity="0.55" />
      <path d="M70 46h22M86 40l6 6-6 6" opacity="0.35" strokeDasharray="3 4" />
    </svg>
  );
}

export function SectionTech() {
  return (
    <section
      id="tech"
      className="relative overflow-hidden border-t border-mirror-chrome/10 bg-mirror-void py-24 sm:py-32"
    >
      <div
        className="mir-grain pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal as="p" className="mir-kicker text-mirror-bone">
            the honest part
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold tracking-[-0.02em] text-mirror-chrome sm:text-4xl md:text-5xl"
          >
            It all happens on <span className="mir-grad">your phone</span>.
          </Reveal>
        </div>

        {/* headline claim: on-device privacy */}
        <Reveal
          delay={140}
          className="mir-glass mir-glass-hover relative mt-12 overflow-hidden rounded-3xl p-6 sm:p-10"
        >
          <div
            aria-hidden="true"
            className="bg-prism pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.09] blur-3xl"
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <div className="md:flex-1">
              <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-mirror-acid">
                on-device
              </p>
              <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-mirror-chrome sm:text-3xl">
                Camera frames never leave the iPhone.
              </h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-mirror-silver sm:text-lg">
                No cloud vision. No external ML services. Tracking and rendering
                both run on the device in your hand — the footage is yours until
                you decide to share the clip.
              </p>
            </div>
            <div className="text-mirror-silver/70 md:w-[300px] md:shrink-0">
              <OnDeviceGlyph />
            </div>
          </div>
        </Reveal>

        {/* pipeline */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PIPELINE.map((item, i) => (
            <Reveal
              key={item.title}
              delay={200 + i * 90}
              className="mir-glass mir-glass-hover rounded-2xl p-6 sm:p-8"
            >
              <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-mirror-bone">
                {item.tag}
              </p>
              <h3 className="mt-4 font-display text-lg font-semibold text-mirror-chrome">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mirror-silver">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>

        {/* requirements strip */}
        <Reveal delay={280} className="mt-6">
          <h3 className="sr-only">Requirements</h3>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {REQUIREMENTS.map((req) => (
              <li key={req.value} className="mir-stat rounded-2xl">
                <span className="font-display text-base font-bold tracking-[-0.01em] text-mirror-chrome sm:text-lg">
                  {req.value}
                </span>
                <span className="mir-stat__label uppercase">{req.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* current limits */}
        <Reveal delay={340} className="mt-14">
          <div className="mir-seam" aria-hidden="true" />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mir-kicker">current limits</p>
              <h3 className="mt-4 font-display text-2xl font-bold text-mirror-chrome sm:text-3xl">
                What it can&apos;t do yet.
              </h3>
            </div>
            <p className="max-w-xs text-sm text-mirror-silver/80 sm:text-right">
              A prototype that tells you where its edges are is a prototype you
              can trust.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {LIMITS.map((limit, i) => (
              <li key={limit.head} className="relative pl-8">
                <span
                  aria-hidden="true"
                  className="bg-prism absolute inset-y-1 left-0 w-px opacity-35"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-0.5 font-display text-[0.65rem] font-semibold tracking-[0.14em] text-mirror-silver/50"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="font-display text-base font-semibold text-mirror-chrome">
                  {limit.head}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-mirror-silver">
                  {limit.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
