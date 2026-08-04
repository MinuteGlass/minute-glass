import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("demandes")
    .select("id, title, city, intervention, insurance, damage, availability, status, created_at")
    .in("status", ["active", "booked"])
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ demandes: [] });

  const demandes = (data ?? []).map((d) => {
    const diffMs = Date.now() - new Date(d.created_at).getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffH / 24);
    const age = diffH < 1 ? "À l'instant" : diffH < 24 ? `Il y a ${diffH}h` : `Il y a ${diffD}j`;

    return {
      id:           d.id,
      title:        d.title,
      city:         d.city,
      distance:     "",
      age,
      intervention: d.intervention,
      insurance:    d.insurance,
      damage:       d.damage,
      availability: d.availability ?? "À définir",
      isNew:        diffH < 24,
      status:       d.status,
      // Coordonnées jamais exposées publiquement
      phone:        "●●● ●●● ●●●●",
      email:        "●●●●●@●●●●●.●●●",
      region:       "",
    };
  });

  return NextResponse.json({ demandes });
}
