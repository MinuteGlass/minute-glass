import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/app/api/admin/login/route";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Vérifie le token admin
  const token = req.headers.get("x-admin-token") ?? "";
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!verifyToken(token, secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { email, amount, reason } = await req.json();

  if (!email || typeof amount !== "number" || amount === 0) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  // Trouve le profil par email
  const { data: profile, error: findErr } = await supabaseAdmin
    .from("profiles")
    .select("id, name, tokens")
    .eq("email", email)
    .single();

  if (findErr || !profile) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const newBalance = Math.max(0, profile.tokens + amount);

  const { error: updateErr } = await supabaseAdmin
    .from("profiles")
    .update({ tokens: newBalance })
    .eq("id", profile.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    name: profile.name,
    previousBalance: profile.tokens,
    newBalance,
    amount,
    reason: reason ?? "",
  });
}
