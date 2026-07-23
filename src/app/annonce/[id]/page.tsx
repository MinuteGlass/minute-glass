"use client";

import { use, useState, useEffect } from "react";
import { tokenCost as calcTokenCost } from "@/lib/token-cost";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ChatModal } from "@/components/ChatModal";
import { DEMANDES } from "@/data/demandes";
import { getLocalDemandes } from "@/lib/demandes-store";
import { getAuth } from "@/lib/auth";
import type { Demande } from "@/types";

/* Seed partners that "unlocked" each demande — keyed by demande id */
const INTERESTED: Record<string, InterestedPartner[]> = {
  "1": [
    { id: "vitro-pro-lyon", name: "Vitro Pro Lyon",   avatar: "VP", avatarBg: "#1D9E75", note: 4.8, nbAvis: 127, city: "Lyon (69)",      badge: "Certifié", delai: "< 1 h" },
    { id: "vitro-pro-lyon", name: "Glass Expert 69",  avatar: "GE", avatarBg: "#2563EB", note: 4.6, nbAvis:  89, city: "Villeurbanne",   badge: "Agréé",    delai: "< 2 h" },
  ],
  "2": [
    { id: "vitro-pro-lyon", name: "Vitro Pro Lyon",   avatar: "VP", avatarBg: "#1D9E75", note: 4.8, nbAvis: 127, city: "Lyon (69)",      badge: "Certifié", delai: "< 1 h" },
  ],
  "3": [
    { id: "vitro-pro-lyon", name: "Rapido Vitrage",   avatar: "RV", avatarBg: "#6D28D9", note: 4.7, nbAvis:  54, city: "Bron (69)",      badge: "Certifié", delai: "< 3 h" },
    { id: "vitro-pro-lyon", name: "AutoVerre Sud",    avatar: "AV", avatarBg: "#D97706", note: 4.5, nbAvis:  41, city: "Vénissieux (69)", badge: "Agréé",    delai: "< 4 h" },
    { id: "vitro-pro-lyon", name: "Glass Expert 69",  avatar: "GE", avatarBg: "#2563EB", note: 4.6, nbAvis:  89, city: "Villeurbanne",   badge: "Agréé",    delai: "< 2 h" },
  ],
};

type InterestedPartner = {
  id: string; name: string; avatar: string; avatarBg: string;
  note: number; nbAvis: number; city: string; badge: string; delai: string;
};

function Stars({ note }: { note: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(note) ? "#F5A623" : "none"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke="#F5A623" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      ))}
    </span>
  );
}

function PartenairesInteresses({ demandeId }: { demandeId: string }) {
  const partners = INTERESTED[demandeId] ?? INTERESTED["1"];
  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex w-6 h-6 rounded-full items-center justify-center" style={{ background: "#E8F6F0" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="#1D9E75" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </span>
        <h2 className="m-0 text-[15px] font-extrabold">{partners.length} réparateur{partners.length > 1 ? "s" : ""} intéressé{partners.length > 1 ? "s" : ""}</h2>
      </div>
      <p className="m-0 mb-4 text-[13px] font-medium" style={{ color: "#6B7280" }}>
        Ces professionnels ont débloqué votre fiche et peuvent vous contacter.
      </p>
      <div className="flex flex-col gap-3">
        {partners.map((p, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[12px] p-3.5" style={{ background: "#F8FAFA", border: "1px solid #EAEFED" }}>
            <div
              className="flex-shrink-0 w-[44px] h-[44px] rounded-[12px] flex items-center justify-center text-white font-extrabold text-[14px]"
              style={{ background: p.avatarBg }}
            >
              {p.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[14px]">{p.name}</span>
                <span className="rounded-full px-2 py-0.5 text-[10.5px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>{p.badge}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <Stars note={p.note} />
                <span className="text-[12px] font-bold">{p.note}</span>
                <span className="text-[12px] font-semibold" style={{ color: "#9aa39e" }}>({p.nbAvis} avis)</span>
                <span className="text-[12px] font-semibold" style={{ color: "#9aa39e" }}>· {p.city}</span>
              </div>
              <div className="text-[11.5px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                Répond en {p.delai}
              </div>
            </div>
            <Link href={`/partenaire/${p.id}`} className="no-underline flex-shrink-0">
              <button
                className="text-[12.5px] font-bold rounded-[9px] px-3 py-2 border-0 cursor-pointer whitespace-nowrap"
                style={{ background: "#fff", color: "#11211B", border: "1px solid #EAEFED" }}
              >
                Voir le profil →
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const INTERVENTION_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  remplacement: { label: "Remplacement pare-brise", bg: "#EAF1FE", color: "#2563EB" },
  reparation:   { label: "Réparation d'impact",     bg: "#E8F6F0", color: "#1D9E75" },
  vitre:        { label: "Vitre latérale",           bg: "#EDE9FE", color: "#6D28D9" },
};

/* Damage illustration SVG */
function DamageIllustration({ intervention }: { intervention: string }) {
  return (
    <div
      className="w-full rounded-[16px] flex items-center justify-center"
      style={{ height: 220, background: "linear-gradient(150deg,#dde7e2,#eef3f0)" }}
    >
      <svg width="160" height="110" viewBox="0 0 160 110" fill="none">
        {/* Car silhouette */}
        <path d="M24 78l12-38a11 11 0 0111-8h66a11 11 0 0111 8l12 38" stroke="#0F5C44" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M36 44l5 24h78l5-24" stroke="#0F5C44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="78" width="132" height="18" rx="5" stroke="#0F5C44" strokeWidth="2.5" />
        <circle cx="38" cy="98" r="9" stroke="#0F5C44" strokeWidth="2.5" />
        <circle cx="122" cy="98" r="9" stroke="#0F5C44" strokeWidth="2.5" />
        {/* Damage marker */}
        {intervention === "vitre" ? (
          <>
            <line x1="58" y1="30" x2="72" y2="52" stroke="#D85A30" strokeWidth="2" strokeLinecap="round" />
            <line x1="72" y1="30" x2="58" y2="52" stroke="#D85A30" strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1="28" x2="65" y2="54" stroke="#D85A30" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="52" y1="41" x2="78" y2="41" stroke="#D85A30" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : intervention === "reparation" ? (
          <circle cx="80" cy="42" r="7" stroke="#D85A30" strokeWidth="2.5" strokeDasharray="4 3" />
        ) : (
          <path d="M45 35 Q70 28 95 38 Q110 44 115 52" stroke="#D85A30" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}

/* Partner unlock modal */
function UnlockModal({ demande, onClose, onUnlocked }: { demande: Demande; onClose: () => void; onUnlocked: () => void }) {
  const router = useRouter();
  const tokenCost = calcTokenCost(demande.intervention, demande.insurance);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,33,27,.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] p-8 w-full max-w-[420px] animate-mgPop"
        style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <span className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-3" style={{ background: "#E8F6F0" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="#1D9E75" strokeWidth="2" />
              <path d="M8 11V8a4 4 0 018 0" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="m-0 text-[20px] font-extrabold">Débloquer cette fiche</h2>
          <p className="m-0 mt-2 text-[14px] leading-relaxed" style={{ color: "#6B7280" }}>
            Révélez les coordonnées du client et commencez à discuter.
          </p>
        </div>

        <div className="rounded-[14px] p-4 mb-5" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[13.5px]" style={{ color: "#6B7280" }}>Coût du déblocage</span>
            <span className="font-extrabold text-[20px]" style={{ color: "#0F5C44" }}>{tokenCost} jeton{tokenCost > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-semibold text-[13px]" style={{ color: "#9aa39e" }}>
              {demande.insurance === "avec" ? "Client assuré · taux de conversion élevé" : "Client sans assurance"}
            </span>
          </div>
        </div>

        <button
          onClick={() => { onUnlocked(); onClose(); }}
          className="w-full py-3.5 rounded-[11px] font-bold text-[15px] text-white border-0 cursor-pointer transition-opacity hover:opacity-90"
          style={{ background: "#1D9E75", boxShadow: "0 4px 14px rgba(29,158,117,.35)" }}
        >
          Confirmer — {tokenCost} jeton{tokenCost > 1 ? "s" : ""}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 bg-transparent border-0 font-bold text-[13.5px] cursor-pointer"
          style={{ color: "#6B7280" }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

/* Not partner modal */
function PartnerModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,33,27,.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] p-8 max-w-[400px] w-full animate-mgPop text-center"
        style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4" style={{ background: "#FCEDE7" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="#D85A30" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 018 0v3" stroke="#D85A30" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <h2 className="m-0 text-[20px] font-extrabold tracking-tight">Espace réservé aux partenaires</h2>
        <p className="mt-2.5 mb-6 text-[14px] leading-relaxed" style={{ color: "#6B7280" }}>
          Seuls les réparateurs partenaires peuvent débloquer les fiches clients.
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="w-full py-3 rounded-[11px] font-bold text-[14.5px] text-white border-0 cursor-pointer"
            style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
            onClick={() => { onClose(); router.push("/partenaire"); }}
          >
            Espace partenaire
          </button>
          <button
            className="w-full py-3 rounded-[11px] font-bold text-[14.5px] border-0 cursor-pointer"
            style={{ background: "#fff", color: "#11211B", border: "1px solid #EAEFED" }}
            onClick={() => { onClose(); router.push("/partenaire"); }}
          >
            Créer un compte partenaire
          </button>
        </div>
        <button onClick={onClose} className="mt-4 bg-transparent border-0 text-[13px] font-semibold cursor-pointer" style={{ color: "#9aa39e" }}>
          Annuler
        </button>
      </div>
    </div>
  );
}

export default function AnnoncePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [demande, setDemande] = useState<Demande | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const auth = typeof window !== "undefined" ? getAuth() : null;

  useEffect(() => {
    const all = [...getLocalDemandes(), ...DEMANDES];
    const found = all.find((d) => d.id === id);
    if (!found) { router.replace("/"); return; }
    setDemande(found);
    try {
      const stored = localStorage.getItem("mg_unlocked");
      const ids: string[] = stored ? JSON.parse(stored) : [];
      setUnlocked(ids.includes(found.id) || (found.isUnlocked ?? false));

      const counts: Record<string, number> = JSON.parse(localStorage.getItem("mg_unlock_counts") ?? "{}");
      const attributed: string[] = JSON.parse(localStorage.getItem("mg_attributed") ?? "[]");
      setIsBlocked((counts[found.id] ?? 0) >= 4 || attributed.includes(found.id));
    } catch {
      setUnlocked(found.isUnlocked ?? false);
    }
  }, [id, router]);

  if (!demande) return null;

  const interv = INTERVENTION_LABELS[demande.intervention];
  const tokenCost = calcTokenCost(demande.intervention, demande.insurance);
  const isPartner = auth?.role === "partenaire";
  const isParticulier = auth?.role === "particulier";

  function handleUnlockClick() {
    if (!auth) { setShowPartnerModal(true); return; }
    if (!isPartner) { setShowPartnerModal(true); return; }
    setShowUnlock(true);
  }

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />

      {showUnlock && (
        <UnlockModal
          demande={demande}
          onClose={() => setShowUnlock(false)}
          onUnlocked={() => setUnlocked(true)}
        />
      )}
      {showPartnerModal && <PartnerModal onClose={() => setShowPartnerModal(false)} />}
      {chatOpen && demande && (
        <ChatModal demande={demande} onClose={() => setChatOpen(false)} />
      )}

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-semibold mb-6" style={{ color: "#9aa39e" }}>
          <Link href="/" className="no-underline hover:underline" style={{ color: "#9aa39e" }}>Annonces</Link>
          <span>›</span>
          <span style={{ color: "#11211B" }}>{demande.title}</span>
        </div>

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          {/* Left — main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Photos client (vraies) ou illustration de substitution */}
            {demande.photos && demande.photos.length > 0 ? (
              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
                {/* Photo principale */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={demande.photos[0]}
                  alt="Photo du dégât"
                  className="w-full object-cover"
                  style={{ maxHeight: 300 }}
                />
                {/* Vignettes supplémentaires */}
                {demande.photos.length > 1 && (
                  <div className="flex gap-2 p-3" style={{ borderTop: "1px solid #EAEFED" }}>
                    {demande.photos.slice(1).map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={src}
                        alt={`Photo dégât ${i + 2}`}
                        className="w-20 h-16 object-cover rounded-[8px] cursor-pointer"
                        style={{ border: "1px solid #EAEFED" }}
                      />
                    ))}
                    <div className="text-[12px] font-semibold self-center ml-1" style={{ color: "#6B7280" }}>
                      {demande.photos.length} photo{demande.photos.length > 1 ? "s" : ""}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <DamageIllustration intervention={demande.intervention} />
            )}

            {/* Info card */}
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 rounded-[8px] px-[10px] py-1.5 text-[12.5px] font-bold"
                  style={{ background: demande.insurance === "avec" ? "#E8F6F0" : "#FCEDE7", color: demande.insurance === "avec" ? "#0F5C44" : "#B0431F" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    {demande.insurance === "avec" && <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
                  </svg>
                  {demande.insurance === "avec" ? "Avec assurance" : "Sans assurance"}
                </span>
                <span className="rounded-[8px] px-[10px] py-1.5 text-[12.5px] font-bold" style={{ background: interv.bg, color: interv.color }}>
                  {interv.label}
                </span>
                {demande.isNew && (
                  <span className="rounded-[8px] px-[10px] py-1.5 text-[12.5px] font-bold" style={{ background: "#FDE8E8", color: "#D8302F" }}>Nouveau</span>
                )}
              </div>

              <h1 className="m-0 text-[24px] font-extrabold tracking-tight">{demande.title}</h1>

              <div className="flex flex-wrap gap-4 mt-3 text-[13px] font-semibold" style={{ color: "#6B7280" }}>
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11Z" stroke="#9aa39e" strokeWidth="1.8"/><circle cx="12" cy="10" r="2.2" stroke="#9aa39e" strokeWidth="1.8"/></svg>
                  {demande.city} · {demande.distance}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#9aa39e" strokeWidth="1.8"/><path d="M12 8v4l2.5 1.5" stroke="#9aa39e" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  {demande.age}
                </span>
              </div>

              <div className="h-px my-5" style={{ background: "#EAEFED" }} />

              {/* Damage description */}
              <div className="mb-5">
                <h2 className="m-0 mb-2 text-[14px] font-extrabold uppercase tracking-wider" style={{ color: "#9aa39e" }}>Description du dégât</h2>
                <p className="m-0 text-[15px] leading-relaxed" style={{ color: "#11211B" }}>{demande.damage}</p>
              </div>

              {/* Zone */}
              {demande.damageZone && (
                <div className="mb-5">
                  <h2 className="m-0 mb-2 text-[14px] font-extrabold uppercase tracking-wider" style={{ color: "#9aa39e" }}>Zone touchée</h2>
                  <div className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13.5px] font-bold" style={{ background: "#F4F6F5", color: "#11211B" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 9h6v6H9z" stroke="#D85A30" strokeWidth="1.8"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#D85A30" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    {demande.damageZone}
                  </div>
                </div>
              )}

              {/* Availability */}
              {demande.availability && (
                <div>
                  <h2 className="m-0 mb-2 text-[14px] font-extrabold uppercase tracking-wider" style={{ color: "#9aa39e" }}>Disponibilités</h2>
                  <div className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13.5px] font-bold" style={{ background: "#F4F6F5", color: "#11211B" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="#1D9E75" strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    {demande.availability}
                  </div>
                </div>
              )}
            </div>

            {/* Back */}
            <Link href="/" className="no-underline">
              <button className="inline-flex items-center gap-2 bg-white rounded-[10px] px-4 py-2.5 font-bold text-[13.5px] cursor-pointer border" style={{ borderColor: "#EAEFED", color: "#6B7280" }}>
                ← Retour aux annonces
              </button>
            </Link>
          </div>

          {/* Right — action sidebar */}
          <div className="w-full lg:w-[320px] flex-shrink-0 sticky top-[92px] flex flex-col gap-4">
            {/* Contact card */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 4px 24px rgba(17,33,27,.08)" }}>
              <div className="text-[11.5px] font-extrabold uppercase tracking-wider mb-3" style={{ color: "#9aa39e" }}>Contact client</div>

              {unlocked ? (
                /* Revealed */
                <div className="flex flex-col gap-3">
                  {demande.clientName && (
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full inline-flex items-center justify-center font-extrabold text-[13px] text-white flex-shrink-0" style={{ background: "linear-gradient(150deg,#1D9E75,#0F5C44)" }}>
                        {demande.clientName.charAt(0)}
                      </span>
                      <span className="font-bold text-[15px]">{demande.clientName}</span>
                    </div>
                  )}
                  <a href={`tel:${(demande.phone ?? "06 00 00 00 00").replace(/\s/g, "")}`}
                    className="no-underline flex items-center gap-3 rounded-[11px] px-3.5 py-3 font-bold text-[13.5px] transition-colors hover:bg-[#E8F6F0]"
                    style={{ background: "#F4F6F5", color: "#0F5C44" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2a11.5 11.5 0 003.6.7c.6 0 1 .4 1 1V19c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.7 3.6.1.3 0 .7-.2 1l-2.4 2.2Z" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {demande.phone ?? "06 84 21 55 09"}
                  </a>
                  <a href={`mailto:${demande.email ?? "contact@email.com"}`}
                    className="no-underline flex items-center gap-3 rounded-[11px] px-3.5 py-3 font-bold text-[13.5px] transition-colors hover:bg-[#E8F6F0]"
                    style={{ background: "#F4F6F5", color: "#0F5C44" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="#1D9E75" strokeWidth="1.8"/><path d="M22 6l-10 7L2 6" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    {demande.email ?? "contact@email.com"}
                  </a>
                  <button
                    onClick={() => setChatOpen(true)}
                    className="w-full py-3 rounded-[11px] font-bold text-[14px] text-white border-0 cursor-pointer transition-opacity hover:opacity-90"
                    style={{ background: "#11211B" }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                      Discuter
                    </span>
                  </button>
                </div>
              ) : (
                /* Blurred */
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-[11px] px-3.5 py-3" style={{ background: "#F4F6F5" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2a11.5 11.5 0 003.6.7c.6 0 1 .4 1 1V19c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.7 3.6.1.3 0 .7-.2 1l-2.4 2.2Z" stroke="#9aa39e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-bold text-[13.5px] select-none" style={{ filter: "blur(6px)", color: "#11211B" }}>06 84 21 55 09</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-[11px] px-3.5 py-3" style={{ background: "#F4F6F5" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="#9aa39e" strokeWidth="1.8"/><path d="M22 6l-10 7L2 6" stroke="#9aa39e" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    <span className="font-bold text-[13.5px] select-none" style={{ filter: "blur(6px)", color: "#11211B" }}>contact@email.com</span>
                  </div>
                  {isParticulier ? (
                    <Link href="/mes-demandes" className="no-underline">
                      <button className="w-full py-3 rounded-[11px] font-bold text-[14px] text-white border-0 cursor-pointer" style={{ background: "#1D9E75" }}>
                        Voir mes offres reçues →
                      </button>
                    </Link>
                  ) : isBlocked ? (
                    <div className="w-full py-3.5 rounded-[11px] font-bold text-[14px] text-center" style={{ background: "#F4F6F5", color: "#9aa39e", border: "1px solid #EAEFED" }}>
                      <span className="inline-flex items-center justify-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#9aa39e" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round"/></svg>
                        Fiche non disponible
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleUnlockClick}
                      className="w-full py-3.5 rounded-[11px] font-bold text-[15px] text-white border-0 cursor-pointer transition-opacity hover:opacity-90"
                      style={{ background: "#1D9E75", boxShadow: "0 4px 14px rgba(29,158,117,.35)" }}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                        Débloquer — {tokenCost} jeton{tokenCost > 1 ? "s" : ""}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Info pill */}
            <div className="rounded-[14px] px-4 py-3.5 flex items-start gap-3" style={{ background: "#E8F6F0", border: "1px solid #cdeadd" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="9" stroke="#0F5C44" strokeWidth="1.8"/>
                <path d="M12 8v4M12 15.5v.5" stroke="#0F5C44" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="m-0 text-[12.5px] font-semibold leading-relaxed" style={{ color: "#0F5C44" }}>
                {demande.insurance === "avec"
                  ? "Ce client est assuré bris de glace. L'intervention est prise en charge — taux de conversion élevé."
                  : "Ce client finance lui-même l'intervention. Proposez un devis compétitif."}
              </p>
            </div>

            {/* Token cost recap */}
            <div className="rounded-[14px] px-4 py-3.5" style={{ background: "#fff", border: "1px solid #EAEFED" }}>
              <div className="text-[11.5px] font-extrabold uppercase tracking-wider mb-2" style={{ color: "#9aa39e" }}>Coût du déblocage</div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[13.5px]" style={{ color: "#6B7280" }}>{interv.label}</span>
                <span className="font-extrabold text-[18px]" style={{ color: "#0F5C44" }}>{tokenCost} jeton{tokenCost > 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
