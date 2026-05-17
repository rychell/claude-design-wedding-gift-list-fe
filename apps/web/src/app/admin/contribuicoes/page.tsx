"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminStatCard } from "@/components/wedding/rsvp-primitives";
import { P, FONTS, GoldRule, CapsLine, Monogram } from "@/components/wedding/primitives";

type Contribuicao = {
  id: string;
  giftId: string | null;
  isSurpresa: boolean;
  valor: number;
  nome: string | null;
  mensagem: string | null;
  criadoEm: string;
};

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminContribuicoesPage() {
  const [items, setItems] = useState<Contribuicao[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contribuicoes");
      const data = await res.json() as Contribuicao[];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // mantém dados antigos
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const total = items.length;
  const totalValor = items.reduce((s, i) => s + i.valor, 0);
  const deLista = items.filter((i) => !i.isSurpresa).length;
  const surpresas = items.filter((i) => i.isSurpresa).length;

  return (
    <div style={{ minHeight: "100dvh", background: P.bg }}>
      {/* Header */}
      <div style={{ background: P.surface, borderBottom: `1px solid ${P.line}`, padding: "16px 20px 14px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Monogram size={20} />
            <div style={{ width: 1, height: 18, background: P.line }} />
            <CapsLine size={10} color={P.inkSoft}>Painel dos noivos</CapsLine>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/admin/rsvp" style={{ textDecoration: "none" }}>
              <button style={{
                height: 30, padding: "0 12px", borderRadius: 999,
                border: `1px solid ${P.line}`, background: "transparent",
                fontFamily: FONTS.body, fontSize: 11, color: P.inkSoft,
                cursor: "pointer",
              }}>
                ← Convidados
              </button>
            </Link>
            <button
              onClick={() => void load()}
              style={{
                height: 30, padding: "0 12px", borderRadius: 999,
                border: `1px solid ${P.line}`, background: "transparent",
                fontFamily: FONTS.body, fontSize: 11, color: P.inkSoft,
                cursor: "pointer",
              }}
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 400, color: P.ink, lineHeight: 1.1 }}>
            Lista de <em style={{ color: P.accent }}>contribuições</em>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: P.inkMuted, marginTop: 6 }}>
            {loading ? "carregando…" : `${total} registro${total !== 1 ? "s" : ""} no banco`}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <AdminStatCard label="Total de contribuições" value={total} sub="registros" accent />
          <AdminStatCard label="Total arrecadado" value={formatBRL(totalValor)} sub="em presentes" />
          <AdminStatCard label="Da lista" value={deLista} sub={deLista === 1 ? "presente" : "presentes"} />
          <AdminStatCard label="Surpresa" value={surpresas} sub={surpresas === 1 ? "contribuição" : "contribuições"} />
        </div>

        <GoldRule style={{ marginBottom: 20 }} />

        {/* Cards */}
        {loading && items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", fontFamily: FONTS.body, fontSize: 13, color: P.inkMuted }}>
            Carregando contribuições…
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", fontFamily: FONTS.body, fontSize: 13, color: P.inkMuted }}>
            Nenhuma contribuição registrada ainda.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: P.card,
                  borderRadius: 14,
                  border: `1px solid ${P.line}`,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Top: data + valor */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: P.inkMuted, letterSpacing: "0.06em" }}>
                    {formatDateTime(item.criadoEm)}
                  </span>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: P.accentDeep, fontWeight: 700 }}>
                    {formatBRL(item.valor)}
                  </span>
                </div>

                {/* Nome */}
                <div style={{ fontFamily: FONTS.body, fontSize: 15, fontWeight: 600, color: P.ink, lineHeight: 1.2 }}>
                  {item.nome ?? <span style={{ color: P.inkMuted, fontStyle: "italic", fontWeight: 400 }}>Anônimo</span>}
                </div>

                {/* Mensagem */}
                <div style={{ fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft, lineHeight: 1.5, flexGrow: 1 }}>
                  {item.mensagem ?? <span style={{ color: P.inkMuted, fontStyle: "italic" }}>Sem mensagem</span>}
                </div>

                {/* Bottom: item/badge */}
                <div style={{ borderTop: `1px solid ${P.line}`, paddingTop: 10 }}>
                  {item.isSurpresa ? (
                    <span style={{
                      display: "inline-block", padding: "3px 10px", borderRadius: 999,
                      background: `${P.accent}20`, color: P.accentDeep,
                      fontFamily: FONTS.mono, fontSize: 10, letterSpacing: "0.08em",
                    }}>
                      Surpresa
                    </span>
                  ) : (
                    <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: P.inkMuted }}>
                      {item.giftId ?? "—"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
