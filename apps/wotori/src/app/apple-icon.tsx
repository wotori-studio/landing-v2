import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 128,
            height: 128,
            borderRadius: 30,
            border: "2px solid rgba(0,228,175,0.4)",
            background: "rgba(15,23,42,0.78)",
            boxShadow: "0 0 32px rgba(0,228,175,0.22)",
            fontSize: 82,
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
