"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { P, FONTS, Sprig, ButtonPrimary, BackButton } from "@/components/wedding/primitives";
import { ImagePlaceholder } from "@/components/wedding/image-placeholder";
import { GiftsGrid } from "@/components/wedding/gift-cards";
import giftsData from "@/data/gifts.json";
import type { Gift } from "@/types/gift";

const GIFTS = giftsData as Gift[];

export default function ConfirmarPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nome?: string }>;
}) {
  const { id } = use(params);
  const { nome } = use(searchParams);
  const gift = GIFTS.find((g) => g.id === id);
  const contributor = nome || "Convidado";

  if (!gift) return notFound();

  return (
    <div style={{ position: "relative", minHeight: "100dvh" }}>
      {/* dimmed list behind */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div style={{ filter: "blur(2px)", opacity: 0.7 }}>
          <div style={{ width: "100%", padding: "64px 24px 0", background: P.bg }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: P.accent }}>
              Lista de presentes
            </div>
            <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 32, lineHeight: 1.05, color: P.ink, margin: "8px 0 16px" }}>
              Pequenos <em style={{ fontStyle: "italic", color: P.accent }}>gestos</em>
            </h1>
            <GiftsGrid gifts={GIFTS} />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(28,22,16,0.45)" }} />
      </div>

      {/* sheet */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: P.bg, borderRadius: "28px 28px 0 0",
        padding: "24px 24px 30px",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.25)",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: P.line, margin: "0 auto 22px" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Sprig size={26} color={P.accent} />
          <h3 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 26, color: P.ink, margin: "12px 0 6px", textAlign: "center", lineHeight: 1.15 }}>
            Confirmar presente
          </h3>
          <p style={{ fontFamily: FONTS.body, fontSize: 12.5, color: P.inkSoft, textAlign: "center", margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
            Você vai ser redirecionada pro Mercado Pago em um instante.
          </p>
        </div>

        <div style={{ marginTop: 22, padding: "16px 16px", background: P.surface, borderRadius: 14, border: `1px solid ${P.line}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${P.line}` }}>
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, color: P.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase" }}>Presente</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, color: P.ink, marginTop: 2 }}>{gift.title}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, color: P.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase" }}>Valor</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, color: P.accentDeep, marginTop: 2 }}>R$ {gift.price}</div>
            </div>
          </div>
          <div style={{ paddingTop: 12 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, color: P.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase" }}>De</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, color: P.ink, marginTop: 2 }}>{contributor}</div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href={`/lista/${gift.id}/pagamento?nome=${encodeURIComponent(contributor)}&titulo=${encodeURIComponent(gift.title)}`} style={{ textDecoration: "none" }}>
            <ButtonPrimary>Ir pro pagamento</ButtonPrimary>
          </Link>
          <Link href={`/lista/${gift.id}`} style={{ textDecoration: "none" }}>
            <div style={{ textAlign: "center", fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft, padding: "12px 0" }}>
              Voltar
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
