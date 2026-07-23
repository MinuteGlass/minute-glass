"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

/* ─── Seed data ─── */
const PARTENAIRES: Record<string, Partenaire> = {
  "vitro-pro-lyon": {
    id: "vitro-pro-lyon",
    name: "Vitro Pro Lyon",
    avatar: "VP",
    avatarBg: "#1D9E75",
    badge: "Certifié MinuteGlass",
    tagline: "Remplacement & réparation pare-brise · Intervention à domicile",
    city: "Lyon (69)",
    zone: ["Rhône (69)", "Ain (01)", "Isère (38)"],
    phone: "04 72 XX XX XX",
    email: "contact@vitroprolyon.fr",
    website: "vitroprolyon.fr",
    since: "2019",
    interventions: ["Remplacement pare-brise", "Réparation d'impact", "Vitre latérale"],
    assurances: ["MAIF", "AXA", "Groupama", "Allianz", "MMA", "Covéa"],
    note: 4.8,
    nbAvis: 127,
    nbFiches: 214,
    tauxReponse: 96,
    delaiMoyen: "< 1 h",
    description: `Vitro Pro Lyon est un réparateur indépendant spécialisé dans le vitrage automobile depuis 2019. Nous intervenons à domicile ou sur votre lieu de travail dans toute la région lyonnaise et ses environs.\n\nAgréés par les principales compagnies d'assurance, nous gérons l'intégralité des démarches à votre place : déclaration, prise en charge et règlement direct avec votre assureur. Vous n'avez rien à avancer.\n\nNos techniciens sont formés aux normes CARGLASS® et utilisent exclusivement des vitrages homologués constructeur.`,
    avis: [
      { id: 1, author: "Marie T.", note: 5, date: "12 juin 2026", text: "Intervention rapide et soignée, technicien très professionnel. Je recommande vivement !", vehicle: "Renault Clio" },
      { id: 2, author: "Jean-Paul M.", note: 5, date: "3 juin 2026", text: "Prise en charge complète par l'assurance, zéro démarche de notre côté. Parfait.", vehicle: "Peugeot 308" },
      { id: 3, author: "Sophie L.", note: 4, date: "28 mai 2026", text: "Très bon travail, délai un peu plus long que prévu mais résultat impeccable.", vehicle: "Citroën C3" },
      { id: 4, author: "Thomas R.", note: 5, date: "14 mai 2026", text: "Contacté en moins d'une heure après ma demande. Intervention le lendemain matin. Top !", vehicle: "BMW Série 3" },
      { id: 5, author: "Isabelle F.", note: 5, date: "2 mai 2026", text: "Équipe sympathique, travail propre. Vitre latérale changée en 45 minutes chrono.", vehicle: "Volkswagen Golf" },
      { id: 6, author: "Marc D.", note: 4, date: "18 avr. 2026", text: "Bon rapport qualité-prix, professionnels sérieux. Légèrement moins bien sur la ponctualité.", vehicle: "Toyota Yaris" },
    ],
  },
};

type Partenaire = {
  id: string; name: string; avatar: string; avatarBg: string;
  badge: string; tagline: string; city: string; zone: string[];
  phone: string; email: string; website: string; since: string;
  interventions: string[]; assurances: string[];
  note: number; nbAvis: number; nbFiches: number; tauxReponse: number; delaiMoyen: string;
  description: string; avis: Avis[];
};
type Avis = { id: number; author: string; note: number; date: string; text: string; vehicle: string };

function Stars({ note, size = 14 }: { note: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(note) ? "#F5A623" : "none"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke="#F5A623" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      ))}
    </span>
  );
}

export default function PartenaireProfilePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const p = PARTENAIRES[id] ?? PARTENAIRES["vitro-pro-lyon"];
  const [tab, setTab] = useState<"presentation" | "avis">("presentation");
  const [contactOpen, setContactOpen] = useState(false);

  const noteDistrib = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: p.avis.filter((a) => a.note === star).length,
    pct: Math.round((p.avis.filter((a) => a.note === star).length / p.avis.length) * 100),
  }));

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12.5px] font-semibold mb-5" style={{ color: "#9aa39e" }}>
          <Link href="/" className="no-underline hover:underline" style={{ color: "#9aa39e" }}>Accueil</Link>
          <span>›</span>
          <span style={{ color: "#11211B" }}>{p.name}</span>
        </div>

        <div className="flex gap-6 items-start flex-col lg:flex-row">

          {/* ── Left column ── */}
          <div className="flex-1 min-w-0">

            {/* Profile card */}
            <div className="bg-white rounded-[20px] p-6 mb-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 2px 12px rgba(17,33,27,.05)" }}>
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-[68px] h-[68px] rounded-[18px] flex items-center justify-center text-white font-extrabold text-[22px]"
                  style={{ background: p.avatarBg }}
                >
                  {p.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="m-0 text-[22px] font-extrabold tracking-tight">{p.name}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4" stroke="#0F5C44" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {p.badge}
                    </span>
                  </div>
                  <p className="m-0 text-[13.5px] font-semibold" style={{ color: "#6B7280" }}>{p.tagline}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: "#6B7280" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11Z" stroke="#9aa39e" strokeWidth="1.8"/><circle cx="12" cy="10" r="2.2" stroke="#9aa39e" strokeWidth="1.8"/></svg>
                      {p.city}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: "#6B7280" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="#9aa39e" strokeWidth="1.8"/><path d="M3 9h18M8 2v4M16 2v4" stroke="#9aa39e" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      Depuis {p.since}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Stars note={p.note} size={13} />
                      <span className="text-[12.5px] font-bold">{p.note}</span>
                      <span className="text-[12.5px] font-semibold" style={{ color: "#9aa39e" }}>({p.nbAvis} avis)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Taux de réponse", value: `${p.tauxReponse}%`, sub: "sur les 3 derniers mois", color: "#1D9E75" },
                { label: "Délai moyen", value: p.delaiMoyen, sub: "pour vous contacter", color: "#2563EB" },
                { label: "Fiches traitées", value: String(p.nbFiches), sub: "depuis l'inscription", color: "#6D28D9" },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="bg-white rounded-[14px] p-4 text-center" style={{ border: "1px solid #EAEFED" }}>
                  <div className="text-[24px] font-extrabold" style={{ color }}>{value}</div>
                  <div className="text-[11.5px] font-bold mt-0.5">{label}</div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color: "#9aa39e" }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {(["presentation", "avis"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="rounded-[10px] px-4 py-2.5 text-[13px] font-bold border-0 cursor-pointer"
                  style={tab === t
                    ? { background: "#1D9E75", color: "#fff" }
                    : { background: "#fff", color: "#3d4b44", border: "1px solid #EAEFED" }
                  }
                >
                  {t === "presentation" ? "Présentation" : `Avis (${p.nbAvis})`}
                </button>
              ))}
            </div>

            {/* Présentation tab */}
            {tab === "presentation" && (
              <div className="bg-white rounded-[18px] p-6 mb-5" style={{ border: "1px solid #EAEFED" }}>
                <h2 className="m-0 mb-4 text-[16px] font-extrabold">À propos</h2>
                {p.description.split("\n\n").map((para, i) => (
                  <p key={i} className="m-0 mb-3 last:mb-0 text-[14px] leading-relaxed" style={{ color: "#3d4b44" }}>{para}</p>
                ))}

                <hr className="my-5" style={{ borderColor: "#EAEFED", borderTopWidth: 0 }} />

                <h3 className="m-0 mb-3 text-[14px] font-extrabold">Interventions proposées</h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.interventions.map((iv) => (
                    <span key={iv} className="rounded-[8px] px-3 py-1.5 text-[12.5px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
                      {iv}
                    </span>
                  ))}
                </div>

                <h3 className="m-0 mb-3 text-[14px] font-extrabold">Zone d'intervention</h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.zone.map((z) => (
                    <span key={z} className="rounded-[8px] px-3 py-1.5 text-[12.5px] font-bold" style={{ background: "#EAF1FE", color: "#2563EB" }}>
                      📍 {z}
                    </span>
                  ))}
                </div>

              </div>
            )}

            {/* Avis tab */}
            {tab === "avis" && (
              <div>
                {/* Note globale */}
                <div className="bg-white rounded-[18px] p-6 mb-4 flex items-center gap-8 flex-wrap" style={{ border: "1px solid #EAEFED" }}>
                  <div className="text-center flex-shrink-0">
                    <div className="text-[52px] font-extrabold leading-none" style={{ color: "#11211B" }}>{p.note}</div>
                    <Stars note={p.note} size={18} />
                    <div className="text-[12px] font-semibold mt-1" style={{ color: "#9aa39e" }}>{p.nbAvis} avis</div>
                  </div>
                  <div className="flex-1 min-w-[180px] flex flex-col gap-1.5">
                    {noteDistrib.map(({ star, count, pct }) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-[12px] font-bold w-4 text-right">{star}</span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#F5A623"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" strokeLinejoin="round"/></svg>
                        <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "#EAEFED" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#F5A623" }} />
                        </div>
                        <span className="text-[11.5px] font-semibold w-6" style={{ color: "#9aa39e" }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Liste avis */}
                <div className="flex flex-col gap-3">
                  {p.avis.map((a) => (
                    <div key={a.id} className="bg-white rounded-[14px] p-5" style={{ border: "1px solid #EAEFED" }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="font-bold text-[14px]">{a.author}</div>
                          <div className="text-[12px] font-semibold" style={{ color: "#9aa39e" }}>{a.vehicle} · {a.date}</div>
                        </div>
                        <Stars note={a.note} size={13} />
                      </div>
                      <p className="m-0 text-[13.5px] leading-relaxed" style={{ color: "#3d4b44" }}>{a.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column (sticky contact card) ── */}
          <div className="w-full lg:w-[300px] flex-shrink-0 lg:sticky lg:top-[88px]">
            <div className="bg-white rounded-[18px] p-6" style={{ border: "1px solid #EAEFED", boxShadow: "0 4px 20px rgba(17,33,27,.07)" }}>
              <h3 className="m-0 mb-1 text-[16px] font-extrabold">Contacter ce partenaire</h3>
              <p className="m-0 mb-5 text-[13px] font-medium" style={{ color: "#6B7280" }}>Demandez un devis directement.</p>

              <button
                onClick={() => setContactOpen(true)}
                className="w-full text-white border-0 rounded-[12px] py-3.5 font-bold text-[14.5px] cursor-pointer mb-3"
                style={{ background: "#1D9E75", boxShadow: "0 4px 14px rgba(29,158,117,.3)" }}
              >
                📞 Demander un devis
              </button>

              <Link href="/deposer" className="no-underline">
                <button className="w-full rounded-[12px] py-3 font-bold text-[13.5px] cursor-pointer border" style={{ background: "#F4F6F5", color: "#11211B", borderColor: "#EAEFED" }}>
                  Déposer une demande
                </button>
              </Link>

              <hr className="my-5" style={{ borderColor: "#EAEFED", borderTopWidth: 0 }} />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: "#E8F6F0" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>Téléphone</div>
                    <div className="font-bold text-[13.5px]">{p.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: "#EAF1FE" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#2563EB" strokeWidth="1.8"/><path d="M3 7l9 6 9-6" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </span>
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>Email</div>
                    <div className="font-bold text-[13.5px] break-all">{p.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: "#EDE9FE" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" stroke="#6D28D9" strokeWidth="1.8"/><path d="M2 12h20M12 2c-2.76 3.33-4 6.67-4 10s1.24 6.67 4 10M12 2c2.76 3.33 4 6.67 4 10s-1.24 6.67-4 10" stroke="#6D28D9" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </span>
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>Site web</div>
                    <div className="font-bold text-[13.5px]">{p.website}</div>
                  </div>
                </div>
              </div>

              <hr className="my-5" style={{ borderColor: "#EAEFED", borderTopWidth: 0 }} />

              {/* Trust signals */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: "✅", text: "Identité vérifiée par MinuteGlass" },
                  { icon: "🛡️", text: "Agréé assurances" },
                  { icon: "⭐", text: `${p.note}/5 sur ${p.nbAvis} avis clients` },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[12.5px] font-semibold" style={{ color: "#3d4b44" }}>
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.55)" }} onClick={() => setContactOpen(false)}>
          <div className="bg-white rounded-[20px] p-8 max-w-[420px] w-full" style={{ boxShadow: "0 24px 60px rgba(17,33,27,.22)" }} onClick={(e) => e.stopPropagation()}>
            <h2 className="m-0 mb-1.5 text-[20px] font-extrabold">Demander un devis</h2>
            <p className="m-0 mb-5 text-[13.5px]" style={{ color: "#6B7280" }}>Décrivez votre besoin, <b>{p.name}</b> vous répond sous {p.delaiMoyen}.</p>
            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: "Votre nom", placeholder: "Jean Dupont" },
                { label: "Téléphone", placeholder: "06 00 00 00 00" },
                { label: "Votre véhicule", placeholder: "Renault Clio 2022" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-[12.5px] font-bold mb-1">{label}</label>
                  <input placeholder={placeholder} className="w-full rounded-[10px] px-3.5 py-2.5 text-[13.5px] outline-none" style={{ border: "1px solid #EAEFED" }} />
                </div>
              ))}
              <div>
                <label className="block text-[12.5px] font-bold mb-1">Type d'intervention</label>
                <select className="w-full rounded-[10px] px-3 py-2.5 text-[13.5px] outline-none bg-white font-semibold" style={{ border: "1px solid #EAEFED" }}>
                  <option>Remplacement pare-brise</option>
                  <option>Réparation d'impact</option>
                  <option>Vitre latérale</option>
                </select>
              </div>
            </div>
            <button
              className="w-full text-white border-0 rounded-[12px] py-3.5 font-bold text-[14.5px] cursor-pointer mb-3"
              style={{ background: "#1D9E75", boxShadow: "0 4px 14px rgba(29,158,117,.3)" }}
              onClick={() => setContactOpen(false)}
            >
              Envoyer ma demande
            </button>
            <button onClick={() => setContactOpen(false)} className="w-full bg-transparent border-0 text-[13px] font-semibold cursor-pointer" style={{ color: "#9aa39e" }}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
