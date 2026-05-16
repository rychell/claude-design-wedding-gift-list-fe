"use client";

import { Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { P, FONTS, Monogram, CapsLine, Pill } from "@/components/wedding/primitives";
import { GiftsGrid, GiftsList, GiftsEditorial } from "@/components/wedding/gift-cards";
import giftsData from "@/data/gifts.json";
import type { Gift } from "@/types/gift";

const GIFTS = giftsData as Gift[];
const CATEGORY_ORDER = [
  "Lua de Mel",
  "Experiências",
  "Casa & Jardim",
  "Para a Mayara",
  "Para o Rychell",
  "Praia & Surf",
  "Música",
  "Viagem",
  "Pra Nós",
  "Todos",
];
const ALL_CATS = new Set(GIFTS.map((g) => g.category));
const CATEGORIES = CATEGORY_ORDER.filter((c) => c === "Todos" || ALL_CATS.has(c));

type Layout = "grade" | "lista" | "editorial";
type Sort = "padrao" | "maior-preco" | "menor-preco";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// stable shuffle at module level
const SHUFFLED_GIFTS = shuffleArray(GIFTS);

const DEFAULTS = { cat: "Todos", layout: "lista", sort: "menor-preco" } as const;

function ListaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("cat") ?? DEFAULTS.cat;
  const layout = (searchParams.get("layout") as Layout) ?? DEFAULTS.layout;
  const sort = (searchParams.get("sort") as Sort) ?? DEFAULTS.sort;

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === DEFAULTS[key as keyof typeof DEFAULTS]) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [searchParams, router]
  );

  const setActiveCategory = (cat: string) => setParam("cat", cat);
  const setLayout = (l: Layout) => setParam("layout", l);
  const setSort = (s: Sort) => setParam("sort", s);

  const filtered = useMemo(() => {
    const base = activeCategory === "Todos" && sort === "padrao" ? SHUFFLED_GIFTS : GIFTS;
    const items = activeCategory === "Todos" ? base : base.filter((g) => g.category === activeCategory);
    if (sort === "maior-preco") return [...items].sort((a, b) => b.price - a.price);
    if (sort === "menor-preco") return [...items].sort((a, b) => a.price - b.price);
    return items;
  }, [activeCategory, sort]);

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ padding: "24px 24px 0" }}>
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
        {/* category pills — wrap instead of horizontal scroll */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 18 }}>
          {CATEGORIES.map((cat) => (
            <Pill key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
              {cat}
            </Pill>
          ))}
        </div>
        {/* sort row */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10 }}>
          <span style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted, flexShrink: 0 }}>
            Ordenar:
          </span>
          {([["padrao", "Padrão"], ["menor-preco", "Menor preço"], ["maior-preco", "Maior preço"]] as [Sort, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSort(val)}
              style={{
                fontFamily: FONTS.body,
                fontSize: 11,
                color: sort === val ? P.accentDeep : P.inkMuted,
                fontWeight: sort === val ? 600 : 400,
                background: "none",
                border: "none",
                padding: "2px 6px",
                cursor: "pointer",
                borderRadius: 6,
                backgroundColor: sort === val ? P.accent + "18" : "transparent",
              }}
            >
              {label}
            </button>
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

export default function ListaPage() {
  return (
    <Suspense>
      <ListaContent />
    </Suspense>
  );
}
