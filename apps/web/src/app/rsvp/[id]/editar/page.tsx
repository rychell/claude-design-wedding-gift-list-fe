"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { Guest } from "@/lib/rsvp-utils";
import { isDeadlinePassed } from "@/lib/rsvp-utils";
import { Stepper } from "@/components/wedding/rsvp-primitives";
import { P, FONTS, GoldRule, Monogram, ButtonPrimary, CapsLine } from "@/components/wedding/primitives";
import eventData from "@/data/event.json";

export default function EditarPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [count, setCount] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/rsvp/${id}`)
      .then((r) => r.json())
      .then((data: Guest) => {
        setGuest(data);
        setCount(data.convidadosConfirmados ?? data.convidados);
      })
      .catch(() => setError("Não foi possível carregar os dados."));
  }, [id]);

  if (isDeadlinePassed(eventData.rsvp.deadline)) {
    return (
      <div style={{ minHeight: "100dvh", background: P.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 24, color: P.ink, marginBottom: 16 }}>
          O prazo para edição já foi encerrado 💛
        </div>
        <Link href={`/rsvp/${id}`} style={{ fontFamily: FONTS.body, fontSize: 13, color: P.accent }}>
          Voltar
        </Link>
      </div>
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/rsvp/${id}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convidadosConfirmados: count }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      router.push(`/rsvp/${id}`);
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
      setSaving(false);
    }
  }

  async function handleDecline() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/rsvp/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comparecera: false }),
      });
      if (!res.ok) throw new Error("Erro ao registrar");
      router.push(`/rsvp/${id}`);
    } catch {
      setError("Não foi possível registrar. Tente novamente.");
      setSaving(false);
    }
  }

  const deadline = eventData.rsvp.deadline.split("-");
  const deadlineStr = `${deadline[2]} de ${monthName(Number(deadline[1]))}`;

  return (
    <div style={{
      minHeight: "100dvh", background: P.bg,
      padding: "56px 28px 40px",
      maxWidth: 390, margin: "0 auto",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <Link href={`/rsvp/${id}`} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft,
          textDecoration: "none",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P.inkSoft} strokeWidth="1.8">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Voltar
        </Link>
        <Monogram size={20} />
        <div style={{ width: 40 }} />
      </div>

      {/* Title */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 30, fontWeight: 400, color: P.ink, lineHeight: 1.15 }}>
          Quantos{" "}
          <em style={{ color: P.accent }}>convidados</em>{" "}
          no total?
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft, marginTop: 10, lineHeight: 1.5 }}>
          Pode ajustar sempre que precisar até {deadlineStr}.
        </div>
      </div>

      <GoldRule style={{ marginBottom: 36 }} />

      {/* Stepper */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {guest ? (
          <Stepper value={count} onChange={setCount} min={1} label="Convidados" />
        ) : error ? (
          <div style={{ fontFamily: FONTS.body, fontSize: 13, color: "#c0392b", textAlign: "center" }}>{error}</div>
        ) : (
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: P.inkMuted }}>Carregando…</div>
        )}
      </div>

      {/* Summary */}
      {guest && (
        <div style={{
          border: `1.5px dashed ${P.accent}`, borderRadius: 12, padding: "14px 18px",
          textAlign: "center", margin: "28px 0",
          fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft, lineHeight: 1.5,
        }}>
          <span style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 500, color: P.ink }}>
            {count} {count === 1 ? "convidado" : "convidados"}
          </span>{" "}
          confirmados pela {guest.nome}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ fontFamily: FONTS.body, fontSize: 13, color: "#c0392b", textAlign: "center", marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div onClick={handleSave} style={{ cursor: "pointer" }}>
          <ButtonPrimary style={{ opacity: saving || !guest ? 0.6 : 1 }}>
            {saving ? "Salvando…" : "Salvar alterações"}
          </ButtonPrimary>
        </div>
        <div onClick={handleDecline} style={{ cursor: "pointer" }}>
          <ButtonPrimary subtle style={{ opacity: saving || !guest ? 0.6 : 1 }}>
            Não conseguirei ir
          </ButtonPrimary>
        </div>
        <Link href={`/rsvp/${id}`} style={{ textDecoration: "none" }}>
          <div style={{
            height: 44, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft,
          }}>
            Cancelar
          </div>
        </Link>
      </div>
    </div>
  );
}

function monthName(m: number): string {
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return months[m - 1] ?? "";
}
