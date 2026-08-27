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
          background: "#07070C",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 140,
            height: 140,
            borderRadius: 38,
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.2)",
            boxShadow: "0 0 34px rgba(124,92,255,0.42)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 70,
              height: 140,
              background: "linear-gradient(180deg, #FFFFFF 0%, #E9ECF5 55%, #A8B0C4 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 70,
              height: 140,
              background: "linear-gradient(100deg, #7C5CFF 0%, #FF5FA2 52%, #35E8FF 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 68,
              display: "flex",
              width: 4,
              height: 140,
              background: "#07070C",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
