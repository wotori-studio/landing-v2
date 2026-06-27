# Ekza Space — Product Marketing Site Spec

Build-ready spec for the ekza.io landing rebuild. Researched from the live protocol
sources; copy below is final EN and protocol-accurate. Builder should not re-research —
implement directly against this file. Match the existing `apps/ekza` brand tokens, theme,
and i18n. Do not invent colors.

---

## 1. Protocol summary (ground truth, with citations)

Ekza Space is a **Solana-native ownership and licensing layer for portable, game-ready 3D
content** — assets, avatars, and virtual Spaces (`doc/docs/intro.md`, `core-concepts/mission.md`).
It is infrastructure, not a metaverse, not a JPEG marketplace, not an avatar generator
(`intro.md` "Avoid describing"). The protocol spans three Anchor programs:
`solana-stellar` (collaboration, asset lineage, releases, vaults, contributor revenue
shares), `solana-ekza-space` (numbered Space NFTs), and `solana-avatars` (avatar profiles +
minting) (`intro.md`, `core-concepts/architecture.md`).

**The "Space" primitive** (`solana-ekza-space/programs/ekza-space/src/state.rs`,
`doc/docs/protocol/space-nft.md`): a Space is a virtual room/scene/world/arena. The
collection is **finite** — `Config.total_spaces` caps supply, `minted_spaces` tracks
issuance. Each Space = a **1/1 Metaplex NFT** + a `Space` PDA holding on-chain settings:
`space_id` (1..=total), `mint`, `owner`, `name` (max 64), `space_config_uri` (max 512, points
to an IPFS scene manifest), `is_open` (can others enter), `is_editable_by_others`, an
`editors` allowlist (max 10 pubkeys), and reserved bytes. **The NFT proves ownership; the PDA
manifest describes the world** (`space-nft.md`).

**Minting** — `mint_next_space` issues the next ID (`minted_spaces + 1`): validates capacity,
transfers SOL to `treasury`, creates a 0-decimal mint, mints exactly one token to the payer
ATA, writes canonical Metaplex metadata, **revokes mint authority**, inits the Space PDA, and
emits `SpaceMinted`. Default metadata URI: `https://meta.ekza.space/spaces/{id}.json`
(`mint_next_space.rs`, README, `space-nft.md`).

**Editing** — `update_space_settings` is **gated by NFT holding** (signer must present a token
account for `space.mint` with amount == 1). Owner-only: `name`, `is_open`,
`is_editable_by_others`, add/remove editor. `space_config_uri` is writable by owner, an
allowlisted editor, or any signer when shared editing is on — enabling collaborative worlds
(`space-nft.md`, `update_space_settings.rs`).

**Arena tie-in** (`ekza-arena/README.md`, `solana-ekza-arena/README.md`): Ekza Arena is a Bevy
composable-avatar auto-battler. It consumes creator-owned 3D assets via `ekza-bevy-sdk`
(stable character IDs + model manifests) and a downstream Anchor registry
(`solana-ekza-arena`) that publishes finalized Stellar releases into Arena-owned card records
(`register_arena_asset`, `register_arena_asset_from_stellar`). Spaces serve as arenas/rooms;
avatars and assets load through the same ownership + manifest path.

**Authoritative IDs/seeds (cite code over README):** program `solana_ekza_space`, id
`2WtuXG6AX3erRp6eK5WiSTEEBec5zprQ7qLyLENfMQEH` (`lib.rs` `declare_id!`). Config seed
`["config"]`; Space seed `["space_v1", config_pubkey, space_id_le_bytes]` (`constants.rs`
`SPACE_SEED_ROOT = b"space_v1"`). NOTE: README says seed `"space"` and `space-nft.md` lists a
different program id `Bms233...` — both are stale; use the code values above.

---

## 2. Positioning / one-liner

**One-liner:** *Own your worlds on-chain. Ekza Space turns virtual rooms, scenes, and arenas
into a finite collection of numbered, creator-owned Spaces on Solana.*

Supporting value props:
1. **Own the world, not just the picture.** A 1/1 NFT proves ownership; an on-chain PDA holds
   the live settings and points to the scene manifest. The world is configurable, not frozen.
2. **Finite by design.** Supply is capped on-chain (`total_spaces`). Every Space is a numbered,
   verifiable, transferable address — not an infinite mint.
3. **Built to be entered and edited.** `is_open`, `is_editable_by_others`, and an editor
   allowlist make Spaces collaborative and playable — loadable into games and into Ekza Arena.

---

## 3. Information architecture (ordered) + final EN copy

All copy below is final. Wire each string through `useI18n()` `t()` under a new
`ekza.v2.*` namespace in `packages/locales/src/translations.json` (mirror existing
`ekza.*` shape; add RU later — EN ships first). Keys suggested inline as `// t: ...`.

### 3.1 `hero` — Hero
Purpose: state what a Space is and drive to waitlist / app / docs.
- Eyebrow: `Solana-native 3D ownership protocol`
- Headline: `Own your worlds, on-chain.`
- Subhead: `Ekza Space turns virtual rooms, scenes, and arenas into a finite collection of numbered Spaces — each a 1/1 NFT with live, on-chain settings you control.`
- Description (glass panel): `Mint a numbered Space, point it at an IPFS scene manifest, and open it to the world. Ownership is proven by the NFT; the world is described by the PDA. Built for games, virtual worlds, and Ekza Arena.`
- Buttons: `Join Waitlist` (primary, opens modal) · `Open App` (→ https://space.ekza.io) · `Read Docs` (→ https://github.com/ekza-space)
- Footer line: `Creator-owned infrastructure for web3 worlds`

### 3.2 `what-is-a-space` — What is a Space (explainer)
Purpose: define the primitive precisely; correct the "it's just a JPEG" assumption.
- Eyebrow: `The primitive`
- Headline: `A Space is more than an image NFT.`
- Subcopy: `Each Space is two things working together: a 1/1 Metaplex NFT that proves who owns it, and a Solana PDA that stores the live settings and a link to the scene. Transfer the NFT, transfer the world.`
- Two-panel split:
  - Panel A — `The NFT — proof of ownership`: `A single 1/1 token. Mint authority is revoked at mint, so supply can never be inflated. Holding it is what authorizes every settings change.`
  - Panel B — `The PDA — the live world`: `On-chain settings — name, open/closed, editability, editor allowlist — plus space_config_uri, an IPFS manifest describing the scene, spawn point, and the assets loaded into it.`
- Field strip (render as labeled chips from the real `Space` account):
  `space_id` · `mint` · `owner` · `name` · `space_config_uri` · `is_open` · `is_editable_by_others` · `editors[ ]`

### 3.3 `how-it-works` — How it works (numbered steps: mint → configure → use)
Purpose: the core flow, protocol-accurate.
- Eyebrow: `How it works`
- Headline: `Mint it. Configure it. Use it anywhere.`
- Steps:
  1. **Mint the next Space** — `Call mint_next_space and you receive Space #N — the next ID in the collection. SOL goes to the treasury, a 1/1 NFT lands in your wallet, mint authority is revoked, and the Space PDA is created. A SpaceMinted event fires on-chain.`
  2. **Configure your world** — `As the NFT holder, set the name, flip is_open and is_editable_by_others, and point space_config_uri at an IPFS manifest with your scene, spawn point, and assets. Add up to 10 collaborators to the editor allowlist.`
  3. **Open it and use it** — `Open Spaces can be entered by others and loaded into games and virtual worlds. Editors — or anyone, when shared editing is on — can update the live room state, so worlds evolve without giving up ownership.`

### 3.4 `primitives` — Feature / primitive grid
Purpose: scannable strengths of the on-chain design.
- Eyebrow: `Why it's built this way`
- Headline: `On-chain by design.`
- Cards (title + body):
  - `Finite collection` — `Supply is capped on-chain by total_spaces. Every Space is numbered 1..=N — verifiable, scarce, and never duplicated.`
  - `True ownership` — `A 1/1 NFT with mint authority revoked. Possession of the token is the only key to editing the Space.`
  - `Configurable worlds` — `Settings live in a PDA, not in a frozen JSON. Rename, open, close, and re-point the scene manifest at any time.`
  - `Collaboration built in` — `is_editable_by_others plus a 10-slot editor allowlist let teams co-build a world while one wallet keeps authoritative ownership.`
  - `Portable scenes` — `space_config_uri points to an IPFS manifest (ekza.space.config.v1) describing scene, spawn, and assets — loadable by any compatible runtime.`
  - `Verifiable events` — `Every mint and settings change emits an on-chain event (SpaceMinted, SpaceSettingsUpdated, ConfigUpdated) — fully indexable.`

### 3.5 `arena` — Ekza Arena integration
Purpose: show Spaces and creator assets in a real game.
- Eyebrow: `In the game`
- Headline: `Spaces become arenas.`
- Subcopy: `Ekza Arena is a composable-avatar auto-battler built on the Ekza asset layer. Players bring creator-owned avatars and modifiers; Spaces serve as the rooms and arenas they play in — all resolved through the same ownership and manifest path.`
- Three points:
  - `Composable avatars` — `Base avatars plus mintable modifiers are equipped slot-by-slot, drawn from creator-published assets.`
  - `Creator-owned cards` — `An on-chain Arena registry publishes finalized Stellar releases into Arena-owned card records, so creator assets flow into the game.`
  - `Shared asset bridge` — `ekza-bevy-sdk gives the game stable character IDs and model manifests, keeping assets reusable across products.`
- Status note (reuse existing amber badge style): `Ekza Arena is an early Bevy prototype. NFT mint and equip are on the roadmap.`

### 3.6 `developers` — Developer / on-chain section
Purpose: earn developer trust; show it's a real, open Anchor program.
- Eyebrow: `For developers`
- Headline: `An open Anchor program on Solana.`
- Subcopy: `No black box. solana_ekza_space is an open Anchor program with four instructions, two PDAs, and emitted events you can index. Resolve ownership, fetch settings, load the scene.`
- Instruction list (name — one line):
  - `init_config` — `Create the global Config PDA: total_spaces, price, treasury, optional collection mint.`
  - `update_config` — `Authority-gated: update mint price and treasury.`
  - `mint_next_space` — `Mint the next Space NFT + PDA; pay the treasury; emit SpaceMinted.`
  - `update_space_settings` — `NFT-gated: update name, flags, editors, and the scene URI.`
- On-chain facts strip (render as the code/PDA signature block — signature visual moment):
  - `Program  solana_ekza_space`
  - `Config PDA  ["config"]`
  - `Space PDA  ["space_v1", config, space_id]`
  - `Default metadata  https://meta.ekza.space/spaces/{id}.json`
  - `Events  SpaceMinted · SpaceSettingsUpdated · ConfigUpdated`
- CTA link: `Read the program on GitHub →` (https://github.com/ekza-space)

### 3.7 `ecosystem` — Ecosystem (Ekza / Omoba / Wotori Studio)
Purpose: situate Space within the wider stack.
Reuse the existing `ProjectCards` pattern.
- Eyebrow: `The ecosystem`
- Headline: `One asset layer, many surfaces.`
- Subcopy: `Spaces are one product surface on a shared Solana ownership layer. The same assets power avatars, collaborative releases, and games.`
- Status note (existing badge): `Early alpha. Running on devnet.`
- Cards:
  - `Stellar` (→ https://stellar.ekza.io) — `The collaboration layer: universes, typed assets, lineage, releases, vaults, and contributor revenue shares.`
  - `Avatar` (→ https://avatar.ekza.io) — `Portable, mintable 3D identities with Solana-native ownership, linkable to finalized Stellar releases.`
  - `Space` (→ https://space.ekza.io) — `Numbered, NFT-owned virtual rooms and arenas with mutable on-chain settings.`
- Partner spotlight (keep existing component): **Omoba** — badge `Built on Ekza`, copy: `Open MOBA from Wotori Studio — players bring custom avatars and game-ready assets, running end-to-end on Ekza infrastructure.`
- Credit: `Created and backed by Wotori Studio` (→ https://wotori.io).

### 3.8 `cta` — Final CTA (waitlist / community)
Purpose: capture intent.
- Headline: `Claim a Space before they're gone.`
- Subcopy: `The collection is finite. Join the waitlist to mint early and follow the build.`
- Primary: `Join Waitlist` (opens modal). Secondary row: `Discord` (https://discord.gg/yUWb4Q5b) · `X` (https://twitter.com/EkzaSpace) · `Telegram` (https://t.me/ekzaspace).
- Keep the existing newsletter form within or directly below this section.

---

## 4. Design direction

**Brand tokens (use only these — from `tailwind.config.js` + `globals.css`):**
`bg-ekza-bg / surface / elevated / muted / card`, text `text-ekza-on / on-muted`,
`text-ekza-primary / primary-muted / on-primary`, `text-ekza-accent`, `border-ekza-border`,
`bg-ekza-glass`, `bg-ekza-philosophy`. Shadows: `shadow-ekza-card`, `shadow-ekza-card-dark`,
`shadow-ekza-glow`. Theme is **class-based dark** (`.dark`) — keep paired light/dark variants
exactly as existing sections do (e.g. `dark:bg-[#0c0e12]`). Light = "Ethereal Professional"
(indigo primary `69 82 195`), dark = "Immersive Void" (cyan `0 209 255` + purple accent).
Backgrounds: alternate `bg-ekza-surface` ↔ `bg-ekza-muted` per section with
`border-t border-ekza-border/20`; use `ekza-mesh-light` and `ekza-glow-orb` for ambient depth
(already in globals).

**Fonts:** headings `font-headline`, body `font-ekza`. Reserve `font-audiowide` for the
brand/wordmark only.

**Type scale:** H1 `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]`;
section H2 `text-4xl md:text-5xl font-bold tracking-tight`; card H3 `text-xl font-semibold`;
eyebrow `text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90`;
body `text-base/lg text-ekza-on-muted dark:text-white/70`; mono/code blocks use a `font-mono`
class with `text-ekza-on-muted`.

**Motion (reuse the omoba pattern):** add an ekza-scoped `motion.tsx` exporting `AnimReady`,
`Reveal` (IntersectionObserver, threshold ~0.14, respects `prefers-reduced-motion`), and
`Marquee`. Add `.ekza-anim-ready`, `.ekza-reveal/.is-in`, `.ekza-marquee*` CSS to `globals.css`
(copy omoba's `.omoba-*` rules, rename). Rules: reveal-on-scroll for every section block with
small stagger (`delay` 60–120ms across grid items); buttons keep existing
`hover:-translate-y-0.5 hover:shadow-ekza-glow`; cards `transition hover:-translate-y-0.5`.

**Three signature visual moments:**
1. **Numbered-Space card** — a large `#001 / 1000` plate styled like a collectible, with the
   `Space` field chips (3.2) rendered as a faux on-chain inspector. Reusable as the hero-side
   visual and in §3.2.
2. **On-chain / PDA code block** (§3.6) — a terminal-style `font-mono` panel with the
   program id, both PDA seeds, default metadata URI, and event names; subtle
   `shadow-ekza-glow`. The trust anchor of the page.
3. **Stat / fact strip** — a thin marquee or fixed row: `Finite supply · 1/1 NFT · Mint authority revoked · On-chain settings · IPFS scenes · Open Anchor program`.

---

## 5. Component plan

**Create (new, in `apps/ekza/src/components/`):**
- `motion.tsx` — ekza `AnimReady` / `Reveal` / `Marquee` (port of omoba's).
- `what-is-space.tsx` — §3.2 two-panel explainer + field chips.
- `how-it-works-steps.tsx` — §3.3 numbered mint→configure→use steps. (Replaces the current
  generic 4-layer "How it works" grid in `page.tsx`.)
- `primitive-grid.tsx` — §3.4 6-card feature grid.
- `arena-section.tsx` — §3.5 Arena integration with status badge.
- `developer-section.tsx` — §3.6 instructions + on-chain code/PDA block.
- `space-card-visual.tsx` — signature numbered-Space plate (used by hero + §3.2).
- `fact-strip.tsx` — signature stat marquee/row.
- `final-cta.tsx` — §3.8 CTA + community links (can wrap existing `NewsletterForm`).

**Keep / reuse as-is:**
- `header.tsx`, `footer.tsx`, `say-hi.tsx`, `theme-toggle.tsx`, `language-switcher.tsx`.
- `hero-section.tsx` — keep; feed §3.1 copy. Optionally slot `space-card-visual` into its
  right column instead of the photo (the component already supports a right-column visual).
- `waitlist-form.tsx`, `waitlist-modal.tsx`, `newsletter-form.tsx` — reuse for CTA.
- `project-cards.tsx` / `project.tsx` — reuse for §3.7 ecosystem cards.
- `partner-spotlight.tsx` — reuse for the Omoba spotlight (refresh copy to §3.7).

**Replace / retire:**
- The inline `how-it-works` and `philosophy` sections in `page.tsx` — replace with the new
  protocol-accurate sections (3.2–3.6). Optionally fold the philosophy quote into the hero or
  CTA rather than its own section.

**`page.tsx` order:** `SayHi → Header → HeroSection → WhatIsSpace → HowItWorksSteps →
PrimitiveGrid → ArenaSection → DeveloperSection → Ecosystem(ProjectCards) → PartnerSpotlight →
FinalCTA → Footer → WaitlistModal`. Mount `<AnimReady />` once near the top.

---

## 6. Asset notes

Existing in `apps/ekza/public/`:
- `img/ekza_wotori_space.jpeg` — current hero image; keep as hero fallback / dark full-bleed.
- `img/space.jpg`, `img/space-ashton.jpeg` — usable in the Space explainer / Arena sections.
- `img/moon.jpg`, `img/wotori_worlds.jpg`, `img/distr.jpeg`, `img/stellar.jpg` — ambient /
  ecosystem imagery. `img/cat*.png`, `img/wotori.*` — Wotori brand; use only in credit/footer.
- `video/enter.mp4` — candidate ambient/hero background loop (muted, autoplay, playsinline)
  for the dark theme; test performance before shipping.
- Ecosystem card art is currently pulled from IPFS in `page.tsx` (Stellar/Avatar/Space) — keep
  those URLs.
- `fonts/Audiowide/` — present; `--font-ekza-headline` / `--font-ekza-body` are wired in
  `layout.tsx`.

**Missing / flag:**
- No dedicated **Ekza Arena** screenshot/art in `public/img` — Arena section needs one
  (request a Bevy capture, or use `space.jpg` as placeholder).
- No icon set for the primitive grid (finite/ownership/config/collab/portable/events) — use a
  lightweight inline-SVG or `lucide-react` set tinted with `text-ekza-primary`.
- No graphic for the numbered-Space plate — build it in CSS/SVG (no asset needed).
- `meta.ekza.space/spaces/{id}.json` is the live metadata host (reference only; do not fetch
  at build).
```
