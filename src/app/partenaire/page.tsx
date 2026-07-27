"use client";

import { useState, useRef, useEffect } from "react";
import { tokenCost } from "@/lib/token-cost";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { DEMANDES as SEED_DEMANDES } from "@/data/demandes";
import { getLocalDemandes, onDemandesChange } from "@/lib/demandes-store";
import { signIn, signUp, setAuth as setGlobalAuth } from "@/lib/auth";
import { toast } from "@/components/Toast";
import { ChatModal } from "@/components/ChatModal";
import type { Demande } from "@/types";

/* ─── Types ─── */
type NavItem = "dashboard" | "demandes" | "debloquees" | "favoris" | "facturation" | "zone" | "avis" | "parametres" | "aide";
type Tab = "toutes" | "sans" | "avec" | "debloquees";
type AuthScreen = "choice" | "login" | "signup" | "dashboard";

const REGIONS = [
  "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne",
  "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France",
  "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie",
  "Pays de la Loire", "Provence-Alpes-Côte d'Azur",
];

const INTERVENTION_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  remplacement: { label: "Remplacement",   bg: "#EAF1FE", color: "#2563EB" },
  reparation:   { label: "Réparation",     bg: "#E8F6F0", color: "#1D9E75" },
  vitre:        { label: "Vitre latérale", bg: "#EDE9FE", color: "#6D28D9" },
};


/* ─── Token Modal ─── */
function TokenModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const PACKS = [
    { name: "1 jeton",   packId: "solo",      tokens: 1,  price: 10,  highlight: false, badge: "🎯" },
    { name: "Starter",   packId: "starter",   tokens: 3,  price: 24,  highlight: false, badge: "🚀" },
    { name: "Essentiel", packId: "essentiel", tokens: 10, price: 75,  highlight: false, badge: "⭐" },
    { name: "Pro",       packId: "pro",       tokens: 25, price: 175, highlight: true,  badge: "💎" },
  ];

  async function handleBuy(packId: string) {
    setLoading(packId);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur : " + (data.error ?? "Réponse inattendue"));
        setLoading(null);
      }
    } catch (err) {
      alert("Erreur réseau : " + String(err));
      setLoading(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.55)" }} onClick={onClose}>
      <div className="bg-white rounded-[20px] p-7 w-full max-w-[540px] animate-mgPop" style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="m-0 text-[20px] font-extrabold">Acheter des jetons</h2>
            <p className="m-0 mt-1 text-[13px] font-semibold" style={{ color: "#6B7280" }}>Sans date d'expiration · utilisez-les quand vous voulez.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center border-0 cursor-pointer text-lg" style={{ background: "#F4F6F5", color: "#6B7280" }}>✕</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PACKS.map((p) => (
            <div
              key={p.name}
              className="rounded-[16px] p-4 flex flex-col gap-2 relative"
              style={p.highlight
                ? { background: "linear-gradient(150deg,#0F5C44,#1D9E75)", color: "#fff", boxShadow: "0 8px 24px rgba(15,92,68,.28)" }
                : { border: "1px solid #EAEFED", background: "#fff" }
              }
            >
              <div className="font-extrabold text-[14px]">{p.badge} {p.name}</div>
              <div className="font-extrabold text-[28px] tracking-tight leading-none">
                {p.tokens}
                <span className={`text-[14px] font-semibold ml-1 ${p.highlight ? "opacity-80" : ""}`} style={!p.highlight ? { color: "#6B7280" } : {}}>jetons</span>
              </div>
              <div className="text-[22px] font-extrabold mt-1" style={!p.highlight ? { color: "#0F5C44" } : {}}>
                {p.price} €
              </div>
              <div className={`text-[11px] font-semibold ${p.highlight ? "opacity-80" : ""}`} style={!p.highlight ? { color: "#6B7280" } : {}}>
                {(p.price / p.tokens).toFixed(2).replace(".", ",")} €/jeton · sans expiration
              </div>
              <button
                onClick={() => handleBuy(p.packId)}
                disabled={loading !== null}
                className="mt-2 w-full py-2.5 rounded-[10px] font-bold text-[13.5px] border-0 cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60"
                style={p.highlight
                  ? { background: "#fff", color: "#0F5C44" }
                  : { background: "#1D9E75", color: "#fff", boxShadow: "0 4px 12px rgba(29,158,117,.25)" }
                }
              >
                {loading === p.packId ? "…" : "Choisir"}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-[11.5px] font-semibold mt-4" style={{ color: "#9aa39e" }}>
          Paiement sécurisé par Stripe · Facturation disponible dans votre espace
        </p>
      </div>
    </div>
  );
}

/* ─── Navbar partenaire ─── */
/* ─── Notifications ─── */
interface Notif {
  id: number;
  type: "new_demande" | "message" | "devis_accepted" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  navTarget: NavItem;
}

const NOTIFS_SEED: Notif[] = [
  { id: 1, type: "new_demande",    title: "Nouvelle demande près de vous",   body: "Peugeot 308 · Impact pare-brise · Lyon 7e",               time: "il y a 3 min",   read: false, navTarget: "demandes"    },
  { id: 2, type: "message",        title: "Nouveau message client",           body: "Marie L. : « Bonjour, êtes-vous disponible demain ? »",   time: "il y a 14 min",  read: false, navTarget: "debloquees"  },
  { id: 3, type: "devis_accepted", title: "Devis accepté 🎉",                 body: "Thomas R. a accepté votre offre de 280 €",               time: "il y a 1h",      read: false, navTarget: "debloquees"  },
  { id: 4, type: "new_demande",    title: "Nouvelle demande près de vous",   body: "Citroën C3 · Vitre latérale · Villeurbanne",             time: "il y a 2h",      read: true,  navTarget: "demandes"    },
  { id: 5, type: "system",         title: "Solde faible",                    body: "Il vous reste 2 jetons. Rechargez pour ne rien rater.",   time: "il y a 4h",      read: true,  navTarget: "facturation" },
];

const NOTIF_ICONS: Record<Notif["type"], React.ReactNode> = {
  new_demande:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  message:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#1D9E75" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  devis_accepted: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z" stroke="#1D9E75" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  system:         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#D85A30" strokeWidth="1.8"/><path d="M12 8v4M12 16v.5" stroke="#D85A30" strokeWidth="2" strokeLinecap="round"/></svg>,
};
const NOTIF_BG: Record<Notif["type"], string> = {
  new_demande: "#EAF1FE", message: "#E8F6F0", devis_accepted: "#E8F6F0", system: "#FCEDE7",
};

function NotifPanel({ onNavigate }: { onNavigate: (nav: NavItem) => void }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(NOTIFS_SEED);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function markRead(id: number) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }
  function dismiss(id: number) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((v) => !v); }}
        className="relative w-[42px] h-[42px] rounded-[11px] flex items-center justify-center cursor-pointer transition-colors hover:bg-[#F4F6F5]"
        style={{ border: "1px solid #EAEFED", background: open ? "#F4F6F5" : "#fff" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6Z" stroke="#11211B" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M9.5 19a2.5 2.5 0 005 0" stroke="#11211B" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-white px-1" style={{ background: "#D85A30" }}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] w-[360px] bg-white rounded-[16px] overflow-hidden animate-mgPop z-50"
          style={{ border: "1px solid #EAEFED", boxShadow: "0 16px 48px rgba(17,33,27,.18)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid #EAEFED" }}>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[15px]">Notifications</span>
              {unread > 0 && (
                <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white" style={{ background: "#D85A30" }}>{unread}</span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="bg-transparent border-0 text-[12.5px] font-bold cursor-pointer" style={{ color: "#1D9E75" }}>
                Tout marquer lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
            {notifs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-[13.5px] font-semibold" style={{ color: "#6B7280" }}>Aucune notification</p>
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => { markRead(n.id); setOpen(false); onNavigate(n.navTarget); }}
                  className="flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-[#FAFBFB] relative"
                  style={{ borderBottom: "1px solid #F4F6F5", background: n.read ? "#fff" : "#FDFEFF" }}
                >
                  {/* Point non lu */}
                  {!n.read && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "#1D9E75" }} />
                  )}
                  <span className="flex-shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center mt-0.5" style={{ background: NOTIF_BG[n.type] }}>
                    {NOTIF_ICONS[n.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[13px]" style={{ color: n.read ? "#6B7280" : "#11211B" }}>{n.title}</div>
                    <div className="text-[12.5px] font-medium truncate mt-0.5" style={{ color: "#9aa39e" }}>{n.body}</div>
                    <div className="text-[11.5px] font-semibold mt-1" style={{ color: "#cdd6d1" }}>{n.time}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-transparent border-0 cursor-pointer text-[14px] leading-none hover:bg-[#F4F6F5]"
                    style={{ color: "#cdd6d1" }}
                  >✕</button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid #EAEFED" }}>
              <button onClick={() => setNotifs([])} className="bg-transparent border-0 text-[12.5px] font-semibold cursor-pointer" style={{ color: "#9aa39e" }}>
                Effacer toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PartnerNav({ tokens, onBuy, onNavigate }: { tokens: number; onBuy: () => void; onNavigate: (nav: NavItem) => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid #EAEFED" }}>
      <div className="max-w-[1320px] mx-auto px-6 flex items-center gap-5" style={{ height: 68 }}>
        <Link href="/"><Logo /></Link>
        <span className="text-[13px] font-semibold" style={{ color: "#6B7280" }}>Espace réparateur</span>
        <div className="flex-1" />
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 pl-3.5" style={{ background: "#E8F6F0", border: "1px solid #cdeadd" }}>
          <span className="text-[13px] font-semibold" style={{ color: "#0F5C44" }}>Solde</span>
          <span className="font-extrabold text-[15px]" style={{ color: "#0F5C44" }}>{tokens} jeton{tokens > 1 ? "s" : ""}</span>
          <button onClick={onBuy} className="text-white rounded-full px-3 py-1.5 text-[12.5px] font-bold border-0 cursor-pointer" style={{ background: "#1D9E75" }}>Acheter</button>
        </div>
        <NotifPanel onNavigate={onNavigate} />
        <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-extrabold text-[14px] text-white" style={{ background: "linear-gradient(150deg,#1D9E75,#0F5C44)" }}>VP</div>
      </div>
    </header>
  );
}

/* ─── Sidebar ─── */
function Sidebar({ active, onChange, countAll }: { active: NavItem; onChange: (n: NavItem) => void; countAll: number }) {
  const items: { id: NavItem; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard",   label: "Tableau de bord",     icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8"/></svg> },
    { id: "demandes",    label: "Toutes les demandes",  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, badge: countAll },
    { id: "debloquees",  label: "Fiches débloquées",    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 11V8a4 4 0 018 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { id: "favoris",     label: "Favoris",               icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 17.3l-5.4 3 1-6L3 10l6-.9L12 4l3 5.1 6 .9-4.6 4.3 1 6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg> },
    { id: "facturation", label: "Jetons & facturation",  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7.5v9M9.5 9.5h4a1.8 1.8 0 010 3.5h-3a1.8 1.8 0 000 3.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
    { id: "zone",        label: "Ma zone d'activité",   icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8"/></svg> },
    { id: "avis",        label: "Mes avis clients",     icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 15.4l-4.2 2.3.8-4.7L5 9.6l4.7-.7L12 4.6l2.3 4.3 4.7.7-3.6 3.4.8 4.7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg> },
  ];

  return (
    <aside className="flex-shrink-0 w-[232px] sticky top-[92px] py-6">
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex items-center justify-between gap-2.5 rounded-[10px] px-3.5 py-2.5 text-[13.5px] font-semibold cursor-pointer border-0 transition-colors text-left w-full"
              style={isActive
                ? { background: "#E8F6F0", color: "#0F5C44", fontWeight: 700 }
                : { background: "transparent", color: "#3d4b44" }
              }
            >
              <span className="flex items-center gap-2.5">{item.icon}{item.label}</span>
              {item.badge !== undefined && (
                <span className="text-white rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: "#1D9E75" }}>{item.badge}</span>
              )}
            </button>
          );
        })}
        <div className="h-px my-2 mx-3.5" style={{ background: "#EAEFED" }} />
        {(["parametres", "aide"] as NavItem[]).map((id) => (
          <button key={id} onClick={() => onChange(id)} className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-[13.5px] font-semibold cursor-pointer border-0 transition-colors text-left w-full" style={active === id ? { background: "#E8F6F0", color: "#0F5C44", fontWeight: 700 } : { background: "transparent", color: "#3d4b44" }}>
            {id === "parametres"
              ? <><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3L5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>Paramètres</>
              : <><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.2M12 17.2v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>Aide</>}
          </button>
        ))}

        {/* Pied de sidebar — Tarifs */}
        <div className="mt-auto pt-6 mx-3.5">
          <div className="h-px mb-3" style={{ background: "#EAEFED" }} />
          <Link href="/tarifs" className="no-underline flex items-center gap-2 text-[12.5px] font-semibold transition-colors hover:text-[#0F5C44]" style={{ color: "#9aa39e" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 7.5v9M9.5 9.5h4a1.8 1.8 0 010 3.5h-3a1.8 1.8 0 000 3.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Tarifs & jetons
          </Link>
        </div>
      </nav>
    </aside>
  );
}

/* ─── MetricCard ─── */
function MetricCard({ icon, iconBg, label, value, sub, subColor }: { icon: React.ReactNode; iconBg: string; label: string; value: string; sub: string; subColor: string }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
      <div className="flex items-center gap-2 text-[12.5px] font-bold mb-3" style={{ color: "#6B7280" }}>
        <span className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: iconBg }}>{icon}</span>
        {label}
      </div>
      <div className="text-[32px] font-extrabold tracking-tight leading-none">{value}</div>
      <div className="text-[12.5px] font-bold mt-1" style={{ color: subColor }}>{sub}</div>
    </div>
  );
}

/* ─── FeedList (controlled state lifted to PartenairePage) ─── */
interface FeedListProps {
  tab: Tab;
  tokens: number;
  onTokenSpent: (cost: number) => void;
  unlocked: Set<string>;
  favs: Set<string>;
  onUnlock: (id: string) => void;
  onToggleFav: (id: string) => void;
  attributedToMe: Set<string>;
  attributedElsewhere: Set<string>;
  onAttributed: (id: string) => void;
  demandes: Demande[];
  globalUnlockCounts: Record<string, number>;
}

function FeedList({ tab, tokens, onTokenSpent, unlocked, favs, onUnlock, onToggleFav, attributedToMe, attributedElsewhere, onAttributed, demandes, globalUnlockCounts }: FeedListProps) {
  const [chatDemande, setChatDemande]     = useState<Demande | null>(null);
  const [justUnlocked, setJustUnlocked]   = useState<string | null>(null);
  const [confirmDemande, setConfirmDemande] = useState<Demande | null>(null);

  const items = demandes.filter((d) => {
    if (tab === "sans")       return d.insurance === "sans";
    if (tab === "avec")       return d.insurance === "avec";
    if (tab === "debloquees") return unlocked.has(d.id);
    return true;
  });

  return (
    <>
    {chatDemande && (
      <ChatModal
        demande={chatDemande}
        onClose={() => setChatDemande(null)}
        onAttributed={(id) => { onAttributed(id); }}
        isBlocked={attributedElsewhere.has(chatDemande.id)}
      />
    )}

    {/* Modale confirmation déblocage */}
    {confirmDemande && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.55)" }} onClick={() => setConfirmDemande(null)}>
        <div className="bg-white rounded-[20px] p-7 max-w-[380px] w-full animate-mgPop" style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex w-11 h-11 rounded-[13px] items-center justify-center flex-shrink-0" style={{ background: "#E8F6F0" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="#1D9E75" strokeWidth="2"/>
                <path d="M8 11V8a4 4 0 018 0" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <div>
              <div className="font-extrabold text-[16px]">Débloquer cette fiche ?</div>
              <div className="text-[13px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>{confirmDemande.title}</div>
            </div>
          </div>
          <div className="rounded-[12px] p-4 mb-5" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold" style={{ color: "#6B7280" }}>Coût du déblocage</span>
              <span className="font-extrabold text-[20px]" style={{ color: "#0F5C44" }}>{tokenCost(confirmDemande.intervention, confirmDemande.insurance)} jeton{tokenCost(confirmDemande.intervention, confirmDemande.insurance) > 1 ? "s" : ""}</span>
            </div>
            <div className="text-[12px] font-semibold mt-1" style={{ color: "#9aa39e" }}>
              {INTERVENTION_LABELS[confirmDemande.intervention]?.label} · {confirmDemande.insurance === "avec" ? "Client assuré" : "Sans assurance"}
            </div>
            <div className="text-[12px] font-semibold mt-0.5" style={{ color: "#9aa39e" }}>
              Solde actuel : <b style={{ color: "#11211B" }}>{tokens} jetons</b> → après : <b style={{ color: "#0F5C44" }}>{tokens - tokenCost(confirmDemande.intervention, confirmDemande.insurance)} jetons</b>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => setConfirmDemande(null)} className="flex-1 py-3 rounded-[11px] font-bold text-[14px] border-0 cursor-pointer" style={{ background: "#F4F6F5", color: "#6B7280" }}>
              Annuler
            </button>
            <button
              onClick={() => {
                const cost = tokenCost(confirmDemande.intervention, confirmDemande.insurance);
                onUnlock(confirmDemande.id);
                onTokenSpent(cost);
                setJustUnlocked(confirmDemande.id);
                setTimeout(() => setJustUnlocked(null), 4000);
                setConfirmDemande(null);
              }}
              className="flex-1 py-3 rounded-[11px] font-bold text-[14px] text-white border-0 cursor-pointer"
              style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
            >
              Confirmer — {tokenCost(confirmDemande.intervention, confirmDemande.insurance)} jeton{tokenCost(confirmDemande.intervention, confirmDemande.insurance) > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center font-semibold" style={{ color: "#6B7280", border: "1px solid #EAEFED" }}>
          Aucune demande dans cet onglet.
        </div>
      )}
      {items.map((d) => {
        const isInsured      = d.insurance === "avec";
        const isUnlocked     = unlocked.has(d.id);
        const isFav          = favs.has(d.id);
        const interv         = INTERVENTION_LABELS[d.intervention];
        const isMyWin        = attributedToMe.has(d.id);
        const isOtherWin     = attributedElsewhere.has(d.id);
        const unlockCount    = globalUnlockCounts[d.id] ?? 0;
        const isAttributed   = isMyWin || isOtherWin;
        const isFull         = unlockCount >= 4;

        return (
          <article
            key={d.id}
            className="bg-white rounded-[14px] px-4 py-4 flex items-center gap-4 flex-wrap cursor-pointer hover:shadow-md transition-shadow"
            style={{
              border: isMyWin ? "1.5px solid #1D9E75" : isOtherWin ? "1.5px solid #cdd6d1" : "1px solid #EAEFED",
              boxShadow: "0 1px 3px rgba(17,33,27,.04)",
              opacity: isOtherWin ? 0.75 : 1,
            }}
            onClick={() => { if (!isOtherWin && !isFull) window.open(`/annonce/${d.id}`, "_self"); }}
          >
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {isInsured ? (
                  <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>Avec assurance</span>
                ) : (
                  <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#FCEDE7", color: "#B0431F" }}>Sans assurance</span>
                )}
                <span className="inline-flex items-center gap-1 rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#FFF7E8", color: "#B7791F" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#B7791F" strokeWidth="1.8"/><path d="M12 8.5v7M10 10.5h2.6a1.4 1.4 0 010 2.8H10m0 0h2.8" stroke="#B7791F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {tokenCost(d.intervention, d.insurance)} jeton{tokenCost(d.intervention, d.insurance) > 1 ? "s" : ""}
                </span>
                <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: interv.bg, color: interv.color }}>{interv.label}</span>
                {d.isNew && !isOtherWin && !isMyWin && (
                  <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#FDE8E8", color: "#D8302F" }}>Nouveau</span>
                )}
                {isMyWin && (
                  <span className="inline-flex items-center gap-1 rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#0F5C44" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Attribuée — votre offre
                  </span>
                )}
                {isOtherWin && (
                  <span className="inline-flex items-center gap-1 rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#F4F6F5", color: "#9aa39e" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#9aa39e" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round"/></svg>
                    Attribuée à un autre réparateur
                  </span>
                )}
              </div>
              <div className="font-extrabold text-[15px]">{d.title}</div>
              <div className="text-[12.5px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>{d.city} · {d.distance} · {d.age}</div>
            </div>

            <div className="flex items-center gap-3">
              {!isOtherWin && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFav(d.id); }}
                  className="text-[20px] border-0 bg-transparent cursor-pointer transition-colors"
                  style={{ color: isFav ? "#F5A623" : "#cdd6d1" }}
                >★</button>
              )}

              {/* ── CAS 1 : attribuée à un autre partenaire ── */}
              {isOtherWin && (
                <div className="flex items-center gap-2 rounded-[10px] px-4 py-2.5" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#9aa39e" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span className="text-[13px] font-bold" style={{ color: "#9aa39e" }}>Fiche non disponible</span>
                </div>
              )}

              {/* ── CAS 2 : ma fiche gagnée ── */}
              {isMyWin && (
                <>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase" style={{ color: "#9aa39e" }}>Tél.</span>
                    <span className="font-bold text-[13px]" style={{ color: "#0F5C44" }}>06 84 21 55 09</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase" style={{ color: "#9aa39e" }}>Email</span>
                    <span className="font-bold text-[13px]" style={{ color: "#0F5C44" }}>contact@email.fr</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setChatDemande(d); }} className="inline-flex items-center gap-1.5 text-white rounded-[10px] px-3 py-2 font-bold text-[12.5px] border-0 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#0F5C44" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                    Continuer la discussion
                  </button>
                </>
              )}

              {/* ── CAS 3 : débloquée normalement (pas encore attribuée) ── */}
              {!isMyWin && !isOtherWin && isUnlocked && (
                <>
                  {justUnlocked === d.id && (
                    <div className="absolute inset-x-0 top-0 flex items-center gap-2 px-4 py-2 rounded-t-[14px] text-[12.5px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#0F5C44" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Fiche débloquée — coordonnées visibles ci-dessous
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase" style={{ color: "#9aa39e" }}>Tél.</span>
                    <span className="font-bold text-[13px]" style={{ color: "#0F5C44" }}>06 84 21 55 09</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase" style={{ color: "#9aa39e" }}>Email</span>
                    <span className="font-bold text-[13px]" style={{ color: "#0F5C44" }}>contact@email.fr</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setChatDemande(d); }} className="inline-flex items-center gap-1.5 text-white rounded-[10px] px-3 py-2 font-bold text-[12.5px] border-0 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#11211B" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                    Discuter
                  </button>
                </>
              )}

              {/* ── CAS 4 : non débloquée et pas attribuée ── */}
              {!isMyWin && !isOtherWin && !isUnlocked && (
                <>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase" style={{ color: "#9aa39e" }}>Tél.</span>
                    <span className="font-bold text-[13px] select-none" style={{ filter: "blur(5px)" }}>06 11 22 33</span>
                  </div>
                  {isFull ? (
                    <span className="inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 font-bold text-[12.5px] whitespace-nowrap" style={{ background: "#F4F6F5", color: "#9aa39e" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#9aa39e" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round"/></svg>
                      Complet — 4/4 réparateurs
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDemande(d); }}
                      disabled={tokens <= 0}
                      className="inline-flex items-center gap-2 text-white rounded-[10px] px-4 py-2.5 font-bold text-[13px] border-0 cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.25)" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                      Débloquer — {tokenCost(d.intervention, d.insurance)} jeton{tokenCost(d.intervention, d.insurance) > 1 ? "s" : ""}
                    </button>
                  )}
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
    </>
  );
}

/* ─── Dashboard view ─── */
function DashboardView({ tokens, onBuy, unlocked, favs, onUnlock, onToggleFav, attributedToMe, attributedElsewhere, onAttributed, demandes, globalUnlockCounts }: {
  tokens: number; onBuy: () => void;
  unlocked: Set<string>; favs: Set<string>;
  onUnlock: (id: string) => void; onToggleFav: (id: string) => void;
  attributedToMe: Set<string>; attributedElsewhere: Set<string>; onAttributed: (id: string) => void;
  demandes: Demande[];
  globalUnlockCounts: Record<string, number>;
}) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Bonjour, Vitro Pro Lyon 👋</h1>
        <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>Voici l'activité de votre zone aujourd'hui.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <MetricCard
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6Z" stroke="#D8302F" strokeWidth="1.8" strokeLinejoin="round"/></svg>}
          iconBg="#FDE8E8" label="Nouvelles demandes" value="12" sub="dans votre zone aujourd'hui" subColor="#1D9E75"
        />
        <MetricCard
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#1D9E75" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          iconBg="#E8F6F0" label="Fiches débloquées" value={String(unlocked.size || 8)} sub="ce mois-ci" subColor="#6B7280"
        />
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(150deg,#0F5C44,#1D9E75)", boxShadow: "0 6px 20px rgba(15,92,68,.22)" }}>
          <div className="flex items-center gap-2 text-[12.5px] font-bold opacity-90 mb-3">
            <span className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: "rgba(255,255,255,.18)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#fff" strokeWidth="1.8"/><path d="M12 7.5v9M9.5 9.5h4a1.8 1.8 0 010 3.5h-3a1.8 1.8 0 000 3.5h4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </span>
            Jetons restants
          </div>
          <div className="text-[32px] font-extrabold tracking-tight leading-none">{tokens}</div>
          <div className="text-[12.5px] font-bold mt-1 opacity-90">sans date d'expiration</div>
        </div>
      </div>

      {/* Token bar */}
      <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 flex-wrap mb-6" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[14px]">Votre solde de jetons</span>
            <span className="font-extrabold text-[14px]" style={{ color: "#0F5C44" }}>{tokens} jetons</span>
          </div>
          <div className="h-[9px] rounded-full overflow-hidden" style={{ background: "#EEF2F0" }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min((tokens / 35) * 100, 100)}%`, background: "linear-gradient(90deg,#1D9E75,#0F5C44)" }} />
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[12px] font-semibold" style={{ color: "#6B7280" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#9aa39e" strokeWidth="1.8"/><path d="M12 7v5l3 2" stroke="#9aa39e" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Vos jetons n'expirent jamais.
          </div>
        </div>
        <button onClick={onBuy} className="text-white rounded-[11px] px-6 py-3 font-bold text-[14px] border-0 cursor-pointer" style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}>Acheter des jetons</button>
      </div>

      {/* Recent feed preview */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="m-0 text-[17px] font-extrabold">Dernières demandes</h2>
        <span className="text-[13px] font-bold cursor-pointer" style={{ color: "#1D9E75" }}>Voir toutes →</span>
      </div>
      <FeedList tab="toutes" tokens={tokens} onTokenSpent={(_cost) => {}} unlocked={unlocked} favs={favs} onUnlock={onUnlock} onToggleFav={onToggleFav} attributedToMe={attributedToMe} attributedElsewhere={attributedElsewhere} onAttributed={onAttributed} demandes={demandes} globalUnlockCounts={globalUnlockCounts} />
    </div>
  );
}

/* ─── Demandes view (with tabs) ─── */
function DemandesView({ tokens, onTokenSpent, unlocked, favs, onUnlock, onToggleFav, attributedToMe, attributedElsewhere, onAttributed, demandes, globalUnlockCounts }: {
  tokens: number; onTokenSpent: (cost: number) => void;
  unlocked: Set<string>; favs: Set<string>;
  onUnlock: (id: string) => void; onToggleFav: (id: string) => void;
  attributedToMe: Set<string>; attributedElsewhere: Set<string>; onAttributed: (id: string) => void;
  demandes: Demande[];
  globalUnlockCounts: Record<string, number>;
}) {
  const [tab, setTab] = useState<Tab>("toutes");
  const tabs: { id: Tab; label: string }[] = [
    { id: "toutes",     label: "Toutes" },
    { id: "sans",       label: "Sans assurance" },
    { id: "avec",       label: "Assurés" },
    { id: "debloquees", label: "Débloquées" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <h2 className="m-0 text-[17px] font-extrabold">Demandes de votre zone</h2>
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="rounded-[9px] px-3.5 py-2 text-[13px] font-bold border-0 cursor-pointer transition-all"
              style={tab === t.id
                ? { background: "#1D9E75", color: "#fff" }
                : { background: "#fff", color: "#3d4b44", border: "1px solid #EAEFED" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <FeedList tab={tab} tokens={tokens} onTokenSpent={onTokenSpent} unlocked={unlocked} favs={favs} onUnlock={onUnlock} onToggleFav={onToggleFav} attributedToMe={attributedToMe} attributedElsewhere={attributedElsewhere} onAttributed={onAttributed} demandes={demandes} globalUnlockCounts={globalUnlockCounts} />
    </div>
  );
}

/* ─── Débloquées view ─── */
function DebloquéesView({ unlocked, favs, onToggleFav, demandes }: { unlocked: Set<string>; favs: Set<string>; onToggleFav: (id: string) => void; demandes: Demande[] }) {
  const [chatDemande, setChatDemande] = useState<Demande | null>(null);
  const items = demandes.filter((d) => unlocked.has(d.id));

  return (
    <>
    {chatDemande && <ChatModal demande={chatDemande} onClose={() => setChatDemande(null)} />}
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Fiches débloquées</h1>
        <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>Les coordonnées clients que vous avez débloquées.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center" style={{ border: "1px solid #EAEFED" }}>
          <div className="text-[40px] mb-3">🔐</div>
          <div className="font-extrabold text-[16px] mb-1">Aucune fiche débloquée</div>
          <div className="text-[13.5px] font-semibold" style={{ color: "#6B7280" }}>Déverrouillez des demandes depuis l'onglet "Toutes les demandes".</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((d) => {
            const isInsured = d.insurance === "avec";
            const isFav     = favs.has(d.id);
            const interv    = INTERVENTION_LABELS[d.intervention];
            return (
              <article key={d.id} className="bg-white rounded-[14px] p-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {isInsured ? (
                        <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>Avec assurance</span>
                      ) : (
                        <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#FCEDE7", color: "#B0431F" }}>Sans assurance</span>
                      )}
                      <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: interv.bg, color: interv.color }}>{interv.label}</span>
                    </div>
                    <div className="font-extrabold text-[16px]">{d.title}</div>
                    <div className="text-[12.5px] font-semibold mt-0.5 mb-3" style={{ color: "#6B7280" }}>{d.city} · {d.distance} · {d.age}</div>

                    <div className="rounded-[12px] p-4 flex gap-6 flex-wrap" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
                      <div>
                        <div className="text-[10.5px] font-bold uppercase mb-0.5" style={{ color: "#9aa39e" }}>Téléphone</div>
                        <div className="font-extrabold text-[14px]" style={{ color: "#0F5C44" }}>06 84 21 55 09</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] font-bold uppercase mb-0.5" style={{ color: "#9aa39e" }}>Email</div>
                        <div className="font-extrabold text-[14px]" style={{ color: "#0F5C44" }}>contact@email.fr</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] font-bold uppercase mb-0.5" style={{ color: "#9aa39e" }}>Débloqué le</div>
                        <div className="font-bold text-[13px]">aujourd'hui</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleFav(d.id)}
                      className="text-[22px] border-0 bg-transparent cursor-pointer"
                      style={{ color: isFav ? "#F5A623" : "#cdd6d1" }}
                    >★</button>
                    <button onClick={() => setChatDemande(d)} className="inline-flex items-center gap-1.5 text-white rounded-[10px] px-4 py-2.5 font-bold text-[13px] border-0 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#11211B" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                      Discuter
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}

/* ─── Favoris view ─── */
function FavorisView({ favs, unlocked, onToggleFav, demandes }: { favs: Set<string>; unlocked: Set<string>; onToggleFav: (id: string) => void; demandes: Demande[] }) {
  const items = demandes.filter((d) => favs.has(d.id));

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Favoris</h1>
        <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>Les demandes que vous avez mises en favoris.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center" style={{ border: "1px solid #EAEFED" }}>
          <div className="text-[40px] mb-3">⭐</div>
          <div className="font-extrabold text-[16px] mb-1">Aucun favori</div>
          <div className="text-[13.5px] font-semibold" style={{ color: "#6B7280" }}>Cliquez sur l'étoile ★ d'une demande pour la garder en vue.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((d) => {
            const isInsured  = d.insurance === "avec";
            const isUnlocked = unlocked.has(d.id);
            const interv     = INTERVENTION_LABELS[d.intervention];
            return (
              <article key={d.id} className="bg-white rounded-[14px] px-4 py-4 flex items-center gap-4 flex-wrap" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {isInsured ? (
                      <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>Avec assurance</span>
                    ) : (
                      <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: "#FCEDE7", color: "#B0431F" }}>Sans assurance</span>
                    )}
                    <span className="rounded-[7px] px-2 py-0.5 text-[11.5px] font-bold" style={{ background: interv.bg, color: interv.color }}>{interv.label}</span>
                  </div>
                  <div className="font-extrabold text-[15px]">{d.title}</div>
                  <div className="text-[12.5px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>{d.city} · {d.distance} · {d.age}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => onToggleFav(d.id)} className="text-[20px] border-0 bg-transparent cursor-pointer" style={{ color: "#F5A623" }}>★</button>
                  {isUnlocked ? (
                    <button className="inline-flex items-center gap-1.5 text-white rounded-[10px] px-3 py-2 font-bold text-[12.5px] border-0 cursor-pointer" style={{ background: "#11211B" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                      Discuter
                    </button>
                  ) : (
                    <span className="text-[12.5px] font-semibold" style={{ color: "#9aa39e" }}>Non débloquée</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Facturation view ─── */
const HISTORIQUE = [
  { id: "FAC-2026-0043", date: "12 juin 2026", pack: "Pack Pro",        jetons: 25, montant: "175,00 €", statut: "Payé" },
  { id: "FAC-2026-0021", date: "3 mai 2026",   pack: "Pack Essentiel", jetons: 10, montant: "75,00 €",  statut: "Payé" },
  { id: "FAC-2026-0008", date: "14 avr. 2026", pack: "Pack Starter",   jetons: 3,  montant: "24,00 €",  statut: "Payé" },
];

function FacturationView({ tokens, onBuy }: { tokens: number; onBuy: () => void }) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Jetons & facturation</h1>
        <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>Gérez votre solde et téléchargez vos factures.</p>
      </div>

      {/* Solde actuel */}
      <div className="rounded-2xl p-6 text-white mb-6 flex items-center justify-between flex-wrap gap-4" style={{ background: "linear-gradient(150deg,#0F5C44,#1D9E75)", boxShadow: "0 6px 20px rgba(15,92,68,.22)" }}>
        <div>
          <div className="text-[13px] font-bold opacity-80 mb-1">Solde actuel</div>
          <div className="text-[44px] font-extrabold tracking-tight leading-none">{tokens} <span className="text-[22px] font-bold opacity-80">jetons</span></div>
          <div className="text-[12.5px] font-semibold mt-2 opacity-80">Sans date d'expiration · débloquent contacts clients</div>
        </div>
        <button onClick={onBuy} className="rounded-[13px] px-7 py-3.5 font-bold text-[14.5px] border-0 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#fff", color: "#0F5C44", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
          Acheter des jetons
        </button>
      </div>

      {/* Jauge */}
      <div className="bg-white rounded-2xl px-5 py-4 mb-6" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-[14px]">Utilisation ce mois-ci</span>
          <span className="text-[13px] font-semibold" style={{ color: "#6B7280" }}>8 jetons consommés</span>
        </div>
        <div className="h-[9px] rounded-full overflow-hidden" style={{ background: "#EEF2F0" }}>
          <div className="h-full rounded-full" style={{ width: "23%", background: "linear-gradient(90deg,#1D9E75,#0F5C44)" }} />
        </div>
        <div className="flex justify-between mt-2 text-[11.5px] font-semibold" style={{ color: "#9aa39e" }}>
          <span>0</span><span>35 achetés</span>
        </div>
      </div>

      {/* Historique */}
      <h2 className="m-0 mb-3 text-[17px] font-extrabold">Historique des achats</h2>
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <div className="grid text-[11.5px] font-extrabold uppercase tracking-wider px-5 py-3" style={{ gridTemplateColumns: "1fr 1fr 80px 100px 80px 100px", color: "#9aa39e", borderBottom: "1px solid #EAEFED" }}>
          <span>Référence</span><span>Pack</span><span>Jetons</span><span>Montant</span><span>Statut</span><span></span>
        </div>
        {HISTORIQUE.map((h, i) => (
          <div key={h.id} className="grid items-center px-5 py-4" style={{ gridTemplateColumns: "1fr 1fr 80px 100px 80px 100px", borderBottom: i < HISTORIQUE.length - 1 ? "1px solid #EAEFED" : undefined }}>
            <span className="text-[13px] font-bold">{h.id}</span>
            <span className="text-[13px] font-semibold" style={{ color: "#6B7280" }}>
              {h.pack}
              <span className="ml-2 text-[11.5px]" style={{ color: "#9aa39e" }}>{h.date}</span>
            </span>
            <span className="font-extrabold text-[13px]" style={{ color: "#0F5C44" }}>+{h.jetons}</span>
            <span className="font-bold text-[13px]">{h.montant}</span>
            <span className="inline-flex items-center gap-1 text-[11.5px] font-bold rounded-full px-2.5 py-1 w-fit" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#0F5C44" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {h.statut}
            </span>
            <button className="inline-flex items-center gap-1.5 text-[12.5px] font-bold rounded-[9px] px-3 py-2 cursor-pointer border-0" style={{ background: "#F4F6F5", color: "#3d4b44" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M7 10l5 5 5-5M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              PDF
            </button>
          </div>
        ))}
      </div>

      <p className="text-[12px] font-semibold mt-3" style={{ color: "#9aa39e" }}>
        Paiement sécurisé par Stripe · TVA non applicable, art. 293 B du CGI
      </p>
    </div>
  );
}

/* ─── Zone view ─── */
function ZoneView() {
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set(["Auvergne-Rhône-Alpes"]));
  const [saved, setSaved] = useState(false);

  function toggle(r: string) {
    setSelectedRegions((prev) => {
      const n = new Set(prev);
      n.has(r) ? n.delete(r) : n.add(r);
      return n;
    });
    setSaved(false);
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Ma zone d'activité</h1>
        <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>Définissez les régions où vous intervenez. Seules les demandes de ces zones vous seront affichées.</p>
      </div>

      <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <div className="flex items-center justify-between mb-1">
          <div className="text-[12px] font-extrabold uppercase tracking-wider" style={{ color: "#9aa39e" }}>Régions sélectionnées</div>
          {selectedRegions.size > 0 && (
            <span className="text-[12px] font-bold" style={{ color: "#1D9E75" }}>
              {selectedRegions.size} région{selectedRegions.size > 1 ? "s" : ""} active{selectedRegions.size > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="m-0 mb-5 text-[13px] font-medium" style={{ color: "#6B7280" }}>Cochez une ou plusieurs régions. Les demandes hors zone resteront visibles mais non filtrées par défaut.</p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {REGIONS.map((r) => {
            const checked = selectedRegions.has(r);
            return (
              <button
                key={r}
                onClick={() => toggle(r)}
                className="flex items-center gap-2 rounded-[10px] px-3.5 py-3 text-[13px] font-semibold cursor-pointer border-0 text-left transition-all"
                style={checked
                  ? { background: "#E8F6F0", color: "#0F5C44", border: "1.5px solid #1D9E75" }
                  : { background: "#F4F6F5", color: "#3d4b44", border: "1.5px solid transparent" }
                }
              >
                <span className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={checked ? { background: "#1D9E75" } : { border: "1.5px solid #cdd6d1" }}>
                  {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                {r}
              </button>
            );
          })}
        </div>

        {/* Info radius */}
        <div className="rounded-[12px] p-4 flex items-start gap-3 mb-6" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="9" stroke="#1D9E75" strokeWidth="1.8"/><path d="M12 8.5v5M12 16v.1" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <p className="m-0 text-[12.5px] font-semibold leading-relaxed" style={{ color: "#6B7280" }}>
            Votre zone filtre uniquement l'affichage par défaut. Vous pouvez toujours débloquer n'importe quelle fiche sur la plateforme, quelle que soit la région.
          </p>
        </div>

        <div className="flex items-center justify-between">
          {saved && (
            <span className="text-[13px] font-bold flex items-center gap-1.5" style={{ color: "#1D9E75" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#1D9E75" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Zone enregistrée avec succès
            </span>
          )}
          {!saved && <span />}
          <button
            onClick={() => setSaved(true)}
            disabled={selectedRegions.size === 0}
            className="text-white rounded-[11px] px-6 py-3 font-bold text-[14px] border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
          >
            Enregistrer ma zone
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Avis view ─── */
const AVIS_SEED = [
  { id: "1", client: "Marie T.",  date: "18 juin 2026", note: 5, demande: "Remplacement pare-brise Peugeot 308", comment: "Intervention rapide et soignée. Le technicien était ponctuel et très professionnel. Je recommande vivement !" },
  { id: "2", client: "Luc D.",    date: "5 juin 2026",  note: 4, demande: "Réparation impact Renault Clio",      comment: "Très bon travail, résultat propre. Légère attente pour la prise en charge mais le service est top." },
  { id: "3", client: "Sophie M.", date: "22 mai 2026",  note: 5, demande: "Remplacement vitre BMW Série 3",      comment: "Parfait de bout en bout. Devis clair, délai respecté, qualité irréprochable. Merci !" },
];

function StarDisplay({ note }: { note: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= note ? "#F5A623" : "none"}>
          <path d="M12 15.4l-4.2 2.3.8-4.7L5 9.6l4.7-.7L12 4.6l2.3 4.3 4.7.7-3.6 3.4.8 4.7Z" stroke="#F5A623" strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
      ))}
    </span>
  );
}

function AvisView() {
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replied, setReplied] = useState<Set<string>>(new Set());

  const avg = (AVIS_SEED.reduce((s, a) => s + a.note, 0) / AVIS_SEED.length).toFixed(1);

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Mes avis clients</h1>
        <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>Les avis laissés par vos clients après intervention.</p>
      </div>

      {/* Agrégat */}
      <div className="bg-white rounded-2xl p-6 flex items-center gap-6 flex-wrap mb-6" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <div className="text-center">
          <div className="text-[52px] font-extrabold tracking-tight leading-none" style={{ color: "#11211B" }}>{avg}</div>
          <StarDisplay note={Math.round(parseFloat(avg))} />
          <div className="text-[12.5px] font-semibold mt-1" style={{ color: "#6B7280" }}>{AVIS_SEED.length} avis</div>
        </div>
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
          {[5,4,3,2,1].map((s) => {
            const count = AVIS_SEED.filter((a) => a.note === s).length;
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="text-[12px] font-bold w-4 text-right">{s}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#F5A623"><path d="M12 15.4l-4.2 2.3.8-4.7L5 9.6l4.7-.7L12 4.6l2.3 4.3 4.7.7-3.6 3.4.8 4.7Z"/></svg>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#EEF2F0" }}>
                  <div className="h-full rounded-full" style={{ width: `${(count / AVIS_SEED.length) * 100}%`, background: "#F5A623" }} />
                </div>
                <span className="text-[12px] font-semibold w-3" style={{ color: "#9aa39e" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste avis */}
      <div className="flex flex-col gap-3">
        {AVIS_SEED.map((avis) => (
          <div key={avis.id} className="bg-white rounded-[16px] p-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[12px] text-white" style={{ background: "linear-gradient(150deg,#1D9E75,#0F5C44)" }}>
                    {avis.client[0]}
                  </div>
                  <span className="font-extrabold text-[14px]">{avis.client}</span>
                  <StarDisplay note={avis.note} />
                </div>
                <div className="text-[12px] font-semibold" style={{ color: "#9aa39e" }}>{avis.date} · {avis.demande}</div>
              </div>
            </div>
            <p className="m-0 text-[13.5px] font-medium leading-relaxed mb-3" style={{ color: "#3d4b44" }}>"{avis.comment}"</p>

            {replied.has(avis.id) ? (
              <div className="rounded-[10px] p-3 flex gap-2" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><path d="M3 10l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9Z" stroke="#1D9E75" strokeWidth="1.8"/></svg>
                <div>
                  <div className="text-[11.5px] font-extrabold mb-0.5" style={{ color: "#1D9E75" }}>Votre réponse</div>
                  <p className="m-0 text-[12.5px] font-medium" style={{ color: "#3d4b44" }}>{replyTexts[avis.id]}</p>
                </div>
              </div>
            ) : replyOpen === avis.id ? (
              <div>
                <textarea
                  value={replyTexts[avis.id] || ""}
                  onChange={(e) => setReplyTexts((prev) => ({ ...prev, [avis.id]: e.target.value }))}
                  placeholder="Répondez publiquement à cet avis..."
                  rows={3}
                  className="w-full rounded-[10px] px-3.5 py-2.5 text-[13.5px] font-medium outline-none resize-none mb-2"
                  style={{ border: "1px solid #EAEFED" }}
                />
                <div className="flex gap-2">
                  <button onClick={() => setReplyOpen(null)} className="rounded-[9px] px-4 py-2 font-bold text-[13px] border-0 cursor-pointer" style={{ background: "#F4F6F5", color: "#6B7280" }}>Annuler</button>
                  <button
                    onClick={() => { if (replyTexts[avis.id]?.trim()) { setReplied((prev) => new Set(prev).add(avis.id)); setReplyOpen(null); } }}
                    disabled={!replyTexts[avis.id]?.trim()}
                    className="rounded-[9px] px-4 py-2 font-bold text-[13px] text-white border-0 cursor-pointer disabled:opacity-50"
                    style={{ background: "#1D9E75" }}
                  >
                    Publier ma réponse
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setReplyOpen(avis.id)} className="text-[12.5px] font-bold border-0 bg-transparent cursor-pointer p-0" style={{ color: "#1D9E75" }}>
                Répondre →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Paramètres view ─── */
function ParametresView() {
  const [nom, setNom]       = useState("Vitro Pro Lyon");
  const [gerant, setGerant] = useState("Paul Martin");
  const [adresse, setAdresse] = useState("24 rue de la République, 69002 Lyon");
  const [siret, setSiret]   = useState("12345678900012");
  const [tel, setTel]       = useState("0612345678");
  const [email]             = useState("contact@vitroprolyon.fr");
  const [notifEmail, setNotifEmail]     = useState(true);
  const [notifNouveau, setNotifNouveau] = useState(true);
  const [savedInfo, setSavedInfo] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passOk, setPassOk]   = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Validations
  const siretValid = /^\d{14}$/.test(siret.replace(/\s/g, ""));
  const telValid   = /^\d{10}$/.test(tel.replace(/[\s.-]/g, ""));
  const nomValid   = nom.trim().length > 0;
  const gerantValid = gerant.trim().length > 0;
  const adresseValid = adresse.trim().length > 0;
  const canSave = nomValid && gerantValid && adresseValid && siretValid && telValid;

  function FieldError({ msg }: { msg: string }) {
    return <p className="mt-1 text-[11.5px] font-bold" style={{ color: "#D85A30" }}>{msg}</p>;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Paramètres</h1>
        <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>Gérez votre compte et vos préférences.</p>
      </div>

      {/* Infos société */}
      <div className="bg-white rounded-2xl p-6 mb-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <h2 className="m-0 mb-4 text-[16px] font-extrabold">Informations société</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold mb-1.5">Nom de la société <span style={{ color: "#D85A30" }}>*</span></label>
            <input
              value={nom}
              onChange={(e) => { setNom(e.target.value); setSavedInfo(false); }}
              placeholder="Ex : Vitro Pro Lyon"
              className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none"
              style={{ border: `1px solid ${nom.length > 0 && !nomValid ? "#D85A30" : "#EAEFED"}` }}
            />
            {nom.length === 0 && <FieldError msg="Champ obligatoire" />}
          </div>
          <div>
            <label className="block text-[13px] font-bold mb-1.5">Gérant <span style={{ color: "#D85A30" }}>*</span></label>
            <input
              value={gerant}
              onChange={(e) => { setGerant(e.target.value); setSavedInfo(false); }}
              placeholder="Ex : Paul Martin"
              className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none"
              style={{ border: `1px solid ${gerant.length > 0 && !gerantValid ? "#D85A30" : "#EAEFED"}` }}
            />
            {gerant.length === 0 && <FieldError msg="Champ obligatoire" />}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[13px] font-bold mb-1.5">Adresse <span style={{ color: "#D85A30" }}>*</span></label>
          <input
            value={adresse}
            onChange={(e) => { setAdresse(e.target.value); setSavedInfo(false); }}
            placeholder="24 rue de la République, 69002 Lyon"
            className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none"
            style={{ border: `1px solid ${adresse.length > 0 && !adresseValid ? "#D85A30" : "#EAEFED"}` }}
          />
          {adresse.length === 0 && <FieldError msg="Champ obligatoire" />}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-[13px] font-bold mb-1.5">SIRET <span style={{ color: "#D85A30" }}>*</span></label>
            <input
              value={siret}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 14);
                setSiret(v); setSavedInfo(false);
              }}
              placeholder="12345678900012"
              maxLength={14}
              inputMode="numeric"
              className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none"
              style={{ border: `1px solid ${siret.length > 0 && !siretValid ? "#D85A30" : "#EAEFED"}` }}
            />
            {siret.length > 0 && !siretValid && <FieldError msg={`14 chiffres requis (${siret.replace(/\s/g, "").length}/14)`} />}
            {siret.length === 0 && <FieldError msg="Champ obligatoire" />}
          </div>
          <div>
            <label className="block text-[13px] font-bold mb-1.5">Téléphone <span style={{ color: "#D85A30" }}>*</span></label>
            <input
              value={tel}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                setTel(v); setSavedInfo(false);
              }}
              placeholder="0612345678"
              maxLength={10}
              inputMode="numeric"
              className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none"
              style={{ border: `1px solid ${tel.length > 0 && !telValid ? "#D85A30" : "#EAEFED"}` }}
            />
            {tel.length > 0 && !telValid && <FieldError msg={`10 chiffres requis (${tel.replace(/[\s.-]/g, "").length}/10)`} />}
            {tel.length === 0 && <FieldError msg="Champ obligatoire" />}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[13px] font-bold mb-1.5">Email</label>
          <input value={email} disabled className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none" style={{ border: "1px solid #EAEFED", background: "#F4F6F5", color: "#9aa39e" }} />
          <p className="m-0 mt-1.5 text-[12px] font-semibold" style={{ color: "#9aa39e" }}>L'email ne peut pas être modifié directement. Contactez le support.</p>
        </div>

        <div className="flex items-center justify-between mt-5">
          {savedInfo ? (
            <span className="text-[13px] font-bold flex items-center gap-1.5" style={{ color: "#1D9E75" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#1D9E75" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Modifications enregistrées
            </span>
          ) : !canSave ? (
            <span className="text-[12.5px] font-semibold" style={{ color: "#D85A30" }}>Veuillez corriger les champs en rouge</span>
          ) : <span />}
          <button
            onClick={() => { if (canSave) setSavedInfo(true); }}
            disabled={!canSave}
            className="text-white rounded-[11px] px-6 py-3 font-bold text-[14px] border-0 cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
          >
            Enregistrer
          </button>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-2xl p-6 mb-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <h2 className="m-0 mb-4 text-[16px] font-extrabold">Sécurité</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold mb-1.5">Mot de passe actuel</label>
            <input type="password" value={oldPass} onChange={(e) => { setOldPass(e.target.value); setPassOk(false); }} placeholder="••••••••" className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none" style={{ border: "1px solid #EAEFED" }} />
          </div>
          <div>
            <label className="block text-[13px] font-bold mb-1.5">Nouveau mot de passe</label>
            <input type="password" value={newPass} onChange={(e) => { setNewPass(e.target.value); setPassOk(false); }} placeholder="8 caractères minimum" className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none" style={{ border: "1px solid #EAEFED" }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {passOk && <span className="text-[13px] font-bold flex items-center gap-1.5" style={{ color: "#1D9E75" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#1D9E75" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Mot de passe mis à jour</span>}
          {!passOk && <span />}
          <button
            onClick={() => { if (oldPass && newPass.length >= 8) setPassOk(true); }}
            disabled={!oldPass || newPass.length < 8}
            className="rounded-[11px] px-5 py-2.5 font-bold text-[13.5px] text-white border-0 cursor-pointer disabled:opacity-50 hover:opacity-90"
            style={{ background: "#11211B" }}
          >
            Mettre à jour
          </button>
        </div>
      </div>

      {/* Notifications — sans SMS */}
      <div className="bg-white rounded-2xl p-6 mb-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <h2 className="m-0 mb-4 text-[16px] font-extrabold">Notifications</h2>
        {[
          { label: "Alertes email",     sub: "Recevoir un email pour chaque nouvelle demande dans votre zone", val: notifEmail,   set: setNotifEmail },
          { label: "Nouvelles demandes", sub: "Notification dans l'interface pour chaque demande entrante",   val: notifNouveau, set: setNotifNouveau },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #EAEFED" }}>
            <div>
              <div className="font-bold text-[14px]">{item.label}</div>
              <div className="text-[12.5px] font-medium mt-0.5" style={{ color: "#6B7280" }}>{item.sub}</div>
            </div>
            <button
              onClick={() => item.set(!item.val)}
              className="relative w-[44px] h-[24px] rounded-full border-0 cursor-pointer transition-all flex-shrink-0"
              style={{ background: item.val ? "#1D9E75" : "#cdd6d1" }}
            >
              <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: item.val ? "23px" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
            </button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl p-6" style={{ border: "1.5px solid #FDE8E8", background: "#FFFBFB" }}>
        <h2 className="m-0 mb-1 text-[16px] font-extrabold" style={{ color: "#B0431F" }}>Zone danger</h2>
        <p className="m-0 mb-4 text-[13px] font-semibold" style={{ color: "#6B7280" }}>La suppression de votre compte est irréversible. Vos jetons non utilisés ne seront pas remboursés.</p>
        <button onClick={() => setShowDeleteConfirm(true)} className="rounded-[11px] px-5 py-2.5 font-bold text-[13.5px] border-0 cursor-pointer hover:opacity-90" style={{ background: "#FDE8E8", color: "#B0431F" }}>
          Supprimer mon compte
        </button>
      </div>

      {/* Modal confirmation suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.55)" }} onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-[20px] p-7 max-w-[380px] w-full" style={{ boxShadow: "0 20px 60px rgba(0,0,0,.18)" }} onClick={(e) => e.stopPropagation()}>
            <div className="w-11 h-11 rounded-[13px] flex items-center justify-center mb-4" style={{ background: "#FDE8E8" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#B0431F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="m-0 mb-2 text-[17px] font-extrabold" style={{ color: "#11211B" }}>Supprimer le compte ?</h3>
            <p className="m-0 mb-5 text-[13px] font-semibold leading-relaxed" style={{ color: "#6B7280" }}>
              Cette action est <strong>irréversible</strong>. Votre profil, vos fiches débloquées et vos jetons restants seront définitivement supprimés.
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-[11px] font-bold text-[13.5px] border-0 cursor-pointer" style={{ background: "#F4F6F5", color: "#6B7280" }}>
                Annuler
              </button>
              <button className="flex-1 py-3 rounded-[11px] font-extrabold text-[13.5px] text-white border-0 cursor-pointer" style={{ background: "#B0431F" }}>
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Aide view ─── */
const AIDE_FAQ = [
  { q: "Comment fonctionne le système de jetons ?",        a: "Chaque jeton vous permet de débloquer les coordonnées d'un client (téléphone + email). Le coût dépend du type d'intervention : réparation impact = 1 jeton, remplacement pare-brise sans assurance = 2 jetons, remplacement avec assurance BdG = 3 jetons. Les jetons n'ont pas de date d'expiration." },
  { q: "Puis-je obtenir un remboursement ?",               a: "Les jetons achetés ne sont pas remboursables, sauf erreur de notre part. Ils sont valables à vie, donc utilisez-les sans contrainte de temps." },
  { q: "Comment contacter un client après déblocage ?",    a: "Une fois la fiche débloquée, le téléphone et l'email du client apparaissent. Contactez-le rapidement — d'autres réparateurs peuvent débloquer la même fiche." },
  { q: "Ma zone d'activité est-elle obligatoire ?",        a: "Non, mais elle filtre les demandes affichées par défaut. Vous pouvez débloquer n'importe quelle fiche, quelle que soit la zone." },
  { q: "Comment recevoir une facture pour ma comptabilité ?", a: "Toutes vos factures sont disponibles dans l'onglet « Jetons & facturation ». Vous pouvez les télécharger en PDF à tout moment." },
  { q: "Que faire si un client ne répond pas ?",           a: "Le jeton est consommé au moment du déblocage. Nous recommandons de contacter le client rapidement par téléphone ET email pour maximiser vos chances." },
];

function AideView() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Aide & support</h1>
        <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>Trouvez des réponses à vos questions ou contactez notre équipe.</p>
      </div>

      {/* Contact rapide */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 flex items-start gap-4" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
          <span className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background: "#E8F6F0" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#1D9E75" strokeWidth="1.8" strokeLinejoin="round"/></svg>
          </span>
          <div>
            <div className="font-extrabold text-[14.5px] mb-0.5">Chat en direct</div>
            <div className="text-[12.5px] font-semibold mb-3" style={{ color: "#6B7280" }}>Réponse en moins de 5 min · Lun–Ven 9h–18h</div>
            <button className="text-white rounded-[9px] px-4 py-2 font-bold text-[13px] border-0 cursor-pointer" style={{ background: "#1D9E75" }}>Démarrer un chat</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-start gap-4" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
          <span className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background: "#EAF1FE" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2Z" stroke="#2563EB" strokeWidth="1.8"/><path d="M22 6l-10 7L2 6" stroke="#2563EB" strokeWidth="1.8"/></svg>
          </span>
          <div>
            <div className="font-extrabold text-[14.5px] mb-0.5">Email</div>
            <div className="text-[12.5px] font-semibold mb-3" style={{ color: "#6B7280" }}>support@minuteglass.fr · Réponse sous 24h</div>
            <button className="rounded-[9px] px-4 py-2 font-bold text-[13px] border-0 cursor-pointer" style={{ background: "#EAF1FE", color: "#2563EB" }}>Envoyer un email</button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="m-0 mb-3 text-[17px] font-extrabold">Questions fréquentes</h2>
      <div className="flex flex-col gap-2">
        {AIDE_FAQ.map((item, i) => (
          <div key={i} className="bg-white rounded-[14px] overflow-hidden" style={{ border: "1px solid #EAEFED" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-bold text-[14px] bg-transparent border-0 cursor-pointer"
            >
              {item.q}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 transition-transform" style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)", color: "#6B7280" }}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-[13.5px] leading-relaxed font-medium" style={{ color: "#3d4b44" }}>{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Auth screens ─── */
function PartnerChoiceScreen({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid #EAEFED" }}>
        <div className="max-w-[1320px] mx-auto px-6 flex items-center" style={{ height: 68 }}>
          <Link href="/"><Logo /></Link>
        </div>
      </header>
      <main className="max-w-[760px] mx-auto px-6 pt-9 pb-16 animate-mgFade">
        <div className="text-center mb-7">
          <span className="inline-block rounded-full px-3.5 py-1.5 text-[12.5px] font-bold mb-3" style={{ background: "#FCEDE7", color: "#B0431F" }}>Espace réparateur</span>
          <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Accéder à mon espace réparateur</h1>
          <p className="m-0 mt-2 text-sm font-medium" style={{ color: "#6B7280" }}>Connectez-vous ou créez votre compte réparateur.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onLogin} className="text-left rounded-[18px] p-6 cursor-pointer bg-white transition-all" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
            <span className="inline-flex w-[46px] h-[46px] rounded-[13px] items-center justify-center mb-3.5" style={{ background: "#FCEDE7" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3M10 17l5-5-5-5M15 12H3" stroke="#B0431F" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <div className="font-extrabold text-[17px]">Se connecter</div>
            <div className="text-[13px] font-semibold mt-1" style={{ color: "#6B7280" }}>J'ai déjà un compte réparateur</div>
          </button>
          <button onClick={onSignup} className="text-left rounded-[18px] p-6 cursor-pointer relative" style={{ background: "#FFF6F2", border: "2px solid #D85A30", boxShadow: "0 6px 20px rgba(216,90,48,.12)" }}>
            <span className="absolute top-4 right-4 text-white rounded-full px-2.5 py-1 text-[10.5px] font-extrabold" style={{ background: "#0F5C44" }}>2 JETONS OFFERTS</span>
            <span className="inline-flex w-[46px] h-[46px] rounded-[13px] items-center justify-center mb-3.5" style={{ background: "#D85A30" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16 17v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 8.5a3 3 0 100-6 3 3 0 000 6ZM19 8v6M22 11h-6" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <div className="font-extrabold text-[17px]" style={{ color: "#B0431F" }}>Créer un compte</div>
            <div className="text-[13px] font-semibold mt-1" style={{ color: "#6B7280" }}>Je rejoins le réseau de réparateurs</div>
          </button>
        </div>
        <div className="text-center mt-5">
          <Link href="/" className="font-bold text-[13.5px] no-underline" style={{ color: "#6B7280" }}>← Retour aux annonces</Link>
        </div>
      </main>
    </div>
  );
}

function PartnerLoginScreen({ onSubmit, onBack, onSignup }: { onSubmit: () => void; onBack: () => void; onSignup: () => void }) {
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const valid = email.length > 0 && pass.length >= 6;

  async function handleLogin() {
    if (!valid) return;
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email, pass);
    setLoading(false);
    if (err) { setError(err); return; }
    onSubmit();
  }

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid #EAEFED" }}>
        <div className="max-w-[1320px] mx-auto px-6 flex items-center" style={{ height: 68 }}>
          <Link href="/"><Logo /></Link>
        </div>
      </header>
      <main className="max-w-[760px] mx-auto px-6 pt-9 pb-16 animate-mgFade">
        <div className="text-center mb-6">
          <h1 className="m-0 text-2xl font-extrabold tracking-tight">Connexion réparateur</h1>
          <p className="m-0 mt-2 text-sm font-medium" style={{ color: "#6B7280" }}>Accédez à votre tableau de bord réparateur.</p>
        </div>
        <div className="bg-white rounded-[20px] p-8 max-w-[440px] mx-auto" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
          <label className="block text-[13px] font-bold mb-1.5">Adresse email professionnelle</label>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="contact@masociete.fr" className="w-full rounded-[11px] px-3.5 py-3 text-[14.5px] outline-none mb-4" style={{ border: `1px solid ${error ? "#D85A30" : "#EAEFED"}` }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          <label className="block text-[13px] font-bold mb-1.5">Mot de passe</label>
          <input type="password" value={pass} onChange={(e) => { setPass(e.target.value); setError(""); }} placeholder="••••••••" className="w-full rounded-[11px] px-3.5 py-3 text-[14.5px] outline-none" style={{ border: `1px solid ${error ? "#D85A30" : "#EAEFED"}` }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          {error && <p className="mt-2 text-[12.5px] font-bold" style={{ color: "#D85A30" }}>⚠ {error}</p>}
          <div className="text-right mt-2"><span className="text-[12.5px] font-bold cursor-pointer" style={{ color: "#1D9E75" }}>Mot de passe oublié ?</span></div>
          <button onClick={handleLogin} disabled={!valid || loading} className="w-full mt-4 py-3.5 rounded-[11px] font-bold text-[14.5px] text-white border-0 cursor-pointer disabled:cursor-not-allowed" style={{ background: valid && !loading ? "#1D9E75" : "#cdd6d1" }}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
          <div className="flex items-center gap-3 my-5 text-[12.5px] font-semibold" style={{ color: "#9aa39e" }}><span className="flex-1 h-px" style={{ background: "#EAEFED" }} />ou<span className="flex-1 h-px" style={{ background: "#EAEFED" }} /></div>
          <div className="text-center text-[13px] font-semibold" style={{ color: "#6B7280" }}>Pas encore réparateur ? <button onClick={onSignup} className="bg-transparent border-0 font-bold cursor-pointer p-0" style={{ color: "#1D9E75" }}>Créer un compte</button></div>
        </div>
        <div className="text-center mt-4"><button onClick={onBack} className="bg-transparent border-0 font-bold text-[13.5px] cursor-pointer" style={{ color: "#6B7280" }}>← Retour</button></div>
      </main>
    </div>
  );
}

const PRESTATIONS = [
  { id: "remplacement", label: "Remplacement pare-brise" },
  { id: "reparation",   label: "Réparation d'impact" },
  { id: "vitre",        label: "Vitre latérale / lunette" },
];

function PartnerSignupScreen({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  const [nom, setNom]                 = useState("");
  const [gerant, setGerant]           = useState("");
  const [adresse, setAdresse]         = useState("");
  const [codePostal, setCodePostal]   = useState("");
  const [ville, setVille]             = useState("");
  const [siret, setSiret]             = useState("");
  const [tel, setTel]                 = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [selectedPrestations, setSelectedPrestations] = useState<Set<string>>(new Set());
  const [kbis, setKbis]               = useState<File | null>(null);
  const [kbisError, setKbisError]     = useState("");
  const [kbisDrag, setKbisDrag]       = useState(false);
  const kbisRef                        = useRef<HTMLInputElement>(null);
  const [photo, setPhoto]             = useState<string | null>(null);
  const photoRef                       = useRef<HTMLInputElement>(null);

  function handlePhotoFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleKbisFile(file: File) {
    setKbisError("");
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setKbisError("Format invalide — PDF, JPG ou PNG uniquement.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setKbisError("Fichier trop volumineux (max 10 Mo).");
      return;
    }
    setKbis(file);
  }

  const siretValid   = /^\d{14}$/.test(siret.replace(/\s/g, ""));
  const telValid     = /^\d{10}$/.test(tel.replace(/[\s.-]/g, ""));
  const canRegister  = nom && gerant && adresse && codePostal && ville && siretValid && telValid && email.includes("@") && password.length >= 8 && selectedRegions.size > 0 && selectedPrestations.size > 0 && kbis !== null;

  async function handleSignup() {
    if (!canRegister) return;
    setSignupLoading(true);
    setSignupError("");
    const { error } = await signUp(email, password, "partenaire", gerant);
    setSignupLoading(false);
    if (error) { setSignupError(error); return; }
    onSubmit();
  }

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid #EAEFED" }}>
        <div className="max-w-[1320px] mx-auto px-6 flex items-center" style={{ height: 68 }}>
          <Link href="/"><Logo /></Link>
        </div>
      </header>
      <main className="max-w-[760px] mx-auto px-6 pt-8 pb-16 animate-mgFade">
        <div className="text-center mb-6">
          <span className="inline-block rounded-full px-3.5 py-1.5 text-[12.5px] font-bold mb-3" style={{ background: "#FCEDE7", color: "#B0431F" }}>Inscription réparateur</span>
          <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Créer mon compte réparateur</h1>
          <p className="m-0 mt-2 text-sm font-medium" style={{ color: "#6B7280" }}>
            Renseignez votre société et vos zones d'intervention · <b style={{ color: "#0F5C44" }}>2 jetons offerts</b> à l'inscription.
          </p>
        </div>
        <div className="bg-white rounded-[20px] p-8" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
          <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#9aa39e" }}>Informations société</div>

          {/* Photo de profil */}
          <div className="flex items-center gap-5 mb-5 pb-5" style={{ borderBottom: "1px solid #EAEFED" }}>
            <div
              className="relative w-20 h-20 rounded-[18px] flex-shrink-0 overflow-hidden cursor-pointer"
              style={{ background: photo ? "transparent" : "#F4F6F5", border: "2px dashed #cdd6d1" }}
              onClick={() => photoRef.current?.click()}
            >
              {photo ? (
                <img src={photo} alt="profil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="#9aa39e" strokeWidth="1.8"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9aa39e" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#1D9E75" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <input ref={photoRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }} />
            </div>
            <div>
              <div className="font-bold text-[14px] mb-0.5">Logo de la société</div>
              <div className="text-[12.5px] font-medium" style={{ color: "#6B7280" }}>
                Visible par les clients sur votre fiche. JPG ou PNG, max 5 Mo.
              </div>
              {photo && (
                <button onClick={() => setPhoto(null)} className="mt-2 bg-transparent border-0 text-[12px] font-bold cursor-pointer p-0" style={{ color: "#D85A30" }}>
                  Supprimer
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom de la société *" value={nom} onChange={setNom} placeholder="Ex : Vitro Pro Lyon" />
            <Field label="Nom & prénom du gérant *" value={gerant} onChange={setGerant} placeholder="Ex : Paul Martin" />
          </div>
          <div className="mt-4"><Field label="Adresse de la société *" value={adresse} onChange={setAdresse} placeholder="24 rue de la République" /></div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="Code postal *" value={codePostal} onChange={setCodePostal} placeholder="69002" />
            <Field label="Ville *" value={ville} onChange={setVille} placeholder="Lyon" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-[13px] font-bold mb-1.5">Numéro de SIRET *</label>
              <input
                value={siret}
                onChange={(e) => setSiret(e.target.value.replace(/\D/g, "").slice(0, 14))}
                placeholder="12345678900012"
                maxLength={14}
                className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none"
                style={{ border: `1px solid ${siret.length > 0 && !siretValid ? "#D85A30" : "#EAEFED"}` }}
              />
              {siret.length > 0 && !siretValid && (
                <p className="mt-1 text-[12px] font-semibold" style={{ color: "#D85A30" }}>
                  ⚠ 14 chiffres requis ({siret.length}/14)
                </p>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-bold mb-1.5">Téléphone *</label>
              <input
                value={tel}
                onChange={(e) => setTel(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="0612345678"
                maxLength={10}
                className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none"
                style={{ border: `1px solid ${tel.length > 0 && !telValid ? "#D85A30" : "#EAEFED"}` }}
              />
              {tel.length > 0 && !telValid && (
                <p className="mt-1 text-[12px] font-semibold" style={{ color: "#D85A30" }}>
                  ⚠ 10 chiffres requis ({tel.length}/10)
                </p>
              )}
            </div>
          </div>
          <div className="mt-4"><Field label="Adresse email *" value={email} onChange={setEmail} placeholder="contact@masociete.fr" type="email" /></div>
          <div className="mt-4"><Field label="Mot de passe * (8 caractères min.)" value={password} onChange={setPassword} placeholder="••••••••" type="password" /></div>
          {signupError && <p className="mt-2 text-[12.5px] font-bold" style={{ color: "#D85A30" }}>⚠ {signupError}</p>}

          {/* ── Kbis upload ── */}
          <div className="mt-4">
            <label className="block text-[13px] font-bold mb-1.5">
              Extrait Kbis *
              <span className="ml-2 text-[11.5px] font-semibold rounded-full px-2 py-0.5" style={{ background: "#FDE8E8", color: "#D8302F" }}>
                de moins de 3 mois
              </span>
            </label>
            <p className="m-0 mb-3 text-[12.5px]" style={{ color: "#6B7280" }}>
              Document officiel attestant de l'existence juridique de votre société (PDF, JPG ou PNG · max 10 Mo).
            </p>

            {kbis ? (
              /* fichier sélectionné */
              <div
                className="flex items-center gap-3 rounded-[13px] px-4 py-3"
                style={{ background: "#E8F6F0", border: "1.5px solid #1D9E75" }}
              >
                <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#1D9E75" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M9 13l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[13.5px] truncate" style={{ color: "#0F5C44" }}>{kbis.name}</div>
                  <div className="text-[12px] font-semibold" style={{ color: "#1D9E75" }}>
                    {(kbis.size / 1024).toFixed(0)} Ko · Prêt à être envoyé
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setKbis(null); setKbisError(""); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center border-0 cursor-pointer text-sm font-bold"
                  style={{ background: "#fff", color: "#0F5C44" }}
                >✕</button>
              </div>
            ) : (
              /* zone de dépôt */
              <div
                onDragOver={(e) => { e.preventDefault(); setKbisDrag(true); }}
                onDragLeave={() => setKbisDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setKbisDrag(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleKbisFile(f);
                }}
                onClick={() => kbisRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-[13px] px-6 py-6 cursor-pointer transition-all"
                style={{
                  border: `2px dashed ${kbisDrag ? "#1D9E75" : "#cdd6d1"}`,
                  background: kbisDrag ? "#E8F6F0" : "#FAFBFB",
                }}
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#F4F6F5" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6Z" stroke="#6B7280" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="text-[13.5px] font-bold" style={{ color: "#3d4b44" }}>
                  Glissez votre Kbis ici ou <span style={{ color: "#1D9E75" }}>parcourir</span>
                </div>
                <div className="text-[12px] font-semibold" style={{ color: "#9aa39e" }}>PDF · JPG · PNG — max 10 Mo</div>
                <input
                  ref={kbisRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleKbisFile(f); }}
                />
              </div>
            )}

            {kbisError && (
              <p className="mt-2 text-[12.5px] font-semibold" style={{ color: "#D85A30" }}>⚠ {kbisError}</p>
            )}
          </div>

          <div className="h-px my-6" style={{ background: "#EAEFED" }} />

          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-bold tracking-widest uppercase" style={{ color: "#9aa39e" }}>Zone d'intervention</div>
            {selectedRegions.size > 0 && <span className="text-[12px] font-bold" style={{ color: "#1D9E75" }}>{selectedRegions.size} région{selectedRegions.size > 1 ? "s" : ""} sélectionnée{selectedRegions.size > 1 ? "s" : ""}</span>}
          </div>
          <p className="m-0 mb-4 text-[12.5px]" style={{ color: "#6B7280" }}>Cochez une ou plusieurs régions où vous intervenez.</p>
          <div className="grid grid-cols-3 gap-2">
            {REGIONS.map((r) => {
              const checked = selectedRegions.has(r);
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRegions((prev) => { const n = new Set(prev); checked ? n.delete(r) : n.add(r); return n; })}
                  className="flex items-center gap-2 rounded-[9px] px-3 py-2.5 text-[12.5px] font-semibold cursor-pointer border-0 text-left transition-all"
                  style={checked
                    ? { background: "#E8F6F0", color: "#0F5C44", border: "1.5px solid #1D9E75" }
                    : { background: "#F4F6F5", color: "#3d4b44", border: "1.5px solid transparent" }
                  }
                >
                  <span className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={checked ? { background: "#1D9E75" } : { border: "1.5px solid #cdd6d1" }}>
                    {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  {r}
                </button>
              );
            })}
          </div>

          <div className="h-px my-6" style={{ background: "#EAEFED" }} />

          {/* Types de prestations */}
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-bold tracking-widest uppercase" style={{ color: "#9aa39e" }}>Types de prestations *</div>
            {selectedPrestations.size > 0 && (
              <span className="text-[12px] font-bold" style={{ color: "#1D9E75" }}>{selectedPrestations.size} sélectionné{selectedPrestations.size > 1 ? "s" : ""}</span>
            )}
          </div>
          <p className="m-0 mb-4 text-[12.5px]" style={{ color: "#6B7280" }}>Sélectionnez les interventions que vous réalisez.</p>
          <div className="flex flex-col gap-2">
            {PRESTATIONS.map((p) => {
              const checked = selectedPrestations.has(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPrestations((prev) => { const n = new Set(prev); checked ? n.delete(p.id) : n.add(p.id); return n; })}
                  className="flex items-center gap-3 rounded-[11px] px-4 py-3 font-semibold text-[13.5px] cursor-pointer border-0 text-left transition-all"
                  style={checked
                    ? { background: "#E8F6F0", color: "#0F5C44", border: "1.5px solid #1D9E75" }
                    : { background: "#F4F6F5", color: "#3d4b44", border: "1.5px solid transparent" }
                  }
                >
                  <span className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center" style={checked ? { background: "#1D9E75" } : { border: "1.5px solid #cdd6d1", background: "#fff" }}>
                    {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 mt-7">
            <button onClick={onBack} className="bg-transparent border-0 font-bold text-[14px] cursor-pointer" style={{ color: "#6B7280" }}>← Retour</button>
            <button onClick={handleSignup} disabled={!canRegister || signupLoading} className="text-white rounded-[11px] px-7 py-3.5 font-bold text-[14.5px] border-0 cursor-pointer disabled:cursor-not-allowed" style={{ background: canRegister && !signupLoading ? "#1D9E75" : "#cdd6d1", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}>
              {signupLoading ? "Création en cours…" : canRegister ? "Créer mon compte réparateur" : "Complétez tous les champs"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-[13px] font-bold mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-[11px] px-3.5 py-3 text-[14px] font-medium outline-none" style={{ border: "1px solid #EAEFED" }} />
    </div>
  );
}

/* ─── Main page ─── */
export default function PartenairePage() {
  // null = pas encore monté (évite hydration mismatch avec localStorage)
  const [auth, setAuth] = useState<AuthScreen | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mg_auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.role === "partenaire") { setAuth("dashboard"); return; }
      }
    } catch {}
    setAuth("choice");
  }, []);
  const [localDemandes, setLocalDemandes] = useState(getLocalDemandes());
  useEffect(() => onDemandesChange(() => setLocalDemandes(getLocalDemandes())), []);
  const DEMANDES = [...SEED_DEMANDES, ...localDemandes];

  const [nav, setNav]                 = useState<NavItem>("dashboard");
  const [tokens, setTokens]           = useState<number>(() => {
    try { const v = localStorage.getItem("mg_tokens"); return v ? Number(v) : 12; } catch { return 12; }
  });
  const [showTokenModal, setShowTokenModal] = useState(false);
  // Lifted state — shared across all views
  const [unlocked, setUnlocked] = useState<Set<string>>(() => {
    try { const v = localStorage.getItem("mg_unlocked"); return v ? new Set<string>(JSON.parse(v)) : new Set<string>(); } catch { return new Set<string>(); }
  });
  const [globalUnlockCounts, setGlobalUnlockCounts] = useState<Record<string, number>>(() => {
    try { const v = localStorage.getItem("mg_unlock_counts"); return v ? JSON.parse(v) : {}; } catch { return {}; }
  });
  const [favs, setFavs] = useState<Set<string>>(() => {
    try { const v = localStorage.getItem("mg_favs"); return v ? new Set<string>(JSON.parse(v)) : new Set<string>(); } catch { return new Set<string>(); }
  });
  // Attribution : fiches dont mon devis a été accepté / attribuées à un autre
  const [attributedToMe, setAttributedToMe]           = useState<Set<string>>(new Set());
  const [attributedElsewhere, setAttributedElsewhere] = useState<Set<string>>(new Set(["3"])); // seed : demande id "3" déjà prise

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [successJetons, setSuccessJetons] = useState<number | null>(null);

  // Detect ?success=1 after Stripe payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      const jetons = Number(params.get("jetons") ?? 0);
      setSuccessJetons(jetons);
      window.history.replaceState({}, "", "/partenaire");
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => { try { localStorage.setItem("mg_tokens", String(tokens)); } catch {} }, [tokens]);
  useEffect(() => { try { localStorage.setItem("mg_unlocked", JSON.stringify([...unlocked])); } catch {} }, [unlocked]);
  useEffect(() => { try { localStorage.setItem("mg_unlock_counts", JSON.stringify(globalUnlockCounts)); } catch {} }, [globalUnlockCounts]);
  useEffect(() => { try { localStorage.setItem("mg_favs", JSON.stringify([...favs])); } catch {} }, [favs]);

  function handleUnlock(id: string) {
    setUnlocked((prev) => new Set(prev).add(id));
    setGlobalUnlockCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    const d = DEMANDES.find((d) => d.id === id);
    toast(`Fiche débloquée${d ? ` — ${d.title}` : ""} ! Coordonnées visibles.`, "success");
  }
  function handleToggleFav(id: string) {
    setFavs((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function handleTokenSpent(cost: number) { setTokens((t) => Math.max(0, t - cost)); }
  function handleAttributed(id: string) {
    setAttributedToMe((prev) => new Set(prev).add(id));
    // Persister pour que la page /annonce/[id] puisse bloquer le déblocage
    try {
      const stored = localStorage.getItem("mg_attributed");
      const ids: string[] = stored ? JSON.parse(stored) : [];
      if (!ids.includes(id)) { ids.push(id); localStorage.setItem("mg_attributed", JSON.stringify(ids)); }
    } catch {}
  }

  if (auth === null) return null; // en attente du montage client
  if (auth === "choice") return <PartnerChoiceScreen onLogin={() => setAuth("login")} onSignup={() => setAuth("signup")} />;
  if (auth === "login")  return <PartnerLoginScreen onSubmit={() => { setGlobalAuth("partenaire"); setAuth("dashboard"); }} onBack={() => setAuth("choice")} onSignup={() => setAuth("signup")} />;
  if (auth === "signup") return <PartnerSignupScreen onSubmit={() => { setGlobalAuth("partenaire"); setAuth("dashboard"); }} onBack={() => setAuth("choice")} />;

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <PartnerNav tokens={tokens} onBuy={() => setShowTokenModal(true)} onNavigate={(n) => { setNav(n); setSidebarOpen(false); }} />
      {showTokenModal && <TokenModal onClose={() => setShowTokenModal(false)} />}

      {/* Modale succès paiement Stripe */}
      {successJetons !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.55)" }}>
          <div className="bg-white rounded-[24px] p-10 max-w-[420px] w-full mx-4 text-center animate-mgPop" style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="m-0 text-[22px] font-extrabold mb-2">Paiement réussi !</h2>
            <p className="m-0 text-[15px] font-semibold mb-1" style={{ color: "#6B7280" }}>
              <span className="font-extrabold" style={{ color: "#0F5C44" }}>+{successJetons} jeton{successJetons > 1 ? "s" : ""}</span> crédités sur votre compte.
            </p>
            <p className="m-0 text-[13px] font-medium mb-8" style={{ color: "#9aa39e" }}>Utilisez-les pour débloquer des contacts clients.</p>
            <button
              onClick={() => setSuccessJetons(null)}
              className="w-full py-3.5 rounded-[13px] font-bold text-[15px] text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(150deg,#0F5C44,#1D9E75)", boxShadow: "0 6px 20px rgba(15,92,68,.3)" }}
            >
              Accéder aux demandes
            </button>
          </div>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" style={{ background: "rgba(17,33,27,.45)" }} onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-white pt-4 pb-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Sidebar active={nav} onChange={(n) => { setNav(n); setSidebarOpen(false); }} countAll={DEMANDES.length} />
          </div>
        </div>
      )}

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex gap-6 items-start">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar active={nav} onChange={setNav} countAll={DEMANDES.length} />
        </div>

        <main className="flex-1 min-w-0 py-6 pb-16">
          {/* Mobile nav toggle */}
          <button
            className="lg:hidden mb-4 inline-flex items-center gap-2 bg-white rounded-[10px] px-4 py-2.5 font-bold text-[13.5px] cursor-pointer border"
            style={{ borderColor: "#EAEFED", color: "#11211B" }}
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Menu
          </button>

          {nav === "dashboard"   && <DashboardView tokens={tokens} onBuy={() => setShowTokenModal(true)} unlocked={unlocked} favs={favs} onUnlock={handleUnlock} onToggleFav={handleToggleFav} attributedToMe={attributedToMe} attributedElsewhere={attributedElsewhere} onAttributed={handleAttributed} demandes={DEMANDES} globalUnlockCounts={globalUnlockCounts} />}
          {nav === "demandes"    && <DemandesView tokens={tokens} onTokenSpent={handleTokenSpent} unlocked={unlocked} favs={favs} onUnlock={handleUnlock} onToggleFav={handleToggleFav} attributedToMe={attributedToMe} attributedElsewhere={attributedElsewhere} onAttributed={handleAttributed} demandes={DEMANDES} globalUnlockCounts={globalUnlockCounts} />}
          {nav === "debloquees"  && <DebloquéesView unlocked={unlocked} favs={favs} onToggleFav={handleToggleFav} demandes={DEMANDES} />}
          {nav === "favoris"     && <FavorisView favs={favs} unlocked={unlocked} onToggleFav={handleToggleFav} demandes={DEMANDES} />}
          {nav === "facturation" && <FacturationView tokens={tokens} onBuy={() => setShowTokenModal(true)} />}
          {nav === "zone"        && <ZoneView />}
          {nav === "avis"        && <AvisView />}
          {nav === "parametres"  && <ParametresView />}
          {nav === "aide"        && <AideView />}
        </main>
      </div>
    </div>
  );
}
