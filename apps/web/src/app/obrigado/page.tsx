"use client";

import Link from "next/link";
import { use } from "react";
import { P, FONTS, GoldRule, CapsLine, ButtonPrimary, Botanical } from "@/components/wedding/primitives";
import eventData from "@/data/event.json";

export default function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string }>;
}) {
  const { nome } = use(searchParams);
  const firstName = nome ? nome.split(" ")[0] : "Convidado";
  const { person1, person2 } = eventData.coupleNames;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Casamento de ${person1} & ${person2}`,
        text: "Acabei de presentear o casal! 💛",
        url: "/",
      });
    }
  };

  return (
    <div style={{
      position: "relative", minHeight: "100dvh",
      padding: "24px 28px 34px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    }}>
      <div style={{ marginTop: 8 }}>
        <Botanical size={70} color={P.accent} opacity={0.7} />
      </div>
      <CapsLine size={11} color={P.accent} style={{ marginTop: 20 }}>De coração</CapsLine>
      <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 44, color: P.ink, margin: "14px 0 0", lineHeight: 1.05 }}>
        Obrigado,<br />
        <em style={{ fontStyle: "italic", color: P.accent, fontWeight: 300 }}>{firstName}</em>.
      </h1>
      <GoldRule color={P.accent} width={36} style={{ marginTop: 22 }} />
      <p style={{ fontFamily: FONTS.display, fontStyle: "italic", fontWeight: 300, fontSize: 19, color: P.inkSoft, marginTop: 22, lineHeight: 1.45, maxWidth: 280 }}>
        Cada gesto vira lembrança — e a gente vai lembrar de você no jantar mais bonito da nossa lua de mel.
      </p>
      <div style={{ marginTop: 14, fontFamily: FONTS.body, fontSize: 13, color: P.ink }}>
        com amor, <span style={{ fontFamily: FONTS.display, fontStyle: "italic" }}>{person1} &amp; {person2}</span>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/lista" style={{ textDecoration: "none" }}>
          <ButtonPrimary>Voltar pra lista</ButtonPrimary>
        </Link>
        <ButtonPrimary subtle onClick={handleShare}>
          Compartilhar no WhatsApp
        </ButtonPrimary>
      </div>
    </div>
  );
}
