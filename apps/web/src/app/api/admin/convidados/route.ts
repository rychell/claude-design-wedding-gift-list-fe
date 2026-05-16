import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function GET() {
  if (!SCRIPT_URL) {
    return NextResponse.json({ error: "GOOGLE_APPS_SCRIPT_URL não configurado" }, { status: 503 });
  }
  const res = await fetch(`${SCRIPT_URL}?action=listAll`, { cache: "no-store" });
  const data = await res.json() as unknown;
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!SCRIPT_URL) {
    return NextResponse.json({ error: "GOOGLE_APPS_SCRIPT_URL não configurado" }, { status: 503 });
  }
  const body = await req.json() as {
    nome?: string;
    convidados?: number;
    lado?: string;
    telefone?: string;
  };

  if (!body.nome?.trim() || !body.convidados || !body.lado) {
    return NextResponse.json({ error: "Campos obrigatórios: nome, convidados, lado" }, { status: 400 });
  }
  if (body.lado !== "noivo" && body.lado !== "noiva") {
    return NextResponse.json({ error: "lado deve ser 'noivo' ou 'noiva'" }, { status: 400 });
  }

  const guest = {
    id: nanoid(8),
    nome: body.nome.trim(),
    convidados: Number(body.convidados),
    lado: body.lado,
    telefone: body.telefone?.trim() ?? "",
  };

  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "addConvidado", ...guest }),
  });
  const data = await res.json() as unknown;
  return NextResponse.json(data, { status: 201 });
}
