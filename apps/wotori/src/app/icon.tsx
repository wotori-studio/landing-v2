import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top left, rgba(0,228,175,0.3), transparent 38%), linear-gradient(135deg, #020617 0%, #0f172a 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.18,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 320,
            height: 320,
            borderRadius: 72,
            border: "2px solid rgba(0,228,175,0.4)",
            background: "rgba(15,23,42,0.72)",
            boxShadow: "0 0 80px rgba(0,228,175,0.25)",
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: "-0.08em",
          }}
        >
          W
        </div>
      </div>
    ),
    size
  );
}
