"use client";

import Link from "next/link";
import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { P, FONTS, CapsLine, ButtonPrimary, BackButton } from "@/components/wedding/primitives";
import { ImagePlaceholder } from "@/components/wedding/image-placeholder";
import giftsData from "@/data/gifts.json";
import type { Gift } from "@/types/gift";
import { use } from "react";

const GIFTS = giftsData as Gift[];

export default function DetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const gift = GIFTS.find((g) => g.id === id);
  const router = useRouter();
  const [identify, setIdentify] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("Que essa noite seja só o começo de muitas. Amo vocês. ✨");

  const [imgError, setImgError] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!gift) return notFound();

  async function handlePresentear() {
    if (!gift || saving) return;
    setSaving(true);
    try {
      await fetch("/api/contribuicoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: gift.id,
          valor: gift.price,
          nome: identify ? name.trim() || null : null,
          mensagem: identify ? message.trim() || null : null,
        }),
      });
    } catch {
      // não bloquear navegação por falha no registro
    }
    router.push(`/lista/${gift.id}/confirmar?nome=${encodeURIComponent(identify ? name : "")}`);
  }

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* hero image */}
      <div style={{ position: "relative", height: 360, flexShrink: 0 }}>
        {imgError ? (
          <ImagePlaceholder width="100%" height={360} label={gift.id} />
        ) : (
          <Image
            src={`/images/${gift.id}.png`}
            alt={gift.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        )}
        <div style={{ position: "absolute", top: 24, left: 20 }}>
          <Link href="/lista">
            <BackButton />
          </Link>
        </div>
        {gift.badge && (
          <div style={{
            position: "absolute", top: 60, right: 20,
            background: "rgba(255,255,255,0.92)", padding: "6px 12px", borderRadius: 999,
            fontFamily: FONTS.display, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: P.accentDeep,
          }}>
            ★ {gift.badge}
          </div>
        )}
      </div>

      {/* content card */}
      <div style={{
        marginTop: -24, borderRadius: "24px 24px 0 0", background: P.bg,
        padding: "26px 24px 24px", flex: 1, position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column",
      }}>
        <CapsLine size={10} color={P.accent}>{gift.category}</CapsLine>
        <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 32, color: P.ink, margin: "8px 0 10px", lineHeight: 1.1, letterSpacing: "-0.005em" }}>
          {gift.title}
        </h2>
        <p style={{ fontFamily: FONTS.body, fontSize: 13.5, lineHeight: 1.55, color: P.inkSoft, margin: "0 0 18px" }}>
          {gift.desc}
        </p>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: FONTS.display, fontSize: 14, color: P.inkSoft }}>R$</span>
          <span style={{ fontFamily: FONTS.display, fontSize: 44, color: P.ink, fontWeight: 400, lineHeight: 1 }}>{gift.price}</span>
        </div>

        {/* identify toggle */}
        <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 14, background: P.surface, border: `1px solid ${P.line}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: P.ink }}>Quero me identificar</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted, marginTop: 2 }}>Opcional — assim a gente sabe que foi você</div>
            </div>
            <div
              onClick={() => setIdentify(!identify)}
              style={{
                width: 42, height: 24, borderRadius: 999,
                background: identify ? P.accent : P.line,
                position: "relative", cursor: "pointer", transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute", top: 2,
                left: identify ? "unset" : 2,
                right: identify ? 2 : "unset",
                width: 20, height: 20, borderRadius: 999, background: "#fff",
                transition: "left 0.2s, right 0.2s",
              }} />
            </div>
          </div>
          {identify && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                style={{
                  padding: "10px 12px", borderRadius: 10, background: "#fff",
                  border: `1px solid ${P.line}`, fontFamily: FONTS.body, fontSize: 13, color: P.ink,
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe uma mensagem (opcional)"
                style={{
                  padding: "10px 12px", borderRadius: 10, background: "#fff",
                  border: `1px solid ${P.line}`, fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft,
                  minHeight: 56, resize: "none", outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />
        <ButtonPrimary
          style={{ marginTop: 16, opacity: saving ? 0.6 : 1 }}
          onClick={handlePresentear}
        >
          {saving ? "Salvando…" : `Presentear · R$ ${gift.price}`}
        </ButtonPrimary>
      </div>
    </div>
  );
}
