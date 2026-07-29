import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PACKS = {
  solo:      { jetons: 1,  prix: 1000,  label: "1 jeton" },
  starter:   { jetons: 3,  prix: 2400,  label: "Pack Starter — 3 jetons" },
  essentiel: { jetons: 10, prix: 7500,  label: "Pack Essentiel — 10 jetons" },
  pro:       { jetons: 25, prix: 17500, label: "Pack Pro — 25 jetons" },
};

export async function POST(req: NextRequest) {
  // Vérifie la session Supabase depuis le header Authorization
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  const { pack } = await req.json();
  const p = PACKS[pack as keyof typeof PACKS];
  if (!p) return NextResponse.json({ error: "Pack invalide" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price_data: { currency: "eur", product_data: { name: p.label }, unit_amount: p.prix }, quantity: 1 }],
      metadata: { userId: user.id, pack, jetons: String(p.jetons) },
      success_url: `${req.nextUrl.origin}/partenaire?success=1&jetons=${p.jetons}`,
      cancel_url:  `${req.nextUrl.origin}/partenaire`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
