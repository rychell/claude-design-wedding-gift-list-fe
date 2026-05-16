"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Guest } from "@/lib/rsvp-utils";
import { formatDateShort, buildRsvpMessage, buildWhatsAppUrl } from "@/lib/rsvp-utils";
import {
  GuestRow, AdminStatCard, RingProgress, FilterPill, useCopyFeedback,
} from "@/components/wedding/rsvp-primitives";
import { P, FONTS, GoldRule, CapsLine, Monogram, ButtonPrimary } from "@/components/wedding/primitives";
import eventData from "@/data/event.json";

type Filter = "todos" | "confirmados" | "nao-vao" | "pendentes" | "noiva" | "noivo";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

export default function AdminRsvpPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("todos");
  const [template, setTemplate] = useState(eventData.rsvp.whatsAppTemplate);
  const { copied, copy } = useCopyFeedback();

  async function load() {
    setLoading(true);
    try {
      const [gRes, tRes] = await Promise.all([
        fetch("/api/admin/convidados"),
        fetch("/api/admin/template"),
      ]);
      const gData = await gRes.json() as Guest[];
      const tData = await tRes.json() as { template: string };
      setGuests(Array.isArray(gData) ? gData : []);
      setTemplate(tData.template ?? eventData.rsvp.whatsAppTemplate);
      setLastSync(formatDateShort(new Date().toISOString()));
    } catch {
      // keep stale data
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const vao = guests.filter((g) => g.comparecera === true);
  const naoVao = guests.filter((g) => g.comparecera === false);
  const pending = guests.filter((g) => g.comparecera === null);
  const totalConvidados = guests.reduce((s, g) => s + g.convidados, 0);
  const confirmedConvidados = vao.reduce((s, g) => s + (g.convidadosConfirmados ?? g.convidados), 0);
  const responderam = guests.filter((g) => g.comparecera !== null).length;
  const rate = responderam > 0 ? (vao.length / responderam) * 100 : 0;

  const filtered = useMemo(() => {
    if (filter === "confirmados") return vao;
    if (filter === "nao-vao") return naoVao;
    if (filter === "pendentes") return pending;
    if (filter === "noiva") return guests.filter((g) => g.lado === "noiva");
    if (filter === "noivo") return guests.filter((g) => g.lado === "noivo");
    return guests;
  }, [guests, filter, vao, naoVao, pending]);

  function handleCopyLink(g: Guest) {
    copy(`${BASE_URL}/rsvp/${g.id}`, g.id + "-link");
  }

  function handleCopyMessage(g: Guest) {
    const msg = buildRsvpMessage(template, g.nome, g.id, BASE_URL);
    copy(msg, g.id + "-msg");
  }

  function handleWhatsApp(g: Guest) {
    if (!g.telefone) return;
    const msg = buildRsvpMessage(template, g.nome, g.id, BASE_URL);
    window.open(buildWhatsAppUrl(g.telefone, msg), "_blank");
  }

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
            {lastSync && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONTS.mono, fontSize: 10, color: P.inkMuted }}>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: "#22c55e" }} />
                Sheets · {lastSync}
              </div>
            )}
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
            Lista de <em style={{ color: P.accent }}>convidados</em>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: P.inkMuted, marginTop: 6 }}>
            {loading ? "carregando…" : `atualizado ${lastSync ?? "agora"} · faltam ${daysUntil(eventData.date)} dias`}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <Link href="/admin/rsvp/novo" style={{ textDecoration: "none" }}>
            <button style={{
              height: 38, padding: "0 18px", borderRadius: 999,
              background: P.accent, border: "none", color: "#fff",
              fontFamily: FONTS.body, fontSize: 12, fontWeight: 500,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}>
              + Novo convidado
            </button>
          </Link>
          <Link href="/admin/rsvp/importar" style={{ textDecoration: "none" }}>
            <button style={{
              height: 38, padding: "0 18px", borderRadius: 999,
              background: "transparent", border: `1px solid ${P.line}`,
              color: P.inkSoft, fontFamily: FONTS.body, fontSize: 12, cursor: "pointer",
            }}>
              Importar CSV
            </button>
          </Link>
          {eventData.sheetsUrl && (
            <a href={eventData.sheetsUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button style={{
                height: 38, padding: "0 18px", borderRadius: 999,
                background: "transparent", border: `1px solid ${P.line}`,
                color: P.inkSoft, fontFamily: FONTS.body, fontSize: 12, cursor: "pointer",
              }}>
                Ver planilha ↗
              </button>
            </a>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <AdminStatCard
            label="Vão comparecer"
            value={`${vao.length} de ${guests.length}`}
            sub="famílias confirmadas"
            accent
          />
          <AdminStatCard
            label="Convidados confirmados"
            value={`${confirmedConvidados} de ${totalConvidados}`}
            sub="esperados no total"
          />
          <AdminStatCard
            label="Não vão"
            value={naoVao.length}
            sub={`${naoVao.length === 1 ? "família" : "famílias"}`}
          />
          <AdminStatCard
            label="Pendentes"
            value={pending.length}
            sub={`${pending.length === 1 ? "família" : "famílias"}`}
          />
          <div style={{
            background: P.card, borderRadius: 14, padding: "16px 18px",
            border: `1px solid ${P.line}`, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8,
          }}>
            <RingProgress percent={rate} size={72} />
            <div style={{ fontFamily: FONTS.body, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: P.inkMuted }}>
              Taxa de confirmação
            </div>
          </div>
        </div>

        <GoldRule style={{ marginBottom: 20 }} />

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
          {(["todos", "confirmados", "nao-vao", "pendentes", "noiva", "noivo"] as Filter[]).map((f) => (
            <FilterPill
              key={f}
              active={filter === f}
              onClick={() => setFilter(f)}
              count={
                f === "todos" ? guests.length
                : f === "confirmados" ? vao.length
                : f === "nao-vao" ? naoVao.length
                : f === "pendentes" ? pending.length
                : f === "noiva" ? guests.filter((g) => g.lado === "noiva").length
                : guests.filter((g) => g.lado === "noivo").length
              }
            >
              {f === "todos" ? "Todos"
                : f === "confirmados" ? "Vão"
                : f === "nao-vao" ? "Não vão"
                : f === "pendentes" ? "Pendentes"
                : f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterPill>
          ))}
        </div>

        {/* Guest list */}
        {loading && guests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", fontFamily: FONTS.body, fontSize: 13, color: P.inkMuted }}>
            Carregando convidados…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", fontFamily: FONTS.body, fontSize: 13, color: P.inkMuted }}>
            Nenhum convidado encontrado.
          </div>
        ) : (
          <div>
            {filtered.map((g) => (
              <GuestRow
                key={g.id}
                guest={g}
                baseUrl={BASE_URL}
                onCopyLink={() => handleCopyLink(g)}
                onCopyMessage={() => handleCopyMessage(g)}
                onWhatsApp={() => handleWhatsApp(g)}
                onClick={() => window.location.href = `/admin/rsvp/${g.id}`}
              />
            ))}
          </div>
        )}

        {/* Copy feedback toast */}
        {copied && (
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: P.ink, color: "#fff", borderRadius: 999,
            padding: "10px 20px", fontFamily: FONTS.body, fontSize: 13,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            pointerEvents: "none",
          }}>
            Copiado ✓
          </div>
        )}
      </div>
    </div>
  );
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target.getTime() - now.getTime()) / 86400000));
}
