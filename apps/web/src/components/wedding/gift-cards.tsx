"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { P, FONTS, Botanical, Sprig } from "./primitives";
import { ImagePlaceholder } from "./image-placeholder";
import type { Gift } from "@/types/gift";

function GiftImage({
  id,
  height,
  width,
  radius = 0,
}: {
  id: string;
  height: number;
  width?: number;
  radius?: number;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return <ImagePlaceholder width={width} height={height} radius={radius} label={id} />;
  }

  return (
    <div
      style={{
        position: "relative",
        width: width ?? "100%",
        height,
        borderRadius: radius,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <Image
        src={`/images/${id}.png`}
        alt={id}
        fill
        sizes="(max-width: 600px) 50vw, 300px"
        style={{ objectFit: "cover" }}
        onError={() => setError(true)}
      />
    </div>
  );
}

// ─── SurpreendaCard ───────────────────────────────────────────
export function SurpreendaCard() {
  return (
    <Link href="/surpresa" style={{ textDecoration: "none" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 16,
          padding: "20px 22px 20px 20px",
          background: `linear-gradient(135deg, ${P.surface} 0%, ${P.card} 100%)`,
          border: `1px solid ${P.accent}55`,
          display: "flex",
          alignItems: "stretch",
          gap: 16,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 70,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-10px -10px -10px -10px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${P.accent}1f 0%, transparent 70%)`,
            }}
          />
          <Botanical size={56} color={P.accent} opacity={0.85} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: P.accent,
              fontWeight: 500,
            }}
          >
            ★ Presente livre
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 24,
              fontStyle: "italic",
              fontWeight: 400,
              color: P.ink,
              marginTop: 4,
              lineHeight: 1.05,
            }}
          >
            Nos surpreenda.
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 11.5,
              color: P.inkSoft,
              marginTop: 6,
              lineHeight: 1.45,
            }}
          >
            Contribua com o valor que fizer sentido pra você.
          </div>
        </div>
        <div
          style={{
            alignSelf: "center",
            flexShrink: 0,
            width: 38,
            height: 38,
            borderRadius: 999,
            background: P.accent,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 14px -4px ${P.accent}80`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            fontFamily: FONTS.display,
            fontSize: 9,
            letterSpacing: "0.22em",
            color: P.accent,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          R$ — ——
        </div>
      </div>
    </Link>
  );
}

// ─── GiftsGrid (2-column grid) ────────────────────────────────
export function GiftsGrid({ gifts }: { gifts: Gift[] }) {
  const items = gifts;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <SurpreendaCard />
      </div>
      {items.map((g) => (
        <Link key={g.id} href={`/lista/${g.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              background: P.card,
              borderRadius: 14,
              padding: 10,
              border: `1px solid ${P.line}`,
              height: "100%",
            }}
          >
            <div style={{ position: "relative" }}>
              <GiftImage id={g.id} height={120} radius={10} />
              {g.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    background: "rgba(255,255,255,0.92)",
                    color: P.accentDeep,
                    fontFamily: FONTS.display,
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontWeight: 500,
                  }}
                >
                  ★ {g.badge.split(" ")[0]}
                </div>
              )}
            </div>
            <div style={{ padding: "10px 4px 4px" }}>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 17,
                  lineHeight: 1.15,
                  color: P.ink,
                  fontWeight: 400,
                }}
              >
                {g.title}
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: P.accentDeep }}
                >
                  R$ {g.price}
                </span>
                <span style={{ fontFamily: FONTS.body, fontSize: 10, color: P.inkMuted, letterSpacing: "0.06em" }}>
                  →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── GiftsList (horizontal list) ──────────────────────────────
export function GiftsList({ gifts }: { gifts: Gift[] }) {
  const items = gifts;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SurpreendaCard />
      {items.map((g) => (
        <Link key={g.id} href={`/lista/${g.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              gap: 14,
              background: P.card,
              borderRadius: 12,
              padding: 10,
              border: `1px solid ${P.line}`,
              alignItems: "center",
            }}
          >
            <GiftImage id={g.id} width={86} height={86} radius={8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {g.badge && (
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: P.accentDeep,
                    marginBottom: 4,
                  }}
                >
                  ★ {g.badge}
                </div>
              )}
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 17,
                  fontWeight: 400,
                  color: P.ink,
                  lineHeight: 1.15,
                }}
              >
                {g.title}
              </div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 11,
                  color: P.inkSoft,
                  marginTop: 3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {g.desc}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: FONTS.body,
                  fontSize: 13,
                  fontWeight: 600,
                  color: P.accentDeep,
                }}
              >
                R$ {g.price}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── GiftsEditorial (large feature style) ─────────────────────
export function GiftsEditorial({ gifts }: { gifts: Gift[] }) {
  const items = gifts;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <SurpreendaCard />
      {items.map((g, i) => (
        <Link key={g.id} href={`/lista/${g.id}`} style={{ textDecoration: "none" }}>
          <div>
            <GiftImage id={g.id} height={210} radius={14} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: 12,
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: P.inkSoft,
                  }}
                >
                  Nº {String(i + 1).padStart(2, "0")} · {g.category}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 26,
                    fontWeight: 400,
                    color: P.ink,
                    lineHeight: 1.1,
                    marginTop: 4,
                  }}
                >
                  {g.title}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 12,
                    color: P.inkSoft,
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {g.desc}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    color: P.inkMuted,
                  }}
                >
                  R$
                </div>
                <div
                  style={{ fontFamily: FONTS.display, fontSize: 28, color: P.accentDeep }}
                >
                  {g.price}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
