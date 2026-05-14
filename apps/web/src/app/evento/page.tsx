import Link from "next/link";
import { P, FONTS, CapsLine, MapTile } from "@/components/wedding/primitives";
import { ImagePlaceholder } from "@/components/wedding/image-placeholder";
import eventData from "@/data/event.json";

function EventRow({
  label,
  value,
  caption,
  last = false,
}: {
  label: string;
  value: string;
  caption: string;
  last?: boolean;
}) {
  return (
    <div style={{
      padding: "14px 16px",
      borderBottom: last ? "none" : `1px solid ${P.line}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: P.inkSoft, width: 90 }}>
        {label}
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 18, color: P.ink, lineHeight: 1.15 }}>{value}</div>
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: P.inkMuted, marginTop: 2 }}>{caption}</div>
      </div>
    </div>
  );
}

export default function EventoPage() {
  const { ceremony, venue, reception, dressCode, footerQuote } = eventData;
  const eventDate = new Date(eventData.date + "T00:00:00");
  const day = eventDate.getDate();
  const year = eventDate.getFullYear();

  const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const monthName = monthNames[eventDate.getMonth()];

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* hero */}
      <div style={{ position: "relative" }}>
        <ImagePlaceholder height={300} label="local do evento" />
        <div style={{ position: "absolute", top: 60, left: 20 }}>
          <Link href="/">
            <div style={{
              width: 38, height: 38, borderRadius: 999, background: "rgba(255,255,255,0.85)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(8px)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.ink} strokeWidth="1.7">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: `linear-gradient(180deg, transparent, ${P.bg})`,
        }} />
      </div>

      <div style={{ padding: "8px 28px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
        <CapsLine size={10} color={P.accent}>O grande dia</CapsLine>
        <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 36, color: P.ink, margin: "8px 0 0", lineHeight: 1.05 }}>
          {day} <em style={{ fontStyle: "italic", color: P.accent }}>de {monthName}</em> de {year}
        </h2>

        {/* details grid */}
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${P.line}`, borderRadius: 14, overflow: "hidden", background: P.surface }}>
          <EventRow label="Horário" value={ceremony.time} caption={ceremony.caption} />
          <EventRow label="Local" value={venue.name} caption={`${venue.city} · ${venue.state}`} />
          <EventRow label="Dress code" value={dressCode.label} caption={dressCode.caption} last />
        </div>

        {/* map preview */}
        <div style={{ marginTop: 18, borderRadius: 14, overflow: "hidden", border: `1px solid ${P.line}`, position: "relative", height: 130 }}>
          <MapTile />
          <div style={{
            position: "absolute", bottom: 12, left: 12, right: 12,
            padding: "10px 12px", background: "rgba(255,255,255,0.95)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            backdropFilter: "blur(6px)",
          }}>
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 600, color: P.ink }}>{venue.address}</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 10.5, color: P.inkSoft, marginTop: 1 }}>{venue.city} · {venue.state}</div>
            </div>
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 600, color: P.accent, letterSpacing: "0.06em", textDecoration: "none" }}
            >
              Abrir no mapa →
            </a>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 16, fontFamily: FONTS.display, fontStyle: "italic", fontSize: 14, color: P.inkSoft, textAlign: "center" }}>
          {footerQuote}
        </div>
      </div>
    </div>
  );
}
