import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db, convidados } from "@claude-design-wedding-gift-list-fe/db";
import { desc, eq } from "drizzle-orm";
import type { ConvidadoRow } from "@claude-design-wedding-gift-list-fe/db";
import type { Guest } from "@/lib/rsvp-utils";

function rowToGuest(row: ConvidadoRow): Guest {
  return {
    ...row,
    comparecera: row.comparecera === "sim" ? true : row.comparecera === "nao" ? false : null,
  };
}

export async function GET() {
  const rows = await db.select().from(convidados).orderBy(desc(convidados.ultimaAtualizacao));
  return NextResponse.json(rows.map(rowToGuest));
}

export async function POST(req: NextRequest) {
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

  const now = new Date().toISOString();
  const id = nanoid(8);
  await db.insert(convidados).values({
    id,
    nome: body.nome.trim(),
    convidados: Number(body.convidados),
    lado: body.lado as "noivo" | "noiva",
    telefone: body.telefone?.trim() ?? "",
    confirmado: false,
    ultimaAtualizacao: now,
  });

  const rows = await db.select().from(convidados).where(eq(convidados.id, id)).limit(1);
  return NextResponse.json(rowToGuest(rows[0]!), { status: 201 });
}
