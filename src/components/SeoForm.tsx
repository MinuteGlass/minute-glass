"use client";

import { useState } from "react";
import Link from "next/link";
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

type Step = 1 | 2 | 3;

export function SeoForm({ intervention, ville }: Props) {
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

  /* Envoi */
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState("");

  const step1Ok = marque && modele.trim() && annee;
  const step2Ok = zone && damage.trim().length >= 10 && insurance !== null && dispo;
  const telDigits = tel.replace(/\D/g, "");
  const telValid  = telDigits.length === 10;
  const step3Ok = prenom.trim() && telValid && email.trim().includes("@");

  function goToStep3() {
    setStep(3);
  }

  /* Envoi direct : aucun compte, aucune session particulier. */
  async function submitLead() {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/demandes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${marque} ${modele} · ${annee}`,
          city: ville,
          intervention,
          insurance: insurance ?? "sans",
          damage: zone ? `${zone} — ${damage.trim()}` : damage.trim(),
          phone: telDigits,
          email: email.trim().toLowerCase(),
          name: prenom.trim(),
          availability: dispo,
        }),
      });
      if (!res.ok) {
        let message = "Impossible d’envoyer votre demande. Réessayez dans un instant.";
        try {
          const payload = (await res.json()) as { error?: string };
          if (payload?.error) message = payload.error;
        } catch {
          /* réponse non JSON */
        }
        setError(message);
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setSubmitting(false);
    }
  }

  /* ── UI helpers ── */
  const Progress = () => (
    <div className="flex items-center gap-1.5 mb-4">
      {([1, 2, 3] as Step[]).map((n) => (
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
  if (step === 3 && !submitted) return (
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
          <BtnNext
            onClick={submitLead}
            disabled={!step3Ok || submitting}
            label={submitting ? "Envoi…" : "Envoyer ma demande"}
          />
          {error && (
            <p role="alert" className="text-[12px] font-bold" style={{ color: "#D85A30" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  /* ── Confirmation ── */
  return (
    <div className="text-center py-2">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: "#E8F6F0" }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="#1D9E75" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="font-extrabold text-[17px] mb-1.5" style={{ color: "#11211B" }}>Demande envoyée !</div>
      <p className="text-[12.5px] font-semibold leading-relaxed mb-5" style={{ color: "#6B7280" }}>
        Votre demande est enregistrée. Un réparateur de votre secteur peut vous contacter.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center w-full py-3 rounded-[11px] font-extrabold text-[13.5px] text-white no-underline"
        style={{ background: "#1D9E75" }}
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
