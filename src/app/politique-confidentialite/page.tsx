import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Politique de confidentialité — MinuteGlass",
  description: "Politique de confidentialité et traitement des données personnelles de MinuteGlass.",
};

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Navbar />
      <main className="max-w-[760px] mx-auto px-6 py-16">
        <h1 className="text-[32px] font-extrabold tracking-tight mb-2">Politique de confidentialité</h1>
        <p className="text-[14px] font-semibold mb-12" style={{ color: "#9aa39e" }}>
          Dernière mise à jour : juillet 2026
        </p>

        <Section titre="1. Responsable du traitement">
          <p>
            Le responsable du traitement des données personnelles collectées sur <strong>minuteglass.fr</strong> est
            la société <strong>EKKO</strong> (SIRET : 90751095200019), dont le siège est situé au 62 rue Hélène Muller,
            94320 Thiais, joignable à{" "}
            <a href="mailto:contact@minuteglass.fr" className="text-[#1D9E75]">contact@minuteglass.fr</a>.
          </p>
        </Section>

        <Section titre="2. Données collectées">
          <p>Nous collectons les données suivantes :</p>
          <ul>
            <li><strong>Particuliers (déposants de demandes) :</strong> prénom, adresse email, ville et code postal, type de véhicule et de vitrage concerné.</li>
            <li><strong>Réparateurs (partenaires) :</strong> nom, prénom, email, numéro de téléphone, zone d'intervention, document KBIS.</li>
            <li><strong>Données de paiement :</strong> traitées exclusivement par Stripe — MinuteGlass ne stocke aucune donnée bancaire.</li>
            <li><strong>Données de connexion :</strong> adresse IP, date et heure de connexion, pages visitées (à des fins de sécurité et statistiques).</li>
          </ul>
        </Section>

        <Section titre="3. Finalités du traitement">
          <p>Les données sont utilisées pour :</p>
          <ul>
            <li>Permettre la mise en relation entre particuliers et réparateurs</li>
            <li>Gérer les comptes utilisateurs et l'authentification</li>
            <li>Traiter les paiements (achat de jetons)</li>
            <li>Envoyer des emails transactionnels (confirmation de demande, factures)</li>
            <li>Prévenir la fraude et assurer la sécurité de la plateforme</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </Section>

        <Section titre="4. Base légale">
          <p>Les traitements reposent sur :</p>
          <ul>
            <li><strong>Exécution du contrat</strong> : pour la mise en relation et la gestion des comptes</li>
            <li><strong>Intérêt légitime</strong> : pour la sécurité et la prévention de la fraude</li>
            <li><strong>Obligation légale</strong> : pour la conservation des données de facturation (10 ans)</li>
            <li><strong>Consentement</strong> : pour l'envoi de communications marketing (si applicable)</li>
          </ul>
        </Section>

        <Section titre="5. Destinataires des données">
          <p>Vos données peuvent être transmises aux sous-traitants suivants :</p>
          <ul>
            <li><strong>Supabase Inc.</strong> — hébergement de la base de données (UE/US)</li>
            <li><strong>Stripe Inc.</strong> — traitement des paiements (US, certifié PCI-DSS)</li>
            <li><strong>Resend Inc.</strong> — envoi d'emails transactionnels (US)</li>
            <li><strong>Vercel Inc.</strong> — hébergement du site (US)</li>
          </ul>
          <p>
            Ces sous-traitants sont soumis à des garanties appropriées (clauses contractuelles types) pour les transferts hors UE.
          </p>
        </Section>

        <Section titre="6. Durée de conservation">
          <ul>
            <li><strong>Données de compte :</strong> durée de vie du compte + 3 ans après la dernière activité</li>
            <li><strong>Demandes de particuliers :</strong> 1 an après la date de soumission</li>
            <li><strong>Données de facturation :</strong> 10 ans (obligation comptable)</li>
            <li><strong>Logs de sécurité :</strong> 1 an</li>
          </ul>
        </Section>

        <Section titre="7. Vos droits">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition</strong> : s'opposer à certains traitements</li>
            <li><strong>Droit à la limitation</strong> : restreindre le traitement de vos données</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à{" "}
            <a href="mailto:contact@minuteglass.fr" className="text-[#1D9E75] font-semibold">contact@minuteglass.fr</a>.
            Vous pouvez également introduire une réclamation auprès de la{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#1D9E75]">CNIL</a>.
          </p>
        </Section>

        <Section titre="8. Cookies">
          <p>
            Le site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement de la plateforme
            (authentification, session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
          </p>
        </Section>

        <Section titre="9. Sécurité">
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
            chiffrement HTTPS (TLS), authentification sécurisée via Supabase Auth, accès limité aux données
            par rôle, et journalisation des accès administrateurs.
          </p>
        </Section>

        <Section titre="10. Modifications">
          <p>
            Cette politique peut être mise à jour à tout moment. La date de dernière modification est indiquée en haut de page.
            En cas de modification substantielle, vous serez informé par email.
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
