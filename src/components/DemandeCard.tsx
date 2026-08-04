"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Demande } from "@/types";
import { tokenCost } from "@/lib/token-cost";
import { ChatModal } from "@/components/ChatModal";

const INTERVENTION_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  remplacement: { label: "Remplacement pare-brise", bg: "#EAF1FE", color: "#2563EB" },
  reparation:   { label: "Réparation d'impact",    bg: "#E8F6F0", color: "#1D9E75" },
  vitre:        { label: "Vitre latérale",          bg: "#EDE9FE", color: "#6D28D9" },
};

export function DemandeCard({ demande, isPartner, isParticulier }: { demande: Demande; isPartner: boolean; isParticulier?: boolean }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const stored = localStorage.getItem("mg_unlocked");
      return stored ? (JSON.parse(stored) as string[]).includes(demande.id) : (demande.isUnlocked ?? false);
    } catch { return demande.isUnlocked ?? false; }
  });
  const [contacts, setContacts] = useState<{ phone: string; email: string } | null>(() => {
    try {
      const stored = localStorage.getItem("mg_contacts");
      const all = stored ? JSON.parse(stored) : {};
      return all[demande.id] ?? null;
    } catch { return null; }
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const router = useRouter();
  const isInsured = demande.insurance === "avec";
  const interv = INTERVENTION_LABELS[demande.intervention];
  const cost = tokenCost(demande.intervention, demande.insurance);

  function handleUnlockClick() {
    if (!isPartner) { setShowModal(true); return; }
    setShowConfirm(true);
  }

  function confirmUnlock() {
    setShowConfirm(false);
    try {
      const current = Number(localStorage.getItem("mg_tokens") ?? 12);
      if (current < cost) return;
      localStorage.setItem("mg_tokens", String(current - cost));
      const stored = localStorage.getItem("mg_unlocked");
      const ids: string[] = stored ? JSON.parse(stored) : [];
      if (!ids.includes(demande.id)) {
        ids.push(demande.id);
        localStorage.setItem("mg_unlocked", JSON.stringify(ids));
      }
    } catch {}
    setUnlocked(true);
    setJustUnlocked(true);
    setTimeout(() => setJustUnlocked(false), 4000);
    try {
      const stored = localStorage.getItem("mg_contacts");
      const all = stored ? JSON.parse(stored) : {};
      if (all[demande.id]) setContacts(all[demande.id]);
    } catch {}
  }

  return (
    <>
    {chatOpen && <ChatModal demande={demande} onClose={() => setChatOpen(false)} />}
    <article
      className="bg-white rounded-2xl p-4 flex gap-4 transition-all duration-150 cursor-pointer group hover:shadow-md"
      style={{
        border: "1px solid #EAEFED",
        boxShadow: "0 1px 3px rgba(17,33,27,.04)",
      }}
      onClick={() => router.push(`/annonce/${demande.id}`)}
    >
      {/* Thumbnail */}
      <div
        className="flex-shrink-0 w-[118px] h-[118px] rounded-xl relative overflow-hidden flex items-end justify-center"
        style={{ background: "linear-gradient(150deg,#dde7e2,#eef3f0)" }}
      >
        <svg width="84" height="58" viewBox="0 0 84 58" fill="none" className="mb-1.5 opacity-55">
          <path d="M14 40l6-20a6 6 0 015.8-4.4h32.4A6 6 0 0164 20l6 20" stroke="#0F5C44" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M22 22l2.6 12h34.8L62 22" stroke="#0F5C44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 23l5 11M48 26l-9 8" stroke="#D85A30" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span
          className="absolute top-[7px] left-[7px] inline-flex items-center gap-1 text-white rounded-[7px] px-[7px] py-[3px] text-[9.5px] font-bold"
          style={{ background: "rgba(17,33,27,.72)" }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 018 0v3" stroke="#fff" strokeWidth="2" />
          </svg>
          Plaque masquée
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Badges */}
        <div className="flex items-start flex-wrap gap-2 mb-2.5">
          {isInsured ? (
            <span
              className="inline-flex items-center gap-1 rounded-[7px] px-[9px] py-1 text-xs font-bold"
              style={{ background: "#E8F6F0", color: "#0F5C44" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z" stroke="#0F5C44" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="#0F5C44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Avec assurance
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-[7px] px-[9px] py-1 text-xs font-bold"
              style={{ background: "#FCEDE7", color: "#B0431F" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z" stroke="#B0431F" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              Sans assurance
            </span>
          )}

          <span
            className="rounded-[7px] px-[9px] py-1 text-xs font-bold"
            style={{ background: interv.bg, color: interv.color }}
          >
            {interv.label}
          </span>

          {demande.isNew && (
            <span className="rounded-[7px] px-[9px] py-1 text-xs font-bold" style={{ background: "#FDE8E8", color: "#D8302F" }}>
              Nouveau
            </span>
          )}
          {demande.status === "booked" && (
            <span className="rounded-[7px] px-[9px] py-1 text-xs font-bold" style={{ background: "#F4F6F5", color: "#6B7280" }}>
              🔒 Déjà attribué
            </span>
          )}
        </div>

        <h3 className="m-0 text-[17px] font-extrabold tracking-tight">{demande.title}</h3>

        <div
          className="flex items-center gap-3 mt-1 text-[12.5px] font-semibold flex-wrap"
          style={{ color: "#6B7280" }}
        >
          <span className="inline-flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11Z" stroke="#9aa39e" strokeWidth="1.8" />
              <circle cx="12" cy="10" r="2.2" stroke="#9aa39e" strokeWidth="1.8" />
            </svg>
            {demande.city} · {demande.distance}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="#9aa39e" strokeWidth="1.8" />
              <path d="M12 8v4l2.5 1.5" stroke="#9aa39e" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {demande.age}
          </span>
        </div>

        <p className="m-0 mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "#3d4b44" }}>
          {demande.damage}
        </p>

        {/* Contact zone */}
        {unlocked && isPartner ? (
          <div
            className="mt-3 flex items-center justify-between gap-3 flex-wrap rounded-[11px] px-3 py-2.5"
            style={{ background: justUnlocked ? "#E8F6F0" : "#FAFBFB", border: justUnlocked ? "1px solid #1D9E75" : "1px solid #EEF2F0", transition: "background .4s, border-color .4s" }}
          >
            <div className="flex items-center gap-[18px]">
              <span className="flex flex-col gap-0.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>
                  Téléphone
                </span>
                <span className="font-bold text-[13.5px]" style={{ color: "#0F5C44" }}>
                  {contacts?.phone ?? demande.phone ?? "—"}
                </span>
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>
                  Email
                </span>
                <span className="font-bold text-[13.5px]" style={{ color: "#0F5C44" }}>
                  {contacts?.email ?? demande.email ?? "—"}
                </span>
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setChatOpen(true); }}
              className="inline-flex items-center gap-1.5 text-white rounded-[10px] px-3.5 py-2 font-bold text-[13px] border-0 cursor-pointer whitespace-nowrap"
              style={{ background: "#11211B" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              Discuter
            </button>
          </div>
        ) : (
          <div
            className="mt-3 flex items-center justify-between gap-3 flex-wrap rounded-[11px] px-3 py-2.5"
            style={{ background: "#FAFBFB", border: "1px solid #EEF2F0" }}
          >
            <div className="flex items-center gap-[18px]">
              <span className="flex flex-col gap-0.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>
                  Téléphone
                </span>
                <span className="font-bold text-[13.5px] select-none" style={{ filter: "blur(5px)" }}>
                  06 84 21 55 09
                </span>
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>
                  Email
                </span>
                <span className="font-bold text-[13.5px] select-none" style={{ filter: "blur(5px)" }}>
                  contact@email.com
                </span>
              </span>
            </div>
            {isParticulier ? (
              <span className="text-[12px] font-semibold rounded-[9px] px-3 py-2" style={{ background: "#F4F6F5", color: "#9aa39e" }}>
                Réservé aux réparateurs
              </span>
            ) : demande.status === "booked" && !unlocked ? (
              <span className="text-[12px] font-semibold rounded-[9px] px-3 py-2" style={{ background: "#F4F6F5", color: "#9aa39e" }}>
                🔒 Déjà attribué
              </span>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); handleUnlockClick(); }}
                className="inline-flex items-center gap-2 text-white rounded-[10px] px-[15px] py-2.5 font-bold text-[13.5px] border-0 cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.25)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="2" />
                  <path d="M8 11V8a4 4 0 018 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Débloquer — {cost} jeton{cost > 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}
      </div>
    </article>

    {/* Modale confirmation déblocage */}
    {showConfirm && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(17,33,27,.55)" }}
        onClick={() => setShowConfirm(false)}
      >
        <div
          className="bg-white rounded-[20px] p-7 max-w-[380px] w-full animate-mgPop"
          style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex w-11 h-11 rounded-[13px] items-center justify-center flex-shrink-0" style={{ background: "#E8F6F0" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="#1D9E75" strokeWidth="2"/>
                <path d="M8 11V8a4 4 0 018 0" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <div>
              <div className="font-extrabold text-[16px]">Débloquer cette fiche ?</div>
              <div className="text-[13px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>{demande.title}</div>
            </div>
          </div>

          <div className="rounded-[12px] p-4 mb-5" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold" style={{ color: "#6B7280" }}>Coût du déblocage</span>
              <span className="font-extrabold text-[20px]" style={{ color: "#0F5C44" }}>{cost} jeton{cost > 1 ? "s" : ""}</span>
            </div>
            <div className="text-[12px] font-semibold mt-1" style={{ color: "#9aa39e" }}>
              {interv.label} · {isInsured ? "Client assuré" : "Sans assurance"}
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 rounded-[11px] font-bold text-[14px] border-0 cursor-pointer"
              style={{ background: "#F4F6F5", color: "#6B7280" }}
            >
              Annuler
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); confirmUnlock(); }}
              className="flex-1 py-3 rounded-[11px] font-bold text-[14px] text-white border-0 cursor-pointer"
              style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
            >
              Confirmer — {cost} jeton{cost > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modale connexion partenaire */}
    {showModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(17,33,27,.55)" }}
        onClick={() => setShowModal(false)}
      >
        <div
          className="bg-white rounded-[20px] p-8 max-w-[400px] w-full animate-mgPop text-center"
          style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4"
            style={{ background: "#FCEDE7" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="#D85A30" strokeWidth="2" />
              <path d="M8 11V8a4 4 0 018 0v3" stroke="#D85A30" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="m-0 text-[20px] font-extrabold tracking-tight">Espace réservé aux réparateurs</h2>
          <p className="mt-2.5 mb-6 text-[14px] leading-relaxed" style={{ color: "#6B7280" }}>
            Seuls les réparateurs peuvent débloquer les fiches clients. Connectez-vous ou créez votre compte réparateur.
          </p>
          <div className="flex flex-col gap-3">
            <button
              className="w-full py-3 rounded-[11px] font-bold text-[14.5px] text-white border-0 cursor-pointer"
              style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
              onClick={() => { setShowModal(false); router.push("/partenaire"); }}
            >
              Se connecter — Espace réparateur
            </button>
            <button
              className="w-full py-3 rounded-[11px] font-bold text-[14.5px] border-0 cursor-pointer"
              style={{ background: "#fff", color: "#11211B", border: "1px solid #EAEFED" }}
              onClick={() => { setShowModal(false); router.push("/partenaire"); }}
            >
              Créer un compte réparateur
            </button>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 bg-transparent border-0 text-[13px] font-semibold cursor-pointer"
            style={{ color: "#9aa39e" }}
          >
            Annuler
          </button>
        </div>
      </div>
    )}
    </>
  );
}
