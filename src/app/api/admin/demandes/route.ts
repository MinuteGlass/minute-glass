import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/app/api/admin/login/route";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? "";
  if (!verifyToken(token, process.env.ADMIN_SESSION_SECRET ?? "")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("demandes")
    .select("id, title, city, intervention, insurance, damage, availability, status, verified, estimated_margin, created_at, client_id")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: unlocks } = await supabaseAdmin
    .from("unlocks")
    .select("demande_id");

  const unlockCounts: Record<string, number> = {};
  for (const u of unlocks ?? []) {
    unlockCounts[u.demande_id] = (unlockCounts[u.demande_id] ?? 0) + 1;
  }

  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 3600 * 1000;

  const demandes = (data ?? []).map((d) => {
    const createdAt = new Date(d.created_at).getTime();
    const diffH = Math.floor((now - createdAt) / 3600000);
    const diffD = Math.floor(diffH / 24);
    const age = diffH < 1 ? "À l'instant" : diffH < 24 ? `Il y a ${diffH}h` : `Il y a ${diffD}j`;
    return {
      id: d.id,
      title: d.title ?? "—",
      city: d.city ?? "—",
      intervention: d.intervention ?? "remplacement",
      insurance: d.insurance ?? "sans",
      damage: d.damage ?? "",
      availability: d.availability ?? "À définir",
      status: d.status ?? "active",
      verified: d.verified ?? false,
      estimated_margin: d.estimated_margin ?? null,
      age,
      isNew: createdAt > oneWeekAgo,
      unlockCount: unlockCounts[d.id] ?? 0,
    };
  });

  return NextResponse.json({ demandes });
}

/* PATCH — toggle verified */
export async function PATCH(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? "";
  if (!verifyToken(token, process.env.ADMIN_SESSION_SECRET ?? "")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id, verified, estimated_margin } = await req.json();
  if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (verified !== undefined) updates.verified = verified;
  if (estimated_margin !== undefined) updates.estimated_margin = estimated_margin === "" ? null : Number(estimated_margin);

  const { error } = await supabaseAdmin
    .from("demandes")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
