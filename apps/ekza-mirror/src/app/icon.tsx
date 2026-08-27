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
          background: "#07070C",
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
            boxShadow: "0 0 90px rgba(124,92,255,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 200,
              height: 400,
              background: "linear-gradient(180deg, #FFFFFF 0%, #E9ECF5 55%, #A8B0C4 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 200,
              height: 400,
              background: "linear-gradient(100deg, #7C5CFF 0%, #FF5FA2 52%, #35E8FF 100%)",
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
              background: "#07070C",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
