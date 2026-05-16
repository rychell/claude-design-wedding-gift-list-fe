import { NextRequest, NextResponse } from "next/server";
import { db, convidados } from "@claude-design-wedding-gift-list-fe/db";
import { eq } from "drizzle-orm";
import type { ConvidadoRow } from "@claude-design-wedding-gift-list-fe/db";
import type { Guest } from "@/lib/rsvp-utils";

function rowToGuest(row: ConvidadoRow): Guest {
  return {
    ...row,
    comparecera: row.comparecera === "sim" ? true : row.comparecera === "nao" ? false : null,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db.select().from(convidados).where(eq(convidados.id, id)).limit(1);
  if (!rows[0]) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(rowToGuest(rows[0]));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json() as { comparecera?: boolean };
  if (typeof body.comparecera !== "boolean") {
    return NextResponse.json({ error: "comparecera deve ser boolean" }, { status: 400 });
  }

  const existing = await db.select().from(convidados).where(eq(convidados.id, id)).limit(1);
  const row = existing[0];
  if (!row) return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 });

  const now = new Date().toISOString();
  await db.update(convidados)
    .set({
      confirmado: true,
      confirmadoEm: row.confirmado ? row.confirmadoEm : now,
      comparecera: body.comparecera ? "sim" : "nao",
      convidadosConfirmados: body.comparecera
        ? (row.convidadosConfirmados ?? row.convidados)
        : null,
      ultimaAtualizacao: now,
    })
    .where(eq(convidados.id, id));

  const updated = await db.select().from(convidados).where(eq(convidados.id, id)).limit(1);
  return NextResponse.json(rowToGuest(updated[0]!));
}
