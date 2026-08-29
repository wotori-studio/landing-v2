import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

/**
 * Favicon — the logo mark: a rounded square split by a prism seam.
 * Left half chrome (reality), right half prism (the universe).
 */
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
          background: "#07080A",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 400,
            height: 400,
            borderRadius: 110,
            overflow: "hidden",
            border: "8px solid rgba(255,255,255,0.2)",
            boxShadow: "0 0 90px rgba(182,255,26,0.22)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 200,
              height: 400,
              background: "linear-gradient(180deg, #FFFFFF 0%, #EDF2E9 55%, #9AA79A 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 200,
              height: 400,
              background: "linear-gradient(100deg, #6EF244 0%, #B6FF1A 55%, #E7FFB0 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 194,
              display: "flex",
              width: 12,
              height: 400,
              background: "#07080A",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
