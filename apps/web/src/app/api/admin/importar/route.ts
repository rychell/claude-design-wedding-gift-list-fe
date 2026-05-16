import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

type CsvRow = {
  nome: string;
  convidados: string | number;
  lado: string;
  telefone?: string;
};

export async function POST(req: NextRequest) {
  if (!SCRIPT_URL) {
    return NextResponse.json({ error: "GOOGLE_APPS_SCRIPT_URL não configurado" }, { status: 503 });
  }

  const body = await req.json() as { rows?: CsvRow[] };
  if (!Array.isArray(body.rows) || body.rows.length === 0) {
    return NextResponse.json({ error: "rows deve ser um array não vazio" }, { status: 400 });
  }

  const rows = body.rows.map((r) => ({
    id: nanoid(8),
    nome: String(r.nome ?? "").trim(),
    convidados: Number(r.convidados),
    lado: String(r.lado ?? "").toLowerCase().trim(),
    telefone: String(r.telefone ?? "").trim(),
  }));

  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "importCSV", rows }),
  });
  const data = await res.json() as unknown;
  return NextResponse.json(data);
}
