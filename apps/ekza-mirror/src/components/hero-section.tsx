"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Reveal } from "@/components/motion";
import { MIRROR_LINKS } from "@/lib/links";

const STATS = [
  { metric: "on-device", label: "Frames never leave the phone" },
  { metric: "1 tap", label: "Record & share" },
  { metric: "iOS 17+", label: "A12 Bionic or newer" },
];

// One type ramp, used twice: once for the headline, once for its reflection.
const H1_TYPE =
  "font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]";

/* ------------------------------------------------------------------ *
 * Mirror wipe
 * ------------------------------------------------------------------ */

const REST = 55; // seam position, % from the left edge
const SWEEP_MIN = 24;
const SWEEP_MAX = 80;
const SWEEP_MS = 6400;
// Phase offset that starts the sweep at ~REST so it never snaps on mount.
const SWEEP_PHASE = 0.267;

// The seam lives in a CSS custom property so the auto-demo and the drag can run
// at frame rate without re-rendering the two <Image> trees. The fallback keeps
// the server-rendered frame correct before hydration.
const SEAM_VAR = "var(--mir-seam, 55%)";
const CLIP: CSSProperties = {
  clipPath: `inset(0 0 0 ${SEAM_VAR})`,
  WebkitClipPath: `inset(0 0 0 ${SEAM_VAR})`,
};

const clamp = (n: number) => Math.min(100, Math.max(0, n));

type SceneVariant = "real" | "avatar";

/**
 * CSS/SVG stand-in painted *behind* each photo, so a missing jpg reads as a
 * deliberate composition instead of an empty box.
 */
function WipeScene({ variant }: { variant: SceneVariant }) {
  const isAvatar = variant === "avatar";
  return (
    <div
      aria-hidden
      className={
        isAvatar
          ? "absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_10%,rgba(124,92,255,0.55),transparent_60%),radial-gradient(90%_70%_at_70%_100%,rgba(53,232,255,0.35),transparent_65%),linear-gradient(180deg,#120C24_0%,#0B0B16_70%,#07070C_100%)]"
          : "absolute inset-0 bg-[radial-gradient(110%_70%_at_50%_0%,rgba(233,236,245,0.14),transparent_60%),linear-gradient(180deg,#191924_0%,#101019_55%,#07070C_100%)]"
      }
    >
      <svg
        viewBox="0 0 100 200"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="mirWipeFigure" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="52%" stopColor="#FF5FA2" />
            <stop offset="100%" stopColor="#35E8FF" />
          </linearGradient>
        </defs>
        <g
          stroke={isAvatar ? "url(#mirWipeFigure)" : "rgba(233,236,245,0.22)"}
          strokeLinecap="round"
          opacity={isAvatar ? 0.95 : 0.75}
        >
          <path d="M50 62 v46" strokeWidth="27" />
          <path d="M50 70 L30 100" strokeWidth="9" />
          <path d="M50 70 L70 100" strokeWidth="9" />
          <path d="M44 110 L38 156" strokeWidth="11" />
          <path d="M56 110 L62 156" strokeWidth="11" />
        </g>
        <circle
          cx="50"
          cy="42"
          r="13"
          fill={isAvatar ? "url(#mirWipeFigure)" : "rgba(233,236,245,0.2)"}
        />
        {isAvatar ? (
          <g fill="#E9ECF5" opacity="0.9">
            <circle cx="50" cy="62" r="2" />
            <circle cx="30" cy="100" r="2" />
            <circle cx="70" cy="100" r="2" />
            <circle cx="38" cy="156" r="2" />
            <circle cx="62" cy="156" r="2" />
          </g>
        ) : null}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-mirror-void to-transparent" />
    </div>
  );
}

function MirrorWipe() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(REST);
  const announcedRef = useRef(REST);
  const engagedRef = useRef(false);
  const draggingRef = useRef(false);

  // State is only for things that must re-render: the exposed slider value and
  // the "drag me" hint. The pixels are moved by the CSS variable above.
  const [announced, setAnnounced] = useState(REST);
  const [engaged, setEngaged] = useState(false);
  const [missing, setMissing] = useState({ before: false, after: false });

  const applyPos = useCallback((next: number, announce: boolean) => {
    const value = clamp(next);
    posRef.current = value;
    frameRef.current?.style.setProperty("--mir-seam", `${value}%`);
    if (announce || Math.abs(value - announcedRef.current) >= 4) {
      announcedRef.current = value;
      setAnnounced(Math.round(value));
    }
  }, []);

  const engage = useCallback(() => {
    if (engagedRef.current) return;
    engagedRef.current = true;
    setEngaged(true);
  }, []);

  // Slow eased auto-demo. Runs until the first interaction, then never again.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyPos(REST, true);
      return undefined;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (engagedRef.current) return;
      if (!start) start = now;
      const phase = (SWEEP_PHASE + (now - start) / SWEEP_MS) % 1;
      const eased = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
      applyPos(SWEEP_MIN + eased * (SWEEP_MAX - SWEEP_MIN), false);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [applyPos]);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width) return;
      applyPos(((clientX - rect.left) / rect.width) * 100, true);
    },
    [applyPos]
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      engage();
      draggingRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setFromClientX(event.clientX);
    },
    [engage, setFromClientX]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      setFromClientX(event.clientX);
    },
    [setFromClientX]
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 10 : 4;
      let next: number | null = null;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        next = posRef.current - step;
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        next = posRef.current + step;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = 100;
      }
      if (next === null) return;
      event.preventDefault();
      engage();
      applyPos(next, true);
    },
    [applyPos, engage]
  );

  return (
    <div className="relative mx-auto w-[min(74vw,264px)] sm:w-[296px] lg:w-[332px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-[3.5rem] bg-[radial-gradient(55%_45%_at_50%_18%,rgba(124,92,255,0.42),transparent_70%),radial-gradient(45%_35%_at_65%_92%,rgba(53,232,255,0.24),transparent_70%)] blur-2xl"
      />

      {/* phone shell */}
      <div className="relative rounded-[2.4rem] border border-mirror-chrome/15 bg-mirror-surface/70 p-2 shadow-[0_40px_120px_-40px_rgba(124,92,255,0.65)] backdrop-blur-xl">
        <div
          aria-hidden
          className="absolute left-1/2 top-[0.85rem] z-30 h-1 w-16 -translate-x-1/2 rounded-full bg-mirror-chrome/20"
        />

        <div
          ref={frameRef}
          role="slider"
          tabIndex={0}
          aria-label="Mirror wipe — drag to swap the person for their Ekza avatar"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={announced}
          aria-valuetext={`${100 - announced}% avatar`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          style={{ touchAction: "pan-y" }}
          className="relative aspect-[9/16] w-full cursor-ew-resize select-none overflow-hidden rounded-[1.9rem] bg-mirror-void outline-none focus-visible:ring-2 focus-visible:ring-mirror-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-mirror-void"
        >
          {/* left of the seam — the room */}
          <div className="absolute inset-0 z-[1]">
            <WipeScene variant="real" />
            {missing.before ? null : (
              <Image
                src="/img/mirror-before.jpg"
                alt="A person standing in a room, framed by the Ekza Mirror camera."
                width={1200}
                height={1600}
                priority
                sizes="(max-width: 640px) 74vw, 332px"
                onError={() => setMissing((m) => ({ ...m, before: true }))}
                className="pointer-events-none relative z-[1] h-full w-full object-cover object-center"
              />
            )}
          </div>

          {/* right of the seam — the universe */}
          <div className="absolute inset-0 z-[2]" style={CLIP}>
            <WipeScene variant="avatar" />
            {missing.after ? null : (
              <Image
                src="/img/mirror-after.jpg"
                alt="The same person wearing a volumetric Ekza avatar that copies their pose."
                width={1200}
                height={1600}
                priority
                sizes="(max-width: 640px) 74vw, 332px"
                onError={() => setMissing((m) => ({ ...m, after: true }))}
                className="pointer-events-none relative z-[1] h-full w-full object-cover object-center"
              />
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(124,92,255,0.28),transparent_38%)]"
            />
          </div>

          {/* the seam itself */}
          <div
            className="pointer-events-none absolute inset-y-0 z-20 w-0"
            style={{ left: SEAM_VAR }}
          >
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-6 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,95,162,0.28),transparent)] blur-md"
            />
            <div className="mir-seam-v absolute inset-y-0 left-0 -translate-x-1/2" />
            <div
              aria-hidden
              className="pointer-events-auto absolute left-0 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-mirror-chrome/50 bg-mirror-void/70 shadow-[0_0_24px_rgba(124,92,255,0.55)] backdrop-blur"
              style={{ touchAction: "none" }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" focusable="false">
                <path
                  d="M9.5 8 6 12l3.5 4M14.5 8l3.5 4-3.5 4"
                  stroke="#E9ECF5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-mirror-void/60 px-2.5 py-1 font-display text-[0.6rem] uppercase tracking-[0.24em] text-mirror-silver backdrop-blur">
            real
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-mirror-void/60 px-2.5 py-1 font-display text-[0.6rem] uppercase tracking-[0.24em] text-mirror-chrome backdrop-blur">
            avatar
          </span>

          {engaged ? null : (
            <span className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 animate-pulse rounded-full border border-mirror-chrome/20 bg-mirror-void/70 px-3 py-1 font-display text-[0.6rem] uppercase tracking-[0.26em] text-mirror-silver backdrop-blur motion-reduce:animate-none">
              drag the seam
            </span>
          )}
        </div>
      </div>

      {/* floor reflection */}
      <div
        aria-hidden
        className="pointer-events-none mx-auto mt-3 h-16 w-[80%] rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(124,92,255,0.32),transparent_70%)] blur-xl"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32"
    >
      <div className="mir-mesh absolute inset-0" aria-hidden />
      <div className="mir-grain pointer-events-none absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(124,92,255,0.6),rgba(255,95,162,0.6),rgba(53,232,255,0.6),transparent)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div>
          <Reveal as="p" className="mir-kicker text-mirror-aqua">
            prototype · iphone · on-device
          </Reveal>

          <Reveal className="relative mt-6" delay={70}>
            <h1 className={`${H1_TYPE} text-mirror-chrome`}>
              Wear the <span className="mir-grad">universe</span>.
            </h1>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-full -z-10 translate-y-full select-none"
            >
              <div className={`mir-reflect ${H1_TYPE} text-mirror-chrome`}>
                Wear the universe.
              </div>
            </div>
          </Reveal>

          <Reveal
            as="p"
            delay={140}
            className="mt-9 max-w-xl text-lg leading-relaxed text-mirror-silver sm:mt-10 sm:text-xl"
          >
            Point the camera at a friend. They become an Ekza avatar. Hit record.
          </Reveal>

          <Reveal delay={200} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={MIRROR_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="mir-btn-primary text-center"
            >
              Get on the list
            </a>
            <a href="#how" className="mir-btn-secondary text-center">
              See how it works
            </a>
          </Reveal>

          <dl className="mt-12 grid max-w-xl gap-3 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <Reveal key={stat.metric} className="mir-stat" delay={260 + i * 80}>
                <dt className="mir-stat__metric mir-grad">{stat.metric}</dt>
                <dd className="mir-stat__label">{stat.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal delay={120} className="lg:pl-4">
          <MirrorWipe />
          <p className="mx-auto mt-6 max-w-[15rem] text-center text-xs leading-relaxed text-mirror-silver/80 sm:max-w-xs">
            Drag the seam. Left is the room, right is the render — same frame,
            same phone.
          </p>
        </Reveal>
      </div>

      <a
        href="#how"
        className="relative z-10 mx-auto mt-14 hidden font-display text-[0.65rem] uppercase tracking-[0.3em] text-mirror-silver transition hover:text-mirror-aqua sm:block"
      >
        point · wear · record ↓
      </a>
    </section>
  );
}
