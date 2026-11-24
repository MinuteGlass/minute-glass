/**
 * Envoi de la conversion « Lead – Demande vitrage » — MinuteGlass
 * --------------------------------------------------------------
 * À appeler UNIQUEMENT après confirmation serveur de /api/demandes/create.
 * Sinon on compte des leads qui n'ont jamais été enregistrés.
 *
 * Valeur = ce que le lead rapporte à la plateforme en jetons :
 *   - remplacement + assurance bris de glace : 3 jetons = 30 €
 *   - remplacement sans assurance            : 2 jetons = 20 €
 *   - réparation d'impact / vitre            : 1 jeton  = 10 €
 *
 * Renseigner NEXT_PUBLIC_GOOGLE_ADS_ID et NEXT_PUBLIC_ADS_LEAD_LABEL
 * (Google Ads > Objectifs > Conversions > votre action > Configurer le tag),
 * et monter <GoogleAdsTag /> pour que window.gtag existe. Sans tag, l'appel
 * est simplement ignoré : aucune erreur côté parcours.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-XXXXXXXXX";
const CONVERSION_LABEL = process.env.NEXT_PUBLIC_ADS_LEAD_LABEL ?? "LABEL_CONVERSION";

type Lead = {
  intervention: "remplacement" | "reparation" | "vitre" | null;
  insurance: "oui" | "non" | null;
};

export function leadValue({ intervention, insurance }: Lead): number {
  if (intervention !== "remplacement") return 10;
  return insurance === "oui" ? 30 : 20;
}

export function trackLead(lead: Lead) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "generate_lead", {
    send_to: `${ADS_ID}/${CONVERSION_LABEL}`,
    value: leadValue(lead),
    currency: "EUR",
    lead_type: lead.intervention ?? "inconnu",
    has_insurance: lead.insurance === "oui",
  });
}
