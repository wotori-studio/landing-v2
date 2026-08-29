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
          background: "#07080A",
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
            boxShadow: "0 0 34px rgba(182,255,26,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 70,
              height: 140,
              background: "linear-gradient(180deg, #FFFFFF 0%, #EDF2E9 55%, #9AA79A 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 70,
              height: 140,
              background: "linear-gradient(100deg, #6EF244 0%, #B6FF1A 55%, #E7FFB0 100%)",
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
              background: "#07080A",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
