const apps = [
  {
    name: "Wotori Studio",
    port: 3000,
    href: "http://localhost:3000",
    hint: "wotori.io",
    accent: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
  },
  {
    name: "Ekza Space",
    port: 3001,
    href: "http://localhost:3001",
    hint: "ekza.io",
    accent: "from-violet-500/20 to-fuchsia-500/10 border-violet-500/30",
  },
  {
    name: "O-MOBA",
    port: 3002,
    href: "http://localhost:3002",
    hint: "omoba.io",
    accent: "from-sky-500/20 to-indigo-500/10 border-sky-500/30",
  },
];

export default function DevHubPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        Monorepo local dev
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
        Landing apps
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
        Run <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-300">make dev</code>{" "}
        or <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-300">pnpm dev</code>{" "}
        from the repo root — Turbo starts every app in parallel. Open any site below.
      </p>

      <ul className="mt-10 space-y-4">
        {apps.map((app) => (
          <li key={app.port}>
            <a
              href={app.href}
              className={`block rounded-2xl border bg-gradient-to-br p-6 transition hover:brightness-110 ${app.accent}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-lg font-semibold text-white">
                  {app.name}
                </span>
                <span className="font-mono text-sm text-slate-400">
                  :{app.port}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{app.hint}</p>
              <p className="mt-3 text-xs text-cyan-400/90">
                Open → {app.href}
              </p>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-center text-xs text-slate-600">
        This page only runs in development (port 3999).
      </p>
    </main>
  );
}
