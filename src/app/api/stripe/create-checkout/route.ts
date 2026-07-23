import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PACKS = {
  starter:  { jetons: 5,  prix: 990,  label: "Pack Starter — 5 jetons" },
  pro:      { jetons: 12, prix: 1990, label: "Pack Pro — 12 jetons" },
  premium:  { jetons: 25, prix: 3490, label: "Pack Premium — 25 jetons" },
};

export async function POST(req: NextRequest) {
  const { pack, userId } = await req.json();
  const p = PACKS[pack as keyof typeof PACKS];
  if (!p) return NextResponse.json({ error: "Pack invalide" }, { status: 400 });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price_data: { currency: "eur", product_data: { name: p.label }, unit_amount: p.prix }, quantity: 1 }],
    metadata: { userId, pack, jetons: String(p.jetons) },
    success_url: `${req.nextUrl.origin}/tarifs?success=1&jetons=${p.jetons}`,
    cancel_url:  `${req.nextUrl.origin}/tarifs`,
  });

  return NextResponse.json({ url: session.url });
}
