"use client";

import React from "react";

interface SpaceCardVisualProps {
  id?: number;
  total?: number;
  name?: string;
  owner?: string;
  mint?: string;
  isOpen?: boolean;
  className?: string;
}

export function SpaceCardVisual({
  id = 1,
  total = 1000,
  name = "Genesis Hall",
  owner = "you.sol",
  mint = "8xPq…N4kR",
  isOpen = true,
  className = "",
}: SpaceCardVisualProps) {
  const padded = String(id).padStart(3, "0");

  const fields: { key: string; value: string }[] = [
    { key: "space_id", value: String(id) },
    { key: "mint", value: mint },
    { key: "owner", value: owner },
    { key: "name", value: name },
    { key: "space_config_uri", value: "ipfs://…/scene.json" },
    { key: "is_open", value: String(isOpen) },
    { key: "is_editable_by_others", value: "false" },
    { key: "editors[ ]", value: "0 / 10" },
  ];

  return (
    <div className={`relative mx-auto w-full max-w-md ${className}`}>
      <div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-ekza-primary/25 to-ekza-accent/30 opacity-60 blur-2xl dark:from-cyan-500/25 dark:to-purple-600/25"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-3xl border border-ekza-border/30 bg-ekza-card/95 shadow-ekza-card backdrop-blur-md dark:border-white/10 dark:bg-black/50 dark:shadow-ekza-card-dark">
        {/* inner top-edge sheen — reads like a minted plate */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ekza-primary/40 to-transparent dark:via-cyan-300/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-ekza-border/20 dark:ring-white/10"
          aria-hidden
        />

        {/* Numbered plate header */}
        <div className="flex items-baseline justify-between border-b border-ekza-border/20 px-6 py-5 dark:border-white/10">
          <div className="flex items-baseline gap-1 font-headline">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-ekza-primary dark:text-cyan-300/90">
              Space
            </span>
          </div>
          <div className="flex items-baseline font-headline">
            <span className="bg-gradient-to-b from-ekza-on to-ekza-on-muted bg-clip-text text-4xl font-bold leading-none text-transparent dark:from-white dark:to-white/60 md:text-5xl">
              #{padded}
            </span>
            <span className="ml-1 text-sm font-medium text-ekza-on-muted dark:text-white/50">
              / {total}
            </span>
          </div>
        </div>

        {/* Faux on-chain inspector */}
        <div className="space-y-2 px-6 py-5">
          <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ekza-on-muted dark:text-white/60">
            Space account
          </p>
          {fields.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-ekza-border/20 bg-ekza-muted/60 px-3 py-2 transition-colors hover:border-ekza-primary/40 dark:border-white/5 dark:bg-white/[0.04] dark:hover:border-cyan-400/40"
            >
              <span className="font-mono text-xs text-ekza-primary dark:text-cyan-300/90">
                {field.key}
              </span>
              <span className="truncate font-mono text-xs text-ekza-on-muted dark:text-white/70">
                {field.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-ekza-border/20 px-6 py-4 dark:border-white/10">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70 motion-reduce:hidden dark:bg-emerald-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          </span>
          <span className="text-xs text-ekza-on-muted dark:text-white/55">
            1/1 NFT · mint authority revoked
          </span>
        </div>
      </div>
    </div>
  );
}

export default SpaceCardVisual;
