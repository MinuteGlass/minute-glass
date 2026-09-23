"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signIn } from "@/lib/auth";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handle() {
      // Supabase extrait automatiquement le token du hash d'URL
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/connexion");
        return;
      }

      const user = session.user;

      // Vérifie si le profil existe déjà
      const { data: existing } = await supabase
        .from("profiles")
        .select("id, role, name, tokens, statut")
        .eq("id", user.id)
        .single();

      if (!existing) {
        // Crée le profil particulier pour les nouveaux utilisateurs Google
        const name = user.user_metadata?.full_name ?? user.email ?? "";
        await supabase.from("profiles").insert({
          id:     user.id,
          email:  user.email,
          name,
          role:   "particulier",
          statut: "actif",
          tokens: 0,
        });
      }
      // Met à jour le cache local via onAuthChange natif de Supabase (déclenché par getSession)

      router.replace("/mes-demandes");
    }

    handle();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F4F6F5" }}>
      <div className="text-center">
        <svg className="animate-spin mx-auto mb-4" width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#1D9E75" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" strokeLinecap="round" />
        </svg>
        <p className="font-semibold text-[15px]" style={{ color: "#6B7280" }}>Connexion en cours…</p>
      </div>
    </div>
  );
}
