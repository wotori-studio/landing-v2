"use client";

import { useState } from "react";
import Reveal from "./studio-reveal";
import CaseModal, { type CaseData } from "./studio-case-modal";
import { useI18n } from "../lib/i18n-provider";

// Optimized DJ Wotori renders pinned to IPFS via Pinata as a single folder pin.
// Directory CID: QmeRxV7F1msHPgKJHJLqZsEBN2beCLuezUusFLZpq6WCcW (files at CID root).
// Served via the public ipfs.io gateway — Pinata's public gateway rate-limits (429).
// Swap for a dedicated gateway domain in production for speed.
const MEDIA_BASE =
  "https://ipfs.io/ipfs/QmeRxV7F1msHPgKJHJLqZsEBN2beCLuezUusFLZpq6WCcW";

const FILTERS = [
  { id: "all", labelKey: "work.filterAll" },
  { id: "web", labelKey: "work.filterWeb" },
  { id: "design", labelKey: "work.filterDesign" },
  { id: "animation", labelKey: "work.filterAnimation" },
  { id: "games", labelKey: "work.filterGames" },
];

type Project = {
  name: string;
  cats: string[];
  kind: string;
  year: string;
  bodyKey: string;
  href?: string;
  case?: string;
};

// Ordered by priority / project weight: flagship platform first, protocol
// work next, then game production, character work, and small tools last.
const WORK: Project[] = [
  {
    name: "Ekza Space",
    cats: ["web", "design"],
    kind: "Web3 · 3D assets",
    year: "2024",
    bodyKey: "work.ekzaBody",
    href: "https://ekza.io",
    case: "ekza",
  },
  {
    name: "0→100 Engine",
    cats: ["web"],
    kind: "Web3 · Solana protocol",
    year: "2025",
    bodyKey: "work.zeroBody",
    case: "zerohundred",
  },
  {
    name: "Omoba",
    cats: ["games", "animation"],
    kind: "Game · Avatars",
    year: "2024",
    bodyKey: "work.omobaBody",
    href: "https://x.com/wotorimovako",
    case: "omoba",
  },
  {
    name: "DJ Wotori",
    cats: ["design", "animation"],
    kind: "Character · AI generation",
    year: "2026",
    bodyKey: "work.djBody",
    case: "dj",
  },
  {
    name: "Vibe Piano",
    cats: ["web"],
    kind: "Web · Music tool",
    year: "2025",
    bodyKey: "work.pianoBody",
    href: "https://piano.wotori.io",
  },
];

function RowInner({ w, isCase }: { w: Project; isCase?: boolean }) {
  return (
    <>
      <span className="ws-row__no" aria-hidden="true" />
      <span className="ws-row__name">{w.name}</span>
      <span className="ws-row__kind">{w.kind}</span>
      <span className="ws-row__year">{w.year}</span>
      {isCase ? (
        <svg className="ws-row__arrow" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
        </svg>
      ) : (
        <svg className="ws-row__arrow" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
}

export default function StudioWork() {
  const { t } = useI18n();
  const k = (key: string) => t(`wotori.studio.${key}`);
  const [filter, setFilter] = useState("all");
  const [openCase, setOpenCase] = useState<string | null>(null);

  const countFor = (id: string) =>
    id === "all" ? WORK.length : WORK.filter((w) => w.cats.includes(id)).length;

  const facts = (prefix: string) => [
    { label: k("work.caseLabelProblem"), value: k(`work.${prefix}FactProblem`) },
    { label: k("work.caseLabelBuild"), value: k(`work.${prefix}FactBuild`) },
    { label: k("work.caseLabelStack"), value: k(`work.${prefix}FactStack`) },
    { label: k("work.caseLabelResult"), value: k(`work.${prefix}FactResult`) },
  ];

  const CASES: Record<string, CaseData> = {
    dj: {
      title: "DJ Wotori",
      meta: k("work.caseMeta"),
      desc: k("work.caseDesc"),
      facts: facts("dj"),
      video: `${MEDIA_BASE}/dj-wotori.mp4`,
      poster: `${MEDIA_BASE}/dj-poster.webp`,
      images: [1, 2, 3, 4].map((n) => ({
        full: `${MEDIA_BASE}/dj-${n}.webp`,
        thumb: `${MEDIA_BASE}/dj-${n}-thumb.webp`,
      })),
    },
    ekza: {
      title: "Ekza Space",
      meta: k("work.ekzaCaseMeta"),
      desc: k("work.ekzaCaseDesc"),
      facts: facts("ekza"),
      link: { href: "https://ekza.io", label: k("work.caseOpenLive") },
    },
    omoba: {
      title: "Omoba",
      meta: k("work.omobaCaseMeta"),
      desc: k("work.omobaCaseDesc"),
      facts: facts("omoba"),
      link: { href: "https://x.com/wotorimovako", label: k("work.caseOpenLive") },
    },
    zerohundred: {
      title: "0→100 Engine",
      meta: k("work.zeroCaseMeta"),
      desc: k("work.zeroCaseDesc"),
      facts: facts("zero"),
      link: {
        href: "https://github.com/Xyber-Labs/0-100-Solana-contracts",
        label: k("work.caseViewCode"),
      },
    },
  };

  return (
    <div className="ws-worklist-wrap">
      <p className="ws-worklist__note">{k("work.clientNote")}</p>
      <div className="ws-filters" role="tablist" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`ws-filter ${filter === f.id ? "is-active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {k(f.labelKey)}
            <sup>{countFor(f.id)}</sup>
          </button>
        ))}
      </div>

      <div className="ws-worklist">
        {WORK.map((w, i) => {
          const visible = filter === "all" || w.cats.includes(filter);
          const external = w.href?.startsWith("http");
          return (
            <Reveal
              as="article"
              className={`ws-row ${visible ? "" : "ws-row--hidden"}`.trim()}
              key={w.name}
              delay={i * 60}
            >
              {w.case ? (
                <button
                  type="button"
                  className="ws-row__link ws-row__link--case"
                  onClick={() => setOpenCase(w.case ?? null)}
                >
                  <RowInner w={w} isCase />
                </button>
              ) : (
                <a
                  className="ws-row__link"
                  href={w.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <RowInner w={w} />
                </a>
              )}
              <p className="ws-row__body">{k(w.bodyKey)}</p>
            </Reveal>
          );
        })}
      </div>

      {openCase && (
        <CaseModal data={CASES[openCase]} onClose={() => setOpenCase(null)} />
      )}
    </div>
  );
}
