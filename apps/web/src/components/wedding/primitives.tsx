import type { CSSProperties, ReactNode } from "react";

// ─── Design tokens ────────────────────────────────────────────
export const P = {
  bg: "#F7F2EA",
  surface: "#FBF7F0",
  card: "#FFFFFF",
  ink: "#2A2520",
  inkSoft: "#7A6E5F",
  inkMuted: "#A89B89",
  accent: "#B89968",
  accentDeep: "#8B7448",
  line: "rgba(42,37,32,0.10)",
  placeholder: "#E8DFCF",
  placeholderStripe: "#DCCFB7",
} as const;

export const FONTS = {
  display: "var(--font-display, 'Cormorant Garamond', 'Times New Roman', serif)",
  body: "var(--font-body, 'Manrope', system-ui, sans-serif)",
  mono: "'JetBrains Mono', monospace",
} as const;

// ─── Sprig (4-point star ornament) ───────────────────────────
export function Sprig({ size = 12, color = P.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      <path d="M12 2 L13 11 L22 12 L13 13 L12 22 L11 13 L2 12 L11 11 Z" fill={color} opacity="0.9" />
      <circle cx="12" cy="12" r="0.8" fill={color} />
    </svg>
  );
}

// ─── Botanical (decorative plant illustration) ────────────────
export function Botanical({
  size = 80,
  color = P.accent,
  opacity = 0.5,
  style = {},
}: {
  size?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 80 112"
      style={{ display: "block", ...style }}
    >
      <g stroke={color} strokeWidth="0.9" fill="none" opacity={opacity} strokeLinecap="round">
        <path d="M40 110 Q 40 60 40 4" />
        <path d="M40 92 Q 22 88 14 78" />
        <path d="M40 92 Q 24 92 14 78 Q 22 88 40 92 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 74 Q 24 70 18 60" />
        <path d="M40 74 Q 26 74 18 60 Q 24 70 40 74 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 56 Q 26 52 22 44" />
        <path d="M40 56 Q 28 56 22 44 Q 26 52 40 56 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 38 Q 28 34 26 28" />
        <path d="M40 38 Q 30 38 26 28 Q 28 34 40 38 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 84 Q 56 80 64 70" />
        <path d="M40 84 Q 54 84 64 70 Q 56 80 40 84 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 66 Q 54 62 60 54" />
        <path d="M40 66 Q 52 66 60 54 Q 54 62 40 66 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 48 Q 52 44 56 38" />
        <path d="M40 48 Q 50 48 56 38 Q 52 44 40 48 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 30 Q 50 26 52 22" />
        <path d="M40 30 Q 48 30 52 22 Q 50 26 40 30 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <circle cx="40" cy="6" r="2.5" fill={color} opacity="0.5" stroke="none" />
      </g>
    </svg>
  );
}

// ─── Monogram "M ✿ R" ─────────────────────────────────────────
export function Monogram({
  size = 48,
  color = P.accent,
  style = {},
}: {
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: FONTS.display,
        fontWeight: 400,
        fontSize: size,
        color,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.12,
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      <span>M</span>
      <Sprig size={size * 0.34} color={color} />
      <span>R</span>
    </div>
  );
}

// ─── Gold Rule ────────────────────────────────────────────────
export function GoldRule({
  color = P.accent,
  width = 80,
  ornament = false,
  style = {},
}: {
  color?: string;
  width?: number;
  ornament?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, ...style }}>
      <div style={{ width, height: 1, background: color, opacity: 0.55 }} />
      {ornament && <Sprig size={10} color={color} />}
      {ornament && <div style={{ width, height: 1, background: color, opacity: 0.55 }} />}
    </div>
  );
}

// ─── CapsLine ─────────────────────────────────────────────────
export function CapsLine({
  children,
  size = 12,
  color = P.inkSoft,
  weight = 400,
  style = {},
}: {
  children: ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: FONTS.display,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: size > 20 ? "0.32em" : "0.28em",
        textTransform: "uppercase",
        color,
        textIndent: "0.28em",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── ButtonPrimary ────────────────────────────────────────────
export function ButtonPrimary({
  children,
  subtle = false,
  style = {},
  onClick,
}: {
  children: ReactNode;
  subtle?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        height: 54,
        borderRadius: 999,
        background: subtle ? "transparent" : P.accent,
        color: subtle ? P.accent : "#fff",
        border: subtle ? `1px solid ${P.accent}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTS.display,
        fontSize: 16,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        textIndent: "0.22em",
        fontWeight: 500,
        boxShadow: subtle ? "none" : "0 8px 18px -8px rgba(0,0,0,0.25)",
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Pill (category chip) ─────────────────────────────────────
export function Pill({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        height: 30,
        padding: "0 14px",
        borderRadius: 999,
        background: active ? P.ink : "transparent",
        color: active ? P.bg : P.inkSoft,
        border: active ? "none" : `1px solid ${P.line}`,
        display: "inline-flex",
        alignItems: "center",
        fontFamily: FONTS.body,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

// ─── Back Button ──────────────────────────────────────────────
export function BackButton({ color = P.ink }: { color?: string }) {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 999,
        background: "rgba(255,255,255,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Icon Button (bordered circle) ───────────────────────────
export function IconButton({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 999,
        border: `1px solid ${P.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
}

// ─── MapTile (stylized abstract map SVG) ──────────────────────
export function MapTile() {
  return (
    <svg
      viewBox="0 0 320 130"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block", background: P.placeholder }}
    >
      <defs>
        <pattern id="mapdots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.6" fill={P.placeholderStripe} />
        </pattern>
      </defs>
      <rect width="320" height="130" fill="url(#mapdots)" />
      <path
        d="M0 60 Q 60 50 120 70 T 240 60 T 360 80"
        stroke={P.placeholderStripe}
        strokeWidth="14"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M0 60 Q 60 50 120 70 T 240 60 T 360 80"
        stroke="#fff"
        strokeWidth="2"
        strokeDasharray="3 4"
        fill="none"
      />
      <path d="M40 0 L60 130" stroke={P.placeholderStripe} strokeWidth="22" opacity="0.5" />
      <path d="M40 0 L60 130" stroke="#fff" strokeWidth="2" strokeDasharray="3 4" />
      <g transform="translate(180, 50)">
        <circle r="14" fill={P.accent} opacity="0.18" />
        <circle r="8" fill={P.accent} />
        <circle r="3" fill="#fff" />
      </g>
    </svg>
  );
}
