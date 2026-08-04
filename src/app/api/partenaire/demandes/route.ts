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

  // Récupère les fiches débloquées par ce réparateur
  const { data: unlocks } = await supabaseAdmin
    .from("unlocks")
    .select("demande_id")
    .eq("repairer_id", user.id);

  const unlockedIds = new Set((unlocks ?? []).map((u: { demande_id: string }) => u.demande_id));

  const { data, error } = await supabaseAdmin
    .from("demandes")
    .select("id, title, city, intervention, insurance, damage, availability, status, created_at, phone, email")
    .in("status", ["active", "booked"])
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const demandes = (data ?? []).map((d) => {
    const diffMs = Date.now() - new Date(d.created_at).getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffH / 24);
    const age = diffH < 1 ? "À l'instant" : diffH < 24 ? `Il y a ${diffH}h` : `Il y a ${diffD}j`;
    const isUnlocked = unlockedIds.has(d.id);

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
      isUnlocked,
      phone:        isUnlocked ? (d.phone ?? "") : "●●● ●●● ●●●●",
      email:        isUnlocked ? (d.email ?? "") : "●●●●●@●●●●●.●●●",
    };
  });

  return NextResponse.json({ demandes });
}
