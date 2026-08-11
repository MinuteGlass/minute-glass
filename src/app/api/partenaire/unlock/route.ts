import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tokenCost } from "@/lib/token-cost";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Vérifie la session du réparateur
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  // Vérifie le profil : rôle partenaire + statut validé + assez de jetons
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("role, statut, tokens")
    .eq("id", user.id)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }
  if (profile.role !== "partenaire") {
    return NextResponse.json({ error: "Réservé aux réparateurs partenaires" }, { status: 403 });
  }
  if (profile.statut !== "validé") {
    return NextResponse.json({ error: "Compte en attente de validation" }, { status: 403 });
  }

  const { demandeId } = await req.json();
  if (!demandeId) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  // Récupère la demande pour calculer le coût côté serveur (jamais depuis le client)
  const { data: demandeMeta } = await supabaseAdmin
    .from("demandes")
    .select("status, booked_by, intervention, insurance")
    .eq("id", demandeId)
    .single();

  if (!demandeMeta) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }

  const cost = tokenCost(demandeMeta.intervention, demandeMeta.insurance);

  if (profile.tokens < cost) {
    return NextResponse.json({ error: "Solde insuffisant", tokens: profile.tokens }, { status: 402 });
  }

  if (demandeMeta?.status === "booked" && demandeMeta?.booked_by !== user.id) {
    return NextResponse.json({ error: "Cette demande a déjà été attribuée à un autre réparateur.", booked: true }, { status: 409 });
  }

  // Vérifie si déjà débloqué (idempotent)
  const { data: existing } = await supabaseAdmin
    .from("unlocks")
    .select("id")
    .eq("demande_id", demandeId)
    .eq("repairer_id", user.id)
    .maybeSingle();

  if (existing) {
    const { data: demande } = await supabaseAdmin
      .from("demandes")
      .select("phone, email")
      .eq("id", demandeId)
      .single();
    return NextResponse.json({
      ok: true,
      alreadyUnlocked: true,
      tokens: profile.tokens,
      phone: demande?.phone ?? null,
      email: demande?.email ?? null,
    });
  }

  // Débite les jetons
  const newBalance = profile.tokens - cost;
  const { error: updateErr } = await supabaseAdmin
    .from("profiles")
    .update({ tokens: newBalance })
    .eq("id", user.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Enregistre le déblocage
  const { error: unlockErr } = await supabaseAdmin
    .from("unlocks")
    .insert({ demande_id: demandeId, repairer_id: user.id, tokens_spent: cost });

  if (unlockErr) {
    // Rollback : recrédite les jetons si l'insert échoue
    await supabaseAdmin.from("profiles").update({ tokens: profile.tokens }).eq("id", user.id);
    return NextResponse.json({ error: unlockErr.message }, { status: 500 });
  }

  // Récupère les vraies coordonnées du client
  const { data: demande } = await supabaseAdmin
    .from("demandes")
    .select("phone, email")
    .eq("id", demandeId)
    .single();

  return NextResponse.json({
    ok: true,
    tokens: newBalance,
    phone: demande?.phone ?? null,
    email: demande?.email ?? null,
  });
}
