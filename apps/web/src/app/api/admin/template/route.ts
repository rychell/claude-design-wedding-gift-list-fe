import { NextRequest, NextResponse } from "next/server";
import { db, config } from "@claude-design-wedding-gift-list-fe/db";
import { eq } from "drizzle-orm";
import eventData from "@/data/event.json";

export async function GET() {
  const rows = await db.select().from(config).where(eq(config.key, "template")).limit(1);
  return NextResponse.json({ template: rows[0]?.value ?? eventData.rsvp.whatsAppTemplate });
}

export async function PUT(req: NextRequest) {
  const body = await req.json() as { template?: string };
  if (!body.template?.trim()) {
    return NextResponse.json({ error: "template inválido" }, { status: 400 });
  }
  await db.insert(config)
    .values({ key: "template", value: body.template.trim() })
    .onConflictDoUpdate({ target: config.key, set: { value: body.template.trim() } });
  return NextResponse.json({ ok: true });
}
