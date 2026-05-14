"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { P, FONTS, Sprig, CapsLine, BackButton } from "@/components/wedding/primitives";
import { type Method, formatBRL, PixIcon, CardIcon, Spinner, MethodCard } from "@/components/wedding/payment-ui";

type Stage = "select" | "loading" | "error";

export default function SurpresaPagamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string; valor?: string; erro?: string }>;
}) {
  const { nome, valor, erro } = use(searchParams);
  const router = useRouter();

  const contributor = nome ?? "Convidado";
  const amount = parseFloat(valor ?? "0") || 0;

  const [selected, setSelected] = useState<Method | null>(null);
  const [stage, setStage] = useState<Stage>(erro ? "error" : "select");
  const [errorMsg, setErrorMsg] = useState(
    erro ? "Houve um problema no pagamento. Tente novamente." : ""
  );

  useEffect(() => {
    if (amount <= 0) router.replace("/surpresa");
  }, [amount, router]);

  async function handleConfirm() {
    if (!selected) return;

    if (selected === "pix") {
      router.push(`/surpresa/pix?valor=${amount}&nome=${encodeURIComponent(contributor)}`);
      return;
    }

    setStage("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: amount, nome: contributor }),
      });
      if (!res.ok) throw new Error("Erro ao criar preferência");
      const data = await res.json() as { url: string };
      if (!data.url) throw new Error("URL de pagamento não recebida");
      window.location.href = data.url;
    } catch {
      setErrorMsg("Não foi possível iniciar o pagamento. Tente novamente.");
      setStage("error");
    }
  }

  if (amount <= 0) return null;

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", flexDirection: "column",
      background: P.bg,
    }}>
      {/* Header */}
      <div style={{ padding: "60px 20px 0" }}>
        <Link href={`/surpresa/confirmar?valor=${amount}&nome=${encodeURIComponent(contributor)}`}>
          <BackButton />
        </Link>
      </div>

      <div style={{ padding: "28px 24px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <CapsLine size={10} color={P.accent} style={{ marginBottom: 8 }}>Pagamento</CapsLine>
          <h1 style={{
            fontFamily: FONTS.display, fontWeight: 400, fontSize: 30,
            color: P.ink, margin: 0, lineHeight: 1.1, letterSpacing: "-0.005em",
          }}>
            Como você prefere<br />
            <em style={{ fontStyle: "italic", color: P.accent }}>pagar?</em>
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
              Total
            </div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, color: P.accentDeep, marginTop: 2 }}>
              {formatBRL(amount)}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {stage === "loading" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ position: "relative", width: 44, height: 44 }}>
              <Spinner />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sprig size={12} color={P.accent} />
              </div>
            </div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, color: P.ink, fontStyle: "italic", fontWeight: 300, textAlign: "center" }}>
              Preparando<br />seu pagamento…
            </div>
          </div>
        )}

        {/* Error state */}
        {stage === "error" && (
          <div style={{ marginBottom: 20, padding: "14px 16px", borderRadius: 14, background: "#FEF2F2", border: "1px solid rgba(220,38,38,0.2)" }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, color: "#B91C1C", lineHeight: 1.5 }}>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Method selection */}
        {(stage === "select" || stage === "error") && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <MethodCard
                method="pix"
                selected={selected === "pix"}
                onSelect={() => setSelected("pix")}
                icon={<PixIcon />}
                label="PIX"
                description="Pagamento instantâneo, aprovado na hora"
                badge="Mais rápido"
              />
              <MethodCard
                method="credit_card"
                selected={selected === "credit_card"}
                onSelect={() => setSelected("credit_card")}
                icon={<CardIcon />}
                label="Cartão de crédito"
                description="Parcelamento em até 4x sem juros"
              />
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ paddingBottom: 32, paddingTop: 24 }}>
              <button
                onClick={handleConfirm}
                disabled={!selected}
                style={{
                  width: "100%", height: 54, borderRadius: 999,
                  background: selected ? P.accent : P.placeholder,
                  color: selected ? "#fff" : P.inkMuted,
                  border: "none", cursor: selected ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONTS.display, fontSize: 16,
                  letterSpacing: "0.22em", textTransform: "uppercase", textIndent: "0.22em",
                  fontWeight: 500, transition: "background 0.2s, color 0.2s",
                  boxShadow: selected ? "0 8px 18px -8px rgba(0,0,0,0.25)" : "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {selected === "pix"
                  ? "Continuar com PIX"
                  : selected === "credit_card"
                  ? "Ir pro Mercado Pago"
                  : "Escolha uma forma"}
              </button>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                marginTop: 14,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.inkMuted} strokeWidth="1.5">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 118 0v4" />
                </svg>
                <span style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted }}>
                  Pagamento seguro via Mercado Pago
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
