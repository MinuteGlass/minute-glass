"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { DEMANDES } from "@/data/demandes";

/* ─── Types ─── */
type AdminNav = "dashboard" | "demandes" | "particuliers" | "partenaires" | "jetons" | "parametres";

interface Particulier {
  id: string;
  nom: string;
  email: string;
  inscrit: string;
  demandes: number;
  statut: "actif" | "suspendu";
}

interface Partenaire {
  id: string;
  societe: string;
  gerant: string;
  email: string;
  region: string;
  siret: string;
  inscrit: string;
  jetons: number;
  statut: "validé" | "en attente" | "suspendu" | "refusé";
}

interface TokenTx {
  id: string;
  partenaire: string;
  pack: string;
  jetons: number;
  montant: string;
  date: string;
  statut: "Payé" | "Remboursé";
}

/* ─── Seed data ─── */
const PARTICULIERS_SEED: Particulier[] = [
  { id: "U001", nom: "Marie Laurent",    email: "marie.l@gmail.com",       inscrit: "2 juin 2026",    demandes: 2, statut: "actif"     },
  { id: "U002", nom: "Thomas Roux",      email: "thomas.r@outlook.fr",     inscrit: "5 juin 2026",    demandes: 1, statut: "actif"     },
  { id: "U003", nom: "Sophie Martin",    email: "sophie.m@free.fr",        inscrit: "8 juin 2026",    demandes: 1, statut: "actif"     },
  { id: "U004", nom: "Jean-Paul Dupont", email: "jpdupont@wanadoo.fr",     inscrit: "10 juin 2026",   demandes: 1, statut: "suspendu"  },
  { id: "U005", nom: "Amina Benali",     email: "amina.b@yahoo.fr",        inscrit: "12 juin 2026",   demandes: 3, statut: "actif"     },
  { id: "U006", nom: "Romain Charpentier", email: "romain.c@gmail.com",   inscrit: "14 juin 2026",   demandes: 1, statut: "actif"     },
  { id: "U007", nom: "Lucie Faure",      email: "lucie.f@gmail.com",       inscrit: "15 juin 2026",   demandes: 2, statut: "actif"     },
  { id: "U008", nom: "Kevin Petit",      email: "kevin.p@hotmail.fr",      inscrit: "17 juin 2026",   demandes: 1, statut: "actif"     },
  { id: "U009", nom: "Isabelle Guérin",  email: "isabelle.g@sfr.fr",       inscrit: "18 juin 2026",   demandes: 1, statut: "actif"     },
  { id: "U010", nom: "Marc Tournois",    email: "marc.t@laposte.net",      inscrit: "19 juin 2026",   demandes: 1, statut: "actif"     },
  { id: "U011", nom: "Clara Noel",       email: "clara.n@gmail.com",       inscrit: "20 juin 2026",   demandes: 1, statut: "actif"     },
  { id: "U012", nom: "Hugo Vincent",     email: "hugo.v@outlook.com",      inscrit: "21 juin 2026",   demandes: 1, statut: "actif"     },
];

const PARTENAIRES_SEED: Partenaire[] = [
  { id: "P001", societe: "Vitro Pro Lyon",       gerant: "Paul Bernard",  email: "contact@vitropro.fr",   region: "Auvergne-Rhône-Alpes",    siret: "123 456 789 00012", inscrit: "1 juin 2026",   jetons: 12, statut: "validé"      },
  { id: "P002", societe: "Glass Expert Paris",   gerant: "Laure Morin",   email: "laure@glassexpert.fr",  region: "Île-de-France",           siret: "234 567 890 00023", inscrit: "3 juin 2026",   jetons: 8,  statut: "validé"      },
  { id: "P003", societe: "Sud Vitrage",          gerant: "Karim Amara",   email: "k.amara@sudvitrage.fr", region: "Provence-Alpes-Côte d'Azur", siret: "345 678 901 00034", inscrit: "7 juin 2026",   jetons: 5,  statut: "en attente"  },
  { id: "P004", societe: "Auto Glass Bordeaux",  gerant: "Sophie Blanc",  email: "auto@glassbdx.com",     region: "Nouvelle-Aquitaine",      siret: "456 789 012 00045", inscrit: "9 juin 2026",   jetons: 0,  statut: "en attente"  },
  { id: "P005", societe: "Bretagne Pare-brise",  gerant: "Yann Kermarc",  email: "yann@bretagnepb.fr",    region: "Bretagne",                siret: "567 890 123 00056", inscrit: "11 juin 2026",  jetons: 15, statut: "validé"      },
  { id: "P006", societe: "Occitanie Vitrage",    gerant: "Marc Azéma",    email: "marc@occvitrage.fr",    region: "Occitanie",               siret: "678 901 234 00067", inscrit: "13 juin 2026",  jetons: 3,  statut: "en attente"  },
  { id: "P007", societe: "Alsace Glass",         gerant: "Heinz Müller",  email: "h.muller@alsaceglass.fr", region: "Grand Est",             siret: "789 012 345 00078", inscrit: "15 juin 2026",  jetons: 0,  statut: "refusé"      },
  { id: "P008", societe: "Nord Auto Vitres",     gerant: "Céline Dubois", email: "c.dubois@nordvitres.fr", region: "Hauts-de-France",        siret: "890 123 456 00089", inscrit: "16 juin 2026",  jetons: 20, statut: "validé"      },
];

const TOKENS_SEED: TokenTx[] = [
  { id: "FAC-2026-0043", partenaire: "Vitro Pro Lyon",      pack: "Pack Expert",     jetons: 30, montant: "240,00 €", date: "12 juin 2026",   statut: "Payé"      },
  { id: "FAC-2026-0039", partenaire: "Glass Expert Paris",  pack: "Pack Pro",        jetons: 15, montant: "130,00 €", date: "10 juin 2026",   statut: "Payé"      },
  { id: "FAC-2026-0031", partenaire: "Bretagne Pare-brise", pack: "Pack Expert",     jetons: 30, montant: "240,00 €", date: "8 juin 2026",    statut: "Payé"      },
  { id: "FAC-2026-0028", partenaire: "Nord Auto Vitres",    pack: "Pack Expert",     jetons: 30, montant: "240,00 €", date: "6 juin 2026",    statut: "Payé"      },
  { id: "FAC-2026-0021", partenaire: "Vitro Pro Lyon",      pack: "Pack Pro",        jetons: 15, montant: "130,00 €", date: "3 mai 2026",     statut: "Remboursé" },
  { id: "FAC-2026-0015", partenaire: "Glass Expert Paris",  pack: "Pack Découverte", jetons: 5,  montant: "55,00 €",  date: "20 avr. 2026",   statut: "Payé"      },
  { id: "FAC-2026-0008", partenaire: "Bretagne Pare-brise", pack: "Pack Découverte", jetons: 5,  montant: "55,00 €",  date: "14 avr. 2026",   statut: "Payé"      },
];

/* ─── Login screen ─── */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setError("Trop de tentatives. Réessayez dans quelques minutes.");
      } else if (!res.ok) {
        setError(data.error ?? "Identifiants administrateur incorrects.");
      } else {
        sessionStorage.setItem("mg_admin_token", data.token);
        onLogin();
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F1C18" }}>
      <div className="w-full max-w-[400px] px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: "#1D9E75" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7v5c0 5.5 3.5 9 8 11 4.5-2 8-5.5 8-11V7l-8-4Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-[18px] text-white tracking-tight">Minute Glass</span>
          </div>
          <div className="inline-block rounded-full px-3 py-1 text-[11.5px] font-bold mb-2" style={{ background: "rgba(29,158,117,.2)", color: "#4ade80" }}>
            Espace Administration
          </div>
          <h1 className="m-0 text-[22px] font-extrabold text-white">Connexion administrateur</h1>
          <p className="m-0 mt-1.5 text-[13.5px] font-medium" style={{ color: "#6B9C88" }}>Accès réservé à l'équipe Minute Glass.</p>
        </div>

        <div className="rounded-[20px] p-7" style={{ background: "#162018", border: "1px solid rgba(255,255,255,.08)" }}>
          <label className="block text-[12.5px] font-bold mb-1.5" style={{ color: "#9ab8aa" }}>Identifiant</label>
          <input
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="Identifiant"
            autoComplete="username"
            className="w-full rounded-[11px] px-4 py-3 text-[14px] font-medium outline-none mb-4"
            style={{ background: "#0F1C18", border: `1px solid ${error ? "#D85A30" : "rgba(255,255,255,.12)"}`, color: "#fff" }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <label className="block text-[12.5px] font-bold mb-1.5" style={{ color: "#9ab8aa" }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="••••••••"
            className="w-full rounded-[11px] px-4 py-3 text-[14px] font-medium outline-none"
            style={{ background: "#0F1C18", border: `1px solid ${error ? "#D85A30" : "rgba(255,255,255,.12)"}`, color: "#fff" }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <p className="mt-2 text-[12.5px] font-bold" style={{ color: "#D85A30" }}>⚠ {error}</p>}
          <button
            onClick={handleSubmit}
            disabled={!email || !password || loading}
            className="w-full mt-5 py-3.5 rounded-[11px] font-bold text-[14.5px] text-white border-0 cursor-pointer disabled:cursor-not-allowed transition-opacity"
            style={{ background: "#1D9E75", boxShadow: "0 4px 14px rgba(29,158,117,.35)", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Vérification…" : "Accéder au tableau de bord"}
          </button>
        </div>

        <div className="text-center mt-5">
          <Link href="/" className="text-[12.5px] font-semibold no-underline" style={{ color: "#4d8a6a" }}>
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar ─── */
const NAV_ITEMS: { id: AdminNav; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/></svg>,
  },
  {
    id: "demandes",
    label: "Demandes",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 10h16M4 14h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    id: "particuliers",
    label: "Particuliers",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    id: "partenaires",
    label: "Partenaires",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  },
  {
    id: "jetons",
    label: "Jetons & revenus",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v10M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5S13.66 12 12 12s-3 1.12-3 2.5S10.34 17 12 17s3-1.12 3-2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    id: "parametres",
    label: "Paramètres",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1Z" stroke="currentColor" strokeWidth="1.8"/></svg>,
  },
];

function AdminSidebar({ active, onChange, pendingCount }: { active: AdminNav; onChange: (n: AdminNav) => void; pendingCount: number }) {
  return (
    <aside className="w-[220px] flex-shrink-0 pt-6 pb-10 flex flex-col" style={{ minHeight: "calc(100vh - 68px)" }}>
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-[11px] font-bold text-[13.5px] cursor-pointer border-0 text-left mb-0.5 transition-all w-full relative"
            style={isActive
              ? { background: "#E8F6F0", color: "#0F5C44" }
              : { background: "transparent", color: "#3d4b44" }
            }
          >
            <span style={{ color: isActive ? "#1D9E75" : "#9aa39e" }}>{item.icon}</span>
            {item.label}
            {item.id === "partenaires" && pendingCount > 0 && (
              <span className="ml-auto text-[10.5px] font-extrabold text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: "#D85A30" }}>
                {pendingCount}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}

/* ─── KPI Card ─── */
function KpiCard({ label, value, sub, color = "#1D9E75", icon }: { label: string; value: string; sub?: string; color?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-[12.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>{label}</span>
        <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: color + "22", color }}>{icon}</span>
      </div>
      <div className="text-[30px] font-extrabold tracking-tight leading-none" style={{ color: "#11211B" }}>{value}</div>
      {sub && <div className="text-[12px] font-semibold mt-1.5" style={{ color: "#6B7280" }}>{sub}</div>}
    </div>
  );
}

/* ─── Dashboard view ─── */
function DashboardView({ particuliers, partenaires, transactions }: { particuliers: Particulier[]; partenaires: Partenaire[]; transactions: TokenTx[] }) {
  const revenue = transactions.filter(t => t.statut === "Payé").reduce((acc, t) => {
    const n = parseFloat(t.montant.replace(",", ".").replace(" €", ""));
    return acc + n;
  }, 0);

  const recentDemandes = [...DEMANDES].slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Tableau de bord</h1>
        <p className="m-0 mt-1 text-[14px] font-medium" style={{ color: "#6B7280" }}>Vue d'ensemble de la plateforme · mis à jour à l'instant.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <KpiCard label="Demandes" value={String(DEMANDES.length)} sub={`+${DEMANDES.filter(d => d.isNew).length} cette semaine`} color="#2563EB"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 10h16M4 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>} />
        <KpiCard label="Particuliers" value={String(particuliers.length)} sub={`${particuliers.filter(u => u.statut === "actif").length} actifs`} color="#1D9E75"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>} />
        <KpiCard label="Partenaires" value={String(partenaires.filter(p => p.statut === "validé").length)} sub={`${partenaires.filter(p => p.statut === "en attente").length} en attente de validation`} color="#D85A30"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>} />
        <KpiCard label="Revenus" value={`${revenue.toLocaleString("fr-FR")} €`} sub={`${transactions.filter(t => t.statut === "Payé").length} transactions`} color="#7C3AED"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v10M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5S13.66 12 12 12s-3 1.12-3 2.5S10.34 17 12 17s3-1.12 3-2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Dernières demandes */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED" }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #EAEFED" }}>
            <span className="font-extrabold text-[15px]">Dernières demandes</span>
            <button className="text-[12.5px] font-bold border-0 bg-transparent cursor-pointer p-0" style={{ color: "#1D9E75" }}>Voir tout</button>
          </div>
          {recentDemandes.map((d, i) => (
            <div key={d.id} className="px-5 py-3.5 flex items-center gap-3" style={{ borderBottom: i < recentDemandes.length - 1 ? "1px solid #EAEFED" : undefined }}>
              <div className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 text-[11px] font-extrabold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
                {d.intervention === "remplacement" ? "RMP" : d.intervention === "reparation" ? "REP" : "VIT"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13.5px] truncate">{d.title}</div>
                <div className="text-[12px] font-semibold" style={{ color: "#6B7280" }}>{d.city} · {d.age}</div>
              </div>
              {d.isNew && <span className="text-[10.5px] font-extrabold text-white rounded-full px-2 py-0.5 flex-shrink-0" style={{ background: "#D8302F" }}>NEW</span>}
            </div>
          ))}
        </div>

        {/* Partenaires en attente */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED" }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #EAEFED" }}>
            <span className="font-extrabold text-[15px]">Validations en attente</span>
            <span className="text-[11.5px] font-extrabold text-white rounded-full px-2.5 py-1" style={{ background: "#D85A30" }}>
              {partenaires.filter(p => p.statut === "en attente").length}
            </span>
          </div>
          {partenaires.filter(p => p.statut === "en attente").map((p, i, arr) => (
            <div key={p.id} className="px-5 py-3.5 flex items-center gap-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid #EAEFED" : undefined }}>
              <div className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 font-extrabold text-[13px] text-white" style={{ background: "linear-gradient(150deg,#1D9E75,#0F5C44)" }}>
                {p.societe[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13.5px] truncate">{p.societe}</div>
                <div className="text-[12px] font-semibold" style={{ color: "#6B7280" }}>{p.region} · {p.inscrit}</div>
              </div>
              <span className="text-[11px] font-extrabold rounded-full px-2.5 py-1 flex-shrink-0" style={{ background: "#FDE8E8", color: "#D8302F" }}>
                Kbis à vérifier
              </span>
            </div>
          ))}
          {partenaires.filter(p => p.statut === "en attente").length === 0 && (
            <div className="px-5 py-8 text-center text-[13.5px] font-semibold" style={{ color: "#9aa39e" }}>
              ✓ Aucune validation en attente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Demandes view ─── */
function DemandesAdminView() {
  const [search, setSearch] = useState("");
  const [filterIntervention, setFilterIntervention] = useState("toutes");
  const [unlockCounts, setUnlockCounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<(typeof DEMANDES)[0] | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem("mg_unlock_counts");
      if (v) setUnlockCounts(JSON.parse(v));
    } catch {}
  }, []);

  const filtered = useMemo(() => {
    return DEMANDES.filter(d => {
      const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase());
      const matchInterv = filterIntervention === "toutes" || d.intervention === filterIntervention;
      return matchSearch && matchInterv;
    });
  }, [search, filterIntervention]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Demandes</h1>
        <p className="m-0 mt-1 text-[14px] font-medium" style={{ color: "#6B7280" }}>{DEMANDES.length} demandes au total sur la plateforme.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9aa39e" }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-[10px] pl-9 pr-4 py-2.5 text-[13.5px] font-medium outline-none w-[200px]"
            style={{ border: "1px solid #EAEFED", background: "#fff" }}
          />
        </div>
        {["toutes", "remplacement", "reparation", "vitre"].map((v) => (
          <button
            key={v}
            onClick={() => setFilterIntervention(v)}
            className="rounded-[9px] px-3.5 py-2 text-[12.5px] font-bold border-0 cursor-pointer transition-all capitalize"
            style={filterIntervention === v
              ? { background: "#1D9E75", color: "#fff" }
              : { background: "#fff", color: "#3d4b44", border: "1px solid #EAEFED" }
            }
          >
            {v === "toutes" ? "Toutes" : v === "remplacement" ? "Remplacement" : v === "reparation" ? "Réparation" : "Vitre"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED" }}>
        <div className="grid px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-wider" style={{ gridTemplateColumns: "50px 1fr 140px 120px 100px 90px 90px 100px", color: "#9aa39e", borderBottom: "1px solid #EAEFED" }}>
          <span>ID</span><span>Véhicule</span><span>Ville</span><span>Type</span><span>Assurance</span><span>Publié</span><span>Déblocages</span><span>Actions</span>
        </div>
        {filtered.map((d, i) => {
          const intervColor = d.intervention === "remplacement" ? { bg: "#EAF1FE", color: "#2563EB" } : d.intervention === "reparation" ? { bg: "#E8F6F0", color: "#1D9E75" } : { bg: "#EDE9FE", color: "#6D28D9" };
          const intervLabel = d.intervention === "remplacement" ? "Remplacement" : d.intervention === "reparation" ? "Réparation" : "Vitre";
          const count = unlockCounts[d.id] ?? 0;
          return (
            <div key={d.id} className="grid items-center px-5 py-3.5" style={{ gridTemplateColumns: "50px 1fr 140px 120px 100px 90px 90px 100px", borderBottom: i < filtered.length - 1 ? "1px solid #EAEFED" : undefined }}>
              <span className="text-[12px] font-bold" style={{ color: "#9aa39e" }}>#{d.id}</span>
              <div>
                <div className="font-bold text-[13.5px]">{d.title}</div>
                {d.clientName && <div className="text-[11.5px] font-semibold" style={{ color: "#6B7280" }}>{d.clientName}</div>}
              </div>
              <span className="text-[13px] font-semibold">{d.city}</span>
              <span className="inline-flex text-[11.5px] font-bold rounded-full px-2.5 py-1 w-fit" style={{ background: intervColor.bg, color: intervColor.color }}>{intervLabel}</span>
              <span className="inline-flex text-[11.5px] font-bold rounded-full px-2.5 py-1 w-fit" style={{ background: d.insurance === "avec" ? "#E8F6F0" : "#FCEDE7", color: d.insurance === "avec" ? "#0F5C44" : "#B0431F" }}>
                {d.insurance === "avec" ? "Assuré" : "Sans"}
              </span>
              <span className="text-[12.5px] font-semibold" style={{ color: "#6B7280" }}>{d.age}</span>
              <span className="inline-flex items-center gap-1 text-[12.5px] font-extrabold" style={{ color: count >= 4 ? "#B0431F" : count > 0 ? "#0F5C44" : "#9aa39e" }}>
                {count}/4
              </span>
              <div className="flex gap-1.5">
                <button onClick={() => setSelected(d)} className="rounded-[8px] px-2.5 py-1.5 text-[11.5px] font-bold border-0 cursor-pointer" style={{ background: "#E8F6F0", color: "#0F5C44" }}>Voir</button>
                <button className="rounded-[8px] px-2.5 py-1.5 text-[11.5px] font-bold border-0 cursor-pointer" style={{ background: "#FCEDE7", color: "#B0431F" }}>Retirer</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal fiche ── */}
      {selected && (() => {
        const intervLabel = selected.intervention === "remplacement" ? "Remplacement pare-brise" : selected.intervention === "reparation" ? "Réparation d'impact" : "Vitre latérale / lunette";
        const count = unlockCounts[selected.id] ?? 0;
        const rows: { label: string; value: string | undefined }[] = [
          { label: "ID",            value: `#${selected.id}` },
          { label: "Véhicule",      value: selected.title },
          { label: "Ville",         value: selected.city },
          { label: "Type",          value: intervLabel },
          { label: "Zone touchée",  value: selected.damageZone },
          { label: "Description",   value: selected.damage },
          { label: "Assurance",     value: selected.insurance === "avec" ? "Oui — tous risques" : "Non" },
          { label: "Disponibilité", value: selected.availability },
          { label: "Publié",        value: selected.age },
          { label: "Client",        value: selected.clientName },
          { label: "Téléphone",     value: selected.phone },
          { label: "Email",         value: selected.email },
          { label: "Déblocages",    value: `${count}/4 réparateurs` },
        ];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.55)" }} onClick={() => setSelected(null)}>
            <div className="bg-white rounded-[20px] w-full max-w-[520px] overflow-hidden" style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #EAEFED" }}>
                <div>
                  <div className="font-extrabold text-[17px]">{selected.title}</div>
                  <div className="text-[13px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>{selected.city}</div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center border-0 cursor-pointer" style={{ background: "#F4F6F5", color: "#6B7280" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
              {/* Body */}
              <div className="px-6 py-5 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto">
                {rows.filter(r => r.value).map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-4">
                    <span className="text-[12.5px] font-bold flex-shrink-0" style={{ color: "#9aa39e", minWidth: 110 }}>{label}</span>
                    <span className="text-[13px] font-semibold text-right" style={{ color: label === "Déblocages" && count >= 4 ? "#B0431F" : "#11211B" }}>{value}</span>
                  </div>
                ))}
                {selected.photos && selected.photos.length > 0 && (
                  <div className="mt-2">
                    <span className="text-[12.5px] font-bold block mb-2" style={{ color: "#9aa39e" }}>Photos</span>
                    <div className="flex gap-2 flex-wrap">
                      {selected.photos.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-24 h-24 object-cover rounded-[10px]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-6 py-4 flex justify-end" style={{ borderTop: "1px solid #EAEFED" }}>
                <button onClick={() => setSelected(null)} className="rounded-[10px] px-5 py-2.5 font-bold text-[13.5px] border-0 cursor-pointer" style={{ background: "#F4F6F5", color: "#6B7280" }}>Fermer</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ─── Particuliers view ─── */
function ParticuliersView({ users, setUsers }: { users: Particulier[]; setUsers: React.Dispatch<React.SetStateAction<Particulier[]>> }) {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = !search || u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "tous" || u.statut === filterStatut;
    return matchSearch && matchStatut;
  }), [users, search, filterStatut]);

  function toggleStatut(id: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, statut: u.statut === "actif" ? "suspendu" : "actif" } : u));
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Particuliers</h1>
        <p className="m-0 mt-1 text-[14px] font-medium" style={{ color: "#6B7280" }}>{users.length} comptes particuliers enregistrés.</p>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9aa39e" }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-[10px] pl-9 pr-4 py-2.5 text-[13.5px] font-medium outline-none w-[200px]" style={{ border: "1px solid #EAEFED", background: "#fff" }} />
        </div>
        {["tous", "actif", "suspendu"].map((v) => (
          <button key={v} onClick={() => setFilterStatut(v)} className="rounded-[9px] px-3.5 py-2 text-[12.5px] font-bold border-0 cursor-pointer capitalize"
            style={filterStatut === v ? { background: "#1D9E75", color: "#fff" } : { background: "#fff", color: "#3d4b44", border: "1px solid #EAEFED" }}>
            {v === "tous" ? "Tous" : v === "actif" ? "Actifs" : "Suspendus"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED" }}>
        <div className="grid px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-wider" style={{ gridTemplateColumns: "50px 1fr 200px 80px 100px 120px", color: "#9aa39e", borderBottom: "1px solid #EAEFED" }}>
          <span>ID</span><span>Nom</span><span>Email</span><span>Dem.</span><span>Statut</span><span>Actions</span>
        </div>
        {filtered.map((u, i) => (
          <div key={u.id} className="grid items-center px-5 py-3.5" style={{ gridTemplateColumns: "50px 1fr 200px 80px 100px 120px", borderBottom: i < filtered.length - 1 ? "1px solid #EAEFED" : undefined }}>
            <span className="text-[12px] font-bold" style={{ color: "#9aa39e" }}>{u.id}</span>
            <div>
              <div className="font-bold text-[13.5px]">{u.nom}</div>
              <div className="text-[11.5px] font-semibold" style={{ color: "#9aa39e" }}>{u.inscrit}</div>
            </div>
            <span className="text-[13px] font-medium truncate" style={{ color: "#6B7280" }}>{u.email}</span>
            <span className="font-extrabold text-[13px]" style={{ color: "#0F5C44" }}>{u.demandes}</span>
            <span className="inline-flex text-[11.5px] font-bold rounded-full px-2.5 py-1 w-fit"
              style={u.statut === "actif" ? { background: "#E8F6F0", color: "#0F5C44" } : { background: "#FCEDE7", color: "#B0431F" }}>
              {u.statut === "actif" ? "Actif" : "Suspendu"}
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => toggleStatut(u.id)} className="rounded-[8px] px-2.5 py-1.5 text-[11.5px] font-bold border-0 cursor-pointer"
                style={u.statut === "actif" ? { background: "#FCEDE7", color: "#B0431F" } : { background: "#E8F6F0", color: "#0F5C44" }}>
                {u.statut === "actif" ? "Suspendre" : "Réactiver"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Partenaires view ─── */
function PartenairesView({ partenaires, setPartenaires }: { partenaires: Partenaire[]; setPartenaires: React.Dispatch<React.SetStateAction<Partenaire[]>> }) {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [selected, setSelected] = useState<Partenaire | null>(null);

  const filtered = useMemo(() => partenaires.filter(p => {
    const matchSearch = !search || p.societe.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "tous" || p.statut === filterStatut;
    return matchSearch && matchStatut;
  }), [partenaires, search, filterStatut]);

  function updateStatut(id: string, statut: Partenaire["statut"]) {
    setPartenaires(prev => prev.map(p => p.id === id ? { ...p, statut } : p));
    setSelected(null);
  }

  const statutStyle: Record<Partenaire["statut"], { bg: string; color: string; label: string }> = {
    "validé":      { bg: "#E8F6F0", color: "#0F5C44", label: "Validé" },
    "en attente":  { bg: "#FEF3E8", color: "#B06B10", label: "En attente" },
    "suspendu":    { bg: "#FCEDE7", color: "#B0431F", label: "Suspendu" },
    "refusé":      { bg: "#F4F6F5", color: "#6B7280", label: "Refusé" },
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Partenaires</h1>
        <p className="m-0 mt-1 text-[14px] font-medium" style={{ color: "#6B7280" }}>
          {partenaires.filter(p => p.statut === "validé").length} validés · {partenaires.filter(p => p.statut === "en attente").length} en attente de validation Kbis.
        </p>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9aa39e" }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-[10px] pl-9 pr-4 py-2.5 text-[13.5px] font-medium outline-none w-[200px]" style={{ border: "1px solid #EAEFED", background: "#fff" }} />
        </div>
        {["tous", "en attente", "validé", "suspendu", "refusé"].map((v) => (
          <button key={v} onClick={() => setFilterStatut(v)} className="rounded-[9px] px-3.5 py-2 text-[12.5px] font-bold border-0 cursor-pointer capitalize"
            style={filterStatut === v ? { background: "#1D9E75", color: "#fff" } : { background: "#fff", color: "#3d4b44", border: "1px solid #EAEFED" }}>
            {v === "tous" ? "Tous" : v === "en attente" ? "En attente" : v === "validé" ? "Validés" : v === "suspendu" ? "Suspendus" : "Refusés"}
            {v === "en attente" && partenaires.filter(p => p.statut === "en attente").length > 0 && (
              <span className="ml-1.5 text-[10px] font-extrabold text-white rounded-full px-1.5 py-0.5" style={{ background: "#D85A30" }}>
                {partenaires.filter(p => p.statut === "en attente").length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED" }}>
        <div className="grid px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-wider" style={{ gridTemplateColumns: "50px 1fr 160px 120px 80px 100px 140px", color: "#9aa39e", borderBottom: "1px solid #EAEFED" }}>
          <span>ID</span><span>Société</span><span>Région</span><span>SIRET</span><span>Jetons</span><span>Statut</span><span>Actions</span>
        </div>
        {filtered.map((p, i) => {
          const st = statutStyle[p.statut];
          return (
            <div key={p.id} className="grid items-center px-5 py-3.5" style={{ gridTemplateColumns: "50px 1fr 160px 120px 80px 100px 140px", borderBottom: i < filtered.length - 1 ? "1px solid #EAEFED" : undefined }}>
              <span className="text-[12px] font-bold" style={{ color: "#9aa39e" }}>{p.id}</span>
              <div>
                <div className="font-bold text-[13.5px]">{p.societe}</div>
                <div className="text-[11.5px] font-semibold" style={{ color: "#9aa39e" }}>{p.gerant} · {p.email}</div>
              </div>
              <span className="text-[12.5px] font-semibold" style={{ color: "#6B7280" }}>{p.region.split(" ")[0]}</span>
              <span className="text-[12px] font-mono" style={{ color: "#6B7280" }}>{p.siret}</span>
              <span className="font-extrabold text-[13px]" style={{ color: "#0F5C44" }}>{p.jetons}</span>
              <span className="inline-flex text-[11.5px] font-bold rounded-full px-2.5 py-1 w-fit" style={{ background: st.bg, color: st.color }}>{st.label}</span>
              <div className="flex gap-1.5 flex-wrap">
                {p.statut === "en attente" && (
                  <>
                    <button onClick={() => updateStatut(p.id, "validé")} className="rounded-[8px] px-2.5 py-1.5 text-[11px] font-bold border-0 cursor-pointer" style={{ background: "#E8F6F0", color: "#0F5C44" }}>✓ Valider</button>
                    <button onClick={() => updateStatut(p.id, "refusé")} className="rounded-[8px] px-2.5 py-1.5 text-[11px] font-bold border-0 cursor-pointer" style={{ background: "#FCEDE7", color: "#B0431F" }}>✕ Refuser</button>
                  </>
                )}
                {p.statut === "validé" && (
                  <button onClick={() => updateStatut(p.id, "suspendu")} className="rounded-[8px] px-2.5 py-1.5 text-[11px] font-bold border-0 cursor-pointer" style={{ background: "#FEF3E8", color: "#B06B10" }}>Suspendre</button>
                )}
                {(p.statut === "suspendu" || p.statut === "refusé") && (
                  <button onClick={() => updateStatut(p.id, "validé")} className="rounded-[8px] px-2.5 py-1.5 text-[11px] font-bold border-0 cursor-pointer" style={{ background: "#E8F6F0", color: "#0F5C44" }}>Réactiver</button>
                )}
                <button onClick={() => setSelected(p)} className="rounded-[8px] px-2.5 py-1.5 text-[11px] font-bold border-0 cursor-pointer" style={{ background: "#F4F6F5", color: "#3d4b44" }}>Détails</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.55)" }} onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[20px] p-7 w-full max-w-[480px] animate-mgPop" style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="m-0 text-[18px] font-extrabold">{selected.societe}</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center border-0 cursor-pointer text-[16px]" style={{ background: "#F4F6F5", color: "#6B7280" }}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Gérant", value: selected.gerant },
                { label: "Email", value: selected.email },
                { label: "SIRET", value: selected.siret },
                { label: "Région", value: selected.region },
                { label: "Inscrit le", value: selected.inscrit },
                { label: "Jetons restants", value: `${selected.jetons} jetons` },
              ].map(row => (
                <div key={row.label} className="rounded-[11px] p-3" style={{ background: "#FAFBFB", border: "1px solid #EEF2F0" }}>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#9aa39e" }}>{row.label}</div>
                  <div className="font-bold text-[13.5px]">{row.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 rounded-[11px] flex items-center gap-3" style={{ background: "#FDE8E8", border: "1px solid #FBBDBD" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6Z" stroke="#D85A30" strokeWidth="1.8"/><path d="M14 2v6h6M12 11v6M9 14l3-3 3 3" stroke="#D85A30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div>
                <div className="font-bold text-[13px]" style={{ color: "#B0431F" }}>Extrait Kbis joint</div>
                <div className="text-[12px] font-semibold" style={{ color: "#D85A30" }}>kbis_{selected.id.toLowerCase()}.pdf · à vérifier</div>
              </div>
              <button className="ml-auto rounded-[9px] px-3 py-2 font-bold text-[12.5px] border-0 cursor-pointer flex-shrink-0" style={{ background: "#D85A30", color: "#fff" }}>Télécharger</button>
            </div>
            {selected.statut === "en attente" && (
              <div className="flex gap-3 mt-5">
                <button onClick={() => updateStatut(selected.id, "validé")} className="flex-1 py-3 rounded-[11px] font-bold text-[14px] text-white border-0 cursor-pointer" style={{ background: "#1D9E75" }}>✓ Valider le compte</button>
                <button onClick={() => updateStatut(selected.id, "refusé")} className="flex-1 py-3 rounded-[11px] font-bold text-[14px] border-0 cursor-pointer" style={{ background: "#FCEDE7", color: "#B0431F" }}>✕ Refuser</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Jetons & revenus view ─── */
function JetonsView({ transactions }: { transactions: TokenTx[] }) {
  const totalRevenue = transactions.filter(t => t.statut === "Payé").reduce((acc, t) => acc + parseFloat(t.montant.replace(",", ".").replace(" €", "")), 0);
  const totalJetons  = transactions.filter(t => t.statut === "Payé").reduce((acc, t) => acc + t.jetons, 0);
  const [search, setSearch] = useState("");

  const filtered = transactions.filter(t =>
    !search || t.partenaire.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Jetons & revenus</h1>
        <p className="m-0 mt-1 text-[14px] font-medium" style={{ color: "#6B7280" }}>Suivi des transactions et revenus de la plateforme.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard label="Revenus totaux" value={`${totalRevenue.toLocaleString("fr-FR")} €`} sub="Toutes transactions payées" color="#7C3AED"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>} />
        <KpiCard label="Jetons vendus" value={String(totalJetons)} sub={`${transactions.length} transactions`} color="#1D9E75"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>} />
        <KpiCard label="Ticket moyen" value={`${transactions.length ? Math.round(totalRevenue / transactions.filter(t => t.statut === "Payé").length) : 0} €`} sub="Par transaction" color="#D85A30"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-3M9 7V5a2 2 0 014 0v2M9 7h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9aa39e" }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-[10px] pl-9 pr-4 py-2.5 text-[13.5px] font-medium outline-none w-[220px]" style={{ border: "1px solid #EAEFED", background: "#fff" }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED" }}>
        <div className="grid px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-wider" style={{ gridTemplateColumns: "140px 1fr 120px 80px 100px 90px", color: "#9aa39e", borderBottom: "1px solid #EAEFED" }}>
          <span>Référence</span><span>Partenaire</span><span>Pack</span><span>Jetons</span><span>Montant</span><span>Statut</span>
        </div>
        {filtered.map((t, i) => (
          <div key={t.id} className="grid items-center px-5 py-3.5" style={{ gridTemplateColumns: "140px 1fr 120px 80px 100px 90px", borderBottom: i < filtered.length - 1 ? "1px solid #EAEFED" : undefined }}>
            <span className="text-[12.5px] font-bold">{t.id}</span>
            <div>
              <div className="font-bold text-[13.5px]">{t.partenaire}</div>
              <div className="text-[11.5px] font-semibold" style={{ color: "#9aa39e" }}>{t.date}</div>
            </div>
            <span className="text-[13px] font-semibold" style={{ color: "#6B7280" }}>{t.pack}</span>
            <span className="font-extrabold text-[13px]" style={{ color: "#0F5C44" }}>+{t.jetons}</span>
            <span className="font-bold text-[13px]">{t.montant}</span>
            <span className="inline-flex text-[11.5px] font-bold rounded-full px-2.5 py-1 w-fit"
              style={t.statut === "Payé" ? { background: "#E8F6F0", color: "#0F5C44" } : { background: "#FCEDE7", color: "#B0431F" }}>
              {t.statut}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Paramètres view ─── */
function ParametresView() {
  const [prixJeton, setPrixJeton]     = useState("8.00");
  const [commFee, setCommFee]         = useState("0");
  const [maxPhotos, setMaxPhotos]     = useState("5");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved]             = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Paramètres</h1>
        <p className="m-0 mt-1 text-[14px] font-medium" style={{ color: "#6B7280" }}>Configuration globale de la plateforme.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-4" style={{ border: "1px solid #EAEFED" }}>
        <h2 className="m-0 mb-4 text-[16px] font-extrabold">Tarification</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold mb-1.5">Prix par jeton (€)</label>
            <input type="number" step="0.5" value={prixJeton} onChange={(e) => setPrixJeton(e.target.value)} className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none" style={{ border: "1px solid #EAEFED" }} />
          </div>
          <div>
            <label className="block text-[13px] font-bold mb-1.5">Commission plateforme (%)</label>
            <input type="number" step="1" value={commFee} onChange={(e) => setCommFee(e.target.value)} className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none" style={{ border: "1px solid #EAEFED" }} />
            <p className="m-0 mt-1 text-[11.5px]" style={{ color: "#9aa39e" }}>0% = pas de commission sur les devis</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-4" style={{ border: "1px solid #EAEFED" }}>
        <h2 className="m-0 mb-4 text-[16px] font-extrabold">Limites & contraintes</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold mb-1.5">Photos max par demande</label>
            <input type="number" min="1" max="10" value={maxPhotos} onChange={(e) => setMaxPhotos(e.target.value)} className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none" style={{ border: "1px solid #EAEFED" }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: "1px solid #EAEFED" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-extrabold text-[15px]">Mode maintenance</div>
            <div className="text-[13px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>Affiche une page d'entretien aux visiteurs. Les admins gardent l'accès.</div>
          </div>
          <button
            onClick={() => setMaintenanceMode(v => !v)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-0 cursor-pointer flex-shrink-0"
            style={{ background: maintenanceMode ? "#D85A30" : "#EAEFED" }}
          >
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow" style={{ transform: maintenanceMode ? "translateX(22px)" : "translateX(4px)" }} />
          </button>
        </div>
      </div>

      <button
        onClick={save}
        className="text-white rounded-[11px] px-7 py-3.5 font-bold text-[14.5px] border-0 cursor-pointer transition-all"
        style={{ background: saved ? "#0F5C44" : "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
      >
        {saved ? "✓ Paramètres sauvegardés" : "Sauvegarder les paramètres"}
      </button>
    </div>
  );
}

/* ─── Main page ─── */
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [nav, setNav]           = useState<AdminNav>("dashboard");
  const [particuliers, setParticuliers] = useState<Particulier[]>(PARTICULIERS_SEED);
  const [partenaires, setPartenaires]   = useState<Partenaire[]>(PARTENAIRES_SEED);
  const transactions = TOKENS_SEED;

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem("mg_admin_token");
    if (token) setLoggedIn(true);
  }, []);

  const pendingCount = partenaires.filter(p => p.statut === "en attente").length;

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      {/* Top navbar */}
      <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between" style={{ height: 64 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: "#1D9E75" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7v5c0 5.5 3.5 9 8 11 4.5-2 8-5.5 8-11V7l-8-4Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-[16px] tracking-tight">Minute Glass</span>
            <span className="text-[11.5px] font-bold rounded-full px-2.5 py-1" style={{ background: "#E8F6F0", color: "#0F5C44" }}>Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <button onClick={() => setNav("partenaires")} className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[12.5px] font-bold border-0 cursor-pointer" style={{ background: "#FCEDE7", color: "#B0431F" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                {pendingCount} validation{pendingCount > 1 ? "s" : ""} en attente
              </button>
            )}
            <Link href="/" className="text-[13px] font-bold no-underline" style={{ color: "#6B7280" }}>← Site</Link>
            <button onClick={() => setLoggedIn(false)} className="rounded-[10px] px-3.5 py-2 text-[13px] font-bold border-0 cursor-pointer" style={{ background: "#F4F6F5", color: "#3d4b44" }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1320px] mx-auto px-6 flex gap-6">
        <AdminSidebar active={nav} onChange={setNav} pendingCount={pendingCount} />
        <main className="flex-1 min-w-0 py-6 pb-16">
          {nav === "dashboard"   && <DashboardView particuliers={particuliers} partenaires={partenaires} transactions={transactions} />}
          {nav === "demandes"    && <DemandesAdminView />}
          {nav === "particuliers" && <ParticuliersView users={particuliers} setUsers={setParticuliers} />}
          {nav === "partenaires" && <PartenairesView partenaires={partenaires} setPartenaires={setPartenaires} />}
          {nav === "jetons"      && <JetonsView transactions={transactions} />}
          {nav === "parametres"  && <ParametresView />}
        </main>
      </div>
    </div>
  );
}
