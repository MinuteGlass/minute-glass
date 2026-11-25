"use client";

/**
 * Tag Google Ads + Consent Mode v2 — MinuteGlass
 * -------------------------------------------------
 * Variables d'environnement attendues (Vercel + .env.local) :
 *   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789
 *   NEXT_PUBLIC_ADS_LEAD_LABEL=AbC-D_efGhIjKlMn
 *
 * Tant que l'ID n'est pas renseigné (ou reste AW-XXXXXXXXX), le composant
 * ne monte aucun tag : aucune requête vers Google n'est envoyée.
 *
 * Le consentement est refusé par défaut. Le choix enregistré dans
 * localStorage ("mg_cookie_consent") est appliqué au chargement, puis mis
 * à jour par CookieBanner via updateAdsConsent().
 */

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";
const IS_CONFIGURED = /^AW-\d+$/.test(ADS_ID);

/** À appeler à chaque choix de consentement (accepté / refusé / personnalisé). */
export function updateAdsConsent(marketingGranted: boolean) {
  if (typeof window === "undefined") return;

  // Filet de sécurité : si gtag.js n'est pas encore chargé, on empile la
  // commande dans dataLayer ; gtag.js la traitera à son initialisation.
  window.dataLayer = window.dataLayer || [];
  let gtag = window.gtag;
  if (typeof gtag !== "function") {
    gtag = function () {
      window.dataLayer!.push(arguments);
    };
    window.gtag = gtag;
  }

  gtag("consent", "update", {
    ad_storage: marketingGranted ? "granted" : "denied",
    ad_user_data: marketingGranted ? "granted" : "denied",
    ad_personalization: marketingGranted ? "granted" : "denied",
    analytics_storage: marketingGranted ? "granted" : "denied",
  });
}

export function GoogleAdsTag() {
  useEffect(() => {
    if (!IS_CONFIGURED) return;
    try {
      const raw = localStorage.getItem("mg_cookie_consent");
      if (!raw) return;
      const saved = JSON.parse(raw) as { marketing?: boolean };
      updateAdsConsent(Boolean(saved.marketing));
    } catch {
      /* stockage indisponible : on reste en denied */
    }
  }, []);

  if (!IS_CONFIGURED) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          var saved = null;
          try { saved = JSON.parse(localStorage.getItem('mg_cookie_consent') || 'null'); } catch (e) {}
          var granted = !!(saved && saved.marketing);
          gtag('consent', 'default', {
            ad_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied'
          });

          gtag('js', new Date());
          gtag('config', '${ADS_ID}');
        `}
      </Script>
    </>
  );
}
