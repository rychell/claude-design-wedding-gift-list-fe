"use client";

import { useState } from "react";
import Link from "next/link";
import type { Guest } from "@/lib/rsvp-utils";
import { formatDateShort } from "@/lib/rsvp-utils";
import { CheckMedallion } from "@/components/wedding/rsvp-primitives";
import { P, FONTS, GoldRule, CapsLine, ButtonPrimary, Monogram, Botanical, SpinnerInline } from "@/components/wedding/primitives";
import eventData from "@/data/event.json";

type Screen = "choice" | "confirmed" | "declined" | "error";

function initialScreen(guest: Guest): Screen {
  if (!guest.confirmado) return "choice";
  if (guest.comparecera === true) return "confirmed";
  if (guest.comparecera === false) return "declined";
  return "choice";
}

async function responder(id: string, comparecera: boolean): Promise<Guest> {
  const res = await fetch(`/api/rsvp/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comparecera }),
  });
  if (!res.ok) throw new Error("Falha na requisição");
  return res.json() as Promise<Guest>;
}

export function RsvpClient({ guest: initialGuest }: { guest: Guest }) {
  const [guest, setGuest] = useState<Guest>(initialGuest);
  const [screen, setScreen] = useState<Screen>(initialScreen(initialGuest));
  const [loading, setLoading] = useState<"sim" | "nao" | null>(null);

  async function handleChoice(comparecera: boolean) {
    if (loading) return;
    setLoading(comparecera ? "sim" : "nao");
    try {
      const updated = await responder(guest.id, comparecera);
      setGuest(updated);
      setScreen(comparecera ? "confirmed" : "declined");
    } catch {
      setScreen("error");
    } finally {
      setLoading(null);
    }
  }

  const Footer = () => (
    <div style={{ marginTop: "auto", paddingTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
        <Link href="/evento" style={{ fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft, textDecoration: "none", borderBottom: `1px solid ${P.line}`, paddingBottom: 2 }}>
          Evento
        </Link>
        <button
          onClick={() => navigator.share?.({ title: `Casamento de Mayara & Rychell`, url: window.location.origin })}
          style={{ fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft, background: "none", border: "none", borderBottom: `1px solid ${P.line}`, paddingBottom: 2, cursor: "pointer" }}
        >
          Compartilhar
        </button>
      </div>
      <CapsLine size={10} color={P.inkMuted}>{eventData.date.split("-").reverse().join(" · ")}</CapsLine>
    </div>
  );

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      minHeight: "100dvh", background: P.bg,
      display: "flex", flexDirection: "column",
      padding: "56px 28px 40px",
      maxWidth: 390, margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <Monogram size={26} />
      </div>
      {children}
    </div>
  );

  // ── Tela de escolha ──────────────────────────────────────────
  if (screen === "choice") {
    return (
      <Wrapper>
        <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <CapsLine size={11} color={P.inkSoft} style={{ marginBottom: 14 }}>Confirmar presença</CapsLine>
          <div style={{ fontFamily: FONTS.display, fontSize: 34, fontWeight: 400, color: P.ink, lineHeight: 1.1, marginBottom: 8 }}>
            Olá,{" "}
            <em style={{ color: P.accent }}>{guest.nome}</em>
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 14, color: P.inkSoft, marginBottom: 24, lineHeight: 1.6 }}>
            Você conseguirá estar com a gente no nosso grande dia?
          </div>

          {/* Data e horário do evento */}
          <div style={{
            background: P.surface, borderRadius: 14, padding: "16px 20px",
            border: `1px solid ${P.line}`, marginBottom: 28,
          }}>
            <div style={{
              fontFamily: FONTS.display, fontSize: 22, fontWeight: 400,
              color: P.ink, letterSpacing: "0.04em", marginBottom: 6,
            }}>
              {eventData.date.split("-").reverse().join(" · ")}
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft, letterSpacing: "0.06em" }}>
                {eventData.ceremony.time}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: 999, background: P.line, display: "inline-block" }} />
              <span style={{ fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft, letterSpacing: "0.06em" }}>
                {eventData.venue.city}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              onClick={() => void handleChoice(true)}
              style={{ cursor: loading ? "default" : "pointer", opacity: loading === "nao" ? 0.4 : 1, transition: "opacity 0.2s" }}
            >
              <ButtonPrimary>{loading === "sim" ? <SpinnerInline /> : "Confirmar presença 💛"}</ButtonPrimary>
            </div>
            <div
              onClick={() => void handleChoice(false)}
              style={{ cursor: loading ? "default" : "pointer", opacity: loading === "sim" ? 0.4 : 1, transition: "opacity 0.2s" }}
            >
              <ButtonPrimary subtle>{loading === "nao" ? <SpinnerInline color={P.accent} /> : "Não conseguirei ir"}</ButtonPrimary>
            </div>
          </div>

          <GoldRule style={{ marginTop: 28, marginBottom: 20 }} />

          <Link href="/lista" style={{ textDecoration: "none" }}>
            <ButtonPrimary subtle>Ver lista de presentes 🎁</ButtonPrimary>
          </Link>
        </div>
        <Footer />
      </Wrapper>
    );
  }

  // ── Erro ─────────────────────────────────────────────────────
  if (screen === "error") {
    return (
      <Wrapper>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 14, color: "#c0392b", textAlign: "center" }}>
            Algo deu errado. Tente novamente.
          </div>
          <div onClick={() => setScreen("choice")} style={{ cursor: "pointer", width: "100%" }}>
            <ButtonPrimary subtle>Voltar</ButtonPrimary>
          </div>
        </div>
        <Footer />
      </Wrapper>
    );
  }

  // ── Presença confirmada ──────────────────────────────────────
  if (screen === "confirmed") {
    const count = guest.convidadosConfirmados ?? guest.convidados;
    return (
      <Wrapper>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <CheckMedallion size={72} />
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 15, letterSpacing: "0.18em", textTransform: "uppercase", color: P.inkSoft, marginBottom: 10 }}>
            Olá,
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 34, fontWeight: 400, color: P.ink, lineHeight: 1.1, marginBottom: 12 }}>
            <em style={{ color: P.accent }}>{guest.nome}</em>
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 14, color: P.inkSoft, lineHeight: 1.6, marginBottom: 16 }}>
            Sua presença foi confirmada com sucesso!
          </div>
          <GoldRule style={{ marginBottom: 16 }} />
        </div>

        <div style={{
          background: P.surface, borderRadius: 16, padding: "20px 24px",
          border: `1px solid ${P.line}`, marginBottom: 28, textAlign: "center",
        }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 48, fontWeight: 400, color: P.ink, lineHeight: 1 }}>
            {count}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: P.inkMuted, marginTop: 6 }}>
            {count === 1 ? "convidado" : "convidados"}
          </div>
          {guest.confirmadoEm && (
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: P.inkMuted, marginTop: 10 }}>
              Confirmado em {formatDateShort(guest.confirmadoEm)}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href={`/rsvp/${guest.id}/editar`} style={{ textDecoration: "none" }}>
            <ButtonPrimary subtle>Editar resposta</ButtonPrimary>
          </Link>
          <Link href="/lista" style={{ textDecoration: "none" }}>
            <ButtonPrimary>Ver lista de presentes</ButtonPrimary>
          </Link>
        </div>

        <Footer />
      </Wrapper>
    );
  }

  // ── Não vai comparecer ───────────────────────────────────────
  return (
    <Wrapper>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Botanical size={60} opacity={0.3} style={{ marginBottom: 24 }} />
        <div style={{ fontFamily: FONTS.display, fontSize: 30, fontWeight: 400, color: P.ink, lineHeight: 1.15, maxWidth: 300, marginBottom: 16 }}>
          Vamos sentir a{" "}
          <em style={{ color: P.accent }}>sua falta</em>{" "}
          💛
        </div>
        <GoldRule style={{ marginBottom: 16 }} />
        <div style={{ fontFamily: FONTS.body, fontSize: 14, color: P.inkSoft, lineHeight: 1.6, maxWidth: 290, marginBottom: 28 }}>
          Obrigados por avisar, {guest.nome}. Estaremos pensando em vocês nesse dia tão especial.
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <div onClick={() => void handleChoice(true)} style={{ cursor: "pointer" }}>
            <ButtonPrimary subtle>Mudei de ideia — vou comparecer</ButtonPrimary>
          </div>
          <Link href="/lista" style={{ textDecoration: "none" }}>
            <ButtonPrimary>Ver lista de presentes</ButtonPrimary>
          </Link>
        </div>
      </div>
      <Footer />
    </Wrapper>
  );
}
