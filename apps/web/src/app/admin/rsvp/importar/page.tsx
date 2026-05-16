"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { P, FONTS, GoldRule, Monogram, ButtonPrimary, CapsLine } from "@/components/wedding/primitives";

type ParsedRow = {
  nome: string;
  convidados: number;
  lado: string;
  telefone: string;
  errors: string[];
};

function parseCSV(raw: string): ParsedRow[] {
  const lines = raw.trim().split(/\r?\n/);
  const rows: ParsedRow[] = [];
  const start = lines[0]?.toLowerCase().includes("nome") ? 1 : 0;
  for (let i = start; i < lines.length; i++) {
    const cols = lines[i]?.split(",").map((c) => c.trim()) ?? [];
    if (cols.length < 3) continue;
    const errors: string[] = [];
    const nome = cols[0] ?? "";
    const convidadosRaw = cols[1] ?? "";
    const lado = (cols[2] ?? "").toLowerCase();
    const telefone = cols[3] ?? "";
    if (!nome) errors.push("nome vazio");
    const convidados = parseInt(convidadosRaw, 10);
    if (isNaN(convidados) || convidados < 1) errors.push(`convidados inválido: "${convidadosRaw}"`);
    if (lado !== "noivo" && lado !== "noiva") errors.push(`lado inválido: "${lado}" · esperado: noivo ou noiva`);
    rows.push({ nome, convidados: isNaN(convidados) ? 0 : convidados, lado, telefone, errors });
  }
  return rows;
}

export default function ImportarPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedRow[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ added: number; errors: { row: number; nome: string; error: string }[] } | null>(null);

  function handleParse() {
    const rows = parseCSV(raw);
    setParsed(rows);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRaw(text);
      setParsed(parseCSV(text));
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!parsed) return;
    const valid = parsed.filter((r) => r.errors.length === 0);
    if (valid.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/importar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: valid }),
      });
      const data = await res.json() as { added: number; errors: { row: number; nome: string; error: string }[] };
      setResult(data);
      if (data.added > 0 && data.errors.length === 0) {
        setTimeout(() => router.push("/admin/rsvp"), 1200);
      }
    } catch {
      setResult({ added: 0, errors: [{ row: 0, nome: "", error: "Falha na conexão" }] });
    } finally {
      setSaving(false);
    }
  }

  const errorRows = parsed?.filter((r) => r.errors.length > 0) ?? [];
  const validRows = parsed?.filter((r) => r.errors.length === 0) ?? [];
  const totalConvidados = validRows.reduce((s, r) => s + r.convidados, 0);

  return (
    <div style={{
      minHeight: "100dvh", background: P.bg,
      padding: "56px 28px 60px",
      maxWidth: 520, margin: "0 auto",
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

      <CapsLine size={11} color={P.inkSoft} style={{ marginBottom: 10 }}>Importar lista</CapsLine>
      <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 400, color: P.ink, lineHeight: 1.15, marginBottom: 6 }}>
        Cole sua <em style={{ color: P.accent }}>planilha</em>
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: 13, color: P.inkSoft, marginBottom: 6 }}>
        CSV com colunas{" "}
        <code style={{ fontFamily: FONTS.mono, fontSize: 12, background: P.placeholder, padding: "1px 6px", borderRadius: 4 }}>
          nome, convidados, lado, telefone
        </code>
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted, marginBottom: 24 }}>
        Telefone é opcional. Lado deve ser <strong>noivo</strong> ou <strong>noiva</strong>.
      </div>

      <GoldRule style={{ marginBottom: 24 }} />

      {/* Textarea */}
      <textarea
        value={raw}
        onChange={(e) => { setRaw(e.target.value); setParsed(null); setResult(null); }}
        placeholder={"nome,convidados,lado,telefone\nFamília Silva,3,noiva,558599999999\nJoão Pereira,1,noivo"}
        rows={8}
        style={{
          width: "100%", borderRadius: 12, border: `1px solid ${P.line}`,
          background: P.card, padding: "14px", boxSizing: "border-box",
          fontFamily: FONTS.mono, fontSize: 12, color: P.ink, lineHeight: 1.6,
          resize: "vertical", outline: "none",
        }}
      />

      {/* File upload */}
      <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleFile} />
      <button
        onClick={() => fileRef.current?.click()}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: FONTS.body, fontSize: 12, color: P.accent,
          textDecoration: "underline", padding: "8px 0", display: "block",
        }}
      >
        ou selecionar arquivo
      </button>

      {/* Parse button */}
      {raw.trim() && !parsed && (
        <div onClick={handleParse} style={{ cursor: "pointer", marginTop: 16 }}>
          <ButtonPrimary subtle>Validar CSV</ButtonPrimary>
        </div>
      )}

      {/* Preview */}
      {parsed && parsed.length > 0 && (
        <div style={{ marginTop: 24 }}>
          {/* Error alert */}
          {errorRows.length > 0 && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10,
              padding: "12px 16px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: FONTS.body, fontSize: 13, color: "#dc2626", fontWeight: 500 }}>
                  {errorRows.length} {errorRows.length === 1 ? "ajuste" : "ajustes"} antes de importar
                </span>
              </div>
              {errorRows.slice(0, 4).map((r, i) => (
                <div key={i} style={{ fontFamily: FONTS.mono, fontSize: 11, color: "#b91c1c", marginTop: 4 }}>
                  linha {(parsed.indexOf(r) + 1)} · {r.errors.join(" · ")}
                </div>
              ))}
              {errorRows.length > 4 && (
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: "#b91c1c", marginTop: 4 }}>
                  + {errorRows.length - 4} mais…
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div style={{ background: P.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${P.line}` }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: P.inkMuted, marginBottom: 4 }}>
                Famílias válidas
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 28, color: P.ink }}>{validRows.length}</div>
            </div>
            <div style={{ background: P.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${P.line}` }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: P.inkMuted, marginBottom: 4 }}>
                Convidados
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 28, color: P.ink }}>{totalConvidados}</div>
            </div>
          </div>

          {/* Row preview */}
          <div style={{ background: P.card, borderRadius: 12, border: `1px solid ${P.line}`, overflow: "hidden", marginBottom: 20, maxHeight: 220, overflowY: "auto" }}>
            {parsed.slice(0, 20).map((r, i) => (
              <div key={i} style={{
                padding: "10px 14px",
                background: r.errors.length > 0 ? "#fef2f2" : "transparent",
                borderBottom: `1px solid ${P.line}`,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: P.inkMuted, width: 20, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONTS.body, fontSize: 12, color: P.ink }}>{r.nome || "—"}</div>
                  {r.errors.length > 0 && (
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: "#dc2626", marginTop: 2 }}>
                      {r.errors.join(" · ")}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: P.inkMuted }}>
                  {r.convidados || "?"} · {r.lado || "?"}
                </div>
              </div>
            ))}
            {parsed.length > 20 && (
              <div style={{ padding: "10px 14px", fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted }}>
                + {parsed.length - 20} linhas…
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          background: result.added > 0 ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${result.added > 0 ? "#86efac" : "#fca5a5"}`,
          borderRadius: 10, padding: "12px 16px", marginBottom: 16,
          fontFamily: FONTS.body, fontSize: 13,
          color: result.added > 0 ? "#15803d" : "#dc2626",
        }}>
          {result.added > 0 ? `✓ ${result.added} ${result.added === 1 ? "convidado adicionado" : "convidados adicionados"}` : "Nenhum convidado importado."}
        </div>
      )}

      {/* Import button */}
      {parsed && validRows.length > 0 && !result && (
        <div onClick={handleImport} style={{ cursor: "pointer" }}>
          <ButtonPrimary style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? "Importando…" : `Revisar e importar ${validRows.length} ${validRows.length === 1 ? "família" : "famílias"}`}
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
}
