"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { signIn, signUp } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function SocialBtn({
  icon, label, onClick, loading,
}: { icon: "google" | "apple"; label: string; onClick?: () => void; loading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-1 inline-flex items-center justify-center gap-2 rounded-[11px] py-3 font-bold text-[14px] cursor-pointer transition-all hover:opacity-90 disabled:cursor-wait"
      style={{
        border: icon === "apple" ? "1.5px solid #11211B" : "1px solid #EAEFED",
        background: icon === "apple" ? "#11211B" : "#fff",
        color: icon === "apple" ? "#fff" : "#11211B",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" strokeLinecap="round" />
        </svg>
      ) : icon === "google" ? (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
          <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0012 22Z" />
          <path fill="#FBBC05" d="M6.4 13.9a6 6 0 010-3.8V7.5H3.1a10 10 0 000 9l3.3-2.6Z" />
          <path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 003.1 7.5l3.3 2.6C7.2 7.8 9.4 6.1 12 6.1Z" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1 2.6-2 .8-1.2 1.2-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.5ZM14.2 6c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z" />
        </svg>
      )}
      {loading ? (icon === "google" ? "Connexion Google…" : "Connexion Apple…") : label}
    </button>
  );
}

type Screen = "login" | "forgot";

export default function ConnexionPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("login");

  /* champs */
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);

  /* forgot password */
  const [fpEmail, setFpEmail]   = useState("");
  const [fpSent, setFpSent]     = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 6;

  async function handleLogin() {
    if (!valid) return;
    setLoading(true);
    setError("");
    const { error, state } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    router.push(state?.role === "partenaire" ? "/partenaire" : "/mes-demandes");
  }

  async function handleSocial(provider: "google" | "apple") {
    setSocialLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider: provider === "google" ? "google" : "apple",
      options: { redirectTo: `${window.location.origin}/mes-demandes` },
    });
    setSocialLoading(null);
  }

  async function handleForgot() {
    if (!fpEmail.includes("@")) return;
    await supabase.auth.resetPasswordForEmail(fpEmail, {
      redirectTo: `${window.location.origin}/connexion`,
    });
    setFpSent(true);
  }

  if (screen === "forgot") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F4F6F5" }}>
        <header className="bg-white sticky top-0 z-40" style={{ borderBottom: "1px solid #EAEFED" }}>
          <div className="max-w-[1320px] mx-auto px-6 flex items-center" style={{ height: 68 }}>
            <Link href="/"><Logo /></Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[440px]">
            <div className="text-center mb-7">
              <span className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4" style={{ background: "#E8F6F0" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4l16 16M4 20l4-4m8-8 4-4M9.5 9.5A4 4 0 0114 12a4 4 0 01-1.5 3.1" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="3" y="11" width="18" height="9" rx="2" stroke="#1D9E75" strokeWidth="2"/>
                </svg>
              </span>
              <h1 className="m-0 text-[22px] font-extrabold tracking-tight">Mot de passe oublié</h1>
              <p className="m-0 mt-2 text-sm font-medium" style={{ color: "#6B7280" }}>
                Entrez votre email, on vous envoie un lien de réinitialisation.
              </p>
            </div>
            <div className="bg-white rounded-[20px] p-8" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
              {fpSent ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">✉️</div>
                  <div className="font-extrabold text-[17px] mb-2">Email envoyé !</div>
                  <p className="text-[13.5px] font-semibold" style={{ color: "#6B7280" }}>
                    Vérifiez votre boîte <b>{fpEmail}</b>. Le lien expire dans 30 minutes.
                  </p>
                  <button
                    onClick={() => setScreen("login")}
                    className="mt-6 w-full py-3 rounded-[11px] font-bold text-[14px] text-white border-0 cursor-pointer"
                    style={{ background: "#1D9E75" }}
                  >
                    Retour à la connexion
                  </button>
                </div>
              ) : (
                <>
                  <label className="block text-[13px] font-bold mb-1.5">Adresse email</label>
                  <input
                    type="email"
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    placeholder="vous@email.com"
                    className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none mb-4"
                    style={{ border: "1px solid #EAEFED" }}
                    onKeyDown={(e) => e.key === "Enter" && handleForgot()}
                  />
                  <button
                    onClick={handleForgot}
                    disabled={!fpEmail.includes("@")}
                    className="w-full py-3 rounded-[11px] font-bold text-[14.5px] text-white border-0 cursor-pointer disabled:cursor-not-allowed"
                    style={{ background: fpEmail.includes("@") ? "#1D9E75" : "#cdd6d1" }}
                  >
                    Envoyer le lien
                  </button>
                  <button onClick={() => setScreen("login")} className="w-full mt-3 py-2.5 bg-transparent border-0 font-bold text-[13.5px] cursor-pointer" style={{ color: "#6B7280" }}>
                    ← Retour
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4F6F5" }}>
      <header className="bg-white sticky top-0 z-40" style={{ borderBottom: "1px solid #EAEFED" }}>
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between" style={{ height: 68 }}>
          <Link href="/"><Logo /></Link>
          <span className="text-[13.5px] font-semibold" style={{ color: "#6B7280" }}>
            Pas encore de compte ?{" "}
            <Link href="/deposer" className="font-bold no-underline" style={{ color: "#1D9E75" }}>S'inscrire gratuitement</Link>
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[440px]">
          {/* Logo + titre */}
          <div className="text-center mb-8">
            <h1 className="m-0 text-[26px] font-extrabold tracking-tight">Bon retour&nbsp;👋</h1>
            <p className="m-0 mt-2 text-[14.5px] font-medium" style={{ color: "#6B7280" }}>
              Connectez-vous pour suivre vos demandes.
            </p>
          </div>

          <div className="bg-white rounded-[22px] p-8" style={{ border: "1px solid #EAEFED", boxShadow: "0 4px 24px rgba(17,33,27,.07)" }}>
            {/* Social */}
            <div className="flex gap-3 mb-5">
              <SocialBtn icon="google" label="Google" onClick={() => handleSocial("google")} loading={socialLoading === "google"} />
              <SocialBtn icon="apple" label="Apple" onClick={() => handleSocial("apple")} loading={socialLoading === "apple"} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: "#EAEFED" }} />
              <span className="text-[12.5px] font-semibold" style={{ color: "#9aa39e" }}>ou par email</span>
              <div className="flex-1 h-px" style={{ background: "#EAEFED" }} />
            </div>

            {/* Champs */}
            <label className="block text-[13px] font-bold mb-1.5">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="vous@email.com"
              className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none mb-4"
              style={{ border: `1px solid ${error ? "#D85A30" : "#EAEFED"}` }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-bold">Mot de passe</label>
              <button
                onClick={() => setScreen("forgot")}
                className="bg-transparent border-0 text-[12.5px] font-bold cursor-pointer p-0"
                style={{ color: "#1D9E75" }}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="relative mb-1">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none pr-11"
                style={{ border: `1px solid ${error ? "#D85A30" : "#EAEFED"}` }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-1"
                style={{ color: "#9aa39e" }}
                tabIndex={-1}
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.9 17.9A10 10 0 014.1 4.1m7.2 2.8a4 4 0 015.8 5.8M9.9 9.9A4 4 0 0014 14M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
                )}
              </button>
            </div>

            {error && (
              <p className="text-[12.5px] font-semibold mt-1 mb-3" style={{ color: "#D85A30" }}>⚠ {error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={!valid || loading}
              className="w-full mt-5 py-3.5 rounded-[11px] font-bold text-[15px] text-white border-0 cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              style={{
                background: valid ? "#1D9E75" : "#cdd6d1",
                boxShadow: valid ? "0 4px 14px rgba(29,158,117,.35)" : "none",
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" strokeLinecap="round"/>
                  </svg>
                  Connexion…
                </span>
              ) : "Se connecter"}
            </button>
          </div>

          <p className="text-center mt-5 text-[13px] font-semibold" style={{ color: "#6B7280" }}>
            Vous êtes réparateur ?{" "}
            <Link href="/partenaire" className="font-bold no-underline" style={{ color: "#D85A30" }}>
              Espace réparateur →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
