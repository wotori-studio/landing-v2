const cards = [
  {
    title: "Design everything",
    body: "Create unique characters—appearances, backstories, professions, and abilities.",
    accent: "from-omoba-accent to-cyan-600",
  },
  {
    title: "Open marketplace",
    body: "Share your creations with the world.",
    accent: "from-omoba-magenta to-violet-600",
  },
  {
    title: "Direct support",
    body: "Fans directly support creators by purchasing custom skins and characters. Retain full ownership with options for limited or unlimited editions.",
    accent: "from-omoba-gold to-omoba-ember",
  },
];

export function SectionCreators() {
  return (
    <section
      id="creators"
      className="relative border-t border-white/5 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-omoba-void via-omoba-depth/50 to-omoba-void" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-omoba-accent">
            For creators
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Create, share, earn
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="omoba-glass omoba-glass-hover group rounded-2xl p-8"
            >
              <div
                className={`mb-6 inline-block h-1 w-16 rounded-full bg-gradient-to-r ${c.accent}`}
              />
              <h3 className="font-display text-xl font-semibold text-white">
                {c.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
