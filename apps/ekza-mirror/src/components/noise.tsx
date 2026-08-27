/**
 * Motif 3 — grain.
 * A subtle film-grain overlay drawn from an inline SVG feTurbulence
 * data-URI (no network request, no image file). Place it inside a
 * `relative` container; it is decorative and never interactive.
 */
const NOISE_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='mirNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23mirNoise)'/%3E%3C/svg%3E";

export function Noise({
  className = "",
  opacity = 0.035,
  fixed = false,
}: {
  className?: string;
  /** Keep it whisper-quiet — brand default is 0.035. */
  opacity?: number;
  /** `true` pins the grain to the viewport for a whole-page overlay. */
  fixed?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`mir-grain ${className}`.trim()}
      style={{
        opacity,
        backgroundImage: `url("${NOISE_DATA_URI}")`,
        // inline so it beats the `.mir-grain` default of `absolute`
        position: fixed ? "fixed" : undefined,
        zIndex: fixed ? 60 : undefined,
      }}
    />
  );
}

export { NOISE_DATA_URI };
