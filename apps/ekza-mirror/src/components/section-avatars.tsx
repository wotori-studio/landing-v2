"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Avatar3D } from "@/components/avatar-3d";
import { Reveal } from "@/components/motion";
import { AVATARS, type Avatar } from "@/lib/avatars";
import { MIRROR_LINKS } from "@/lib/links";

/**
 * The renderer's sentinel for "hold still" — it is not a clip the model ships,
 * so it never appears in the reported list and is offered as its own button.
 */
const STOP_CLIP = "tpose";

/** Sentinel id for the "no collection filter" chip. */
const ALL_COLLECTIONS = "__all__";

type CollectionChip = { id: string; label: string; count: number };

/** Chips are derived from the catalog, so a growing catalog needs no edit here. */
const COLLECTIONS: CollectionChip[] = (() => {
  const counts = new Map<string, number>();
  for (const avatar of AVATARS) {
    counts.set(avatar.collection, (counts.get(avatar.collection) ?? 0) + 1);
  }
  return [
    { id: ALL_COLLECTIONS, label: "everyone", count: AVATARS.length },
    ...Array.from(counts, ([label, count]) => ({ id: label, label, count })),
  ];
})();

/** Cosmetic only — whatever the renderer reports is what gets a button. */
function clipLabel(name: string): string {
  if (name === STOP_CLIP) return "stop";
  return name
    .replace(/[_\-.]+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Which clip actually plays. The visitor's pick is kept across avatar switches
 * when the next model happens to have the same clip; otherwise it falls back to
 * an idle-ish default. `undefined` means "renderer's own default".
 */
function resolveClip(
  clips: string[],
  wanted: string | null
): string | undefined {
  if (wanted === STOP_CLIP) return STOP_CLIP;
  if (clips.length === 0) return wanted ?? undefined;
  if (wanted && clips.includes(wanted)) return wanted;
  return clips.find((clip) => clip.toLowerCase() === "idle") ?? clips[0];
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

type RenderState = "idle" | "loading" | "ready" | "failed";

/**
 * The viewer publishes `data-avatar-render-state` on its wrapper. Reading it is
 * the only way to tell "rendered, but this model ships no clips" apart from
 * "the file 404'd / WebGL refused" — both of which otherwise look like
 * `loading:false` with an empty clip list.
 */
function useRenderState(
  host: RefObject<HTMLDivElement>,
  active: boolean
): RenderState {
  const [state, setState] = useState<RenderState>("idle");

  useEffect(() => {
    if (!active) {
      setState("idle");
      return;
    }
    const root = host.current;
    if (!root) return;

    const read = () => {
      const value = root
        .querySelector("[data-avatar-render-state]")
        ?.getAttribute("data-avatar-render-state");
      setState(
        value === "ready" || value === "failed" || value === "loading"
          ? value
          : "loading"
      );
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributeFilter: ["data-avatar-render-state"],
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [active, host]);

  return state;
}

export function SectionAvatars() {
  const [activeId, setActiveId] = useState(AVATARS[0].id);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clips, setClips] = useState<string[]>([]);
  const [wantedClip, setWantedClip] = useState<string | null>(null);
  const [artFailed, setArtFailed] = useState<Record<string, boolean>>({});
  const [collection, setCollection] = useState<string>(ALL_COLLECTIONS);

  const viewerRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const renderState = useRenderState(viewerRef, live);

  const active: Avatar =
    AVATARS.find((avatar) => avatar.id === activeId) ?? AVATARS[0];

  const failed = live && renderState === "failed";
  // `renderState !== "ready"` is the safety catch: if the viewer ever settles
  // without a matching `onLoadingChange(false)`, the overlay still clears.
  const busy =
    live &&
    !failed &&
    renderState !== "ready" &&
    (loading || renderState === "loading");
  const clip = resolveClip(clips, wantedClip);

  const shown = useMemo(
    () =>
      collection === ALL_COLLECTIONS
        ? AVATARS
        : AVATARS.filter((avatar) => avatar.collection === collection),
    [collection]
  );

  const markArtFailed = useCallback((id: string) => {
    setArtFailed((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  // Identity-stable: the viewer keeps these in a ref, but a changing callback
  // would still churn its effects for no reason.
  const handleAnimations = useCallback((names: string[]) => {
    setClips(names.filter((name) => name !== STOP_CLIP));
  }, []);

  const handleLoadingChange = useCallback((value: boolean) => {
    setLoading(value);
  }, []);

  /**
   * Turning 3D on, or switching model, is loading — said here rather than
   * waited for, so the overlay is up on the same paint as the click. Re-picking
   * the avatar already on screen changes no url, so it must not raise a flag
   * nothing will ever lower.
   */
  const pick = useCallback(
    (id: string) => {
      if (id === activeId && live) return;
      if (id !== activeId) setClips([]);
      setActiveId(id);
      setLive(true);
      setLoading(true);
    },
    [activeId, live]
  );

  // A visible sign of life that cannot lie: a multi-megabyte file over a public
  // IPFS gateway can take 20 seconds, and a frozen panel reads as broken.
  useEffect(() => {
    if (!busy) return;
    setElapsed(0);
    const started = Date.now();
    const timer = window.setInterval(() => {
      setElapsed(Math.round((Date.now() - started) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeId, busy]);

  const filterBy = useCallback(
    (id: string) => {
      setCollection(id);
      railRef.current?.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  const credit =
    active.collection === active.author.toLowerCase()
      ? `by ${active.author} · cc0`
      : `${active.collection} · by ${active.author} · cc0`;

  const status = failed
    ? `${active.name} could not be rendered in 3D. Showing the still image instead.`
    : busy
      ? `Loading ${active.name}. Downloading the VRM model file.`
      : live
        ? `${active.name} is live in 3D. Drag to rotate.`
        : "";

  const still: ReactNode = (
    <div className="absolute inset-0">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: active.fallback }}
      />
      {artFailed[active.id] ? null : (
        <Image
          key={active.thumbUrl}
          src={active.thumbUrl}
          alt={active.alt}
          width={640}
          height={800}
          sizes="(max-width: 1024px) 92vw, 460px"
          onError={() => markArtFailed(active.id)}
          className="relative h-full w-full object-cover object-center"
        />
      )}
    </div>
  );

  return (
    <section
      id="avatars"
      /* `overflow-x-clip`, never `overflow-hidden`: a hidden ancestor becomes
         the scroll container for everything inside it, which is exactly what
         stopped the old `lg:sticky` viewer from ever sticking. */
      className="relative overflow-x-clip border-t border-mirror-chrome/10 bg-mirror-void py-20 sm:py-28"
    >
      <div
        className="mir-grain pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(182,255,26,0.07),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal as="p" className="mir-kicker text-mirror-bone">
            pick your face
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold tracking-[-0.02em] text-mirror-chrome sm:text-4xl md:text-5xl"
          >
            Choose who your friend <span className="mir-grad">becomes</span>.
          </Reveal>
          <Reveal
            as="p"
            delay={140}
            className="mt-5 text-base leading-relaxed text-mirror-silver sm:text-lg"
          >
            {AVATARS.length} avatars from the open-source catalog. Tap a card —
            the real VRM file downloads and renders right here, in your browser.
            The same files the iPhone lens wears.
          </Reveal>
        </div>

        {/* Screen-reader account of the viewer. Never announces the ticking
            seconds, only the transitions between states. */}
        <p aria-live="polite" className="sr-only" role="status">
          {status}
        </p>

        {/*
          The layout that fixes the client's complaint.

          Desktop keeps the stage pinned while the catalog rail scrolls. Mobile
          stays in normal document flow: no sticky stage + nested vertical
          scroller competing for the same touch gesture.
        */}
        <div className="mt-10 flex flex-col gap-4 sm:mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
          {/* ---------------------------------------------------- stage */}
          <div className="lg:sticky lg:top-24">
            <div className="mir-glass relative overflow-hidden p-2">
              <div
                ref={viewerRef}
                className="relative h-[40svh] min-h-[15rem] w-full overflow-hidden rounded-xl bg-mirror-surface sm:h-[52svh] lg:h-[calc(100svh-15rem)] lg:min-h-[22rem] lg:max-h-[44rem]"
              >
                {live ? (
                  <div className="mir-avatar-canvas absolute inset-0">
                    <Avatar3D
                      animation={clip}
                      fallback={still}
                      label={`${active.name} — live 3D avatar, drag to rotate`}
                      onAnimations={handleAnimations}
                      onLoadingChange={handleLoadingChange}
                      url={active.modelUrl}
                    />
                  </div>
                ) : (
                  still
                )}

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-mirror-void via-mirror-void/70 to-transparent"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="font-display text-[0.58rem] uppercase tracking-[0.26em] text-mirror-bone sm:text-[0.62rem] sm:tracking-[0.28em]">
                    {credit}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold tracking-[-0.02em] text-mirror-chrome sm:mt-2 sm:text-3xl lg:text-4xl">
                    {active.name}
                  </h3>
                  <div className="mt-3 w-16">
                    <div className="mir-seam" aria-hidden />
                  </div>
                  <p className="mt-3 hidden text-sm leading-relaxed text-mirror-silver sm:block">
                    {active.line}
                  </p>
                </div>

                {/* badge / call to action */}
                {live && !busy && !failed ? (
                  <p className="pointer-events-none absolute left-3 top-3 rounded-full border border-mirror-chrome/15 bg-mirror-void/70 px-3 py-1 font-display text-[0.55rem] uppercase tracking-[0.22em] text-mirror-acid">
                    live · vrm · in your browser
                  </p>
                ) : null}
                {live ? null : (
                  <span className="absolute right-3 top-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLive(true);
                        setLoading(true);
                      }}
                      className="mir-btn-primary min-h-11 px-4 py-2 text-xs"
                    >
                      render live
                    </button>
                  </span>
                )}
                {live && failed ? (
                  <p className="absolute inset-x-3 top-3 rounded-xl border border-mirror-bone/40 bg-mirror-void/85 px-3 py-2 text-[0.7rem] leading-snug text-mirror-silver">
                    The 3D file would not load. This is the still image — try
                    another avatar.
                  </p>
                ) : null}

                {/* ------------------------------------ loading overlay */}
                {busy ? (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-mirror-void/80 px-6 text-center backdrop-blur-[3px]">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 scale-105 opacity-20 blur-[6px]"
                    >
                      {still}
                    </div>

                    <div
                      aria-hidden
                      className={`relative h-10 w-10 rounded-full border-2 border-mirror-chrome/15 border-t-mirror-acid ${
                        reducedMotion ? "" : "animate-spin"
                      }`}
                    />

                    <div className="relative">
                      <p className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-mirror-bone">
                        downloading 3d model
                      </p>
                      <p className="mt-2 font-display text-lg font-semibold text-mirror-chrome">
                        {active.name}
                      </p>
                      <p className="mx-auto mt-2 max-w-[22rem] text-xs leading-relaxed text-mirror-silver">
                        A full VRM file — several megabytes — is coming down
                        from the open catalog, then it renders on your GPU.
                      </p>
                    </div>

                    <div className="relative flex items-center gap-3">
                      <span
                        aria-hidden
                        className="relative h-[3px] w-32 overflow-hidden rounded-full bg-mirror-chrome/15"
                      >
                        <span
                          className={`absolute inset-y-0 left-0 w-full rounded-full bg-prism ${
                            reducedMotion ? "opacity-60" : "animate-pulse"
                          }`}
                        />
                      </span>
                      <span
                        aria-hidden
                        className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-mirror-silver tabular-nums"
                      >
                        {elapsed}s
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* ------------------------------------ animation selector */}
              <div className="mt-2 flex items-center gap-2 px-1 pb-1">
                <span
                  aria-hidden
                  className="shrink-0 font-display text-[0.55rem] uppercase tracking-[0.22em] text-mirror-silver/70"
                >
                  motion
                </span>
                <div
                  aria-label="Animation"
                  className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1"
                  role="group"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {!live ? (
                    <span className="whitespace-nowrap py-1 text-[0.7rem] text-mirror-silver/70">
                      render the avatar to pick a motion
                    </span>
                  ) : busy ? (
                    <span className="whitespace-nowrap py-1 text-[0.7rem] text-mirror-silver/70">
                      reading clips…
                    </span>
                  ) : clips.length === 0 ? (
                    <span className="whitespace-nowrap py-1 text-[0.7rem] text-mirror-silver/70">
                      {failed ? "—" : "this model ships no clips"}
                    </span>
                  ) : (
                    [...clips, STOP_CLIP].map((name) => {
                      const on = clip === name;
                      return (
                        <button
                          aria-pressed={on}
                          className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-3 py-1 font-display text-[0.6rem] uppercase tracking-[0.16em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-mirror-acid focus-visible:ring-offset-2 focus-visible:ring-offset-mirror-void ${
                            on
                              ? "border-mirror-acid/70 bg-mirror-acid/15 text-mirror-chrome"
                              : "border-mirror-chrome/15 text-mirror-silver hover:border-mirror-bone/40 hover:text-mirror-chrome"
                          }`}
                          key={name}
                          onClick={() => setWantedClip(name)}
                          type="button"
                        >
                          {clipLabel(name)}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------- rail */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-display text-[0.62rem] uppercase tracking-[0.26em] text-mirror-silver">
                tap a card · it renders here
              </p>
              <p
                aria-live="polite"
                className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-mirror-silver/60"
              >
                {shown.length} of {AVATARS.length}
              </p>
            </div>

            <div
              aria-label="Filter avatars by collection"
              className="mt-3 flex gap-1.5 overflow-x-auto pb-1"
              role="group"
              style={{ scrollbarWidth: "thin" }}
            >
              {COLLECTIONS.map((chip) => {
                const on = chip.id === collection;
                return (
                  <button
                    aria-pressed={on}
                    className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-display text-[0.6rem] uppercase tracking-[0.16em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-mirror-acid focus-visible:ring-offset-2 focus-visible:ring-offset-mirror-void ${
                      on
                        ? "border-mirror-bone/60 bg-mirror-bone/10 text-mirror-chrome"
                        : "border-mirror-chrome/10 text-mirror-silver hover:border-mirror-bone/30 hover:text-mirror-chrome"
                    }`}
                    key={chip.id}
                    onClick={() => filterBy(chip.id)}
                    type="button"
                  >
                    {chip.label}{" "}
                    <span aria-hidden className="text-mirror-silver/60">
                      {chip.count}
                    </span>
                    <span className="sr-only">{chip.count} avatars</span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-3">
              <div
                className="lg:max-h-[calc(100svh-16rem)] lg:overflow-y-auto lg:pr-1"
                ref={railRef}
                style={{ scrollbarWidth: "thin" }}
              >
                <div className="grid grid-cols-2 gap-3 pb-8 sm:grid-cols-4 lg:grid-cols-3">
                  {shown.map((avatar) => {
                    const selected = avatar.id === active.id;
                    return (
                      <button
                        aria-pressed={selected}
                        className={`group relative block w-full overflow-hidden rounded-2xl border text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-mirror-acid focus-visible:ring-offset-2 focus-visible:ring-offset-mirror-void ${
                          selected
                            ? "border-mirror-acid/60 shadow-[0_0_36px_-8px_rgba(182,255,26,0.3)]"
                            : "border-mirror-chrome/10 hover:border-mirror-bone/40"
                        }`}
                        key={avatar.id}
                        onClick={() => pick(avatar.id)}
                        type="button"
                      >
                        <span className="relative block aspect-[4/5] w-full overflow-hidden bg-mirror-surface">
                          <span
                            aria-hidden
                            className="absolute inset-0"
                            style={{ backgroundImage: avatar.fallback }}
                          />
                          {artFailed[avatar.id] ? (
                            <span
                              aria-hidden
                              className="mir-grad absolute inset-0 flex items-center justify-center font-display text-5xl font-bold leading-none opacity-20"
                            >
                              {avatar.name.charAt(0)}
                            </span>
                          ) : (
                            <Image
                              alt={avatar.alt}
                              className={`relative h-full w-full object-cover object-center transition duration-500 ${
                                selected
                                  ? "scale-[1.03]"
                                  : "opacity-70 group-hover:opacity-100"
                              }`}
                              height={400}
                              loading="lazy"
                              onError={() => markArtFailed(avatar.id)}
                              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 24vw, 180px"
                              src={avatar.thumbUrl}
                              width={320}
                            />
                          )}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-mirror-void/95 to-transparent"
                          />
                        </span>

                        <span className="absolute inset-x-0 bottom-0 p-2.5">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate font-display text-xs font-semibold text-mirror-chrome sm:text-sm">
                              {avatar.name}
                            </span>
                            <span
                              aria-hidden
                              className={`h-1.5 w-1.5 shrink-0 rounded-full transition ${
                                selected
                                  ? "bg-mirror-acid"
                                  : "bg-mirror-chrome/25"
                              }`}
                            />
                          </span>
                          <span className="mt-0.5 block truncate font-display text-[0.5rem] uppercase tracking-[0.18em] text-mirror-silver/80">
                            by {avatar.author}
                          </span>
                        </span>
                        <span className="sr-only">
                          {selected ? "Selected. " : ""}
                          {avatar.collection}, by {avatar.author}, CC0.{" "}
                          {avatar.line}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* the rail keeps scrolling below the fold — say so visually */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-mirror-void to-transparent"
              />
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- credits */}
        <Reveal delay={120} className="mir-glass mt-8 rounded-2xl p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-mirror-silver">
            Every avatar here is CC0 from the{" "}
            <a
              href="https://opensourceavatars.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mirror-chrome underline decoration-mirror-acid/60 underline-offset-4 transition hover:text-mirror-acid"
            >
              Open Source Avatars
            </a>{" "}
            catalog — made by Polygonal-Mind, ToxSam and friends, pinned to IPFS
            and Arweave, addressed by content hash. Own one anywhere in the Ekza
            ecosystem and it follows you here.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <a
              href={MIRROR_LINKS.avatars}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[0.68rem] uppercase tracking-[0.22em] text-mirror-chrome underline-offset-4 transition hover:text-mirror-acid hover:underline"
            >
              Browse the catalog →
            </a>
            <a
              href={MIRROR_LINKS.stellar}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[0.68rem] uppercase tracking-[0.22em] text-mirror-silver underline-offset-4 transition hover:text-mirror-acid hover:underline"
            >
              Where ownership lives →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
