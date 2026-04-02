import { ImageResponse } from "next/og";
import { WOTORI_SITE_NAME } from "../lib/seo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = `${WOTORI_SITE_NAME} social preview`;

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(0,228,175,0.28), transparent 34%), radial-gradient(circle at bottom right, rgba(34,211,238,0.22), transparent 32%), linear-gradient(135deg, #020617 0%, #07111f 45%, #020617 100%)",
          color: "#f8fafc",
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
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            fontSize: 24,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#67e8f9",
          }}
        >
          Wotori Studio
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
              maxWidth: 920,
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            Web3 animation, creator platforms, and Solana-aligned ecosystems.
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              marginTop: 26,
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(226,232,240,0.9)",
            }}
          >
            Wotori builds creator-first products across gaming, media, and
            digital ownership.
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 34,
            }}
          >
            {["Ekza Space", "Omoba", "Web3 Studio"].map((pill) => (
              <div
                key={pill}
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,228,175,0.35)",
                  background: "rgba(0,228,175,0.1)",
                  fontSize: 24,
                  color: "#ccfbf1",
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
