"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4F6F5" }}>
      <header className="bg-white sticky top-0 z-40" style={{ borderBottom: "1px solid #EAEFED" }}>
        <div className="max-w-[1320px] mx-auto px-6 flex items-center" style={{ height: 68 }}>
          <Link href="/"><Logo /></Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20 text-center">
        <div className="max-w-[480px]">
          {/* Illustration */}
          <div className="mx-auto w-[120px] h-[120px] rounded-[28px] flex items-center justify-center mb-8" style={{ background: "linear-gradient(150deg,#E8F6F0,#cdeadd)" }}>
            <svg width="60" height="60" viewBox="0 0 84 58" fill="none">
              <path d="M14 40l6-20a6 6 0 015.8-4.4h32.4A6 6 0 0164 20l6 20" stroke="#0F5C44" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M22 22l2.6 12h34.8L62 22" stroke="#0F5C44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 23l5 11M48 26l-9 8" stroke="#D85A30" strokeWidth="1.8" strokeLinecap="round" />
              <text x="30" y="50" fontFamily="system-ui" fontWeight="900" fontSize="10" fill="#D85A30">404</text>
            </svg>
          </div>

          <h1 className="m-0 text-[36px] font-extrabold tracking-tight">Page introuvable</h1>
          <p className="m-0 mt-4 text-[16px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>
            Oups ! Cette page n'existe pas ou a été déplacée.<br />
            Pas de panique, votre pare-brise est intact.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/">
              <button
                className="inline-flex items-center gap-2 text-white rounded-[11px] px-6 py-3.5 font-bold text-[14.5px] border-0 cursor-pointer"
                style={{ background: "#1D9E75", boxShadow: "0 4px 14px rgba(29,158,117,.35)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Retour à l'accueil
              </button>
            </Link>
            <Link href="/deposer">
              <button
                className="inline-flex items-center gap-2 rounded-[11px] px-6 py-3.5 font-bold text-[14.5px] border-0 cursor-pointer"
                style={{ background: "#fff", border: "1px solid #EAEFED", color: "#11211B" }}
              >
                Déposer une demande
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
