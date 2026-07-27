"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import Link from "next/link";
import { getAuth, clearAuth, onAuthChange, type AuthState } from "@/lib/auth";

export function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [auth, setAuthState] = useState<AuthState | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setAuthState(getAuth());
    update();
    return onAuthChange(update);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    clearAuth();
    setMenuOpen(false);
    router.push("/");
  }

  const monEspacePath  = auth?.role === "partenaire" ? "/partenaire"   : "/mes-demandes";
  const monEspaceLabel = auth?.role === "partenaire" ? "Mes fiches & jetons" : "Mes demandes en cours";

  return (
    <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid #EAEFED" }}>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center gap-3" style={{ height: 68 }}>
        <Link href="/"><Logo /></Link>

        <div className="flex-1" />

        {auth ? (
          /* ── Connecté : avatar + dropdown ── */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 font-semibold text-[13.5px] cursor-pointer transition-colors border-0"
              style={{ background: "#F4F6F5", color: "#11211B" }}
            >
              <span
                className="w-6 h-6 rounded-full inline-flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0"
                style={{ background: auth.role === "partenaire" ? "#D85A30" : "#1D9E75" }}
              >
                {auth.name?.[0]?.toUpperCase() ?? (auth.role === "partenaire" ? "R" : "P")}
              </span>
              <span className="hidden sm:inline">
                {auth.role === "partenaire" ? "Mon espace réparateur" : "Mes demandes"}
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] w-[280px] bg-white rounded-[14px] p-2 animate-mgPop z-50"
                style={{ border: "1px solid #EAEFED", boxShadow: "0 12px 40px rgba(17,33,27,.16)" }}
              >
                {/* Badge rôle */}
                <div className="px-3 py-2.5 mb-1">
                  <div className="text-[11px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9aa39e" }}>
                    Connecté en tant que
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full inline-flex items-center justify-center text-white text-[11px] font-extrabold"
                      style={{ background: auth.role === "partenaire" ? "#D85A30" : "#1D9E75" }}
                    >
                      {auth.name?.[0]?.toUpperCase() ?? (auth.role === "partenaire" ? "R" : "P")}
                    </span>
                    <div>
                      <div className="font-bold text-[13px]">{auth.name ?? (auth.role === "partenaire" ? "Réparateur" : "Particulier")}</div>
                      <div className="text-[11px] font-medium capitalize" style={{ color: "#9aa39e" }}>{auth.role}</div>
                    </div>
                  </div>
                </div>

                <div className="h-px mb-1 mx-1" style={{ background: "#EAEFED" }} />

                <Link href={monEspacePath} className="no-underline" onClick={() => setMenuOpen(false)}>
                  <button className="flex w-full text-left gap-3 items-center rounded-[10px] px-3 py-[11px] cursor-pointer border-0 bg-transparent hover:bg-[#E8F6F0] transition-colors">
                    <span className="flex-shrink-0 w-8 h-8 rounded-[9px] inline-flex items-center justify-center" style={{ background: "#E8F6F0" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>
                      <span className="block font-bold text-[13.5px]">Mon espace</span>
                      <span className="block text-[11.5px] mt-0.5" style={{ color: "#6B7280" }}>{monEspaceLabel}</span>
                    </span>
                  </button>
                </Link>

                <div className="h-px my-1 mx-1" style={{ background: "#EAEFED" }} />

                <button
                  onClick={handleLogout}
                  className="flex w-full text-left gap-3 items-center rounded-[10px] px-3 py-[11px] cursor-pointer border-0 bg-transparent hover:bg-[#FDE8E8] transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-[9px] inline-flex items-center justify-center" style={{ background: "#FDE8E8" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="#D85A30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="font-bold text-[13.5px]" style={{ color: "#D85A30" }}>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Non connecté : deux CTAs distincts ── */
          <>
            {/* Espace client — desktop only */}
            <Link
              href="/connexion"
              className="hidden sm:inline-flex items-center gap-1.5 no-underline rounded-[10px] px-[14px] py-[10px] font-bold text-[13px] transition-colors"
              style={{ color: "#3d4b44", border: "1px solid #EAEFED", background: "#fff" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Espace client
            </Link>

            {/* Espace réparateur — desktop only */}
            <Link
              href="/partenaire"
              className="hidden sm:inline-flex items-center gap-1.5 no-underline rounded-[10px] px-[14px] py-[10px] font-bold text-[13px] transition-colors"
              style={{ color: "#3d4b44", border: "1px solid #EAEFED", background: "#fff" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Espace réparateur
            </Link>

            {/* Je dépose une demande — CTA principal */}
            <Link href="/deposer" className="inline-flex no-underline">
              <button
                className="inline-flex items-center gap-2 text-white rounded-[10px] px-[14px] py-[10px] font-bold text-[13px] cursor-pointer border-0"
                style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                <span className="hidden sm:inline">Je dépose une demande</span>
                <span className="sm:hidden">Déposer</span>
              </button>
            </Link>

            {/* Menu mobile — hamburger pour Espace client / réparateur */}
            <div className="relative sm:hidden" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-10 h-10 rounded-[10px] flex items-center justify-center border-0 cursor-pointer"
                style={{ background: "#F4F6F5" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="#11211B" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+10px)] w-[220px] bg-white rounded-[14px] p-2 z-50"
                  style={{ border: "1px solid #EAEFED", boxShadow: "0 12px 40px rgba(17,33,27,.16)" }}
                >
                  <Link href="/connexion" onClick={() => setMenuOpen(false)} className="no-underline flex items-center gap-2.5 rounded-[10px] px-3 py-3 font-bold text-[13.5px] hover:bg-[#F4F6F5]" style={{ color: "#11211B" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    Espace client
                  </Link>
                  <Link href="/partenaire" onClick={() => setMenuOpen(false)} className="no-underline flex items-center gap-2.5 rounded-[10px] px-3 py-3 font-bold text-[13.5px] hover:bg-[#F4F6F5]" style={{ color: "#11211B" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Espace réparateur
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
