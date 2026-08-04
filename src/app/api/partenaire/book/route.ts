import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  // Vérifie que le réparateur a bien débloqué cette demande
  const { data: unlock } = await supabaseAdmin
    .from("unlocks")
    .select("id")
    .eq("demande_id", demandeId)
    .eq("repairer_id", user.id)
    .maybeSingle();

  if (!unlock) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { error } = await supabaseAdmin
    .from("demandes")
    .update({ status: "booked", booked_by: user.id })
    .eq("id", demandeId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
