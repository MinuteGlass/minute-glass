import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Mentions légales — MinuteGlass",
  description: "Mentions légales de la plateforme MinuteGlass.",
};

export default function MentionsLegales() {
  return (
    <>
      <Navbar />
      <main className="max-w-[760px] mx-auto px-6 py-16">
        <h1 className="text-[32px] font-extrabold tracking-tight mb-2">Mentions légales</h1>
        <p className="text-[14px] font-semibold mb-12" style={{ color: "#9aa39e" }}>
          Dernière mise à jour : juillet 2026
        </p>

        <Section titre="1. Éditeur du site">
          <p>Le site <strong>minuteglass.fr</strong> est édité par :</p>
          <ul>
            <li><strong>Raison sociale :</strong> EKKO</li>
            <li><strong>Forme juridique :</strong> SASU (Société par Actions Simplifiée Unipersonnelle)</li>
            <li><strong>SIRET :</strong> 90751095200019</li>
            <li><strong>Siège social :</strong> 62 rue Hélène Muller, 94320 Thiais, France</li>
            <li><strong>Email :</strong> <a href="mailto:contact@minuteglass.fr" className="text-[#1D9E75]">contact@minuteglass.fr</a></li>
          </ul>
        </Section>

        <Section titre="2. Hébergement">
          <p>Le site est hébergé par :</p>
          <ul>
            <li><strong>Vercel Inc.</strong></li>
            <li>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#1D9E75]">vercel.com</a></li>
          </ul>
          <p>Les données sont stockées via :</p>
          <ul>
            <li><strong>Supabase Inc.</strong> — base de données et authentification</li>
            <li><strong>Stripe Inc.</strong> — traitement des paiements</li>
          </ul>
        </Section>

        <Section titre="3. Propriété intellectuelle">
          <p>
            L'ensemble du contenu du site (textes, logos, images, code source) est la propriété exclusive de MinuteGlass,
            sauf mentions contraires. Toute reproduction, distribution ou utilisation sans autorisation préalable écrite est interdite.
          </p>
        </Section>

        <Section titre="4. Responsabilité">
          <p>
            MinuteGlass est une plateforme de mise en relation entre particuliers et réparateurs professionnels.
            MinuteGlass n'est pas partie aux contrats conclus entre les utilisateurs et les réparateurs et ne saurait
            être tenu responsable des prestations réalisées par ces derniers.
          </p>
          <p>
            MinuteGlass s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site,
            mais ne peut garantir l'exhaustivité ou l'absence d'erreurs.
          </p>
        </Section>

        <Section titre="5. Liens hypertextes">
          <p>
            Le site peut contenir des liens vers des sites tiers. MinuteGlass n'exerce aucun contrôle sur ces sites
            et décline toute responsabilité quant à leur contenu.
          </p>
        </Section>

        <Section titre="6. Droit applicable">
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français
            seront seuls compétents.
          </p>
        </Section>

        <Section titre="7. Contact">
          <p>
            Pour toute question relative au site, vous pouvez nous contacter à :{" "}
            <a href="mailto:contact@minuteglass.fr" className="text-[#1D9E75] font-semibold">contact@minuteglass.fr</a>
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
