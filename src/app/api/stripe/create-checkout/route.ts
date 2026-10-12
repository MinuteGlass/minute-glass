import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Session invalide" }, { status: 401 });

  const { demandeId } = await req.json();
  if (!demandeId) return NextResponse.json({ error: "demandeId manquant" }, { status: 400 });

  // Récupère le dossier et son prix
  const { data: demande } = await supabaseAdmin
    .from("demandes")
    .select("id, title, city, intervention, insurance, status, booked_by, prix_dossier")
    .eq("id", demandeId)
    .single();

  if (!demande) return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
  if (demande.prix_dossier == null) return NextResponse.json({ error: "Prix du dossier non défini" }, { status: 400 });

  // Vérifie que le dossier n'est pas déjà débloqué par quelqu'un d'autre
  const { count: existingUnlocks } = await supabaseAdmin
    .from("unlocks")
    .select("id", { count: "exact", head: true })
    .eq("demande_id", demandeId)
    .neq("repairer_id", user.id);

  if ((existingUnlocks ?? 0) >= 1) {
    return NextResponse.json({ error: "Ce dossier a déjà été débloqué par un autre réparateur.", full: true }, { status: 409 });
  }

  if (demande.status === "booked" && demande.booked_by !== user.id) {
    return NextResponse.json({ error: "Cette demande a déjà été attribuée à un autre réparateur.", booked: true }, { status: 409 });
  }

  // Vérifie si déjà débloqué par ce réparateur (idempotent)
  const { data: existing } = await supabaseAdmin
    .from("unlocks")
    .select("id")
    .eq("demande_id", demandeId)
    .eq("repairer_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Vous avez déjà débloqué ce dossier.", alreadyUnlocked: true }, { status: 409 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, name")
    .eq("id", user.id)
    .single();

  const label = `Dossier MinuteGlass — ${demande.title} (${demande.city})`;
  const priceCents = Math.round(demande.prix_dossier * 100);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: profile?.email ?? user.email ?? undefined,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: label },
          unit_amount: priceCents,
        },
        quantity: 1,
      }],
      invoice_creation: { enabled: true },
      metadata: {
        type: "dossier",
        userId: user.id,
        demandeId,
        label,
        priceCents: String(priceCents),
      },
      success_url: `${req.nextUrl.origin}/partenaire?unlocked=${demandeId}`,
      cancel_url:  `${req.nextUrl.origin}/partenaire`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
