# Ekza Mirror — Brand Guide

> **Wear the universe.**
> Point the camera at a friend. They become an Ekza avatar. Hit record.

---

## 1. The story

Ekza Mirror is a native iPhone AR playground. The rear camera plus ARKit body
tracking finds a real person; RealityKit draws a volumetric avatar on top of
them that copies their motion. Point the phone at a friend, they become someone
from the Ekza universe, record, share.

It is not a second economy. It is **the playground lens of the Ekza universe** —
the piece that lets you *feel* what portable, owned 3D identity is like when it
walks around your living room. Avatars come from the Ekza avatar catalog
(VRM/USDZ, provenance and SHA-256 resolved by a small FastAPI resolver).

**Current state: working prototype.** Procedural volumetric avatar ships today;
real rigged Ekza characters (VRM → ARKit USDZ retarget) are the next milestone.
Six verified VRM avatars on devnet. Status wording is always
`prototype · iphone · on-device`. Never imply App Store or live TestFlight —
the only ask is the waitlist.

### Facts we are allowed to state (and must not inflate)
- Runs on-device. Camera frames never leave the iPhone. No cloud vision, no external ML.
- ARKit body tracking → smoothed 3D skeleton joints; RealityKit avatar rendering.
- Requires iOS 17+, iPhone with A12 Bionic or newer. Simulator unsupported.
- One person at a time; they must fit fully in frame; good light helps.
- The avatar covers the person — it does not rebuild the background.

---

## 2. Voice

Short, playful, imperative. **Toy energy with engineer honesty.**

| Do | Don't |
|---|---|
| Verbs first: "Point. Wear. Record." | Noun soup: "an immersive AR identity solution" |
| Lowercase kickers (`prototype · iphone · on-device`) | SHOUTING HEADLINES |
| Sentence-case headlines | Title Case Every Word |
| Name the limits plainly ("one person at a time") | Hiding limits behind "currently optimizing" |
| Three-beat rhythm: **point · wear · record** | Four-clause corporate sentences |
| One exclamation mark per page, at most | Exclamation spam |

Rhythm rule: whenever you need a list, try three beats first. The product is a
three-beat product.

---

## 3. Palette

Tailwind namespace `mirror` (`bg-mirror-void`, `text-mirror-silver`, …).

Acid green on black. **One hue, three chroma levels** — where the old system
separated things by hue, this one separates them by chroma, value and area.

| Token | Hex | Contrast on void | Use |
|---|---|---|---|
| `mirror.void` | `#07080A` | — | page background, primary-button label color |
| `mirror.deep` | `#0C0F0C` | — | alternate section background, 3D canvas clear |
| `mirror.surface` | `#131813` | — | cards, media frames |
| `mirror.chrome` | `#EDF2E9` | 17.6:1 | primary text |
| `mirror.silver` | `#9AA79A` | 8.0:1 | muted / secondary text |
| `mirror.acid` | `#B6FF1A` | 16.5:1 | **tier A** — primary accent |
| `mirror.toxic` | `#6EF244` | 13.8:1 | **atmosphere** — the gradient's dark end, ambient glow |
| `mirror.bone` | `#E7FFB0` | 18.4:1 | **tier B** — the quiet label colour |

### The emphasis ladder

The single accent only stays loud if it is rationed. Three tiers:

- **Tier A — acid.** Either *the one thing to click* or *the one claim the page
  is built on*. Primary button fill, focus ring, selected state, live/recording
  indicators, text selection, link hover, and exactly two section kickers:
  the hero and the CTA. Nothing else.
- **Tier B — bone.** Every in-card micro-label, note, tag, caption and badge
  that used to be a second or third hue. Reads as off-white with a green cast,
  not as an accent.
- **Tier C — silver.** The back-matter kickers (tech's *current limits*,
  roadmap, FAQ, footer) take `.mir-kicker`'s own silver with no accent class.
  The decrescendo through the lower half of the page is deliberate.

**Never** put acid, bone or chrome text on an acid or bone fill —
chrome on acid is 1.07:1. Text on an acid fill is always `mirror.void`
(16.5:1). Toxic is never a text colour.

**The prism** — the one signature gradient, exposed as `--mir-prism`:

```css
linear-gradient(100deg, #6EF244 0%, #B6FF1A 55%, #E7FFB0 100%);
```

It is now a *value* ramp inside one hue rather than a hue ramp, so it reads as
a light sweep across the seam. Use it for: gradient text (one phrase per
screen, no more), the seam, kicker hairlines, the primary button fill, the
logo's right half. Never as a large flat field — it is a *line and an edge*,
not a wallpaper.

**Glow alphas.** The green prism runs ~2.2x the luminance of the old one, so
every *fill, wash and glow* alpha inherited from the old palette is roughly
halved. Hairlines, 1px seams, borders and focus rings keep their alpha — they
are supposed to be loud.

Body copy is `mirror.silver` on `mirror.void` (contrast ≈ 8.0:1, AAA for body).
Never drop body text below `mirror.silver` in brightness.

Deliberately unlike its siblings: ekza.io is light and cyan-clean, omoba is
cyan/gold. Mirror is near-black chrome + acid.

---

## 4. Type

| Role | Face | Spec |
|---|---|---|
| Display | **Space Grotesk** (`--font-mirror-display`, `font-display`) | headlines, kickers, buttons, stat metrics |
| Body | **Inter** (`--font-mirror-sans`, `font-sans`) | everything else |

| Style | Size | Weight | Tracking |
|---|---|---|---|
| H1 | `clamp(2.6rem, 1.6rem + 5vw, 5.2rem)` | 700 | `-0.03em` |
| H2 (`.mir-h2`) | `1.875rem → 3rem` | 700 | `-0.03em` |
| H3 | `1.25rem` | 600 | `-0.01em` |
| Lead (`.mir-lead`) | `1rem → 1.125rem` | 400 | normal |
| Body | `0.95rem` | 400 | normal |
| Kicker (`.mir-kicker`) | `0.7rem` | 600 | `0.3em`, uppercase, 26px hairline |
| Stat metric | `1.3rem → 1.9rem` | 700 | `-0.02em` |

Kickers are written lowercase in the copy and uppercased by CSS — so they read
as machine labels, not as shouting.

---

## 5. Logo

**Mark** — a rounded square split by a vertical seam. Left half solid chrome
(reality). Right half acid prism gradient, slightly offset and over-scaled: the
*reflected* version of the same shape. A 1px prism seam sits where they meet.

**Wordmark** — `EKZA MIRROR`, Space Grotesk, uppercase, tracking `0.18em`.
`EKZA` is chrome; `MIRROR` carries the prism gradient text fill.

Rules:
- Ship it from `src/components/logo.tsx` only. No exported PNG/SVG files.
- `variant="mark"` for square contexts (favicon, avatar, app tile);
  `variant="full"` for header and footer.
- Clear space: one mark-width on every side.
- Minimum mark size 20px. Below that, the seam disappears — use the mark alone.
- Never recolor the chrome half, never flip the halves, never put the mark on a
  light background, never add a drop shadow to the wordmark.

---

## 6. Motifs

Five, and they are the whole visual language. Every screen should carry at
least two.

1. **Seam** (`.mir-seam`, `.mir-seam-v`) — a 1px prism line. It divides sections,
   underlines the header, and is the draggable handle of the hero wipe. This is
   the brand's single most recognisable object.
2. **Reflection** (`.mir-reflect`) — a flipped, blurred, fading duplicate placed
   directly under a wordmark or a key card. Always `aria-hidden`.
3. **Grain** (`.mir-grain` / `<Noise />`) — inline `feTurbulence` noise at
   opacity `0.035`. Enough to kill banding, never enough to notice.
4. **Chrome sheen** (`.mir-sheen`, and built into both buttons) — a slow diagonal
   highlight that sweeps across a surface on hover.
5. **Acid edge** (`.mir-glass-hover`) — on hover a card's hairline border warms
   to an acid-tinted glow and the card lifts 5px.

Supporting textures: `.mir-mesh` (the acid/toxic/bone background field — three
chroma characters, one hue, so the page keeps its depth without a second hue) and
`.mir-frame-fallback` (the gradient that must sit behind every image so a
missing file never leaves a white box).

---

## 7. Utility vocabulary

All bespoke classes are prefixed `mir-` and live in `src/app/globals.css`.

`mir-mesh` · `mir-glass` · `mir-glass-hover` · `mir-btn-primary` ·
`mir-btn-secondary` · `mir-sheen` · `mir-kicker` · `mir-grad` · `mir-seam` ·
`mir-seam-v` · `mir-reflect` · `mir-grain` · `mir-stat` (`__metric`, `__label`) ·
`mir-marquee` (`__track`, `__item`, `__sep`) · `mir-reveal` + `.is-in`
(gated by `mir-anim-ready` on `<html>`) · `mir-shell` · `mir-section` ·
`mir-h2` · `mir-lead` · `mir-frame-fallback`.

---

## 8. Motion

- Shared easing `cubic-bezier(0.16, 1, 0.3, 1)` (`--mir-ease`). Nothing bounces.
- Reveals: 26px rise + fade over 800ms, fired once by IntersectionObserver.
- Hover lift: 5px on cards, 2px on buttons, 300–400ms.
- Marquee: 34s linear, infinite, masked at both edges.
- No animation library. CSS + IntersectionObserver only.
- `prefers-reduced-motion: reduce` kills marquee, sheen sweeps, reveals and
  every hover translate. This is not optional.

---

## 9. Accessibility

- Focus ring: 2px `mirror.acid`, 3px offset — 16.5:1 on void, 14.8:1 on
  surface. The offset keeps the ring on the page background, so it stays
  visible even around the acid-filled primary button.
- The hero wipe is a real slider: `role="slider"`, `aria-valuenow`, arrow keys.
- Every image needs alt text; decorative layers get `aria-hidden="true"`.
- Body copy holds AA contrast (`mirror.silver` or lighter on dark).
- Mobile first. The hero must look deliberate at 375px, not merely fit.

---

## 10. Do / Don't

**Do**
- Lead with the verb. "Point the camera at a friend."
- Keep the prism to lines, edges and one gradient phrase per screen.
- State a limit right next to a claim — honesty is part of the toy's charm.
- Let the seam do the dividing; skip heavy borders and boxes.
- Put a gradient fallback behind every photo frame.

**Don't**
- Don't say "launch", "available now", "App Store" or "TestFlight".
- Don't call it a platform, a protocol or a metaverse.
- Don't add a second gradient family — the prism is the only one.
- Don't stack more than one gradient headline per viewport.
- Don't add npm dependencies for motion. CSS is the budget.
