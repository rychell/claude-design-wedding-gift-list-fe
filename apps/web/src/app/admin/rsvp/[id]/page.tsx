"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Guest } from "@/lib/rsvp-utils";
import { formatDateShort, buildRsvpMessage, buildWhatsAppUrl } from "@/lib/rsvp-utils";
import { StatusDot, LinkBlock, useCopyFeedback, SectionLabel } from "@/components/wedding/rsvp-primitives";
import { P, FONTS, GoldRule, Monogram, ButtonPrimary, CapsLine } from "@/components/wedding/primitives";
import eventData from "@/data/event.json";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

function TemplateWithVars({ text }: { text: string }) {
  const TOKEN_RE = /(\{nome\}|\{link\})/g;
  const parts = text.split(TOKEN_RE);
  return (
    <>
      {parts.map((part, i) =>
        part === "{nome}" || part === "{link}" ? (
          <span
            key={i}
            style={{
              fontFamily: FONTS.mono, fontSize: 11,
              background: `${P.accent}22`, color: P.accentDeep,
              padding: "1px 5px", borderRadius: 4,
            }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function GuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [template, setTemplate] = useState(eventData.rsvp.whatsAppTemplate);
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [templateDraft, setTemplateDraft] = useState(template);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const { copied, copy } = useCopyFeedback();

  useEffect(() => {
    Promise.all([
      fetch(`/api/rsvp/${id}`).then((r) => r.json() as Promise<Guest>),
      fetch("/api/admin/template").then((r) => r.json() as Promise<{ template: string }>),
    ]).then(([g, t]) => {
      setGuest(g);
      setTemplate(t.template);
      setTemplateDraft(t.template);
    }).catch(() => undefined);
  }, [id]);

  async function saveTemplate() {
    setSavingTemplate(true);
    try {
      await fetch("/api/admin/template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: templateDraft }),
      });
      setTemplate(templateDraft);
      setEditingTemplate(false);
    } finally {
      setSavingTemplate(false);
    }
  }

  if (!guest) {
    return (
      <div style={{ minHeight: "100dvh", background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: P.inkMuted }}>Carregando…</div>
      </div>
    );
  }

  const message = buildRsvpMessage(template, guest.nome, guest.id, BASE_URL);
  const whatsAppUrl = guest.telefone ? buildWhatsAppUrl(guest.telefone, message) : null;

  return (
    <div style={{
      minHeight: "100dvh", background: P.bg,
      padding: "56px 28px 60px",
      maxWidth: 480, margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <Link href="/admin/rsvp" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: FONTS.body, fontSize: 12, color: P.inkSoft, textDecoration: "none",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P.inkSoft} strokeWidth="1.8">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Lista
        </Link>
        <Monogram size={20} />
        <div style={{ width: 40 }} />
      </div>

      {/* Guest info */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <StatusDot comparecera={guest.comparecera} />
        <CapsLine size={10} color={P.inkMuted}>
          {guest.comparecera === true ? "Confirmado" : guest.comparecera === false ? "Não vai" : "Pendente"} · {guest.lado}
        </CapsLine>
      </div>
      <div style={{ fontFamily: FONTS.display, fontSize: 30, fontWeight: 400, color: P.ink, lineHeight: 1.1, marginBottom: 10 }}>
        {guest.nome}
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft }}>
          {guest.convidados} convidados
          {guest.convidadosConfirmados !== null && guest.convidadosConfirmados !== guest.convidados && (
            <span style={{ color: P.accentDeep }}> → {guest.convidadosConfirmados} confirmados</span>
          )}
        </div>
        {guest.telefone && (
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: P.inkMuted }}>{guest.telefone}</div>
        )}
      </div>
      {guest.confirmadoEm && (
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: P.inkMuted, marginBottom: 20 }}>
          Confirmado em {formatDateShort(guest.confirmadoEm)}
        </div>
      )}

      <GoldRule style={{ marginBottom: 24 }} />

      {/* Link */}
      <SectionLabel>Link RSVP</SectionLabel>
      <LinkBlock id={guest.id} baseUrl={BASE_URL} onCopy={() => copy(`${BASE_URL}/rsvp/${guest.id}`, "link")} />

      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <GoldRule />
      </div>

      {/* Template */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <SectionLabel style={{ marginBottom: 0 }}>Mensagem · com variáveis</SectionLabel>
        <button
          onClick={() => { setEditingTemplate(!editingTemplate); setTemplateDraft(template); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONTS.body, fontSize: 12, color: P.accent, textDecoration: "underline" }}
        >
          {editingTemplate ? "cancelar" : "editar"}
        </button>
      </div>

      {editingTemplate ? (
        <div>
          <textarea
            value={templateDraft}
            onChange={(e) => setTemplateDraft(e.target.value)}
            rows={6}
            style={{
              width: "100%", borderRadius: 10, border: `1px solid ${P.line}`,
              background: P.card, padding: 12, boxSizing: "border-box",
              fontFamily: FONTS.body, fontSize: 13, color: P.ink, lineHeight: 1.6,
              resize: "vertical", outline: "none",
            }}
          />
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: P.inkMuted, marginTop: 6 }}>
            Variáveis: {"{nome}"} e {"{link}"}
          </div>
          <div onClick={saveTemplate} style={{ cursor: "pointer", marginTop: 12 }}>
            <ButtonPrimary style={{ opacity: savingTemplate ? 0.6 : 1 }}>
              {savingTemplate ? "Salvando…" : "Salvar template"}
            </ButtonPrimary>
          </div>
        </div>
      ) : (
        <div style={{
          background: P.surface, borderRadius: 12, padding: 14,
          fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft, lineHeight: 1.7,
          whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>
          <TemplateWithVars text={template} />
        </div>
      )}

      {/* Rendered preview */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <SectionLabel>Como vai chegar</SectionLabel>
        <div style={{
          background: P.card, borderRadius: 12, padding: 14, border: `1px solid ${P.line}`,
          fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft, lineHeight: 1.7,
          whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>
          {message}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {whatsAppUrl && (
          <a href={whatsAppUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <button style={{
              width: "100%", height: 54, borderRadius: 999,
              background: "#25D366", border: "none", color: "#fff",
              fontFamily: FONTS.display, fontSize: 16, letterSpacing: "0.22em",
              textTransform: "uppercase", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: "0 8px 18px -8px rgba(37,211,102,0.5)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Abrir WhatsApp
            </button>
          </a>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button
            onClick={() => copy(message, "msg")}
            style={{
              height: 46, borderRadius: 999, border: `1px solid ${P.line}`,
              background: "transparent", cursor: "pointer",
              fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft,
            }}
          >
            {copied === "msg" ? "Copiado ✓" : "Copiar mensagem"}
          </button>
          <button
            onClick={() => copy(`${BASE_URL}/rsvp/${guest.id}`, "link")}
            style={{
              height: 46, borderRadius: 999, border: `1px solid ${P.line}`,
              background: "transparent", cursor: "pointer",
              fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft,
            }}
          >
            {copied === "link" ? "Copiado ✓" : "Copiar link"}
          </button>
        </div>
      </div>
    </div>
  );
}
