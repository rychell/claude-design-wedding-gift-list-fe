"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stepper } from "@/components/wedding/rsvp-primitives";
import { P, FONTS, GoldRule, Monogram, ButtonPrimary, CapsLine } from "@/components/wedding/primitives";

export default function NovoConvidadoPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [convidados, setConvidados] = useState(2);
  const [lado, setLado] = useState<"noiva" | "noivo">("noiva");
  const [telefone, setTelefone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(addAnother = false) {
    if (!nome.trim()) { setError("Informe o nome do grupo."); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/convidados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), convidados, lado, telefone: telefone.trim() }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Erro ao salvar");
      }
      if (addAnother) {
        setNome(""); setConvidados(2); setTelefone(""); setLado("noiva");
      } else {
        router.push("/admin/rsvp");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      minHeight: "100dvh", background: P.bg,
      padding: "56px 28px 40px",
      maxWidth: 390, margin: "0 auto",
      display: "flex", flexDirection: "column",
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
          Painel
        </Link>
        <Monogram size={20} />
        <div style={{ width: 40 }} />
      </div>

      <CapsLine size={11} color={P.inkSoft} style={{ marginBottom: 10 }}>Novo convidado</CapsLine>
      <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 400, color: P.ink, lineHeight: 1.15, marginBottom: 6 }}>
        Adicionar uma <em style={{ color: P.accent }}>família</em>
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft, marginBottom: 24 }}>
        Um convite por grupo. Quem responde, responde por todos.
      </div>

      <GoldRule style={{ marginBottom: 28 }} />

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1 }}>
        {/* Nome */}
        <div>
          <label style={{ fontFamily: FONTS.body, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: P.inkMuted, display: "block", marginBottom: 8 }}>
            Nome do grupo
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Família Silva"
            style={{
              width: "100%", height: 48, borderRadius: 10, border: `1px solid ${P.line}`,
              background: P.card, padding: "0 14px", boxSizing: "border-box",
              fontFamily: FONTS.body, fontSize: 15, color: P.ink,
              outline: "none",
            }}
          />
        </div>

        {/* Convidados */}
        <div>
          <label style={{ fontFamily: FONTS.body, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: P.inkMuted, display: "block", marginBottom: 16 }}>
            Convidados
          </label>
          <Stepper value={convidados} onChange={setConvidados} min={1} />
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted, textAlign: "center", marginTop: 8 }}>
            total de pessoas no convite
          </div>
        </div>

        {/* Lado */}
        <div>
          <label style={{ fontFamily: FONTS.body, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: P.inkMuted, display: "block", marginBottom: 10 }}>
            Lado
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["noiva", "noivo"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLado(l)}
                style={{
                  flex: 1, height: 42, borderRadius: 999,
                  border: `1px solid ${lado === l ? P.accent : P.line}`,
                  background: lado === l ? P.accent : "transparent",
                  color: lado === l ? "#fff" : P.inkSoft,
                  fontFamily: FONTS.body, fontSize: 13, cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Telefone */}
        <div>
          <label style={{ fontFamily: FONTS.body, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: P.inkMuted, display: "block", marginBottom: 8 }}>
            Telefone
          </label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="+55 85 99999-0001"
            type="tel"
            style={{
              width: "100%", height: 48, borderRadius: 10, border: `1px solid ${P.line}`,
              background: P.card, padding: "0 14px", boxSizing: "border-box",
              fontFamily: FONTS.mono, fontSize: 14, color: P.ink, outline: "none",
            }}
          />
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted, marginTop: 6 }}>
            opcional · usado pro link do WhatsApp
          </div>
        </div>
      </div>

      {error && (
        <div style={{ fontFamily: FONTS.body, fontSize: 13, color: "#c0392b", marginTop: 16, textAlign: "center" }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28 }}>
        <div onClick={() => void handleSubmit(false)} style={{ cursor: "pointer" }}>
          <ButtonPrimary style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? "Salvando…" : "Gerar link e salvar"}
          </ButtonPrimary>
        </div>
        <button
          onClick={() => void handleSubmit(true)}
          disabled={saving}
          style={{
            height: 44, background: "none", border: "none", cursor: "pointer",
            fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft,
          }}
        >
          Salvar e adicionar outro
        </button>
      </div>
    </div>
  );
}
