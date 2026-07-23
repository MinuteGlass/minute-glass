"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addLocalDemande } from "@/lib/demandes-store";
import { setAuth, getAuth } from "@/lib/auth";
import type { InterventionType } from "@/types";

const MARQUES = [
  "Alfa Romeo", "Audi", "BMW", "Citroën", "Cupra", "Dacia", "DS", "Fiat",
  "Ford", "Honda", "Hyundai", "Kia", "Mercedes-Benz", "MINI", "Nissan",
  "Opel", "Peugeot", "Renault", "SEAT", "Škoda", "Toyota", "Volkswagen", "Volvo", "Autre",
];
const ANNEES = Array.from({ length: 30 }, (_, i) => String(2025 - i));
const ZONES: Record<InterventionType, string[]> = {
  reparation:   ["Pare-brise avant", "Pare-brise arrière"],
  remplacement: ["Pare-brise avant", "Pare-brise arrière", "Lunette arrière"],
  vitre:        ["Vitre avant gauche", "Vitre avant droite", "Vitre arrière gauche", "Vitre arrière droite", "Custode", "Toit panoramique"],
};
const DISPOS = ["Dès que possible", "Cette semaine", "La semaine prochaine", "Je suis flexible"];

interface Props {
  intervention: InterventionType;
  ville: string;
}

type Step = 1 | 2 | 3 | 4;

export function SeoForm({ intervention, ville }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  /* Step 1 — Véhicule */
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [annee, setAnnee]   = useState("");

  /* Step 2 — Dégât */
  const [zone, setZone]         = useState("");
  const [damage, setDamage]     = useState("");
  const [insurance, setInsurance] = useState<"sans" | "avec" | null>(null);
  const [dispo, setDispo]       = useState("");

  /* Step 3 — Contact */
  const [prenom, setPrenom] = useState("");
  const [tel, setTel]       = useState("");
  const [email, setEmail]   = useState("");

  /* Step 4 — Compte */
  const [password, setPassword]   = useState("");
  const [showPwd, setShowPwd]     = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const step1Ok = marque && modele.trim() && annee;
  const step2Ok = zone && damage.trim().length >= 10 && insurance !== null && dispo;
  const telDigits = tel.replace(/\D/g, "");
  const telValid  = telDigits.length === 10;
  const step3Ok = prenom.trim() && telValid && email.trim().includes("@");
  const step4Ok = password.length >= 6;

  /* Si déjà connecté en particulier, on saute l'étape compte */
  function goToStep3() {
    setStep(3);
  }

  function goToStep4() {
    const auth = getAuth();
    if (auth?.role === "particulier") {
      submitDemande(auth.email);
    } else {
      setStep(4);
    }
  }

  function submitDemande(userEmail?: string) {
    addLocalDemande({
      id: `seo-${Date.now()}`,
      title: `${marque} ${modele} · ${annee}`,
      city: ville,
      distance: "—",
      age: "À l'instant",
      insurance: insurance!,
      intervention,
      damage,
      damageZone: zone,
      availability: dispo,
      clientName: prenom,
      phone: tel,
      email: userEmail || email,
      isNew: true,
      isLocal: true,
      region: "",
    });
  }

  function createAccount() {
    setSubmitting(true);
    submitDemande(email);
    setAuth("particulier", email, prenom);
    router.push("/mes-demandes");
  }

  /* ── UI helpers ── */
  const Progress = () => (
    <div className="flex items-center gap-1.5 mb-4">
      {([1, 2, 3, 4] as Step[]).map((n) => (
        <div key={n} className="h-1 rounded-full flex-1 transition-all duration-300"
          style={{ background: n <= step ? "#1D9E75" : "#EAEFED" }} />
      ))}
    </div>
  );

  const Label = ({ step: s, children }: { step: number; children: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0" style={{ background: "#1D9E75" }}>{s}</span>
      <span className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: "#9aa39e" }}>{children}</span>
    </div>
  );

  const inputCls = "w-full rounded-[10px] px-3.5 py-3 text-[13px] font-semibold border-0 outline-none";
  const inputStyle = { background: "#F4F6F5", color: "#11211B" };

  const BtnNext = ({ onClick, disabled, label = "Continuer →" }: { onClick: () => void; disabled: boolean; label?: string }) => (
    <button disabled={disabled} onClick={onClick}
      className="flex-1 py-3 rounded-[11px] font-extrabold text-[13.5px] text-white border-0 cursor-pointer"
      style={{ background: "#1D9E75", opacity: disabled ? 0.35 : 1, boxShadow: disabled ? "none" : "0 3px 10px rgba(29,158,117,.25)", transition: "opacity .15s" }}>
      {label}
    </button>
  );

  const BtnBack = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="px-4 py-3 rounded-[11px] font-bold text-[13px] border-0 cursor-pointer flex-shrink-0"
      style={{ background: "#F4F6F5", color: "#6B7280" }}>←</button>
  );

  /* ── STEP 1 — Véhicule ── */
  if (step === 1) return (
    <div>
      <Progress />
      <Label step={1}>Votre véhicule</Label>
      <div className="flex flex-col gap-2.5">
        <select value={marque} onChange={(e) => setMarque(e.target.value)} className={inputCls}
          style={{ ...inputStyle, color: marque ? "#11211B" : "#9aa39e" }}>
          <option value="">Marque…</option>
          {MARQUES.map((m) => <option key={m}>{m}</option>)}
        </select>
        <input type="text" placeholder="Modèle (ex : Clio, 308, Golf…)" value={modele}
          onChange={(e) => setModele(e.target.value)} className={inputCls} style={inputStyle} />
        <select value={annee} onChange={(e) => setAnnee(e.target.value)} className={inputCls}
          style={{ ...inputStyle, color: annee ? "#11211B" : "#9aa39e" }}>
          <option value="">Année…</option>
          {ANNEES.map((a) => <option key={a}>{a}</option>)}
        </select>
        <BtnNext onClick={() => setStep(2)} disabled={!step1Ok} />
      </div>
    </div>
  );

  /* ── STEP 2 — Dégât ── */
  if (step === 2) return (
    <div>
      <Progress />
      <Label step={2}>Le dégât</Label>
      <div className="flex flex-col gap-2.5">
        <select value={zone} onChange={(e) => setZone(e.target.value)} className={inputCls}
          style={{ ...inputStyle, color: zone ? "#11211B" : "#9aa39e" }}>
          <option value="">Zone touchée…</option>
          {ZONES[intervention].map((z) => <option key={z}>{z}</option>)}
        </select>
        <textarea placeholder="Décrivez le dégât précisément (taille, localisation, circonstances…)"
          value={damage} onChange={(e) => setDamage(e.target.value)}
          rows={3} className={`${inputCls} resize-none`} style={inputStyle} />
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: "#9aa39e" }}>Assurance bris de glace ?</div>
          <div className="grid grid-cols-2 gap-2">
            {(["sans", "avec"] as const).map((v) => (
              <button key={v} onClick={() => setInsurance(v)}
                className="py-2.5 rounded-[9px] font-bold text-[12.5px] border-0 cursor-pointer transition-all"
                style={{ background: insurance === v ? "#1D9E75" : "#F4F6F5", color: insurance === v ? "#fff" : "#6B7280" }}>
                {v === "sans" ? "Non" : "Oui, tous risques"}
              </button>
            ))}
          </div>
        </div>
        <select value={dispo} onChange={(e) => setDispo(e.target.value)} className={inputCls}
          style={{ ...inputStyle, color: dispo ? "#11211B" : "#9aa39e" }}>
          <option value="">Disponibilité…</option>
          {DISPOS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <div className="flex gap-2">
          <BtnBack onClick={() => setStep(1)} />
          <BtnNext onClick={goToStep3} disabled={!step2Ok} />
        </div>
      </div>
    </div>
  );

  /* ── STEP 3 — Contact ── */
  if (step === 3) return (
    <div>
      <Progress />
      <Label step={3}>Vos coordonnées</Label>
      <div className="flex flex-col gap-2.5">
        <input type="text" placeholder="Prénom" value={prenom}
          onChange={(e) => setPrenom(e.target.value)} className={inputCls} style={inputStyle} />
        <div>
          <input type="tel" placeholder="06 xx xx xx xx" value={tel}
            onChange={(e) => setTel(e.target.value.replace(/\D/g, "").slice(0, 10))}
            maxLength={10}
            className={inputCls}
            style={{ ...inputStyle, borderColor: tel.length > 0 && !telValid ? "#D85A30" : undefined }} />
          {tel.length > 0 && !telValid && (
            <p className="mt-1 text-[11.5px] font-semibold" style={{ color: "#D85A30" }}>
              ⚠ 10 chiffres requis ({telDigits.length}/10)
            </p>
          )}
        </div>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} className={inputCls} style={inputStyle} />
        <p className="text-[11px] font-semibold leading-relaxed" style={{ color: "#9aa39e" }}>
          Vos coordonnées sont transmises uniquement aux réparateurs qui répondent à votre demande.
        </p>
        <div className="flex gap-2">
          <BtnBack onClick={() => setStep(2)} />
          <BtnNext onClick={goToStep4} disabled={!step3Ok} />
        </div>
      </div>
    </div>
  );

  /* ── STEP 4 — Créer son compte ── */
  return (
    <div>
      <Progress />

      {/* Résumé de la demande */}
      <div className="rounded-[11px] p-3.5 mb-4" style={{ background: "#F4F6F5" }}>
        <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: "#9aa39e" }}>Votre demande</div>
        <div className="flex flex-col gap-1">
          {[
            { label: "Véhicule", value: `${marque} ${modele} ${annee}` },
            { label: "Zone", value: zone },
            { label: "Assurance", value: insurance === "avec" ? "Tous risques" : "Sans assurance" },
            { label: "Disponibilité", value: dispo },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-baseline gap-2">
              <span className="text-[11.5px] font-semibold" style={{ color: "#9aa39e" }}>{label}</span>
              <span className="text-[11.5px] font-bold text-right" style={{ color: "#11211B" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Création compte */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0" style={{ background: "#1D9E75" }}>4</span>
          <span className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: "#9aa39e" }}>Créez votre espace gratuit</span>
        </div>
        <p className="text-[12px] font-semibold mb-3 leading-relaxed" style={{ color: "#6B7280" }}>
          Pour suivre vos demandes et échanger avec les réparateurs.
        </p>
        <div className="flex flex-col gap-2.5">
          <input type="email" value={email} readOnly className={inputCls}
            style={{ ...inputStyle, color: "#9aa39e", cursor: "default" }} />
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Choisissez un mot de passe (6 car. min)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              style={{ ...inputStyle, paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent cursor-pointer p-0"
              style={{ color: "#9aa39e" }}
            >
              {showPwd
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
              }
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <BtnBack onClick={() => setStep(3)} />
        <BtnNext
          onClick={createAccount}
          disabled={!step4Ok || submitting}
          label={submitting ? "Création…" : "Créer mon compte →"}
        />
      </div>

      <p className="text-[10.5px] font-semibold text-center mt-2.5" style={{ color: "#9aa39e" }}>
        Déjà un compte ?{" "}
        <a href="/connexion" className="no-underline font-bold" style={{ color: "#1D9E75" }}>Se connecter</a>
      </p>
    </div>
  );
}
