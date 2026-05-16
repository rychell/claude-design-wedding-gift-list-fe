import { Suspense } from "react";
import { RsvpClient } from "./rsvp-client";
import eventData from "@/data/event.json";
import { isDeadlinePassed } from "@/lib/rsvp-utils";
import type { Guest } from "@/lib/rsvp-utils";
import { P, FONTS, GoldRule, CapsLine, Botanical, ButtonPrimary } from "@/components/wedding/primitives";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";

async function fetchGuest(id: string): Promise<Guest | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json() as Guest | null;
    return data;
  } catch {
    return null;
  }
}

export default async function RsvpPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deadline = eventData.rsvp.deadline;

  if (isDeadlinePassed(deadline)) {
    return <RsvpEncerrado deadline={deadline} />;
  }

  const guest = await fetchGuest(id);

  if (!guest) {
    return <RsvpInvalido />;
  }

  return (
    <Suspense fallback={<RsvpLoading />}>
      <RsvpClient guest={guest} />
    </Suspense>
  );
}

function RsvpEncerrado({ deadline }: { deadline: string }) {
  const [y, m, d] = deadline.split("-");
  const whatsAppUrl = `https://wa.me/55${eventData.pix.key.replace(/\D/g, "")}`;
  return (
    <div style={{ minHeight: "100dvh", background: P.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
      <Botanical size={70} opacity={0.35} style={{ marginBottom: 28 }} />
      <div style={{ textAlign: "center", maxWidth: 340 }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 400, color: P.ink, lineHeight: 1.15, marginBottom: 16 }}>
          O período de{" "}
          <em style={{ color: P.accent }}>confirmação</em>{" "}
          já foi encerrado 💛
        </div>
        <GoldRule style={{ marginBottom: 20 }} />
        <div style={{ fontFamily: FONTS.body, fontSize: 14, color: P.inkSoft, lineHeight: 1.6, marginBottom: 24 }}>
          Se precisar ajustar alguma coisa, chame a Mayara ou o Rychell direto no WhatsApp.
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: FONTS.mono, fontSize: 11, color: P.inkSoft,
          border: `1px solid ${P.line}`, borderRadius: 999,
          padding: "6px 14px", marginBottom: 28,
        }}>
          encerrado em {d} · {m} · {y}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href={whatsAppUrl} style={{ textDecoration: "none" }}>
            <ButtonPrimary>Falar com os noivos</ButtonPrimary>
          </a>
          <Link href="/lista" style={{ textDecoration: "none" }}>
            <ButtonPrimary subtle>Ver lista de presentes</ButtonPrimary>
          </Link>
        </div>
      </div>
    </div>
  );
}

function RsvpInvalido() {
  return (
    <div style={{ minHeight: "100dvh", background: P.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center" }}>
      <CapsLine size={11} color={P.inkMuted} style={{ marginBottom: 16 }}>Link inválido</CapsLine>
      <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 400, color: P.ink, lineHeight: 1.2, maxWidth: 280, marginBottom: 24 }}>
        Não encontramos esse convite
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: 14, color: P.inkSoft, maxWidth: 300, lineHeight: 1.6, marginBottom: 28 }}>
        Verifique o link recebido no WhatsApp ou entre em contato com os noivos.
      </div>
      <Link href="/" style={{ textDecoration: "none" }}>
        <ButtonPrimary subtle>Voltar ao início</ButtonPrimary>
      </Link>
    </div>
  );
}

function RsvpLoading() {
  return (
    <div style={{ minHeight: "100dvh", background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 18, color: P.inkMuted, letterSpacing: "0.1em" }}>
        Confirmando…
      </div>
    </div>
  );
}
