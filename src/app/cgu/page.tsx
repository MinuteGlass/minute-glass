import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CGU / CGV — MinuteGlass",
  description: "Conditions générales d'utilisation et de vente de la plateforme MinuteGlass.",
};

export default function CGU() {
  return (
    <>
      <Navbar />
      <main className="max-w-[760px] mx-auto px-6 py-16">
        <h1 className="text-[32px] font-extrabold tracking-tight mb-2">Conditions générales</h1>
        <p className="text-[14px] font-semibold mb-12" style={{ color: "#9aa39e" }}>
          CGU / CGV · Dernière mise à jour : juillet 2026
        </p>

        <Section titre="1. Objet">
          <p>
            Les présentes conditions générales d'utilisation (CGU) et de vente (CGV) régissent l'accès et l'utilisation
            de la plateforme <strong>MinuteGlass</strong> (ci-après « la Plateforme »), éditée par la société{" "}
            <strong>EKKO</strong> (SASU, SIRET 90751095200019, 62 rue Hélène Muller, 94320 Thiais).
          </p>
          <p>
            MinuteGlass est une plateforme de mise en relation entre des particuliers souhaitant faire réparer
            leur vitrage automobile (ci-après « Clients ») et des professionnels de la réparation vitrage
            (ci-après « Réparateurs »).
          </p>
        </Section>

        <Section titre="2. Acceptation des conditions">
          <p>
            Toute utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU/CGV.
            En créant un compte ou en soumettant une demande, l'utilisateur reconnaît avoir lu et accepté
            ces conditions.
          </p>
        </Section>

        <Section titre="3. Accès à la plateforme">
          <p>L'accès à la Plateforme est gratuit pour les Clients (dépôt de demande de réparation).</p>
          <p>
            L'accès aux coordonnées des Clients est réservé aux Réparateurs disposant d'un compte validé
            et d'un solde de jetons suffisant. Chaque déblocage d'une fiche client consomme 1 jeton.
          </p>
          <p>
            MinuteGlass se réserve le droit de suspendre ou supprimer tout compte en cas de non-respect
            des présentes conditions.
          </p>
        </Section>

        <Section titre="4. Jetons et tarifs">
          <p>
            Les Réparateurs peuvent acheter des jetons via la Plateforme. Les tarifs en vigueur sont :
          </p>
          <ul>
            <li>1 jeton — 10,00 €</li>
            <li>Pack Starter (3 jetons) — 24,00 €</li>
            <li>Pack Essentiel (10 jetons) — 75,00 €</li>
            <li>Pack Pro (25 jetons) — 175,00 €</li>
          </ul>
          <p>
            Les prix sont indiqués en euros hors taxes. MinuteGlass n'est pas assujettie à la TVA (art. 293 B du CGI).
          </p>
          <p>
            <strong>Les jetons sont non remboursables</strong> une fois achetés, sauf en cas de défaillance
            technique imputable à MinuteGlass.
          </p>
          <p>
            Les jetons n'ont pas de date d'expiration et restent disponibles tant que le compte est actif.
          </p>
        </Section>

        <Section titre="5. Obligations des Réparateurs">
          <p>Pour accéder à la Plateforme, les Réparateurs s'engagent à :</p>
          <ul>
            <li>Fournir un extrait Kbis valide et à jour lors de l'inscription</li>
            <li>Exercer légalement l'activité de réparation de vitrage automobile en France</li>
            <li>Contacter les Clients dans un délai raisonnable après déblocage d'une fiche</li>
            <li>Ne pas céder, revendre ou partager leur accès à la Plateforme</li>
            <li>Respecter les Clients et fournir des prestations conformes aux règles de l'art</li>
          </ul>
          <p>
            Tout manquement pourra entraîner la suspension ou la résiliation du compte sans remboursement
            des jetons restants.
          </p>
        </Section>

        <Section titre="6. Obligations des Clients">
          <p>Les Clients s'engagent à :</p>
          <ul>
            <li>Fournir des informations exactes et sincères lors du dépôt de leur demande</li>
            <li>Être joignables aux coordonnées fournies</li>
            <li>Ne pas déposer de demandes fictives ou frauduleuses</li>
          </ul>
        </Section>

        <Section titre="7. Rôle de MinuteGlass">
          <p>
            MinuteGlass agit en qualité d'intermédiaire technique. Elle n'est pas partie au contrat
            conclu entre le Client et le Réparateur, et ne saurait être tenue responsable :
          </p>
          <ul>
            <li>De la qualité des prestations réalisées par les Réparateurs</li>
            <li>Des litiges entre Clients et Réparateurs</li>
            <li>Du non-respect des délais ou devis par les Réparateurs</li>
          </ul>
          <p>
            MinuteGlass vérifie l'extrait Kbis des Réparateurs lors de l'inscription mais ne garantit
            pas la qualité ou la disponibilité des prestations.
          </p>
        </Section>

        <Section titre="8. Paiements">
          <p>
            Les paiements sur la Plateforme sont traités de manière sécurisée par <strong>Stripe Inc.</strong>,
            certifié PCI-DSS. MinuteGlass ne stocke aucune donnée bancaire.
          </p>
          <p>
            En cas d'achat de jetons, une facture est générée automatiquement et envoyée par email
            à l'adresse du compte Réparateur.
          </p>
        </Section>

        <Section titre="9. Propriété intellectuelle">
          <p>
            L'ensemble des éléments de la Plateforme (interface, logo, textes, code) est la propriété exclusive
            d'EKKO. Toute reproduction ou utilisation sans autorisation préalable est interdite.
          </p>
        </Section>

        <Section titre="10. Données personnelles">
          <p>
            Le traitement des données personnelles est décrit dans la{" "}
            <Link href="/politique-confidentialite" className="text-[#1D9E75] font-semibold hover:underline">
              Politique de confidentialité
            </Link>.
          </p>
        </Section>

        <Section titre="11. Résiliation">
          <p>
            Tout utilisateur peut clôturer son compte à tout moment en contactant{" "}
            <a href="mailto:contact@minuteglass.fr" className="text-[#1D9E75]">contact@minuteglass.fr</a>.
          </p>
          <p>
            MinuteGlass peut résilier un compte sans préavis en cas de violation des présentes conditions,
            d'activité frauduleuse ou de mise en danger d'un autre utilisateur.
          </p>
        </Section>

        <Section titre="12. Limitation de responsabilité">
          <p>
            MinuteGlass ne peut être tenue responsable de tout dommage direct ou indirect résultant
            de l'utilisation ou de l'impossibilité d'accéder à la Plateforme. La responsabilité de
            MinuteGlass est limitée au montant des jetons achetés au cours des 12 derniers mois.
          </p>
        </Section>

        <Section titre="13. Droit applicable et litiges">
          <p>
            Les présentes CGU/CGV sont soumises au droit français. En cas de litige, une solution
            amiable sera recherchée en priorité. À défaut, les tribunaux compétents du ressort de
            Créteil seront saisis.
          </p>
          <p>
            Conformément au Code de la consommation, les consommateurs peuvent recourir à un médiateur :
            Médiation de la consommation (CM2C) —{" "}
            <a href="https://www.cm2c.net" target="_blank" rel="noopener noreferrer" className="text-[#1D9E75]">www.cm2c.net</a>.
          </p>
        </Section>

        <Section titre="14. Modification des CGU">
          <p>
            MinuteGlass se réserve le droit de modifier les présentes conditions à tout moment.
            Les utilisateurs seront informés par email en cas de modification substantielle.
            La poursuite de l'utilisation de la Plateforme après notification vaut acceptation des nouvelles conditions.
          </p>
        </Section>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid #EAEFED" }}>
          <Link href="/" className="text-[13px] font-bold no-underline hover:underline" style={{ color: "#1D9E75" }}>
            ← Retour à l'accueil
          </Link>
        </div>
      </main>
    </>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-[19px] font-extrabold mb-4 tracking-tight">{titre}</h2>
      <div className="text-[14.5px] leading-relaxed flex flex-col gap-3" style={{ color: "#374151" }}>
        {children}
      </div>
    </section>
  );
}
