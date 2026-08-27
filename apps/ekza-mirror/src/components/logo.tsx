/**
 * Ekza Mirror logo.
 *
 * Mark: a rounded square split by a vertical seam. The left half is solid
 * chrome (reality), the right half carries the prism gradient and is very
 * slightly offset and over-scaled — the reflected version of the same shape.
 * Wordmark: "EKZA MIRROR", Space Grotesk, tracking 0.18em, with MIRROR
 * filled by the prism gradient.
 *
 * Inline SVG only — this same component feeds the header, the footer,
 * the favicon route and the OG image.
 */
export function Logo({
  variant = "full",
  className = "",
}: {
  variant?: "mark" | "full";
  className?: string;
}) {
  const mark = (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Ekza Mirror"
      className={variant === "mark" ? className : "h-8 w-8 shrink-0"}
    >
      <defs>
        <linearGradient id="mirLogoPrism" x1="0" y1="64" x2="64" y2="0">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="52%" stopColor="#FF5FA2" />
          <stop offset="100%" stopColor="#35E8FF" />
        </linearGradient>
        <linearGradient id="mirLogoChrome" x1="0" y1="0" x2="0" y2="64">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E9ECF5" />
          <stop offset="100%" stopColor="#A8B0C4" />
        </linearGradient>
        <linearGradient id="mirLogoSeam" x1="0" y1="0" x2="0" y2="64">
          <stop offset="0%" stopColor="#35E8FF" stopOpacity="0" />
          <stop offset="22%" stopColor="#7C5CFF" stopOpacity="1" />
          <stop offset="60%" stopColor="#FF5FA2" stopOpacity="1" />
          <stop offset="100%" stopColor="#35E8FF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="mirLogoClip">
          <rect x="2" y="2" width="60" height="60" rx="17" />
        </clipPath>
      </defs>

      <g clipPath="url(#mirLogoClip)">
        <rect x="0" y="0" width="64" height="64" fill="#07070C" />
        {/* reality — solid chrome */}
        <rect x="2" y="2" width="30" height="60" fill="url(#mirLogoChrome)" />
        {/* the universe — the reflected half, offset + over-scaled */}
        <rect
          x="33"
          y="-1"
          width="32"
          height="66"
          fill="url(#mirLogoPrism)"
          opacity="0.95"
        />
        {/* the seam */}
        <rect x="31.5" y="0" width="1.2" height="64" fill="url(#mirLogoSeam)" />
      </g>
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="17"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
      />
    </svg>
  );

  if (variant === "mark") return mark;

  return (
    <span className={`inline-flex shrink-0 items-center gap-2.5 ${className}`.trim()}>
      {mark}
      <span className="whitespace-nowrap font-display text-sm font-bold uppercase leading-none tracking-[0.18em] text-mirror-chrome">
        Ekza <span className="mir-grad">Mirror</span>
      </span>
    </span>
  );
}
