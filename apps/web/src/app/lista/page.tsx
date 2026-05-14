"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { P, FONTS, Monogram, CapsLine, Pill } from "@/components/wedding/primitives";
import { GiftsGrid, GiftsList, GiftsEditorial } from "@/components/wedding/gift-cards";
import giftsData from "@/data/gifts.json";
import type { Gift } from "@/types/gift";

const GIFTS = giftsData as Gift[];
const CATEGORIES = ["Todos", "Lua de mel", "Casa nova", "Pra nós"];
type Layout = "grade" | "lista" | "editorial";

export default function ListaPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [layout, setLayout] = useState<Layout>("grade");

  const filtered = useMemo(() => {
    if (activeCategory === "Todos") return GIFTS;
    return GIFTS.filter((g) => g.category === activeCategory);
  }, [activeCategory]);

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ padding: "64px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Monogram size={22} color={P.accent} />
          {/* layout toggle */}
          <div style={{ display: "flex", gap: 6 }}>
            {(["grade", "lista", "editorial"] as Layout[]).map((l) => (
              <div
                key={l}
                onClick={() => setLayout(l)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${layout === l ? P.accent : P.line}`,
                  background: layout === l ? P.accent + "15" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {l === "grade" && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="0" y="0" width="5" height="5" rx="1" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="7" y="0" width="5" height="5" rx="1" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="0" y="7" width="5" height="5" rx="1" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="7" y="7" width="5" height="5" rx="1" fill={layout === l ? P.accent : P.inkMuted} />
                  </svg>
                )}
                {l === "lista" && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="0" y="1" width="4" height="4" rx="1" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="6" y="2" width="6" height="1.5" rx="0.75" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="6" y="4" width="4" height="1" rx="0.5" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="0" y="7" width="4" height="4" rx="1" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="6" y="8" width="6" height="1.5" rx="0.75" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="6" y="10" width="4" height="1" rx="0.5" fill={layout === l ? P.accent : P.inkMuted} />
                  </svg>
                )}
                {l === "editorial" && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="0" y="0" width="12" height="6" rx="1" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="0" y="8" width="12" height="1.5" rx="0.75" fill={layout === l ? P.accent : P.inkMuted} />
                    <rect x="0" y="10.5" width="8" height="1" rx="0.5" fill={layout === l ? P.accent : P.inkMuted} />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <CapsLine size={10} color={P.accent}>Lista de presentes</CapsLine>
          <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 36, lineHeight: 1.05, color: P.ink, margin: "8px 0 6px", letterSpacing: "-0.01em" }}>
            Pequenos <em style={{ fontStyle: "italic", color: P.accent, fontWeight: 300 }}>gestos</em><br />pra começar a dois.
          </h1>
          <p style={{ fontFamily: FONTS.body, fontSize: 13, lineHeight: 1.5, color: P.inkSoft, margin: 0, maxWidth: 280 }}>
            Escolha um presente simbólico — cada um nos ajuda a construir um pedacinho dessa vida nova.
          </p>
        </div>
        {/* category pills */}
        <div style={{ display: "flex", gap: 6, marginTop: 18, overflowX: "auto", paddingBottom: 2 }}>
          {CATEGORIES.map((cat) => (
            <Pill key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
              {cat}
            </Pill>
          ))}
        </div>
      </div>

      {/* gift list */}
      <div style={{ flex: 1, overflow: "hidden", padding: "20px 24px 100px", marginTop: 4 }}>
        {layout === "grade" && <GiftsGrid gifts={filtered} />}
        {layout === "lista" && <GiftsList gifts={filtered} />}
        {layout === "editorial" && <GiftsEditorial gifts={filtered} />}
      </div>
    </div>
  );
}
