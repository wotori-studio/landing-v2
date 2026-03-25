"use client";

export function SectionEvolution() {
  return (
    <section
      id="evolution"
      className="relative border-t border-white/5 bg-omoba-abyss/80 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-omoba-gold">
            Gameplay & vision
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            The next evolution of MOBA
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Imagine a game that combines beloved gameplay mechanics from classics
            like League of Legends and Dota 2 with a fully open model for
            user-generated content (UGC).
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="omoba-glass omoba-glass-hover rounded-2xl p-6">
            <div className="mb-3 h-2 w-12 rounded-full bg-gradient-to-r from-omoba-accent to-omoba-magenta" />
            <h3 className="font-display text-lg font-semibold text-white">
              Classic depth
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Lane strategy, team fights, and skill expression you know from the
              greats.
            </p>
          </div>
          <div className="omoba-glass omoba-glass-hover rounded-2xl p-6 sm:mt-8">
            <div className="mb-3 h-2 w-12 rounded-full bg-gradient-to-r from-omoba-gold to-omoba-ember" />
            <h3 className="font-display text-lg font-semibold text-white">
              Creator layer
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Tools and pipelines for heroes, cosmetics, and stories — owned by
              players.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
