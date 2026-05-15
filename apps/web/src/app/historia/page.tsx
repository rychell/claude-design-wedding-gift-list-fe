import Link from "next/link";
import { P, FONTS, Monogram, CapsLine, IconButton } from "@/components/wedding/primitives";
import { ImagePlaceholder } from "@/components/wedding/image-placeholder";
import eventData from "@/data/event.json";

export default function HistoriaPage() {
  const { timeline } = eventData;

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <IconButton>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.ink} strokeWidth="1.7">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconButton>
          </Link>
          <Monogram size={22} color={P.accent} />
          <div style={{ width: 38 }} />
        </div>
        <div style={{ marginTop: 22 }}>
          <CapsLine size={10} color={P.accent}>Nossa história</CapsLine>
          <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 36, color: P.ink, lineHeight: 1.05, margin: "8px 0 6px" }}>
            Quarto <em style={{ fontStyle: "italic", color: P.accent, fontWeight: 300 }}>anos</em> em quatro<br />capítulos.
          </h1>
        </div>
      </div>

      {/* timeline */}
      <div style={{ flex: 1, padding: "22px 24px 28px", position: "relative", overflow: "hidden" }}>
        {/* vertical rule */}
        <div style={{ position: "absolute", left: 38, top: 22, bottom: 28, width: 1, background: P.line }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {timeline.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
              <div style={{ width: 28, paddingTop: 6, textAlign: "center", position: "relative", zIndex: 2 }}>
                <div style={{
                  width: 9, height: 9, borderRadius: 999, background: P.accent, margin: "0 auto",
                  boxShadow: `0 0 0 4px ${P.bg}`,
                }} />
              </div>
              <div style={{ flex: 1, paddingBottom: 6 }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: P.inkSoft }}>
                  {m.year} · {m.month}
                </div>
                <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, color: P.ink, margin: "4px 0 6px", lineHeight: 1.15 }}>
                  {m.title}
                </div>
                <ImagePlaceholder height={110} radius={10} label={`foto ${i + 1}`} style={{ marginBottom: 10 }} />
                <div style={{
                  fontFamily: FONTS.mono, fontSize: 11, color: P.inkMuted,
                  padding: "6px 0", borderTop: `1px dashed ${P.line}`, borderBottom: `1px dashed ${P.line}`,
                }}>
                  {m.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
