import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/app/api/admin/login/route";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? "";
  if (!verifyToken(token, process.env.ADMIN_SESSION_SECRET ?? "")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { userId, statut } = await req.json();
  if (!userId || !["validé", "refusé", "suspendu", "en attente"].includes(statut)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  // Si validation → crédite 2 jetons de bienvenue (une seule fois)
  let updatePayload: Record<string, unknown> = { statut };
  if (statut === "validé") {
    const { data: current } = await supabaseAdmin
      .from("profiles")
      .select("tokens, welcome_tokens_granted")
      .eq("id", userId)
      .single();
    if (current && !current.welcome_tokens_granted) {
      updatePayload = { statut, tokens: (current.tokens ?? 0) + 2, welcome_tokens_granted: true };
    }
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Email de notification au réparateur
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, name, company")
    .eq("id", userId)
    .single();

  if (profile?.email) {
    const isValidated = statut === "validé";
    await fetch(`${req.nextUrl.origin}/api/notify/repairer-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({
        to: profile.email,
        name: profile.name,
        company: profile.company,
        statut,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
