import { OMOBA_LINKS } from "@/lib/links";

export function SectionEcosystem() {
  return (
    <section
      id="ecosystem"
      className="relative border-t border-white/5 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-omoba-gold">
            Partnerships
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Ecosystem & partnerships
          </h2>
        </div>

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-omoba-accent/40 to-transparent sm:w-[140%]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-omoba-accent/10 blur-2xl" />

          <div className="relative grid gap-8 sm:grid-cols-2 sm:gap-4">
            <a
              href="/"
              className="omoba-glass omoba-glass-hover flex flex-col items-center justify-center rounded-2xl p-10 text-center"
            >
              <span className="font-display text-2xl font-bold text-white">
                O-MOBA
              </span>
              <span className="mt-1 text-xs text-omoba-accent">omoba.io</span>
            </a>
            <a
              href={OMOBA_LINKS.ekza}
              target="_blank"
              rel="noopener noreferrer"
              className="omoba-glass omoba-glass-hover flex flex-col items-center justify-center rounded-2xl p-10 text-center"
            >
              <span className="font-display text-2xl font-bold text-white">
                Ekza Space
              </span>
              <span className="mt-1 text-xs text-omoba-magenta">ekza.io</span>
            </a>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-center text-slate-400">
            Closely integrated with{" "}
            <strong className="text-white">Ekza Space</strong>, benefiting from
            mutual innovations, shared ecosystems, and collaborative growth.
          </p>
        </div>
      </div>
    </section>
  );
}
