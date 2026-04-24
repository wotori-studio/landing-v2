export const SOCIAL_PREVIEW_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const SOCIAL_PREVIEW_CONTENT_TYPE = "image/png";

interface SocialPreviewImageProps {
  badge: string;
  headline: string;
  description: string;
  tags?: string[];
  background?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeBackground?: string;
  headlineColor?: string;
  descriptionColor?: string;
  tagTextColor?: string;
  tagBorderColor?: string;
  tagBackground?: string;
}

export function SocialPreviewImage({
  badge,
  headline,
  description,
  tags = [],
  background = "radial-gradient(circle at top left, rgba(0,228,175,0.28), transparent 34%), radial-gradient(circle at bottom right, rgba(34,211,238,0.22), transparent 32%), linear-gradient(135deg, #020617 0%, #07111f 45%, #020617 100%)",
  badgeTextColor = "#67e8f9",
  badgeBorderColor = "rgba(255,255,255,0.14)",
  badgeBackground = "rgba(255,255,255,0.06)",
  headlineColor = "#f8fafc",
  descriptionColor = "rgba(226,232,240,0.9)",
  tagTextColor = "#ccfbf1",
  tagBorderColor = "rgba(0,228,175,0.35)",
  tagBackground = "rgba(0,228,175,0.1)",
}: SocialPreviewImageProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background,
        color: headlineColor,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.18,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 54,
          left: 64,
          display: "flex",
          padding: "10px 18px",
          borderRadius: 999,
          border: `1px solid ${badgeBorderColor}`,
          background: badgeBackground,
          fontSize: 24,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: badgeTextColor,
        }}
      >
        {badge}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          padding: "130px 64px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: 940,
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: headlineColor,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: "flex",
            maxWidth: 900,
            marginTop: 26,
            fontSize: 30,
            lineHeight: 1.35,
            color: descriptionColor,
          }}
        >
          {description}
        </div>

        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 34,
            }}
          >
            {tags.map((pill) => (
              <div
                key={pill}
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: `1px solid ${tagBorderColor}`,
                  background: tagBackground,
                  fontSize: 24,
                  color: tagTextColor,
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
