"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Consent = {
  analytics: boolean;
  marketing: boolean;
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Consent>({ analytics: true, marketing: true });

  useEffect(() => {
    const saved = localStorage.getItem("mg_cookie_consent");
    if (!saved) setVisible(true);
  }, []);

  function save(consent: Consent) {
    localStorage.setItem("mg_cookie_consent", JSON.stringify({ ...consent, date: new Date().toISOString() }));
    setVisible(false);
    // Ici tu pourras déclencher le chargement de GA / Meta Pixel selon consent
    if (consent.analytics) loadAnalytics();
    if (consent.marketing) loadMarketing();
  }

  function acceptAll() {
    save({ analytics: true, marketing: true });
  }

  function refuseAll() {
    save({ analytics: false, marketing: false });
  }

  function savePrefs() {
    save(prefs);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6" style={{ pointerEvents: "none" }}>
      <div
        className="max-w-[680px] mx-auto rounded-2xl p-5 sm:p-6"
        style={{
          background: "#fff",
          boxShadow: "0 8px 40px rgba(17,33,27,.16)",
          border: "1px solid #EAEFED",
          pointerEvents: "auto",
        }}
      >
        {!showDetails ? (
          /* Vue principale */
          <div>
            <div className="flex items-start gap-3 mb-4">
              <span className="text-[22px] mt-0.5">🍪</span>
              <div>
                <p className="m-0 text-[15px] font-extrabold text-[#11211B]">Nous utilisons des cookies</p>
                <p className="m-0 mt-1 text-[13px] leading-relaxed" style={{ color: "#6B7280" }}>
                  Des cookies analytiques et marketing nous aident à améliorer le site et à mesurer nos audiences.
                  Vous pouvez accepter, refuser ou personnaliser vos choix.{" "}
                  <Link href="/politique-confidentialite" className="text-[#1D9E75] font-semibold hover:underline">
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2.5 rounded-[10px] text-[13px] font-bold border-0 cursor-pointer"
                style={{ background: "#F4F6F5", color: "#6B7280" }}
              >
                Personnaliser
              </button>
              <button
                onClick={refuseAll}
                className="px-4 py-2.5 rounded-[10px] text-[13px] font-bold border-0 cursor-pointer"
                style={{ background: "#F4F6F5", color: "#11211B" }}
              >
                Tout refuser
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 rounded-[10px] text-[13px] font-bold border-0 cursor-pointer text-white"
                style={{ background: "linear-gradient(150deg,#0F5C44,#1D9E75)" }}
              >
                Tout accepter
              </button>
            </div>
          </div>
        ) : (
          /* Vue personnalisation */
          <div>
            <button
              onClick={() => setShowDetails(false)}
              className="flex items-center gap-1.5 text-[13px] font-bold border-0 bg-transparent cursor-pointer mb-4 p-0"
              style={{ color: "#6B7280" }}
            >
              ← Retour
            </button>
            <p className="m-0 mb-4 text-[15px] font-extrabold text-[#11211B]">Personnaliser mes préférences</p>

            <div className="flex flex-col gap-3 mb-5">
              {/* Cookies essentiels — toujours actifs */}
              <CookieRow
                label="Cookies essentiels"
                description="Authentification et fonctionnement du site. Obligatoires, ils ne peuvent pas être désactivés."
                checked={true}
                disabled
                onChange={() => {}}
              />
              <CookieRow
                label="Cookies analytiques"
                description="Nous aident à comprendre comment le site est utilisé (Google Analytics)."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <CookieRow
                label="Cookies marketing"
                description="Permettent de mesurer l'efficacité de nos publicités (Meta Pixel, etc.)."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={refuseAll}
                className="px-4 py-2.5 rounded-[10px] text-[13px] font-bold border-0 cursor-pointer"
                style={{ background: "#F4F6F5", color: "#11211B" }}
              >
                Tout refuser
              </button>
              <button
                onClick={savePrefs}
                className="px-5 py-2.5 rounded-[10px] text-[13px] font-bold border-0 cursor-pointer text-white"
                style={{ background: "linear-gradient(150deg,#0F5C44,#1D9E75)" }}
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CookieRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-start justify-between gap-4 rounded-xl p-4"
      style={{ background: "#F4F6F5" }}
    >
      <div>
        <p className="m-0 text-[13.5px] font-bold text-[#11211B]">{label}</p>
        <p className="m-0 mt-0.5 text-[12.5px]" style={{ color: "#6B7280" }}>{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="flex-shrink-0 mt-0.5 w-11 h-6 rounded-full border-0 cursor-pointer transition-colors relative"
        style={{
          background: checked ? "#1D9E75" : "#D1D5DB",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <span
          className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform"
          style={{
            left: checked ? "calc(100% - 21px)" : "3px",
            boxShadow: "0 1px 4px rgba(0,0,0,.2)",
          }}
        />
      </button>
    </div>
  );
}

/* Placeholders — remplace par tes vraies intégrations */
function loadAnalytics() {
  // ex: window.gtag('consent', 'update', { analytics_storage: 'granted' })
}

function loadMarketing() {
  // ex: fbq('consent', 'grant')
}
