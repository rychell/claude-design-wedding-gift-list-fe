import { NextRequest, NextResponse } from "next/server";
import { db, contribuicoes } from "@claude-design-wedding-gift-list-fe/db";

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    giftId?: string;
    isSurpresa?: boolean;
    valor?: number;
    nome?: string;
    mensagem?: string;
  };

  const valor = typeof body.valor === "number" ? Math.round(body.valor) : NaN;
  if (!Number.isFinite(valor) || valor <= 0) {
    return NextResponse.json({ error: "valor inválido" }, { status: 400 });
  }

  const row = {
    id: crypto.randomUUID(),
    giftId: body.giftId ?? null,
    isSurpresa: body.isSurpresa ?? false,
    valor,
    nome: body.nome?.trim() || null,
    mensagem: body.mensagem?.trim() || null,
    criadoEm: new Date().toISOString(),
  };

  await db.insert(contribuicoes).values(row);

  return NextResponse.json({ id: row.id }, { status: 201 });
}
