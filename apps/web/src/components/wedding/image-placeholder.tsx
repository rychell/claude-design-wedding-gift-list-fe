import { P, FONTS } from "./primitives";
import type { CSSProperties } from "react";

let idCounter = 0;

export function ImagePlaceholder({
  width = "100%",
  height = 200,
  label = "foto",
  radius = 0,
  style = {},
}: {
  width?: number | string;
  height?: number;
  label?: string;
  radius?: number;
  style?: CSSProperties;
}) {
  // stable server-side id based on label
  const stripeId = `stripe-${label.replace(/\s+/g, "-")}`;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: P.placeholder,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={stripeId}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="14" stroke={P.placeholderStripe} strokeWidth="6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${stripeId})`} />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONTS.mono,
          fontSize: 10,
          color: P.inkSoft,
          padding: "2px 8px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            background: "rgba(255,255,255,0.85)",
            padding: "4px 8px",
            borderRadius: 2,
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
