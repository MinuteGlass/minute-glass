import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche — Minute Glass",
  description:
    "Comprendre le fonctionnement de Minute Glass : déposer une demande, recevoir des devis, choisir un réparateur. 100% gratuit pour les particuliers.",
};

const ETAPES_PARTICULIER = [
  {
    n: "1",
    titre: "Décrivez votre dégât",
    desc: "Indiquez votre véhicule, le type d'intervention (remplacement, réparation, vitre latérale) et votre ville. Le formulaire prend moins de 2 minutes.",
    detail: "Vous pouvez joindre une photo pour aider les réparateurs à évaluer le dégât.",
  },
  {
    n: "2",
    titre: "Les réparateurs vous contactent",
    desc: "Votre demande est transmise aux professionnels agréés de votre zone. Ils vous envoient leurs tarifs par email ou téléphone sous 48h.",
    detail: "Vous recevez en moyenne 3 à 5 devis différents.",
  },
  {
    n: "3",
    titre: "Vous choisissez librement",
    desc: "Comparez les offres reçues : prix, disponibilité, réputation. Aucune obligation d'accepter. Zéro engagement.",
    detail: "Le paiement se fait directement chez le réparateur que vous choisissez.",
  },
];

const ETAPES_REPARATEUR = [
  {
    n: "1",
    titre: "Créez votre espace professionnel",
    desc: "Renseignez votre raison sociale, zone d'intervention et types de prestations. Votre profil est visible des particuliers de votre secteur.",
  },
  {
    n: "2",
    titre: "Achetez des jetons",
    desc: "Chaque demande débloquée consomme 1 à 3 jetons selon le type d'intervention. Vous ne payez que pour les demandes qui vous intéressent. Pas d'abonnement obligatoire.",
  },
  {
    n: "3",
    titre: "Répondez et fidélisez",
    desc: "Contactez directement le client, établissez votre devis, intervenez. Les avis laissés améliorent votre visibilité pour les prochaines demandes.",
  },
];

const FAQ = [
  {
    q: "Est-ce vraiment gratuit pour les particuliers ?",
    a: "Oui, à 100%. Minute Glass est financé par les réparateurs qui achètent des jetons pour accéder aux coordonnées des clients. Pour vous, particulier, le dépôt de demande, la réception de devis et le choix du réparateur sont entièrement gratuits. Vous ne payez que la réparation, directement au professionnel.",
  },
  {
    q: "Je n'ai pas d'assurance bris de glace. Ça marche quand même ?",
    a: "C'est même notre cœur de cible. Sans garantie bris de glace, vous devez payer de votre poche — et Minute Glass vous permet de comparer les prix sans appeler chaque garage un par un. Les réparateurs savent que vous payez sans assurance et adaptent leurs offres.",
  },
  {
    q: "Mes données personnelles sont-elles partagées immédiatement ?",
    a: "Non. Votre nom, téléphone et email ne sont transmis qu'aux réparateurs qui débloquent activement votre demande avec un jeton. Tant qu'aucun réparateur ne débloque votre fiche, vos coordonnées restent privées.",
  },
  {
    q: "Combien de temps pour recevoir des devis ?",
    a: "La majorité des demandes reçoivent une première réponse en moins de 24h. Sur les zones bien couvertes (grandes villes), c'est souvent dans la journée.",
  },
  {
    q: "Suis-je obligé d'accepter une offre ?",
    a: "Non. Aucun engagement. Vous comparez librement et décidez. Si aucune offre ne vous convient, vous pouvez simplement ignorer les devis reçus.",
  },
  {
    q: "Comment sont sélectionnés les réparateurs ?",
    a: "Les réparateurs s'inscrivent eux-mêmes sur la plateforme. Ils doivent créer un profil avec leur raison sociale et zone d'intervention. Les avis clients laissés après chaque intervention sont visibles sur leur fiche publique.",
  },
  {
    q: "Je suis réparateur. Comment rejoindre la plateforme ?",
    a: "Créez un compte réparateur gratuitement, renseignez votre profil et achetez un pack de jetons pour accéder aux demandes de votre secteur. Vous ne payez que pour les leads qui vous intéressent.",
  },
  {
    q: "Quel est le prix d'un remplacement de pare-brise sans assurance ?",
    a: "Le prix varie selon le véhicule, le type de vitre et la région. En moyenne : 200 à 600 € pour un remplacement de pare-brise, 80 à 150 € pour une réparation d'impact. Déposer votre demande vous donnera des tarifs réels de professionnels locaux.",
  },
];

const GARANTIES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="#1D9E75" strokeWidth="1.8" strokeLinejoin="round" fill="#E8F6F0"/>
        <path d="M9 12l2 2 4-4" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    titre: "Données chiffrées",
    desc: "Vos coordonnées ne sont jamais revendues. Elles sont transmises uniquement aux réparateurs qui débloquent votre demande.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#1D9E75" strokeWidth="1.8" fill="#E8F6F0"/>
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    titre: "Aucun stockage superflu",
    desc: "Nous ne conservons que les informations nécessaires à la mise en relation. Pas de revente à des tiers, pas de marketing non sollicité.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#1D9E75" strokeWidth="1.8" fill="#E8F6F0"/>
        <path d="M12 8v4l3 3" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    titre: "Droit à l'effacement",
    desc: "Vous pouvez supprimer votre compte et toutes vos données à tout moment depuis votre espace particulier.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />

      <main>

        {/* ── Hero ── */}
        <section className="bg-white" style={{ borderBottom: "1px solid #EAEFED" }}>
          <div className="max-w-[820px] mx-auto px-5 sm:px-8 py-14 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-[12px] font-bold"
              style={{ background: "#E8F6F0", color: "#0F5C44" }}>
              Guide complet
            </div>
            <h1 className="font-extrabold tracking-tight mb-4"
              style={{ fontSize: "clamp(26px,4vw,44px)", color: "#11211B", lineHeight: 1.1 }}>
              Comment fonctionne<br />
              <span style={{ color: "#1D9E75" }}>Minute Glass ?</span>
            </h1>
            <p className="text-[16px] font-medium leading-relaxed mx-auto" style={{ color: "#6B7280", maxWidth: 560 }}>
              Une mise en relation transparente entre particuliers qui ont besoin d'une réparation
              et professionnels du vitrage automobile. Gratuit pour vous.
            </p>
          </div>
        </section>

        {/* ── Côté particulier ── */}
        <section className="max-w-[860px] mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-extrabold text-[12px] text-white" style={{ background: "#1D9E75" }}>P</span>
            <h2 className="font-extrabold m-0" style={{ fontSize: "clamp(17px,2.5vw,22px)", color: "#11211B" }}>
              Pour les particuliers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {ETAPES_PARTICULIER.map((e) => (
              <div key={e.n} className="bg-white rounded-[16px] p-6" style={{ border: "1px solid #EAEFED" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[14px] text-white mb-4"
                  style={{ background: "#1D9E75" }}>
                  {e.n}
                </div>
                <div className="font-extrabold text-[14.5px] mb-2" style={{ color: "#11211B" }}>{e.titre}</div>
                <p className="text-[13px] font-medium leading-relaxed m-0 mb-2" style={{ color: "#6B7280" }}>{e.desc}</p>
                <p className="text-[11.5px] font-bold m-0" style={{ color: "#9aa39e" }}>{e.detail}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/deposer"
              className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3.5 font-extrabold text-[14px] text-white no-underline"
              style={{ background: "linear-gradient(135deg,#1D9E75,#0F5C44)", boxShadow: "0 4px 16px rgba(29,158,117,.3)" }}>
              Déposer ma demande gratuitement →
            </Link>
          </div>
        </section>

        {/* ── Côté réparateur ── */}
        <section className="bg-white" style={{ borderTop: "1px solid #EAEFED", borderBottom: "1px solid #EAEFED" }}>
          <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-14">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-extrabold text-[12px] text-white" style={{ background: "#D85A30" }}>R</span>
              <h2 className="font-extrabold m-0" style={{ fontSize: "clamp(17px,2.5vw,22px)", color: "#11211B" }}>
                Pour les réparateurs
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {ETAPES_REPARATEUR.map((e) => (
                <div key={e.n} className="rounded-[16px] p-6" style={{ border: "1px solid #EAEFED", background: "#FAFAFA" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[14px] text-white mb-4"
                    style={{ background: "#D85A30" }}>
                    {e.n}
                  </div>
                  <div className="font-extrabold text-[14.5px] mb-2" style={{ color: "#11211B" }}>{e.titre}</div>
                  <p className="text-[13px] font-medium leading-relaxed m-0" style={{ color: "#6B7280" }}>{e.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/partenaire"
                className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3.5 font-extrabold text-[14px] no-underline"
                style={{ background: "#FCEDE7", color: "#B0431F", border: "1px solid #F4C4A8" }}>
                Rejoindre en tant que réparateur →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Confidentialité ── */}
        <section className="max-w-[860px] mx-auto px-5 sm:px-8 py-14">
          <h2 className="font-extrabold mb-2" style={{ fontSize: "clamp(17px,2.5vw,22px)", color: "#11211B" }}>
            Vos données, en sécurité
          </h2>
          <p className="text-[14px] font-medium mb-8" style={{ color: "#6B7280" }}>
            Minute Glass ne revend jamais vos données personnelles.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GARANTIES.map((g) => (
              <div key={g.titre} className="bg-white rounded-[16px] p-5" style={{ border: "1px solid #EAEFED" }}>
                <div className="mb-3">{g.icon}</div>
                <div className="font-extrabold text-[14px] mb-1.5" style={{ color: "#11211B" }}>{g.titre}</div>
                <p className="text-[12.5px] font-medium leading-relaxed m-0" style={{ color: "#6B7280" }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white" style={{ borderTop: "1px solid #EAEFED" }}>
          <div className="max-w-[720px] mx-auto px-5 sm:px-8 py-14">
            <h2 className="font-extrabold mb-8 text-center" style={{ fontSize: "clamp(17px,2.5vw,22px)", color: "#11211B" }}>
              Questions fréquentes
            </h2>
            <div className="flex flex-col gap-2">
              {FAQ.map((item, i) => (
                <details key={i} className="bg-white rounded-[13px] group" style={{ border: "1px solid #EAEFED" }}>
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 font-bold text-[13.5px] cursor-pointer list-none"
                    style={{ color: "#11211B" }}>
                    {item.q}
                    <svg className="flex-shrink-0 transition-transform group-open:rotate-180" width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </summary>
                  <p className="px-5 pb-4 pt-0 m-0 text-[13px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="max-w-[620px] mx-auto px-5 py-14 text-center">
          <h2 className="font-extrabold mb-3" style={{ fontSize: "clamp(18px,3vw,26px)", color: "#11211B" }}>
            Prêt à recevoir des devis ?
          </h2>
          <p className="text-[14.5px] font-medium mb-7" style={{ color: "#6B7280" }}>
            Déposez votre demande en 2 minutes. C'est gratuit, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/deposer"
              className="inline-flex items-center justify-center gap-2 rounded-[12px] px-7 py-4 font-extrabold text-[14px] text-white no-underline"
              style={{ background: "linear-gradient(135deg,#1D9E75,#0F5C44)", boxShadow: "0 4px 16px rgba(29,158,117,.3)" }}>
              Je dépose ma demande →
            </Link>
            <Link href="/partenaire"
              className="inline-flex items-center justify-center gap-2 rounded-[12px] px-7 py-4 font-extrabold text-[14px] no-underline"
              style={{ background: "#fff", color: "#3d4b44", border: "1px solid #EAEFED" }}>
              Espace réparateur
            </Link>
          </div>
        </section>

      </main>

      <footer className="text-center py-5 text-[12px] font-semibold" style={{ color: "#9aa39e", borderTop: "1px solid #EAEFED", background: "#fff" }}>
        © {new Date().getFullYear()} Minute Glass ·{" "}
        <Link href="/" className="no-underline hover:underline" style={{ color: "#9aa39e" }}>Accueil</Link> ·{" "}
        <Link href="/tarifs" className="no-underline hover:underline" style={{ color: "#9aa39e" }}>Tarifs réparateurs</Link>
      </footer>
    </div>
  );
}
