import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!SCRIPT_URL) {
    return NextResponse.json({ error: "GOOGLE_APPS_SCRIPT_URL não configurado" }, { status: 503 });
  }
  const { id } = await params;
  const res = await fetch(`${SCRIPT_URL}?action=getGuest&id=${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  const data = await res.json() as unknown;
  if (!data) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!SCRIPT_URL) {
    return NextResponse.json({ error: "GOOGLE_APPS_SCRIPT_URL não configurado" }, { status: 503 });
  }
  const { id } = await params;
  const body = await req.json() as { comparecera?: boolean };
  if (typeof body.comparecera !== "boolean") {
    return NextResponse.json({ error: "comparecera deve ser boolean" }, { status: 400 });
  }
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "confirmar", id, comparecera: body.comparecera }),
  });
  const data = await res.json() as unknown;
  return NextResponse.json(data);
}
