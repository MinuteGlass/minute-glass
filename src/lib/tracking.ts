/**
 * Envoi de la conversion « Lead – Demande vitrage » — MinuteGlass
 * --------------------------------------------------------------
 * À appeler UNIQUEMENT après confirmation serveur de /api/demandes/create.
 * Sinon on compte des leads qui n'ont jamais été enregistrés.
 *
 * Aucune valeur monétaire n'est envoyée : le modèle économique de la
 * plateforme n'est plus basé sur des jetons. La conversion est comptée,
 * et Google Ads applique la valeur par défaut de l'action de conversion.
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
const IS_CONFIGURED =
  /^AW-\d+$/.test(ADS_ID) && /^[A-Za-z0-9_-]{6,}$/.test(CONVERSION_LABEL);

type Lead = {
  intervention: "remplacement" | "reparation" | "vitre" | null;
  insurance: "oui" | "non" | null;
};


export function trackLead(lead: Lead) {
  if (!IS_CONFIGURED) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: `${ADS_ID}/${CONVERSION_LABEL}`,
    lead_type: lead.intervention ?? "inconnu",
    has_insurance: lead.insurance === "oui",
  });
}
