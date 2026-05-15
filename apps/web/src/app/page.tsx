"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { P, FONTS, GoldRule, CapsLine, ButtonPrimary } from "@/components/wedding/primitives";
import eventData from "@/data/event.json";

function getCountdown(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "hoje é o grande dia!";
  if (diff === 1) return "falta 1 dia";
  return `faltam ${diff} dias`;
}

export default function Home() {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    setCountdown(getCountdown(eventData.date));
  }, []);

  const { person1, person2 } = eventData.coupleNames;
  const dateParts = new Date(eventData.date + "T00:00:00");
  const day = dateParts.getDate();
  const month = String(dateParts.getMonth() + 1).padStart(2, "0");
  const year = dateParts.getFullYear();

  return (
    <div style={{ position: "relative", height: "100dvh", padding: "24px 28px 24px", display: "flex", flexDirection: "column" }}>
      {/* top tag */}
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <CapsLine size={11} color={P.inkSoft}>Casamento</CapsLine>
        <GoldRule color={P.accent} width={18} />
      </div>

      {/* names */}
      <div style={{ marginTop: 22, textAlign: "center" }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 56, fontWeight: 400, color: P.ink, lineHeight: 1.02, letterSpacing: "-0.01em" }}>
          {person1}
        </div>
        <div style={{ fontFamily: FONTS.display, fontStyle: "italic", fontSize: 28, fontWeight: 300, color: P.accent, margin: "2px 0" }}>
          &amp;
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 56, fontWeight: 400, color: P.ink, lineHeight: 1.02, letterSpacing: "-0.01em" }}>
          {person2}
        </div>
      </div>

      {/* photo — flex: 1 so it absorbs available space and button always stays visible */}
      <div style={{ flex: 1, marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100, maxHeight: 280, overflow: "hidden" }}>
        <div style={{ position: "relative", width: 210, height: "100%", borderRadius: 105, overflow: "hidden" }}>
          <Image
            src="/images/casal-home.png"
            alt="Rychell e Mayara"
            fill
            sizes="210px"
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
          />
        </div>
      </div>

      {/* date */}
      <div style={{ marginTop: 18, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 14, fontFamily: FONTS.display, color: P.ink }}>
          <span style={{ fontSize: 13, letterSpacing: "0.32em", color: P.inkSoft }}>{eventData.dayOfWeek}</span>
          <span style={{ width: 1, height: 22, background: P.line, display: "inline-block" }} />
          <span style={{ fontSize: 22, fontWeight: 400 }}>{day} · {month} · {year}</span>
          <span style={{ width: 1, height: 22, background: P.line, display: "inline-block" }} />
          <span style={{ fontSize: 13, letterSpacing: "0.32em", color: P.inkSoft }}>{eventData.timeOfDay}</span>
        </div>
        <div style={{ marginTop: 14, fontFamily: FONTS.body, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: P.inkMuted }}>
          {countdown}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/lista" style={{ textDecoration: "none" }}>
          <ButtonPrimary>Ver lista de presentes</ButtonPrimary>
        </Link>
        <div style={{ display: "flex", justifyContent: "center", gap: 26, fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft, paddingTop: 8 }}>
          <Link href="/evento" style={{ color: P.inkSoft, textDecoration: "none", borderBottom: `1px solid ${P.line}`, paddingBottom: 3 }}>
            Evento
          </Link>
          <Link href="/historia" style={{ color: P.inkSoft, textDecoration: "none", borderBottom: `1px solid ${P.line}`, paddingBottom: 3 }}>
            Nossa história
          </Link>
          <span
            style={{ borderBottom: `1px solid ${P.line}`, paddingBottom: 3, cursor: "pointer" }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `Casamento de ${person1} & ${person2}`, url: window.location.href });
              }
            }}
          >
            Compartilhar
          </span>
        </div>
      </div>
    </div>
  );
}
