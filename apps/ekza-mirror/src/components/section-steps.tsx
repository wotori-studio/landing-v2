import { Reveal } from "@/components/motion";

/* ------------------------------------------------------------------ *
 * Purpose-built diagrams — one per beat, no icon font, no emoji.
 * ------------------------------------------------------------------ */

const PRISM_STOPS = (
  <>
    <stop offset="0%" stopColor="#6EF244" />
    <stop offset="55%" stopColor="#B6FF1A" />
    <stop offset="100%" stopColor="#E7FFB0" />
  </>
);

/** A body outline caught inside a viewfinder. */
function DiagramPoint() {
  return (
    <svg viewBox="0 0 160 120" className="h-28 w-full" fill="none" aria-hidden focusable="false">
      <defs>
        <linearGradient id="mirStepPointPrism" x1="0" y1="0" x2="1" y2="1">
          {PRISM_STOPS}
        </linearGradient>
      </defs>
      {/* viewfinder brackets */}
      <g stroke="url(#mirStepPointPrism)" strokeWidth="2" strokeLinecap="round">
        <path d="M26 34V22h12M134 34V22h-12M26 86v12h12M134 86v12h-12" />
      </g>
      {/* framed body outline */}
      <g
        stroke="rgba(237,242,233,0.45)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="80" cy="40" r="9" />
        <path d="M80 49v26M80 55 66 68M80 55l14 13M73 75l-6 24M87 75l6 24" />
      </g>
      {/* scan sweep + focus dot */}
      <path d="M30 60h100" stroke="rgba(231,255,176,0.3)" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="80" cy="60" r="3" fill="#B6FF1A" />
      <circle cx="80" cy="60" r="9" stroke="rgba(182,255,26,0.4)" strokeWidth="1" />
    </svg>
  );
}

/** The same outline, now filled with the prism — the avatar has landed. */
function DiagramWear() {
  return (
    <svg viewBox="0 0 160 120" className="h-28 w-full" fill="none" aria-hidden focusable="false">
      <defs>
        <linearGradient id="mirStepWearPrism" x1="0.1" y1="0" x2="0.9" y2="1">
          {PRISM_STOPS}
        </linearGradient>
        <radialGradient id="mirStepWearGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#B6FF1A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#B6FF1A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="62" rx="52" ry="46" fill="url(#mirStepWearGlow)" />
      {/* ghost of the real body underneath */}
      <g stroke="rgba(237,242,233,0.16)" strokeWidth="2" strokeLinecap="round">
        <circle cx="74" cy="41" r="8" />
        <path d="M74 49v25M74 55 62 67M74 55l12 12M68 74l-5 24M80 74l5 24" />
      </g>
      {/* avatar volume on top */}
      <g stroke="url(#mirStepWearPrism)" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="80" cy="40" r="10" strokeWidth="2.5" fill="url(#mirStepWearPrism)" fillOpacity="0.25" />
        <path d="M80 50v26" strokeWidth="17" strokeOpacity="0.28" />
        <path d="M80 50v26M80 56 66 69M80 56l14 13M73 76l-6 23M87 76l6 23" strokeWidth="2.5" />
      </g>
      {/* joints */}
      <g fill="#EDF2E9">
        <circle cx="80" cy="50" r="2.2" />
        <circle cx="66" cy="69" r="2.2" />
        <circle cx="94" cy="69" r="2.2" />
        <circle cx="67" cy="99" r="2.2" />
        <circle cx="93" cy="99" r="2.2" />
      </g>
    </svg>
  );
}

/** Record dot, timecode, waveform. */
function DiagramRecord() {
  return (
    <svg viewBox="0 0 160 120" className="h-28 w-full" fill="none" aria-hidden focusable="false">
      <defs>
        <linearGradient id="mirStepRecPrism" x1="0" y1="0" x2="1" y2="0">
          {PRISM_STOPS}
        </linearGradient>
      </defs>
      <circle cx="52" cy="52" r="24" stroke="rgba(237,242,233,0.2)" strokeWidth="2" />
      <circle
        cx="52"
        cy="52"
        r="24"
        stroke="url(#mirStepRecPrism)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="98 152"
      />
      <circle cx="52" cy="52" r="11" fill="#B6FF1A" className="animate-pulse motion-reduce:animate-none" />
      <text
        x="90"
        y="46"
        fill="#EDF2E9"
        fontSize="17"
        letterSpacing="1.6"
        className="font-display"
      >
        00:07
      </text>
      <text
        x="90"
        y="62"
        fill="#9AA79A"
        fontSize="8"
        letterSpacing="2.4"
        className="font-display"
      >
        REC · LOCAL
      </text>
      <g stroke="url(#mirStepRecPrism)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M26 100v-8M38 100v-16M50 100v-24M62 100v-13M74 100v-19M86 100v-7M98 100v-14M110 100v-5M122 100v-11M134 100v-6" />
      </g>
    </svg>
  );
}

const STEPS = [
  {
    id: "01",
    title: "Point",
    diagram: <DiagramPoint />,
    body: "Aim the rear camera at a friend. ARKit body tracking finds their skeleton — one person, full body in frame, decent light.",
    note: "no cloud vision",
  },
  {
    id: "02",
    title: "Wear",
    diagram: <DiagramWear />,
    body: "A volumetric avatar snaps onto the joints and copies every move, rendered live by RealityKit on the phone itself.",
    note: "runs on-device",
  },
  {
    id: "03",
    title: "Record",
    diagram: <DiagramRecord />,
    body: "Hit record, keep the clip, send it wherever you like. Camera frames never leave the iPhone on the way there.",
    note: "your footage, your phone",
  },
];

export function SectionSteps() {
  return (
    <section
      id="how"
      className="relative overflow-hidden border-t border-mirror-chrome/10 bg-mirror-deep py-24 sm:py-32"
    >
      <div className="mir-grain pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal as="p" className="mir-kicker text-mirror-bone">
            three beats
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold tracking-[-0.02em] text-mirror-chrome sm:text-4xl md:text-5xl"
          >
            Point. Wear. <span className="mir-grad">Record.</span>
          </Reveal>
          <Reveal
            as="p"
            delay={140}
            className="mt-5 text-base leading-relaxed text-mirror-silver sm:text-lg"
          >
            The whole loop is three moves and about ten seconds. Nothing to set
            up, nothing to upload.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.id}
              delay={i * 110}
              className="mir-glass mir-glass-hover group relative overflow-hidden rounded-2xl p-6 sm:p-7"
            >
              <span
                aria-hidden
                className="absolute right-5 top-4 font-display text-5xl font-bold leading-none tracking-tight text-mirror-chrome/[0.07] transition-colors duration-300 group-hover:text-mirror-chrome/[0.12]"
              >
                {step.id}
              </span>

              <div className="relative">{step.diagram}</div>

              <div className="mir-seam mt-5" aria-hidden />

              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-mirror-chrome">
                <span className="mr-2 text-mirror-silver/60">{step.id}</span>
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mirror-silver">
                {step.body}
              </p>
              <p className="mt-4 font-display text-[0.62rem] uppercase tracking-[0.24em] text-mirror-bone">
                {step.note}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
