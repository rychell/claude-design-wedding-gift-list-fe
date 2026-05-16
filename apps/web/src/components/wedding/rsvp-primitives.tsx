"use client";

import type { CSSProperties, ReactNode } from "react";
import { P, FONTS, Sprig } from "./primitives";
export type { Guest } from "@/lib/rsvp-utils";
export { isDeadlinePassed, formatDateShort, buildRsvpMessage, buildWhatsAppUrl } from "@/lib/rsvp-utils";
import type { Guest } from "@/lib/rsvp-utils";
import { formatDateShort } from "@/lib/rsvp-utils";

// ─── Stepper (+/-) ────────────────────────────────────────────
export function Stepper({
  value,
  onChange,
  min = 1,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  label?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {label && (
        <div style={{ fontFamily: FONTS.body, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: P.inkSoft }}>
          {label}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          style={{
            width: 44, height: 44, borderRadius: 999,
            border: `1px solid ${value <= min ? P.line : P.accent}`,
            background: "transparent",
            color: value <= min ? P.inkMuted : P.accent,
            fontSize: 22, fontWeight: 300, cursor: value <= min ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          −
        </button>
        <div style={{
          fontFamily: FONTS.display, fontSize: 40, fontWeight: 400,
          color: P.ink, lineHeight: 1, minWidth: 48, textAlign: "center",
        }}>
          {value}
        </div>
        <button
          onClick={() => onChange(value + 1)}
          style={{
            width: 44, height: 44, borderRadius: 999,
            border: "none", background: P.accent,
            color: "#fff", fontSize: 22, fontWeight: 300,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px -4px rgba(184,153,104,0.5)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── StatusDot ────────────────────────────────────────────────
// comparecera: true=vai, false=não vai, null=pendente
export function StatusDot({ comparecera }: { comparecera: boolean | null }) {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: 999, flexShrink: 0,
      background: comparecera === true ? P.accent : "transparent",
      border: comparecera === true
        ? "none"
        : comparecera === false
          ? `1.5px solid ${P.inkMuted}`
          : `1.5px dashed ${P.inkMuted}`,
      opacity: comparecera === false ? 0.5 : 1,
    }} />
  );
}

// ─── CheckMedallion ───────────────────────────────────────────
export function CheckMedallion({ size = 72 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: `radial-gradient(circle at 40% 35%, #c9a870, ${P.accent})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 ${size * 0.12}px ${size * 0.35}px -${size * 0.08}px rgba(184,153,104,0.55)`,
    }}>
      <svg width={size * 0.44} height={size * 0.44} viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l5 5 9-9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── AdminStatCard ────────────────────────────────────────────
export function AdminStatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div style={{
      background: P.card, borderRadius: 14, padding: "16px 18px",
      border: `1px solid ${P.line}`, display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ fontFamily: FONTS.body, fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: P.inkMuted }}>
        {label}
      </div>
      <div style={{
        fontFamily: FONTS.display, fontSize: 28, fontWeight: 400, lineHeight: 1,
        color: accent ? P.accent : P.ink,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkSoft, marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── RingProgress ─────────────────────────────────────────────
export function RingProgress({ percent, size = 96 }: { percent: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={P.line} strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={P.accent} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontFamily: FONTS.display, fontSize: size * 0.22, fontWeight: 400, color: P.ink, lineHeight: 1 }}>
          {Math.round(percent)}%
        </div>
      </div>
    </div>
  );
}

// ─── FilterPill ───────────────────────────────────────────────
export function FilterPill({
  children,
  active = false,
  count,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 32, padding: "0 14px", borderRadius: 999,
        background: active ? P.ink : "transparent",
        color: active ? P.bg : P.inkSoft,
        border: active ? "none" : `1px solid ${P.line}`,
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: FONTS.body, fontSize: 12, fontWeight: 500,
        letterSpacing: "0.03em", whiteSpace: "nowrap",
        cursor: "pointer", WebkitTapHighlightColor: "transparent",
        flexShrink: 0,
      }}
    >
      {children}
      {count !== undefined && (
        <span style={{
          fontFamily: FONTS.mono, fontSize: 10,
          color: active ? P.bg : P.inkMuted,
          opacity: 0.85,
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── GuestRow ─────────────────────────────────────────────────
export function GuestRow({
  guest,
  onCopyLink,
  onCopyMessage,
  onWhatsApp,
  onClick,
  baseUrl = "",
}: {
  guest: Guest;
  onCopyLink?: () => void;
  onCopyMessage?: () => void;
  onWhatsApp?: () => void;
  onClick?: () => void;
  baseUrl?: string;
}) {
  const diverge = guest.convidadosConfirmados !== null && guest.convidadosConfirmados !== guest.convidados;
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
        borderBottom: `1px solid ${P.line}`, cursor: onClick ? "pointer" : "default",
      }}
    >
      <StatusDot comparecera={guest.comparecera} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 15, fontWeight: 500,
          color: P.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {guest.nome}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted }}>
            {guest.convidados} convidados
            {diverge && (
              <span style={{ color: P.accentDeep, fontWeight: 600 }}>
                {" "}→ {guest.convidadosConfirmados} confirmados
              </span>
            )}
          </span>
          <span style={{ fontFamily: FONTS.body, fontSize: 10, color: P.inkMuted, letterSpacing: "0.06em", textTransform: "capitalize" }}>
            · {guest.lado}
          </span>
          {guest.confirmadoEm && (
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: P.inkMuted }}>
              · {formatDateShort(guest.confirmadoEm)}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <ActionCircle title="Copiar link" onClick={onCopyLink}>
          <LinkIcon />
        </ActionCircle>
        <ActionCircle title="Copiar mensagem" onClick={onCopyMessage}>
          <CopyIcon />
        </ActionCircle>
        {guest.telefone && (
          <ActionCircle title="Abrir WhatsApp" onClick={onWhatsApp} green>
            <WhatsAppIcon />
          </ActionCircle>
        )}
      </div>
    </div>
  );
}

function ActionCircle({
  children,
  onClick,
  title,
  green = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  green?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 30, height: 30, borderRadius: 999,
        border: green ? "none" : `1px solid ${P.line}`,
        background: green ? "#25D366" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", WebkitTapHighlightColor: "transparent", flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ─── Link block (RSVP URL display) ───────────────────────────
export function LinkBlock({ id, onCopy, baseUrl = "" }: { id: string; onCopy?: () => void; baseUrl?: string }) {
  const url = `${baseUrl}/rsvp/${id}`;
  return (
    <div style={{
      border: `1.5px dashed ${P.accent}`, borderRadius: 12, padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Sprig size={14} color={P.accent} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: P.ink, wordBreak: "break-all" }}>
          {url.replace(/^https?:\/\//, "")}
        </span>
      </div>
      <button
        onClick={onCopy}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: FONTS.body, fontSize: 12, color: P.accent,
          textDecoration: "underline", padding: 0, flexShrink: 0,
        }}
      >
        copiar
      </button>
    </div>
  );
}

// ─── SVG icons ────────────────────────────────────────────────
function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.inkSoft} strokeWidth="1.8">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P.inkSoft} strokeWidth="1.8">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// ─── Section label ────────────────────────────────────────────
export function SectionLabel({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      fontFamily: FONTS.body, fontSize: 10.5, letterSpacing: "0.18em",
      textTransform: "uppercase", color: P.inkMuted, marginBottom: 8, ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Toast-like copy feedback ─────────────────────────────────
export function useCopyFeedback() {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    }).catch(() => undefined);
  }
  return { copied, copy };
}

// React import needed for hooks
import { useState } from "react";
