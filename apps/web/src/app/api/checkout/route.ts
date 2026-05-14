import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import giftsData from "@/data/gifts.json";
import type { Gift } from "@/types/gift";

const GIFTS = giftsData as Gift[];

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN não configurado");
}

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";
const IS_PRODUCTION = !BASE_URL.includes("localhost");

export async function POST(req: NextRequest) {
  const body = await req.json() as { giftId?: string; valor?: number; nome?: string };
  const nome = body.nome?.trim() || "Convidado";

  const gift = body.giftId ? GIFTS.find((g) => g.id === body.giftId) : null;
  const isSurpresa = !gift;
  const itemPrice = gift ? gift.price : (body.valor ?? 0);

  if (!itemPrice || itemPrice <= 0) {
    return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
  }

  const client = new Preference(mp);

  const failureUrl = gift
    ? `${BASE_URL}/lista/${gift.id}/pagamento?nome=${encodeURIComponent(nome)}&erro=1`
    : `${BASE_URL}/surpresa/pagamento?valor=${itemPrice}&nome=${encodeURIComponent(nome)}&erro=1`;

  try {
    const preference = await client.create({
      body: {
        items: [
          {
            id: gift?.id ?? "surpresa",
            title: gift?.title ?? "Nos surpreenda",
            description: gift?.desc ?? "Presente livre",
            quantity: 1,
            unit_price: itemPrice,
            currency_id: "BRL",
          },
        ],
        payer: { name: nome },
        payment_methods: {
          excluded_payment_types: [
            { id: "bank_transfer" },
            { id: "debit_card" },
            { id: "ticket" },
            { id: "atm" },
          ],
          installments: 4,
          default_installments: 1,
        },
        back_urls: {
          success: `${BASE_URL}/obrigado?nome=${encodeURIComponent(nome)}`,
          failure: failureUrl,
          pending: `${BASE_URL}/obrigado?nome=${encodeURIComponent(nome)}&pendente=1`,
        },
        ...(IS_PRODUCTION && { auto_return: "approved" }),
        statement_descriptor: "Lista de presentes",
        metadata: { giftId: gift?.id ?? null, isSurpresa, nome },
      },
    });

    const url = preference.init_point ?? preference.sandbox_init_point;
    if (!url) {
      return NextResponse.json(
        { error: "URL de pagamento não gerada pelo MercadoPago" },
        { status: 502 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[checkout] Erro ao criar preferência MP:", err);
    return NextResponse.json(
      { error: "Erro ao criar preferência de pagamento" },
      { status: 500 }
    );
  }
}
