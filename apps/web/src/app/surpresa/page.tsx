"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { P, FONTS, Monogram, CapsLine, ButtonPrimary, Botanical, IconButton } from "@/components/wedding/primitives";

const QUICK_VALUES = [50, 100, 150, 250, 500];

export default function SurpresaPage() {
  const [selected, setSelected] = useState<number | "outro">(150);
  const [customValue, setCustomValue] = useState("");
  const [message, setMessage] = useState("Que esse comecinho de vida a dois seja como vocês — gentil e divertido.");
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const numericValue = selected === "outro" ? (parseInt(customValue) || 0) : selected;
  const isValid = selected !== "outro" || (parseInt(customValue) > 0);
  const [saving, setSaving] = useState(false);

  async function handlePresentear() {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await fetch("/api/contribuicoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isSurpresa: true,
          valor: numericValue,
          nome: null,
          mensagem: message.trim() || null,
        }),
      });
    } catch {
      // não bloquear navegação por falha no registro
    }
    router.push(`/surpresa/confirmar?valor=${numericValue}`);
  }

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/lista">
            <IconButton>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.ink} strokeWidth="1.7">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconButton>
          </Link>
          <Monogram size={22} color={P.accent} />
          <div style={{ width: 38 }} />
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 28px 28px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <Botanical size={56} color={P.accent} opacity={0.6} />
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <CapsLine size={11} color={P.accent}>Presente livre</CapsLine>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 36, color: P.ink, margin: "10px 0 0", lineHeight: 1.1 }}>
            Nos <em style={{ fontStyle: "italic", color: P.accent, fontWeight: 300 }}>surpreenda.</em>
          </h2>
          <p style={{ fontFamily: FONTS.body, fontSize: 13.5, color: P.inkSoft, marginTop: 10, lineHeight: 1.55, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
            Contribua com o valor que fizer sentido pra você — qualquer gesto cabe.
          </p>
        </div>

        {/* amount input */}
        <div style={{ marginTop: 26, padding: "22px 18px", background: P.surface, borderRadius: 16, border: `1px solid ${P.line}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 22, color: P.inkSoft }}>R$</span>
            {selected === "outro" ? (
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={customValue}
                placeholder="0"
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setCustomValue(v);
                }}
                style={{
                  fontFamily: FONTS.display, fontSize: 64, color: P.ink, fontWeight: 400,
                  lineHeight: 1, letterSpacing: "-0.02em", border: "none", background: "transparent",
                  outline: "none", width: customValue ? `${customValue.length + 1}ch` : "3ch",
                  minWidth: "3ch", maxWidth: "6ch", padding: 0, textAlign: "center",
                }}
              />
            ) : (
              <span style={{ fontFamily: FONTS.display, fontSize: 64, color: P.ink, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {selected}
              </span>
            )}
            <span style={{ fontFamily: FONTS.display, fontSize: 32, color: P.inkMuted }}>,00</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {QUICK_VALUES.map((v) => (
              <div
                key={v}
                onClick={() => setSelected(v)}
                style={{
                  padding: "7px 12px", borderRadius: 999,
                  border: v === selected ? `1px solid ${P.accent}` : `1px solid ${P.line}`,
                  background: v === selected ? P.accent + "15" : "transparent",
                  fontFamily: FONTS.body, fontSize: 12,
                  color: v === selected ? P.accentDeep : P.inkSoft,
                  fontWeight: 500, cursor: "pointer",
                  userSelect: "none",
                }}
              >
                R$ {v}
              </div>
            ))}
            <div
              onClick={() => {
                setSelected("outro");
                setCustomValue("");
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              style={{
                padding: "7px 12px", borderRadius: 999,
                border: selected === "outro" ? `1px solid ${P.accent}` : `1px solid ${P.line}`,
                background: selected === "outro" ? P.accent + "15" : "transparent",
                fontFamily: FONTS.body, fontSize: 12,
                color: selected === "outro" ? P.accentDeep : P.inkSoft,
                fontWeight: 500, cursor: "pointer",
                userSelect: "none",
              }}
            >
              Outro valor
            </div>
          </div>
        </div>

        {/* message */}
        <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 14, background: P.card, border: `1px solid ${P.line}` }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 10, color: P.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Mensagem (opcional)
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              fontFamily: FONTS.display, fontStyle: "italic", fontSize: 16, color: P.inkSoft,
              marginTop: 6, lineHeight: 1.4, width: "100%", border: "none", background: "transparent",
              resize: "none", outline: "none", padding: 0, boxSizing: "border-box",
            }}
            rows={3}
          />
        </div>

        <div style={{ flex: 1 }} />
        <ButtonPrimary
          style={{ marginTop: 16, opacity: (!isValid || saving) ? 0.45 : 1 }}
          onClick={handlePresentear}
        >
          {saving ? "Salvando…" : `Presentear · R$ ${numericValue || "—"}`}
        </ButtonPrimary>
      </div>
    </div>
  );
}
