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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json() as { convidadosConfirmados?: number };
  const n = Number(body.convidadosConfirmados);
  if (!n || n < 1) {
    return NextResponse.json({ error: "convidadosConfirmados inválido" }, { status: 400 });
  }

  const now = new Date().toISOString();
  await db.update(convidados)
    .set({ convidadosConfirmados: n, ultimaAtualizacao: now })
    .where(eq(convidados.id, id));

  const updated = await db.select().from(convidados).where(eq(convidados.id, id)).limit(1);
  if (!updated[0]) return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 });
  return NextResponse.json(rowToGuest(updated[0]));
}
