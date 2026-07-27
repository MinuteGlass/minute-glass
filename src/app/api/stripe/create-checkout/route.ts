import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PACKS = {
  solo:      { jetons: 1,  prix: 1000, label: "1 jeton" },
  starter:   { jetons: 3,  prix: 2400, label: "Pack Starter — 3 jetons" },
  essentiel: { jetons: 10, prix: 7500, label: "Pack Essentiel — 10 jetons" },
  pro:       { jetons: 25, prix: 17500, label: "Pack Pro — 25 jetons" },
};

export async function POST(req: NextRequest) {
  const { pack, userId } = await req.json();
  const p = PACKS[pack as keyof typeof PACKS];
  if (!p) return NextResponse.json({ error: "Pack invalide" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price_data: { currency: "eur", product_data: { name: p.label }, unit_amount: p.prix }, quantity: 1 }],
      metadata: { userId, pack, jetons: String(p.jetons) },
      success_url: `${req.nextUrl.origin}/partenaire?success=1&jetons=${p.jetons}`,
      cancel_url:  `${req.nextUrl.origin}/partenaire`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
// Mon Jul 27 12:58:32 CEST 2026
