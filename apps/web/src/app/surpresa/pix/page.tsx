"use client";

import { use, useState } from "react";
import Link from "next/link";
import { P, FONTS, Sprig, CapsLine, BackButton, GoldRule } from "@/components/wedding/primitives";
import eventData from "@/data/event.json";

const { pix } = eventData as typeof eventData & {
  pix: { key: string; keyType: string; holderName: string };
};

function PixDiamondIcon({ size = 36, color = P.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path d="M18 4L32 18L18 32L4 18Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill={`${color}14`} />
      <path d="M18 4L32 18" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32 18L18 32" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 32L4 18" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4 18L18 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="18" cy="18" r="3" fill={color} opacity="0.5" />
    </svg>
  );
}

function CheckIcon({ size = 16, color = "#16A34A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon({ size = 16, color = P.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" />
    </svg>
  );
}

export default function SurpresaPixPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string; valor?: string }>;
}) {
  const { nome, valor } = use(searchParams);
  const contributor = nome ?? "Convidado";
  const amount = parseInt(valor ?? "0") || 0;

  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pix.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback silencioso
    }
  }

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", flexDirection: "column",
      background: P.bg,
    }}>
      {/* Header */}
      <div style={{ padding: "60px 20px 0" }}>
        <Link href={`/surpresa/pagamento?valor=${amount}&nome=${encodeURIComponent(contributor)}`}>
          <BackButton />
        </Link>
      </div>

      <div style={{ padding: "28px 24px 0", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Title */}
        <div style={{ marginBottom: 26 }}>
          <CapsLine size={10} color={P.accent} style={{ marginBottom: 8 }}>Pagar com PIX</CapsLine>
          <h1 style={{
            fontFamily: FONTS.display, fontWeight: 400, fontSize: 30,
            color: P.ink, margin: 0, lineHeight: 1.1, letterSpacing: "-0.005em",
          }}>
            Copie a chave<br />
            <em style={{ fontStyle: "italic", color: P.accent }}>e faça a transferência.</em>
          </h1>
        </div>

        {/* Summary */}
        <div style={{
          padding: "14px 16px", borderRadius: 14, background: P.surface,
          border: `1px solid ${P.line}`, marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, color: P.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Presente
            </div>
            <div style={{ fontFamily: FONTS.display, fontSize: 17, color: P.ink, marginTop: 2, lineHeight: 1.2 }}>
              Nos surpreenda
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, color: P.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Valor
            </div>
            <div style={{ fontFamily: FONTS.display, fontSize: 22, color: P.accentDeep, marginTop: 2 }}>
              R$ {amount}
            </div>
          </div>
        </div>

        {/* PIX card */}
        <div style={{
          borderRadius: 20, background: P.surface,
          border: `1px solid ${P.line}`,
          padding: "28px 24px",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <PixDiamondIcon size={44} color={P.accent} />

          <GoldRule color={P.accent} width={40} style={{ marginTop: 18, marginBottom: 18 }} />

          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
            {pix.keyType}
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 20, color: P.ink, letterSpacing: "0.01em", textAlign: "center", lineHeight: 1.2 }}>
            {pix.key}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft, marginTop: 6 }}>
            {pix.holderName}
          </div>

          <button
            onClick={handleCopy}
            style={{
              marginTop: 22,
              height: 46, paddingInline: 28,
              borderRadius: 999,
              background: copied ? "#F0FDF4" : `${P.accent}18`,
              color: copied ? "#16A34A" : P.accentDeep,
              border: copied ? "1.5px solid #BBF7D0" : `1.5px solid ${P.accent}40`,
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              fontFamily: FONTS.body, fontSize: 13, fontWeight: 600,
              letterSpacing: "0.04em",
              transition: "all 0.2s",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Chave copiada!" : "Copiar chave PIX"}
          </button>
        </div>

        {/* Instructions */}
        <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 12, background: `${P.accent}0C`, border: `1px solid ${P.accent}20` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ marginTop: 2, flexShrink: 0 }}><Sprig size={12} color={P.accent} /></div>
            <p style={{ fontFamily: FONTS.body, fontSize: 12.5, color: P.inkSoft, margin: 0, lineHeight: 1.6 }}>
              Abra o app do seu banco, selecione <strong style={{ color: P.ink }}>PIX → Pagar</strong>, cole a chave e confirme o valor de <strong style={{ color: P.ink }}>R$ {amount}</strong>.
            </p>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 24 }} />

        {/* Actions */}
        <div style={{ paddingBottom: 32, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            href={`/obrigado?nome=${encodeURIComponent(contributor)}`}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              height: 54, borderRadius: 999,
              background: P.accent, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONTS.display, fontSize: 16,
              letterSpacing: "0.22em", textTransform: "uppercase", textIndent: "0.22em",
              fontWeight: 500,
              boxShadow: "0 8px 18px -8px rgba(0,0,0,0.25)",
              cursor: "pointer",
            }}>
              Já fiz o pagamento
            </div>
          </Link>

          <Link
            href={`/surpresa/pagamento?valor=${amount}&nome=${encodeURIComponent(contributor)}`}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              height: 46,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft,
              cursor: "pointer",
            }}>
              Escolher outra forma
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
