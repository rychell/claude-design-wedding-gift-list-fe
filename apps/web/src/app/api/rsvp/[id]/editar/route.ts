import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!SCRIPT_URL) {
    return NextResponse.json({ error: "GOOGLE_APPS_SCRIPT_URL não configurado" }, { status: 503 });
  }
  const { id } = await params;
  const body = await req.json() as { convidadosConfirmados?: number };
  const n = Number(body.convidadosConfirmados);
  if (!n || n < 1) {
    return NextResponse.json({ error: "convidadosConfirmados inválido" }, { status: 400 });
  }
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "editar", id, convidadosConfirmados: n }),
  });
  const data = await res.json() as unknown;
  return NextResponse.json(data);
}
