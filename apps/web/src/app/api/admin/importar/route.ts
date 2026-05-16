import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db, convidados } from "@claude-design-wedding-gift-list-fe/db";

type CsvRow = {
  nome: string;
  convidados: string | number;
  lado: string;
  telefone?: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json() as { rows?: CsvRow[] };
  if (!Array.isArray(body.rows) || body.rows.length === 0) {
    return NextResponse.json({ error: "rows deve ser um array não vazio" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const values = body.rows.map((r) => ({
    id: nanoid(8),
    nome: String(r.nome ?? "").trim(),
    convidados: Number(r.convidados),
    lado: String(r.lado ?? "").toLowerCase().trim() as "noivo" | "noiva",
    telefone: String(r.telefone ?? "").trim(),
    confirmado: false as const,
    ultimaAtualizacao: now,
  }));

  let added = 0;
  const errors: { row: number; nome: string; error: string }[] = [];

  for (let i = 0; i < values.length; i++) {
    const v = values[i]!;
    try {
      await db.insert(convidados).values(v);
      added++;
    } catch (e: unknown) {
      errors.push({ row: i + 1, nome: v.nome, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return NextResponse.json({ added, errors });
}
