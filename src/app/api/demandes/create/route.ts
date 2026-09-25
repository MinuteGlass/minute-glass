import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, city, intervention, insurance, damage, phone, email, availability, name } = body;

  if (!title || !city || !email) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // Cherche si un compte existe déjà pour cet email
  let userId: string | null = null;

  // Vérifie si l'utilisateur est authentifié via le header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (token) {
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user) userId = user.id;
  }

  // Si pas de session, crée ou récupère le compte via email
  if (!userId) {
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    if (existing) {
      userId = existing.id;
    } else {
      // Crée un compte avec mot de passe temporaire
      const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const { data: newUser, error: signUpErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { role: "particulier", name },
      });
      if (!signUpErr && newUser?.user) {
        userId = newUser.user.id;
        // Crée le profil
        await supabaseAdmin.from("profiles").insert({
          id:     userId,
          email,
          name:   name ?? email,
          role:   "particulier",
          statut: "actif",
          tokens: 0,
          phone:  phone ?? "",
        });
      }
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "Impossible de créer le compte" }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin.from("demandes").insert({
    client_id:    userId,
    title,
    city,
    intervention: intervention ?? "remplacement",
    insurance:    insurance ?? "sans",
    damage:       damage ?? "",
    phone:        phone ?? "",
    email,
    availability: availability ?? "À définir",
    status:       "active",
  }).select("id").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
