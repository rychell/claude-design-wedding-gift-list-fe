"use client";

import { P, FONTS } from "@/components/wedding/primitives";

export type Method = "pix" | "credit_card";

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PixIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M7 14L14 7L21 14L14 21L7 14Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 14L14 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 7L21 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M21 14L14 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 21L7 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function CardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="7" width="22" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 11H25" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6" y="15" width="6" height="2" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function Spinner({ color = P.accent }: { color?: string }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="18" stroke={P.line} strokeWidth="1.5" fill="none" />
      <circle cx="22" cy="22" r="18" stroke={color} strokeWidth="1.5" fill="none"
        strokeLinecap="round" strokeDasharray="28 86" transform="rotate(-90 22 22)">
        <animateTransform attributeName="transform" type="rotate"
          from="0 22 22" to="360 22 22" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function MethodCard({
  selected,
  onSelect,
  icon,
  label,
  description,
  badge,
}: {
  method: Method;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
  badge?: string;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: "18px 18px",
        borderRadius: 16,
        background: P.surface,
        border: selected ? `1.5px solid ${P.accent}` : `1px solid ${P.line}`,
        cursor: "pointer",
        display: "flex", alignItems: "center", gap: 16,
        transition: "border 0.15s, box-shadow 0.15s",
        boxShadow: selected ? `0 0 0 3px ${P.accent}22` : "none",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        position: "relative",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 999, flexShrink: 0,
        border: selected ? `2px solid ${P.accent}` : `1.5px solid ${P.line}`,
        background: selected ? P.accent : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s, border 0.15s",
      }}>
        {selected && <div style={{ width: 7, height: 7, borderRadius: 999, background: "#fff" }} />}
      </div>

      <div style={{ color: selected ? P.accent : P.inkSoft, flexShrink: 0, transition: "color 0.15s" }}>
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 600, color: P.ink, marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft, lineHeight: 1.4 }}>
          {description}
        </div>
      </div>

      {badge && (
        <div style={{
          padding: "3px 8px", borderRadius: 999,
          background: `${P.accent}18`, color: P.accentDeep,
          fontFamily: FONTS.body, fontSize: 10, fontWeight: 600,
          letterSpacing: "0.06em", flexShrink: 0,
        }}>
          {badge}
        </div>
      )}
    </div>
  );
}
