"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getAuth } from "@/lib/auth";

const PACKS = [
  { name: "Starter",    packId: "starter",  tokens: 5,  bonus: 0, price: 9.90,  perToken: "1,98", highlight: false, badge: "🧪", save: null },
  { name: "Pro",        packId: "pro",       tokens: 12, bonus: 0, price: 19.90, perToken: "1,65", highlight: true,  badge: "🥈", save: null },
  { name: "Premium",    packId: "premium",   tokens: 25, bonus: 0, price: 34.90, perToken: "1,39", highlight: false, badge: "🥇", save: null },
];

const FAQ = [
  { q: "Les jetons ont-ils une date d'expiration ?", a: "Non. Vos jetons sont valables à vie, sans aucune date d'expiration. Achetez-les quand vous le souhaitez et utilisez-les à votre rythme." },
  { q: "Que se passe-t-il si je débloque une fiche et que le client ne répond pas ?", a: "Le jeton est consommé au moment du déblocage. Nous vous recommandons de contacter rapidement le client (téléphone + email révélés) pour maximiser vos chances de conversion." },
  { q: "Puis-je obtenir un remboursement ?", a: "Les jetons ne sont pas remboursables une fois achetés, sauf erreur de notre part. Ils sont cependant sans expiration, donc utilisez-les sans contrainte de temps." },
  { q: "Comment fonctionne le coût selon le type d'intervention ?", a: "Le coût en jetons dépend du type de fiche : réparation impact = 1 jeton, remplacement pare-brise sans assurance = 2 jetons, remplacement pare-brise avec assurance BdG = 3 jetons. Les fiches assurées sont plus faciles à conclure car l'intervention est prise en charge." },
  { q: "Puis-je utiliser mes jetons sur toute la France ?", a: "Oui. Vous pouvez débloquer n'importe quelle fiche sur la plateforme, indépendamment de votre zone d'activité déclarée. La zone sert uniquement à filtrer le listing." },
];

const INTERVENTION_COSTS: Record<string, number> = {
  reparation: 1,
  vitre: 1,
  remplacement_sans: 2,
  remplacement_avec: 3,
};

export default function TarifsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [simType, setSimType] = useState<string>("remplacement_sans");
  const [simQty, setSimQty] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      setShowSuccess(true);
      window.history.replaceState({}, "", "/tarifs");
    }
  }, [searchParams]);

  const costPerFiche = INTERVENTION_COSTS[simType];
  const tokensNeeded = simQty * costPerFiche;
  const packForQty = tokensNeeded <= PACKS[0].tokens ? PACKS[0] : tokensNeeded <= PACKS[1].tokens ? PACKS[1] : PACKS[2];
  const surplus = packForQty.tokens - tokensNeeded;

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSuccess(false)}>
          <div className="bg-white rounded-[24px] p-10 max-w-[420px] w-full mx-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-[22px] font-extrabold mb-2">Paiement réussi !</h2>
            <p className="text-[14px] font-semibold mb-6" style={{ color: "#6B7280" }}>
              Vos jetons ont été crédités sur votre compte. Vous pouvez maintenant débloquer des fiches.
            </p>
            <button onClick={() => setShowSuccess(false)} className="w-full py-3 rounded-[11px] font-bold text-white border-0 cursor-pointer" style={{ background: "#1D9E75" }}>
              Accéder aux demandes
            </button>
          </div>
        </div>
      )}
      <Navbar />

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <span className="inline-block rounded-full px-4 py-1.5 text-[12.5px] font-bold mb-4" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
          Tarification transparente
        </span>
        <h1 className="m-0 text-[38px] font-extrabold tracking-tight leading-tight">
          Payez uniquement<br />les fiches qui vous intéressent
        </h1>
        <p className="m-0 mt-4 text-[16px] font-medium max-w-[560px] mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
          Achetez des jetons, déverrouillez les coordonnées des clients que vous souhaitez contacter. Sans abonnement, sans engagement.
        </p>
      </section>

      {/* Cost per unlock */}
      <section className="max-w-[900px] mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #EAEFED" }}>
            <h2 className="m-0 text-[17px] font-extrabold">Coût en jetons par type de fiche</h2>
            <p className="m-0 mt-1 text-[13px] font-semibold" style={{ color: "#6B7280" }}>1 jeton = 8 € · prix unitaire de référence</p>
          </div>
          <div className="divide-y" style={{ borderColor: "#EAEFED" }}>
            {[
              { label: "Réparation impact", sub: "assuré ou non assuré", tokens: 1, price: "8 €", color: "#1D9E75", bg: "#E8F6F0" },
              { label: "Vitre latérale", sub: "assuré ou non assuré", tokens: 1, price: "8 €", color: "#6D28D9", bg: "#EDE9FE" },
              { label: "Remplacement pare-brise", sub: "sans assurance BdG", tokens: 2, price: "16 €", color: "#B0431F", bg: "#FCEDE7" },
              { label: "Remplacement pare-brise", sub: "avec assurance BdG", tokens: 3, price: "24 €", color: "#0F5C44", bg: "#E8F6F0" },
            ].map((row) => (
              <div key={row.label + row.sub} className="flex items-center justify-between px-6 py-4 gap-4">
                <div>
                  <div className="font-bold text-[14px]">{row.label}</div>
                  <div className="text-[12.5px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>{row.sub}</div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="rounded-full px-3 py-1 text-[13px] font-extrabold" style={{ background: row.bg, color: row.color }}>
                    {row.tokens} jeton{row.tokens > 1 ? "s" : ""}
                  </span>
                  <span className="text-[14px] font-extrabold w-12 text-right" style={{ color: "#11211B" }}>{row.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packs */}
      <section className="max-w-[900px] mx-auto px-6 mb-16">
        <div className="text-center mb-10">
          <h2 className="m-0 text-[28px] font-extrabold tracking-tight">Choisissez votre pack</h2>
          <p className="m-0 mt-2 text-[14px] font-medium" style={{ color: "#6B7280" }}>Jetons sans date d'expiration — utilisez-les quand vous voulez.</p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {PACKS.map((p) => {
            const total = p.tokens + p.bonus;
            return (
              <div
                key={p.name}
                className="rounded-[20px] p-7 flex flex-col gap-3 relative"
                style={p.highlight
                  ? { background: "linear-gradient(150deg,#0F5C44,#1D9E75)", color: "#fff", boxShadow: "0 12px 32px rgba(15,92,68,.28)" }
                  : { background: "#fff", border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }
                }
              >
                {p.save && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-extrabold text-white" style={{ background: "#D85A30" }}>
                    {p.save}
                  </span>
                )}
                <div className={`font-extrabold text-[16px] ${p.highlight ? "opacity-90" : ""}`} style={!p.highlight ? { color: "#6B7280" } : {}}>
                  {p.badge && <span className="mr-1">{p.badge}</span>}Pack {p.name}
                  {p.highlight && <span className="ml-2 text-[11px] font-extrabold rounded-full px-2 py-0.5" style={{ background: "rgba(255,255,255,.25)" }}>Le plus populaire</span>}
                </div>
                <div className="flex items-end gap-2 leading-none">
                  <span className="text-[44px] font-extrabold tracking-tight">{total}</span>
                  <span className={`text-[16px] font-bold mb-1.5 ${p.highlight ? "opacity-80" : ""}`} style={!p.highlight ? { color: "#6B7280" } : {}}>jetons</span>
                </div>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-[32px] font-extrabold tracking-tight" style={!p.highlight ? { color: "#0F5C44" } : {}}>{p.price} €</span>
                </div>
                <div className={`text-[12.5px] font-semibold ${p.highlight ? "opacity-80" : ""}`} style={!p.highlight ? { color: "#6B7280" } : {}}>
                  {p.perToken} €/jeton · sans expiration
                </div>
                <ul className="m-0 p-0 list-none flex flex-col gap-2 mt-1">
                  {[
                    `Jusqu'à ${total} réparations impact`,
                    `Jusqu'à ${Math.floor(total / 2)} remplacements sans assurance`,
                    `Jusqu'à ${Math.floor(total / 3)} remplacements avec assurance BdG`,
                    "Sans date d'expiration",
                    "Facturation immédiate",
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[13px] font-semibold">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                        <path d="M5 12.5l4.5 4.5L19 7" stroke={p.highlight ? "#fff" : "#1D9E75"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className={p.highlight ? "opacity-90" : ""} style={!p.highlight ? { color: "#3d4b44" } : {}}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={async () => {
                    const auth = getAuth();
                    if (!auth) { window.location.href = "/partenaire"; return; }
                    const res = await fetch("/api/stripe/create-checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ pack: p.packId, userId: auth.id }),
                    });
                    const { url } = await res.json();
                    if (url) window.location.href = url;
                  }}
                  className="w-full py-3 rounded-[11px] font-bold text-[14px] border-0 cursor-pointer transition-opacity hover:opacity-90 mt-4"
                  style={p.highlight
                    ? { background: "#fff", color: "#0F5C44" }
                    : { background: "#1D9E75", color: "#fff", boxShadow: "0 4px 12px rgba(29,158,117,.25)" }
                  }
                >
                  Acheter ce pack
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simulator */}
      <section className="max-w-[900px] mx-auto px-6 mb-16">
        <div className="bg-white rounded-2xl p-8" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
          <div className="text-center mb-7">
            <h2 className="m-0 text-[22px] font-extrabold tracking-tight">Simulateur</h2>
            <p className="m-0 mt-2 text-[14px] font-medium" style={{ color: "#6B7280" }}>Combien de fiches puis-je débloquer avec mon pack ?</p>
          </div>
          <div className="max-w-[480px] mx-auto flex flex-col gap-5">
            <div>
              <label className="block text-[13px] font-bold mb-2">Type d'intervention</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "reparation",       label: "Réparation impact",             sub: "assuré ou non · 1 jeton" },
                  { key: "vitre",            label: "Vitre latérale",                sub: "assuré ou non · 1 jeton" },
                  { key: "remplacement_sans",label: "Remplacement sans assurance",   sub: "2 jetons/fiche" },
                  { key: "remplacement_avec",label: "Remplacement avec assurance BdG", sub: "3 jetons/fiche" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSimType(opt.key)}
                    className="text-left rounded-[11px] px-3.5 py-3 border-0 cursor-pointer transition-all"
                    style={simType === opt.key
                      ? { background: "#E8F6F0", border: "1.5px solid #1D9E75" }
                      : { background: "#F4F6F5", border: "1.5px solid transparent" }
                    }
                  >
                    <div className="font-bold text-[13px]" style={{ color: simType === opt.key ? "#0F5C44" : "#11211B" }}>{opt.label}</div>
                    <div className="text-[11.5px] font-semibold mt-0.5" style={{ color: "#9aa39e" }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold mb-2">Nombre de fiches / mois : <span style={{ color: "#0F5C44" }}>{simQty}</span></label>
              <input
                type="range" min={1} max={25} value={simQty}
                onChange={(e) => setSimQty(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: "#1D9E75" }}
              />
              <div className="flex justify-between text-[12px] font-bold mt-1" style={{ color: "#9aa39e" }}>
                <span>1</span><span>25</span>
              </div>
            </div>
            <div className="rounded-[14px] p-5 text-center" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
              <div className="text-[13px] font-semibold mb-1" style={{ color: "#6B7280" }}>
                {simQty} fiche{simQty > 1 ? "s" : ""} × {costPerFiche} jeton{costPerFiche > 1 ? "s" : ""} = <b style={{ color: "#11211B" }}>{tokensNeeded} jetons nécessaires</b>
              </div>
              <div className="text-[22px] font-extrabold mt-1" style={{ color: "#0F5C44" }}>Pack {packForQty.name} — {packForQty.price} €</div>
              {surplus > 0 && (
                <div className="text-[12.5px] font-semibold mt-1.5" style={{ color: "#6B7280" }}>
                  + {surplus} jeton{surplus > 1 ? "s" : ""} restant{surplus > 1 ? "s" : ""} pour d'autres fiches
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[760px] mx-auto px-6 mb-16">
        <h2 className="m-0 text-[24px] font-extrabold tracking-tight text-center mb-8">Questions fréquentes</h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white rounded-[14px] overflow-hidden" style={{ border: "1px solid #EAEFED" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-bold text-[14.5px] bg-transparent border-0 cursor-pointer"
              >
                {item.q}
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  className="flex-shrink-0 transition-transform"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", color: "#6B7280" }}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-[13.5px] leading-relaxed" style={{ color: "#3d4b44" }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-14 px-6 mb-10 mx-6 rounded-[20px] max-w-[900px] mx-auto" style={{ background: "linear-gradient(150deg,#0F5C44,#1D9E75)" }}>
        <h2 className="m-0 text-[28px] font-extrabold tracking-tight text-white">Prêt à trouver vos prochains clients ?</h2>
        <p className="m-0 mt-3 text-[15px] font-medium text-white opacity-90">Créez votre compte gratuitement et recevez 2 jetons offerts à l'inscription.</p>
        <Link href="/partenaire" className="no-underline">
          <button className="mt-6 rounded-[12px] px-8 py-4 font-bold text-[15px] border-0 cursor-pointer" style={{ background: "#fff", color: "#0F5C44", boxShadow: "0 8px 24px rgba(0,0,0,.15)" }}>
            Créer mon compte réparateur — Gratuit
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-6 text-[13px] font-semibold" style={{ color: "#9aa39e", borderTop: "1px solid #EAEFED", background: "#fff" }}>
        © 2026 Minute Glass · <Link href="/" className="no-underline" style={{ color: "#1D9E75" }}>Annonces</Link> · <Link href="/tarifs" className="no-underline" style={{ color: "#1D9E75" }}>Tarifs</Link> · CGU · Politique de confidentialité · RGPD
      </footer>
    </div>
  );
}
