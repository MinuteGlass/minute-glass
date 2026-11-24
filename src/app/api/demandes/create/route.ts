import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Création d'une demande SANS compte client.
 *
 * `demandes.client_id` doit être nullable (voir
 * supabase/migrations/20261124_client_id_nullable.sql). Aucun profil ni
 * utilisateur Supabase n'est créé ici : le particulier n'a pas d'espace.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, city, intervention, insurance, damage, phone, email, availability } = body;

  if (!title || !city || !email) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("demandes")
    .insert({
      title,
      city,
      intervention: intervention ?? "remplacement",
      insurance: insurance ?? "sans",
      damage: damage ?? "",
      phone: phone ?? "",
      email,
      availability: availability ?? "À définir",
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
