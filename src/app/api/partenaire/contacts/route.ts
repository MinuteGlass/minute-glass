import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Returns real contacts for demandes the authenticated repairer has already unlocked
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Session invalide" }, { status: 401 });

  const { demandeIds } = await req.json();
  if (!Array.isArray(demandeIds) || demandeIds.length === 0) {
    return NextResponse.json({ contacts: {} });
  }

  // Verify which of these IDs the user has actually unlocked
  const { data: unlocks } = await supabaseAdmin
    .from("unlocks")
    .select("demande_id")
    .eq("repairer_id", user.id)
    .in("demande_id", demandeIds);

  const unlockedIds = (unlocks ?? []).map((u) => u.demande_id);
  if (unlockedIds.length === 0) return NextResponse.json({ contacts: {} });

  const { data: demandes } = await supabaseAdmin
    .from("demandes")
    .select("id, phone, email")
    .in("id", unlockedIds);

  const contacts: Record<string, { phone: string; email: string }> = {};
  for (const d of demandes ?? []) {
    if (d.phone || d.email) {
      contacts[d.id] = { phone: d.phone ?? "", email: d.email ?? "" };
    }
  }

  return NextResponse.json({ contacts });
}
