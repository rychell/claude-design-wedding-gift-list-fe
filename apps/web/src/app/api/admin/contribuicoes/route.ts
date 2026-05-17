import { NextResponse } from "next/server";
import { db, contribuicoes } from "@claude-design-wedding-gift-list-fe/db";
import { desc } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(contribuicoes).orderBy(desc(contribuicoes.criadoEm));
  return NextResponse.json(rows);
}
