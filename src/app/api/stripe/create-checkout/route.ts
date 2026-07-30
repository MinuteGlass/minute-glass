import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { PACKS } from "@/lib/packs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  const { pack: packId } = await req.json();
  const p = PACKS.find((x) => x.id === packId);
  if (!p) return NextResponse.json({ error: "Pack invalide" }, { status: 400 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, name")
    .eq("id", user.id)
    .single();

  const label = `Pack ${p.name} — ${p.tokens} jeton${p.tokens > 1 ? "s" : ""}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: profile?.email ?? user.email ?? undefined,
      line_items: [{ price_data: { currency: "eur", product_data: { name: label }, unit_amount: p.priceCents }, quantity: 1 }],
      invoice_creation: { enabled: true },
      metadata: { userId: user.id, pack: p.id, jetons: String(p.tokens), packLabel: label },
      success_url: `${req.nextUrl.origin}/partenaire?success=1&jetons=${p.tokens}`,
      cancel_url:  `${req.nextUrl.origin}/partenaire`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
