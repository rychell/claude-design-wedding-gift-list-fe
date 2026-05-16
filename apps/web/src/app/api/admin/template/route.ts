import { NextRequest, NextResponse } from "next/server";
import eventData from "@/data/event.json";

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function GET() {
  if (!SCRIPT_URL) {
    return NextResponse.json({ template: eventData.rsvp.whatsAppTemplate });
  }
  const res = await fetch(`${SCRIPT_URL}?action=getTemplate`, { cache: "no-store" });
  const data = await res.json() as { template?: string };
  return NextResponse.json({ template: data.template ?? eventData.rsvp.whatsAppTemplate });
}

export async function PUT(req: NextRequest) {
  if (!SCRIPT_URL) {
    return NextResponse.json({ error: "GOOGLE_APPS_SCRIPT_URL não configurado" }, { status: 503 });
  }
  const body = await req.json() as { template?: string };
  if (!body.template?.trim()) {
    return NextResponse.json({ error: "template inválido" }, { status: 400 });
  }
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "saveTemplate", template: body.template.trim() }),
  });
  const data = await res.json() as unknown;
  return NextResponse.json(data);
}
