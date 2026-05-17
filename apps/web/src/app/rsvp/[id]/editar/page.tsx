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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        {guest ? (
          <>
            <Stepper value={count} onChange={setCount} min={1} max={guest.convidados} label="Convidados" />
            {count >= guest.convidados && (
              <a
                href="https://wa.me/5585988579650"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  fontFamily: FONTS.body, fontSize: 12, color: "#25D366",
                  textDecoration: "none", padding: "8px 16px",
                  border: "1px solid #25D366", borderRadius: 999,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Precisa de mais vagas? Entre em contato
              </a>
            )}
          </>
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
