import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Session invalide" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("demandes")
    .select("id, title, city, intervention, insurance, damage, availability, status, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Formate pour correspondre au type Demande du frontend
  const demandes = (data ?? []).map((d) => {
    const createdAt = new Date(d.created_at);
    const diffMs = Date.now() - createdAt.getTime();
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
      status:       d.status,
      isUnlocked:   false,
      // Coordonnées masquées — révélées après déblocage
      phone:        "●●● ●●● ●●●●",
      email:        "●●●●●@●●●●●.●●●",
    };
  });

  return NextResponse.json({ demandes });
}
