import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#2A2520",
          borderRadius: 4,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: "Georgia, serif",
            color: "#B89968",
            letterSpacing: 1,
            lineHeight: 1,
          }}
        >
          m | r
        </span>
      </div>
    ),
    { ...size }
  );
}
