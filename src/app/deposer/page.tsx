"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getAuth } from "@/lib/auth";
import { toast } from "@/components/Toast";
import { trackLead } from "@/lib/tracking";
import type { InsuranceType, InterventionType } from "@/types";
import { MARQUES, modelesPour } from "@/data/vehicules";

const CONSENT_TEXT =
  "J’accepte d’être recontacté(e) par téléphone par des réparateurs partenaires de mon secteur au sujet de ma demande.";

const INTERVENTIONS: { value: InterventionType; label: string }[] = [
  { value: "remplacement", label: "Remplacement pare-brise" },
  { value: "reparation", label: "Réparation d’impact" },
  { value: "vitre", label: "Vitre latérale ou lunette" },
];

const INSURANCES: { value: Exclude<InsuranceAnswer, "">; label: string }[] = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
  { value: "je_ne_sais_pas", label: "Je ne sais pas" },
];

/* Principaux assureurs auto du marché français. « Autre » ouvre une saisie libre. */
const ASSUREURS = [
  "AXA",
  "Allianz",
  "Active Assurances",
  "Aviva",
  "Covéa",
  "Direct Assurance",
  "Eurofil",
  "GMF",
  "Generali",
  "Groupama",
  "Harmonie Mutuelle",
  "L’olivier",
  "Leocare",
  "MAAF",
  "MACIF",
  "MAIF",
  "Matmut",
  "MMA",
  "Ornikar",
  "Pacifica (Crédit Agricole)",
  "Swiss Life",
  "Thélem Assurances",
  "Autre",
];

const AUTRE_MARQUE = "Autre";
const AUTRE_MODELE = "__autre__";

const INTERV_LABELS: Record<InterventionType, string> = {
  remplacement: "Remplacement pare-brise",
  reparation: "Réparation d’impact",
  vitre: "Vitre latérale ou lunette",
};

type InsuranceAnswer = "oui" | "non" | "je_ne_sais_pas" | "";

type FieldName =
  | "intervention"
  | "marque"
  | "modele"
  | "cp"
  | "phone"
  | "email"
  | "insurance"
  | "assureur"
  | "consent";

type Errors = Partial<Record<FieldName, string>>;

/* Ordre d’affichage : sert à placer le focus sur le premier champ en erreur. */
const FIELD_ORDER: FieldName[] = [
  "intervention",
  "marque",
  "modele",
  "cp",
  "phone",
  "email",
  "insurance",
  "assureur",
  "consent",
];

const FOCUS_IDS: Record<FieldName, string> = {
  intervention: "intervention-remplacement",
  marque: "marque",
  modele: "modele",
  cp: "cp",
  phone: "phone",
  email: "email",
  insurance: "insurance-oui",
  assureur: "insurer",
  consent: "consent",
};

/* ─── Helpers ─── */

/** Retire espaces, points et tirets ; ramène +33 / 0033 / 33 à un 0 initial. */
function normalizePhone(raw: string): string {
  let value = raw.replace(/[\s.\-()/]/g, "");

  if (value.startsWith("+33")) {
    value = `0${value.slice(3).replace(/^0/, "")}`;
  } else if (value.startsWith("0033")) {
    value = `0${value.slice(4).replace(/^0/, "")}`;
  } else if (value.startsWith("33") && value.length === 11) {
    value = `0${value.slice(2).replace(/^0/, "")}`;
  }

  return value.replace(/\D/g, "").slice(0, 10);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value);
}

function inputClass(invalid: boolean): string {
  return [
    "h-12 w-full rounded-[12px] border bg-white px-3.5 text-[16px] font-semibold text-[#11211B]",
    "outline-none transition-colors placeholder:font-medium placeholder:text-[#9aa39e]",
    "focus:border-[#1D9E75] focus:shadow-[0_0_0_3px_rgba(29,158,117,.18)]",
    invalid ? "border-[#D85A30]" : "border-[#EAEFED]",
  ].join(" ");
}

/* ─── Petits composants (hors rendu pour éviter les remontages) ─── */

function Req() {
  return <span className="ml-0.5 text-[#D85A30]">*</span>;
}

function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-[13.5px] font-bold text-[#11211B]">
        {children}
      </label>
      {hint ? (
        <span className="text-[11.5px] font-medium text-[#9aa39e]">{hint}</span>
      ) : null}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[12px] font-bold text-[#D85A30]">
      {message}
    </p>
  );
}

/* ─── Page ─── */

export default function DeposerPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (auth?.role === "partenaire") router.replace("/partenaire");
  }, [router]);

  const [intervention, setIntervention] = useState<InterventionType>("remplacement");
  const [marque, setMarque] = useState("");
  const [marqueAutre, setMarqueAutre] = useState("");
  const [modele, setModele] = useState("");
  const [modeleAutre, setModeleAutre] = useState("");
  const [insurer, setInsurer] = useState("");
  const [insurerAutre, setInsurerAutre] = useState("");
  const [cp, setCp] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [insurance, setInsurance] = useState<InsuranceAnswer>("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  // Hauteur du bandeau cookies : le CTA sticky se cale juste au-dessus.
  const [cookieBannerHeight, setCookieBannerHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const banner = document.getElementById("mg-cookie-banner");
      setCookieBannerHeight(
        banner ? Math.round(banner.getBoundingClientRect().height) : 0,
      );
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("mg-cookie-banner-change", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("mg-cookie-banner-change", measure);
    };
  }, []);

  function clearError(name: FieldName) {
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  function libelleVehicule(): string {
    const marqueLabel = marque === AUTRE_MARQUE ? marqueAutre.trim() : marque;
    const modeleLabel =
      marque === AUTRE_MARQUE
        ? modeleAutre.trim()
        : modele === AUTRE_MODELE
          ? modeleAutre.trim()
          : modele;
    return `${marqueLabel} ${modeleLabel}`.trim();
  }

  function validate(): Errors {
    const next: Errors = {};

    const marqueChoisie = marque === AUTRE_MARQUE ? marqueAutre.trim() : marque;
    const modeleChoisi =
      marque === AUTRE_MARQUE
        ? modeleAutre.trim()
        : modele === AUTRE_MODELE
          ? modeleAutre.trim()
          : modele;

    if (!marqueChoisie) {
      next.marque = "Choisissez la marque de votre véhicule.";
    } else if (marque === AUTRE_MARQUE && marqueChoisie.length < 2) {
      next.marque = "Précisez la marque (2 caractères minimum).";
    }
    if (marqueChoisie && !modeleChoisi) {
      next.modele = "Choisissez le modèle de votre véhicule.";
    }
    if (!/^\d{5}$/.test(cp)) {
      next.cp = "Entrez un code postal à 5 chiffres.";
    }
    if (!/^0\d{9}$/.test(normalizePhone(phone))) {
      next.phone = "Entrez un numéro de téléphone français à 10 chiffres.";
    }
    if (!isValidEmail(email.trim())) {
      next.email = "Entrez une adresse email valide.";
    }
    if (!insurance) {
      next.insurance = "Précisez si vous avez une assurance bris de glace.";
    }
    if (insurance === "oui") {
      const assureurChoisi = insurer === "Autre" ? insurerAutre.trim() : insurer;
      if (!assureurChoisi) {
        next.assureur = "Choisissez votre assureur (ou « Autre »).";
      }
    }
    if (!consent) {
      next.consent = "Ce consentement est obligatoire pour envoyer votre demande.";
    }

    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validate();
    setErrors(nextErrors);

    const firstError = FIELD_ORDER.find((name) => nextErrors[name]);
    if (firstError) {
      requestAnimationFrame(() => {
        document.getElementById(FOCUS_IDS[firstError])?.focus();
      });
      return;
    }

    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = email.trim().toLowerCase();
    const clientName = firstName.trim() || "Client";
    const city = `CP ${cp}`;
    const vehicleTitle = libelleVehicule();
    const insuranceValue: InsuranceType = insurance === "oui" ? "avec" : "sans";
    const assureurLabel =
      insurance === "oui" ? (insurer === "Autre" ? insurerAutre.trim() : insurer) : "";

    let damage = description.trim();
    if (assureurLabel) {
      damage = `[Assurance : ${assureurLabel}] ${damage}`.trim();
    }
    if (insurance === "je_ne_sais_pas") {
      damage = damage ? `[Assurance à vérifier] ${damage}` : "[Assurance à vérifier]";
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/demandes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: vehicleTitle,
          city,
          intervention,
          insurance: insuranceValue,
          damage,
          phone: normalizedPhone,
          email: normalizedEmail,
          availability: "À définir",
          consent_text: CONSENT_TEXT,
          consent_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        let message = "Impossible d’envoyer votre demande. Réessayez dans un instant.";
        try {
          const payload = (await res.json()) as { error?: string };
          if (payload?.error) message = payload.error;
        } catch {
          /* réponse non JSON : on garde le message générique */
        }
        toast(message, "error");
        setSubmitting(false);
        return;
      }

      // Notifications : ne bloquent jamais l’écran de succès.
      void fetch("/api/notify/new-demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: vehicleTitle,
          city,
          intervention,
          damage,
          insurance: insuranceValue,
        }),
      }).catch(() => {});

      void fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "confirmation_client",
          to: normalizedEmail,
          prenom: clientName,
          title: vehicleTitle,
          ville: city,
          intervention,
        }),
      }).catch(() => {});

      // Conversion Google Ads : uniquement après confirmation serveur.
      trackLead({
        intervention,
        insurance: insurance === "oui" ? "oui" : "non",
      });

      setRefNumber(
        `MG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      );
      setPublished(true);
    } catch {
      toast("Connexion impossible. Vérifiez votre réseau et réessayez.", "error");
      setSubmitting(false);
    }
  }

  if (published) {
    return (
      <SuccessScreen
        refNumber={refNumber}
        vehicle={libelleVehicule()}
        city={`CP ${cp}`}
        intervention={intervention}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      <Navbar />
      <main className="mx-auto w-full max-w-[640px] px-4 pb-14 pt-7 sm:px-6 sm:pt-10">
        <header className="mb-5 text-center sm:mb-7">
          <h1 className="m-0 text-[26px] font-extrabold leading-tight tracking-tight text-[#11211B] sm:text-[30px]">
            Décrivez votre vitrage
          </h1>
          <p className="mt-1.5 text-[13px] font-semibold text-[#6B7280] sm:text-[14px]">
            Gratuit · Sans engagement · Les réparateurs vous rappellent
          </p>
        </header>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="rounded-[20px] border border-[#EAEFED] bg-white p-5 shadow-[0_1px_3px_rgba(17,33,27,.04)] sm:p-8"
        >
          <div className="flex flex-col gap-6">
            {/* 1 — Type de vitrage */}
            <fieldset
              className="m-0 border-0 p-0"
              aria-invalid={errors.intervention ? true : undefined}
            >
              <legend className="mb-2 p-0 text-[13.5px] font-bold text-[#11211B]">
                Type de vitrage <Req />
              </legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {INTERVENTIONS.map((option) => (
                  <label key={option.value} className="relative block cursor-pointer">
                    <input
                      id={`intervention-${option.value}`}
                      type="radio"
                      name="intervention"
                      value={option.value}
                      checked={intervention === option.value}
                      onChange={() => setIntervention(option.value)}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-[52px] items-center justify-center rounded-[13px] border border-[#EAEFED] bg-white px-3 text-center text-[13.5px] font-bold leading-tight text-[#3d4b44] transition-colors peer-checked:border-[#1D9E75] peer-checked:bg-[#E8F6F0] peer-checked:text-[#0F5C44] peer-focus-visible:ring-2 peer-focus-visible:ring-[#1D9E75] peer-focus-visible:ring-offset-2">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 2 — Véhicule : marque puis modèle dépendant */}
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="marque">
                  Marque <Req />
                </Label>
                <select
                  id="marque"
                  value={marque}
                  onChange={(event) => {
                    setMarque(event.target.value);
                    setModele("");
                    setModeleAutre("");
                    clearError("marque");
                    clearError("modele");
                  }}
                  required
                  aria-invalid={errors.marque ? true : undefined}
                  aria-describedby={errors.marque ? "err-marque" : undefined}
                  className={`${inputClass(Boolean(errors.marque))} cursor-pointer`}
                >
                  <option value="" disabled>
                    Choisir la marque…
                  </option>
                  {MARQUES.map((nom) => (
                    <option key={nom} value={nom}>
                      {nom}
                    </option>
                  ))}
                  <option value={AUTRE_MARQUE}>Autre marque</option>
                </select>
                {marque === AUTRE_MARQUE && (
                  <input
                    id="marque-autre"
                    type="text"
                    value={marqueAutre}
                    onChange={(event) => {
                      setMarqueAutre(event.target.value);
                      clearError("marque");
                    }}
                    placeholder="Précisez la marque"
                    autoComplete="off"
                    aria-label="Précisez la marque"
                    className={`${inputClass(Boolean(errors.marque))} mt-2`}
                  />
                )}
                <FieldError id="err-marque" message={errors.marque} />
              </div>

              <div>
                <Label htmlFor="modele">
                  Modèle <Req />
                </Label>
                {marque === AUTRE_MARQUE ? (
                  <input
                    id="modele-autre"
                    type="text"
                    value={modeleAutre}
                    onChange={(event) => {
                      setModeleAutre(event.target.value);
                      clearError("modele");
                    }}
                    placeholder="Précisez le modèle"
                    autoComplete="off"
                    aria-label="Précisez le modèle"
                    className={inputClass(Boolean(errors.modele))}
                  />
                ) : (
                  <select
                    id="modele"
                    value={modele}
                    onChange={(event) => {
                      setModele(event.target.value);
                      clearError("modele");
                    }}
                    disabled={!marque}
                    required
                    aria-invalid={errors.modele ? true : undefined}
                    aria-describedby={errors.modele ? "err-modele" : undefined}
                    className={`${inputClass(Boolean(errors.modele))} cursor-pointer disabled:cursor-not-allowed disabled:bg-[#F4F6F5] disabled:text-[#9aa39e]`}
                  >
                    <option value="" disabled>
                      {marque ? "Choisir le modèle…" : "Choisissez d’abord la marque"}
                    </option>
                    {modelesPour(marque).map((nom) => (
                      <option key={nom} value={nom}>
                        {nom}
                      </option>
                    ))}
                    <option value={AUTRE_MODELE}>Mon modèle n’est pas dans la liste</option>
                  </select>
                )}
                {marque !== AUTRE_MARQUE && modele === AUTRE_MODELE && (
                  <input
                    id="modele-libre"
                    type="text"
                    value={modeleAutre}
                    onChange={(event) => {
                      setModeleAutre(event.target.value);
                      clearError("modele");
                    }}
                    placeholder="Précisez le modèle"
                    autoComplete="off"
                    aria-label="Précisez le modèle"
                    className={`${inputClass(Boolean(errors.modele))} mt-2`}
                  />
                )}
                <FieldError id="err-modele" message={errors.modele} />
              </div>
            </div>

            {/* 3 — Code postal */}
            <div>
              <Label htmlFor="cp">
                Code postal <Req />
              </Label>
              <input
                id="cp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={5}
                autoComplete="postal-code"
                value={cp}
                onChange={(event) => {
                  setCp(event.target.value.replace(/\D/g, "").slice(0, 5));
                  clearError("cp");
                }}
                placeholder="69001"
                required
                aria-invalid={errors.cp ? true : undefined}
                aria-describedby={errors.cp ? "err-cp" : undefined}
                className={inputClass(Boolean(errors.cp))}
              />
              <FieldError id="err-cp" message={errors.cp} />
            </div>

            {/* 4 — Téléphone */}
            <div>
              <Label htmlFor="phone" hint="Pour être rappelé">
                Téléphone <Req />
              </Label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value.replace(/[^\d+\s.\-()/]/g, ""));
                  clearError("phone");
                }}
                placeholder="06 12 34 56 78"
                required
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? "err-phone" : undefined}
                className={inputClass(Boolean(errors.phone))}
              />
              <FieldError id="err-phone" message={errors.phone} />
            </div>

            {/* 5 — Email */}
            <div>
              <Label htmlFor="email">
                Email <Req />
              </Label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearError("email");
                }}
                placeholder="vous@email.com"
                required
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={
                  errors.email ? "err-email email-hint" : "email-hint"
                }
                className={inputClass(Boolean(errors.email))}
              />
              <p id="email-hint" className="mt-1.5 text-[12px] font-medium text-[#6B7280]">
                Pour recevoir la confirmation
              </p>
              <FieldError id="err-email" message={errors.email} />
            </div>

            {/* 6 — Assurance bris de glace */}
            <fieldset
              className="m-0 border-0 p-0"
              aria-invalid={errors.insurance ? true : undefined}
            >
              <legend className="mb-2 p-0 text-[13.5px] font-bold text-[#11211B]">
                Assurance bris de glace <Req />
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {INSURANCES.map((option) => (
                  <label key={option.value} className="relative block cursor-pointer">
                    <input
                      id={`insurance-${option.value}`}
                      type="radio"
                      name="insurance"
                      value={option.value}
                      checked={insurance === option.value}
                      onChange={() => {
                        setInsurance(option.value);
                        clearError("insurance");
                        clearError("assureur");
                      }}
                      className="peer sr-only"
                    />
                    <span className="flex h-12 items-center justify-center rounded-[12px] border border-[#EAEFED] bg-white px-2 text-center text-[13px] font-bold leading-tight text-[#3d4b44] transition-colors peer-checked:border-[#1D9E75] peer-checked:bg-[#E8F6F0] peer-checked:text-[#0F5C44] peer-focus-visible:ring-2 peer-focus-visible:ring-[#1D9E75] peer-focus-visible:ring-offset-2">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              <FieldError id="err-insurance" message={errors.insurance} />

              {insurance === "oui" && (
                <div className="mt-4 animate-mgFade">
                  <Label htmlFor="insurer">
                    Nom de votre assurance <Req />
                  </Label>
                  <select
                    id="insurer"
                    value={insurer}
                    onChange={(event) => {
                      setInsurer(event.target.value);
                      setInsurerAutre("");
                      clearError("assureur");
                    }}
                    required
                    aria-invalid={errors.assureur ? true : undefined}
                    aria-describedby={errors.assureur ? "err-assureur" : undefined}
                    className={`${inputClass(Boolean(errors.assureur))} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Choisir votre assureur…
                    </option>
                    {ASSUREURS.map((nom) => (
                      <option key={nom} value={nom}>
                        {nom}
                      </option>
                    ))}
                  </select>
                  {insurer === "Autre" && (
                    <input
                      id="insurer-autre"
                      type="text"
                      value={insurerAutre}
                      onChange={(event) => {
                        setInsurerAutre(event.target.value);
                        clearError("assureur");
                      }}
                      placeholder="Nom de votre assureur"
                      autoComplete="organization"
                      aria-label="Nom de votre assureur"
                      className={`${inputClass(Boolean(errors.assureur))} mt-2`}
                    />
                  )}
                  <FieldError id="err-assureur" message={errors.assureur} />
                </div>
              )}
            </fieldset>

            {/* 7 — Prénom (facultatif) */}
            <div>
              <Label htmlFor="first-name" hint="Facultatif">
                Prénom
              </Label>
              <input
                id="first-name"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Votre prénom"
                className={inputClass(false)}
              />
            </div>

            {/* 8 — Consentement */}
            <div>
              <label
                htmlFor="consent"
                className="flex cursor-pointer items-start gap-3 rounded-[13px] border p-3.5 transition-colors"
                style={{
                  borderColor: consent ? "#1D9E75" : errors.consent ? "#D85A30" : "#EAEFED",
                  background: consent ? "#F0FAF5" : "#FAFBFB",
                }}
              >
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    clearError("consent");
                  }}
                  required
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? "err-consent" : undefined}
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 cursor-pointer accent-[#1D9E75]"
                />
                <span className="text-[12.5px] font-semibold leading-relaxed text-[#3d4b44]">
                  {CONSENT_TEXT} <Req />
                </span>
              </label>
              <p className="mt-1.5 text-[11.5px] font-medium text-[#9aa39e]">
                En envoyant ce formulaire, vous acceptez notre{" "}
                <Link
                  href="/politique-confidentialite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#1D9E75] underline underline-offset-2"
                >
                  politique de confidentialité
                </Link>
                .
              </p>
              <FieldError id="err-consent" message={errors.consent} />
            </div>

            {/* 9 — Précision facultative */}
            {!showDescription ? (
              <button
                type="button"
                onClick={() => setShowDescription(true)}
                className="self-start border-0 bg-transparent p-0 text-[13px] font-bold text-[#0F5C44] underline decoration-[#1D9E75] decoration-2 underline-offset-4"
              >
                Ajouter une précision (facultatif)
              </button>
            ) : (
              <div className="animate-mgFade">
                <Label htmlFor="description" hint="300 caractères max.">
                  Précision (facultatif)
                </Label>
                <textarea
                  id="description"
                  rows={3}
                  maxLength={300}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Ex. impact côté passager, fissure de 10 cm…"
                  aria-describedby="description-count"
                  className="w-full resize-y rounded-[12px] border border-[#EAEFED] bg-white px-3.5 py-3 text-[16px] font-semibold text-[#11211B] outline-none transition-colors placeholder:font-medium placeholder:text-[#9aa39e] focus:border-[#1D9E75] focus:shadow-[0_0_0_3px_rgba(29,158,117,.18)]"
                />
                <p
                  id="description-count"
                  className="mt-1 text-right text-[11.5px] font-medium text-[#9aa39e]"
                >
                  {description.length}/300
                </p>
              </div>
            )}
          </div>

          {/* CTA — collé en bas sur mobile */}
          <div
            className="sticky bottom-0 z-30 -mx-5 mt-7 rounded-b-[20px] border-t border-[#EAEFED] bg-white/95 px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:mx-0 sm:mb-0 sm:mt-7 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none"
            style={{ bottom: cookieBannerHeight }}
          >
            <button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-[12px] bg-[#1D9E75] text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(29,158,117,.3)] transition-colors hover:bg-[#178a65] disabled:cursor-not-allowed disabled:bg-[#cdd6d1] disabled:shadow-none"
            >
              {submitting ? "Envoi…" : "Envoyer ma demande"}
            </button>
            <p className="mt-2 text-center text-[11px] font-medium leading-snug text-[#6B7280]">
              Service gratuit pour le particulier. Vos coordonnées sont transmises aux
              réparateurs de votre secteur.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

/* ─── Écran de succès ─── */

function SuccessScreen({
  refNumber,
  vehicle,
  city,
  intervention,
}: {
  refNumber: string;
  vehicle: string;
  city: string;
  intervention: InterventionType;
}) {
  const recap = [
    { icon: "🚗", label: "Véhicule", value: vehicle },
    { icon: "📍", label: "Secteur", value: city },
    { icon: "🔧", label: "Intervention", value: INTERV_LABELS[intervention] ?? intervention },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      <Navbar />
      <main className="mx-auto w-full max-w-[600px] animate-mgFade px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <section className="rounded-[22px] border border-[#EAEFED] bg-white p-6 text-center shadow-[0_4px_20px_rgba(17,33,27,.06)] sm:p-8">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(150deg,#E8F6F0,#cdeadd)]">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7"
                stroke="#1D9E75"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="m-0 text-[25px] font-extrabold tracking-tight text-[#11211B] sm:text-[28px]">
            Demande enregistrée !
          </h1>
          <p className="mx-auto mt-2.5 max-w-[420px] text-[14.5px] font-medium leading-relaxed text-[#6B7280]">
            Votre demande est enregistrée. Un réparateur de votre secteur peut vous contacter.
          </p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-[13px] border border-dashed border-[#c8d5ce] bg-[#F4F6F5] px-5 py-3">
            <div className="text-left">
              <div className="mb-0.5 text-[10.5px] font-bold uppercase tracking-widest text-[#9aa39e]">
                Référence dossier
              </div>
              <div className="text-[20px] font-extrabold tracking-wider text-[#0F5C44]">
                {refNumber}
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-[12px] bg-[#1D9E75] text-[15px] font-extrabold text-white no-underline shadow-[0_4px_14px_rgba(29,158,117,.3)] transition-colors hover:bg-[#178a65]"
          >
            Retour à l’accueil
          </Link>
        </section>

        <section className="mt-4 rounded-[18px] border border-[#EAEFED] bg-white p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-[15px] font-extrabold text-[#11211B]">Récapitulatif</h2>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {recap.map(({ icon, label, value }) => (
              <div
                key={label}
                className="rounded-[12px] border border-[#EAEFED] bg-[#F8FAFA] p-3.5"
              >
                <div className="mb-1 text-[18px]" aria-hidden="true">
                  {icon}
                </div>
                <div className="mb-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#9aa39e]">
                  {label}
                </div>
                <div className="text-[13.5px] font-bold text-[#11211B]">{value}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
