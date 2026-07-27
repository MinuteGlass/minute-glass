"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { setAuth, getAuth, signUp } from "@/lib/auth";
import { addLocalDemande } from "@/lib/demandes-store";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/Toast";

type Step = 1 | 2 | 3 | 4;
type Insurance = "oui" | "non" | null;
type Intervention = "remplacement" | "reparation" | "vitre" | null;

const STEPS = ["Véhicule", "Le dégât", "Vos infos", "Confirmation"];

const MARQUES = [
  "Alfa Romeo", "Audi", "BMW", "Citroën", "Cupra", "Dacia", "DS", "Fiat",
  "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Land Rover",
  "Lexus", "Mazda", "Mercedes-Benz", "MINI", "Mitsubishi", "Nissan",
  "Opel", "Peugeot", "Porsche", "Renault", "SEAT", "Škoda", "Smart",
  "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Autre",
];
const ANNEES = Array.from({ length: 37 }, (_, i) => String(2026 - i));
const INTERV_LABELS: Record<string, string> = {
  remplacement: "Remplacement pare-brise",
  reparation: "Réparation d'impact",
  vitre: "Vitre latérale",
};

function StepCircle({ n, state }: { n: number; state: "done" | "active" | "todo" }) {
  const base = "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all";
  if (state === "done")
    return (
      <div className={`${base} text-white`} style={{ background: "#1D9E75" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  if (state === "active")
    return <div className={`${base} text-white`} style={{ background: "#1D9E75", boxShadow: "0 0 0 4px #c8ead9" }}>{n}</div>;
  return <div className={`${base}`} style={{ background: "#EAEFED", color: "#9aa39e" }}>{n}</div>;
}

export default function DeposerPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [published, setPublished] = useState(false);
  const [alreadyAuth, setAlreadyAuth] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth?.role === "partenaire") { router.replace("/partenaire"); return; }
    if (auth?.role === "particulier") setAlreadyAuth(true);
  }, [router]);

  /* Step 1 — Véhicule */
  const [marque, setMarque] = useState("");
  const [marqueAutre, setMarqueAutre] = useState("");
  const [modele, setModele] = useState("");
  const [annee, setAnnee] = useState("2024");
  const [ville, setVille] = useState("");
  const [cp, setCp] = useState("");
  const [plaque, setPlaque] = useState("");
  const [insurance, setInsurance] = useState<Insurance>(null);

  /* Step 2 — Dégât */
  const [intervention, setIntervention] = useState<Intervention>("remplacement");
  const [photos, setPhotos] = useState<{ name: string; size: number; dataUrl: string; processing: boolean }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Step 3 — Coordonnées */
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  /* Step 4 — Compte */
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [cgu, setCgu] = useState(false);
  const [ref] = useState(() => `MG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);

  /* Validation */
  const cpValid     = /^\d{5}$/.test(cp);
  const plaqueValid = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/.test(plaque.toUpperCase());
  const marqueValid = marque !== "" && (marque !== "Autre" || marqueAutre.trim() !== "");
  const canStep1 = marqueValid && modele.trim() !== "" && ville.trim() !== "" && cpValid && plaqueValid && insurance !== null;
  const canStep2 = intervention !== null && description.trim().length >= 10;
  const telDigits = tel.replace(/\D/g, "");
  const canStep3 = prenom.trim() !== "" && telDigits.length === 10 && email.trim().includes("@");
  const canStep4 = cgu && (alreadyAuth || password.length >= 6);

  function next() { if (step < 4) setStep((s) => (s + 1) as Step); }
  function prev() { if (step > 1) setStep((s) => (s - 1) as Step); }

  async function publish() {
    if (!cgu) return;

    // Assure qu'un compte existe (crée un compte auto si pas connecté)
    let userId: string | null = getAuth()?.id ?? null;
    if (!userId) {
      const tempPassword = crypto.randomUUID();
      const { error } = await signUp(email, tempPassword, "particulier", prenom);
      if (!error) {
        const { data } = await supabase.auth.getUser();
        userId = data.user?.id ?? null;
      }
    }

    const title = `${marque === "Autre" ? marqueAutre : marque} ${modele} · ${annee}`;

    // Sauvegarde en base Supabase si connecté
    if (userId) {
      await supabase.from("demandes").insert({
        client_id:    userId,
        title,
        city:         `${ville} (${cp})`,
        intervention: intervention ?? "remplacement",
        insurance:    insurance === "oui" ? "avec" : "sans",
        damage:       description,
        phone:        tel,
        email,
        availability: "À définir",
        status:       "active",
      });
    }

    // Garde aussi le localStorage pour la session en cours
    addLocalDemande({
      id:           `local-${Date.now()}`,
      title,
      city:         `${ville} (${cp})`,
      distance:     "0 km",
      age:          "À l'instant",
      insurance:    insurance === "oui" ? "avec" : "sans",
      intervention: intervention ?? "remplacement",
      damage:       description,
      isNew:        true,
      isLocal:      true,
      clientName:   prenom,
      phone:        tel,
      email,
      availability: "À définir",
      photos:       photos.map((p) => p.dataUrl),
    });

    // Email de confirmation au client
    fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "confirmation_client",
        to: email,
        prenom,
        title,
        ville,
        intervention: intervention ?? "remplacement",
      }),
    }).catch(() => {});

    if (!alreadyAuth) setAuth("particulier", email, prenom);
    toast("Votre demande a été publiée !", "success");
    setPublished(true);
  }

  /* Photo processing */
  const MAX_PHOTOS = 5;
  const MAX_SIZE_MB = 8;

  function pixelateBottom(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const blockSize = Math.max(8, Math.round(img.width / 30));
        const startY = Math.round(img.height * 0.72);
        for (let y = startY; y < img.height; y += blockSize) {
          for (let x = 0; x < img.width; x += blockSize) {
            const pixel = ctx.getImageData(x + Math.floor(blockSize / 2), y + Math.floor(blockSize / 2), 1, 1).data;
            ctx.fillStyle = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3] / 255})`;
            ctx.fillRect(x, y, blockSize, blockSize);
          }
        }
        ctx.fillStyle = "rgba(15,92,68,0.35)";
        ctx.fillRect(0, startY, img.width, img.height - startY);
        resolve(canvas.toDataURL("image/jpeg", 0.88));
      };
      img.src = dataUrl;
    });
  }

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    Array.from(files).slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) { toast(`${file.name} dépasse ${MAX_SIZE_MB} Mo.`, "error"); return; }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const raw = e.target?.result as string;
        setPhotos((prev) => [...prev, { name: file.name, size: file.size, dataUrl: raw, processing: true }]);
        const blurred = await pixelateBottom(raw);
        setPhotos((prev) => prev.map((p) => p.dataUrl === raw ? { ...p, dataUrl: blurred, processing: false } : p));
      };
      reader.readAsDataURL(file);
    });
    if (files.length > remaining) toast(`Maximum ${MAX_PHOTOS} photos.`, "info");
  }, [photos.length]); // eslint-disable-line

  if (published) return (
    <SuccessScreen
      refNumber={ref}
      vehicle={`${marque === "Autre" ? marqueAutre : marque} ${modele} ${annee}`}
      city={`${ville} (${cp})`}
      intervention={intervention ?? "remplacement"}
      insurance={insurance === "oui" ? "avec" : "sans"}
      email={email}
    />
  );

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />
      <main className="max-w-[720px] mx-auto px-6 pb-16 pt-8">
        <div className="text-center mb-7">
          <h1 className="m-0 text-[25px] font-extrabold tracking-tight">Déposer une demande</h1>
          <p className="m-0 mt-2 text-sm font-medium" style={{ color: "#6B7280" }}>
            Gratuit · Les réparateurs vous contactent directement
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between max-w-[520px] mx-auto mb-7">
          {STEPS.map((name, i) => {
            const n = (i + 1) as Step;
            const state = step > n ? "done" : step === n ? "active" : "todo";
            return (
              <div key={n} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <StepCircle n={n} state={state} />
                  <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: state === "todo" ? "#9aa39e" : "#11211B" }}>{name}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-12 h-0.5 mb-4 mx-1 rounded-full" style={{ background: step > n ? "#1D9E75" : "#EAEFED" }} />}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-[20px] p-8" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>

          {/* ── STEP 1 — Véhicule ── */}
          {step === 1 && (
            <div className="animate-mgFade">
              <h2 className="m-0 mb-1 text-[19px] font-extrabold">Votre véhicule</h2>
              <p className="m-0 mb-6 text-[13.5px]" style={{ color: "#6B7280" }}>Ces infos aident le réparateur à préparer l'intervention.</p>
              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <FieldLabel>Marque <Req /></FieldLabel>
                  <select value={marque} onChange={(e) => { setMarque(e.target.value); setMarqueAutre(""); }}
                    className="w-full rounded-[11px] px-3 py-3 text-[14px] font-semibold cursor-pointer outline-none bg-white"
                    style={{ border: "1px solid #EAEFED", color: marque ? "#11211B" : "#9aa39e" }}>
                    <option value="" disabled>Choisir…</option>
                    {MARQUES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                  {marque === "Autre" && (
                    <input type="text" value={marqueAutre} onChange={(e) => setMarqueAutre(e.target.value)}
                      placeholder="Précisez" className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none mt-2"
                      style={{ border: "1px solid #EAEFED" }} />
                  )}
                </div>
                <div>
                  <FieldLabel>Modèle <Req /></FieldLabel>
                  <InputField value={modele} onChange={setModele} placeholder="Ex : 308" />
                </div>
                <div>
                  <FieldLabel>Année <Req /></FieldLabel>
                  <SelectField value={annee} onChange={setAnnee} options={ANNEES} />
                </div>
              </div>
              <div className="grid grid-cols-[2fr_1fr] gap-3.5 mt-4">
                <div>
                  <FieldLabel>Ville <Req /></FieldLabel>
                  <InputField value={ville} onChange={setVille} placeholder="Ex : Lyon" />
                </div>
                <div>
                  <FieldLabel>Code postal <Req /></FieldLabel>
                  <input type="text" inputMode="numeric" value={cp}
                    onChange={(e) => setCp(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    placeholder="69001" maxLength={5}
                    className="w-full rounded-[11px] px-3.5 py-3 text-[14.5px] outline-none"
                    style={{ border: `1px solid ${cp.length > 0 && !cpValid ? "#D85A30" : "#EAEFED"}` }} />
                  {cp.length > 0 && !cpValid && <p className="mt-1 text-[11.5px] font-bold" style={{ color: "#D85A30" }}>5 chiffres requis</p>}
                </div>
              </div>
              <div className="mt-4">
                <FieldLabel>Plaque d'immatriculation <Req /></FieldLabel>
                <input type="text" value={plaque}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 7);
                    let f = raw;
                    if (raw.length > 5) f = raw.slice(0, 2) + "-" + raw.slice(2, 5) + "-" + raw.slice(5);
                    else if (raw.length > 2) f = raw.slice(0, 2) + "-" + raw.slice(2);
                    setPlaque(f);
                  }}
                  placeholder="AB-123-CD" maxLength={9}
                  className="w-full rounded-[11px] px-3.5 py-3 text-[14.5px] outline-none tracking-widest font-bold"
                  style={{ border: `1px solid ${plaque.length > 0 && !plaqueValid ? "#D85A30" : "#EAEFED"}` }} />
                {plaque.length > 0 && !plaqueValid && <p className="mt-1 text-[11.5px] font-bold" style={{ color: "#D85A30" }}>Format attendu : AB-123-CD</p>}
                <div className="flex items-center gap-1.5 mt-2 text-[12.5px] font-bold" style={{ color: "#1D9E75" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#1D9E75" strokeWidth="2" /><path d="M8 11V8a4 4 0 018 0v3" stroke="#1D9E75" strokeWidth="2" /></svg>
                  Masquée automatiquement dans toutes les annonces.
                </div>
              </div>
              <div className="mt-5 rounded-[13px] p-4" style={{ background: "#FAFBFB", border: "1px solid #EEF2F0" }}>
                <div className="font-bold text-[14px] mb-1">Assurance bris de glace <span style={{ color: "#D85A30" }}>*</span></div>
                <div className="text-[12.5px] mb-3" style={{ color: "#6B7280" }}>Êtes-vous couvert pour ce sinistre ?</div>
                <div className="flex gap-2.5">
                  <InsuranceBtn active={insurance === "oui"} onClick={() => setInsurance("oui")} color="green" label="Oui, je suis assuré" />
                  <InsuranceBtn active={insurance === "non"} onClick={() => setInsurance("non")} color="orange" label="Non / je ne sais pas" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 — Dégât ── */}
          {step === 2 && (
            <div className="animate-mgFade">
              <h2 className="m-0 mb-1 text-[19px] font-extrabold">Le dégât</h2>
              <p className="m-0 mb-5 text-[13.5px]" style={{ color: "#6B7280" }}>Décrivez le type d'intervention souhaité.</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {([
                  { value: "remplacement", label: "Remplacement pare-brise", sub: "Fissuré ou très endommagé" },
                  { value: "reparation", label: "Réparation d'impact", sub: "Petit éclat ou impact localisé" },
                  { value: "vitre", label: "Vitre latérale", sub: "Vitre de porte ou custode" },
                ] as const).map((opt) => (
                  <label key={opt.value} className="rounded-[13px] p-4 cursor-pointer flex gap-3 items-start transition-all"
                    style={intervention === opt.value ? { border: "2px solid #1D9E75", background: "#F6FBF9" } : { border: "1px solid #EAEFED", background: "#fff" }}>
                    <input type="radio" name="interv" checked={intervention === opt.value}
                      onChange={() => setIntervention(opt.value)} className="mt-0.5" style={{ accentColor: "#1D9E75", width: 17, height: 17 }} />
                    <span>
                      <span className="block font-bold text-[14px]">{opt.label}</span>
                      <span className="block text-xs mt-0.5" style={{ color: "#6B7280" }}>{opt.sub}</span>
                    </span>
                  </label>
                ))}
              </div>
              <FieldLabel>Photos du dégât <span className="font-semibold" style={{ color: "#9aa39e" }}>(optionnel · max {MAX_PHOTOS})</span></FieldLabel>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple className="hidden" onChange={(e) => processFiles(e.target.files)} />
              {photos.length < MAX_PHOTOS && (
                <div onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
                  className="rounded-[14px] p-7 text-center cursor-pointer transition-all"
                  style={{ border: dragOver ? "2px dashed #1D9E75" : "2px dashed #cdd6d1", background: dragOver ? "#F0FAF5" : "#FAFBFB" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2">
                    <path d="M12 16V4m0 0L8 8m4-4l4 4" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <div className="font-bold text-[14px]">Glissez vos photos ici</div>
                  <div className="text-[12.5px] mt-1" style={{ color: "#6B7280" }}>ou cliquez · JPG, PNG, WEBP (max {MAX_SIZE_MB} Mo)</div>
                </div>
              )}
              {photos.length > 0 && (
                <div className="mt-3 flex flex-col gap-3">
                  {photos.map((photo) => (
                    <div key={photo.dataUrl} className="rounded-[14px] p-3 flex gap-4 items-center" style={{ border: "1px solid #EAEFED" }}>
                      <div className="flex-shrink-0 w-[100px] h-[76px] rounded-[10px] overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
                        {photo.processing && (
                          <>
                            <div className="absolute inset-0" style={{ background: "rgba(15,92,68,.35)" }} />
                            <div className="absolute left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,transparent,#1D9E75,transparent)", animation: "mgScan 1.6s linear infinite" }} />
                          </>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {photo.processing ? (
                          <>
                            <div className="flex items-center gap-2 font-bold text-[13.5px]" style={{ color: "#0F5C44" }}>
                              <div className="w-3.5 h-3.5 rounded-full border-[2px] border-[#cdeadd] border-t-[#1D9E75] flex-shrink-0" style={{ animation: "mgSpin .7s linear infinite" }} />
                              Analyse en cours…
                            </div>
                            <div className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>Détection et floutage de la plaque</div>
                          </>
                        ) : (
                          <>
                            <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-[12px] mb-1" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#0F5C44" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              Plaque masquée ✓
                            </div>
                            <div className="text-[12px] truncate" style={{ color: "#6B7280" }}>{photo.name} · {(photo.size / 1024 / 1024).toFixed(1)} Mo</div>
                          </>
                        )}
                      </div>
                      <button onClick={() => setPhotos((p) => p.filter((x) => x.dataUrl !== photo.dataUrl))}
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-0 cursor-pointer" style={{ background: "#F4F6F5", color: "#6B7280" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="block font-bold text-[13px] mt-5 mb-2">Description du dégât <Req /> <span className="font-semibold" style={{ color: "#9aa39e" }}>(min. 10 car.)</span></label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex : impact apparu ce matin, situé à 10 cm du bord conducteur…"
                rows={3} className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none resize-y" style={{ border: "1px solid #EAEFED" }} />
            </div>
          )}

          {/* ── STEP 3 — Coordonnées ── */}
          {step === 3 && (
            <div className="animate-mgFade">
              <h2 className="m-0 mb-1 text-[19px] font-extrabold">Vos coordonnées</h2>
              <p className="m-0 mb-6 text-[13.5px]" style={{ color: "#6B7280" }}>Transmises uniquement aux réparateurs qui répondent à votre demande.</p>
              <FieldLabel>Prénom <Req /></FieldLabel>
              <InputField value={prenom} onChange={setPrenom} placeholder="Votre prénom" />
              <FieldLabel>Téléphone <Req /></FieldLabel>
              <input type="tel" value={tel} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 10); setTel(d); }} placeholder="0644972408" maxLength={10}
                className="w-full rounded-[11px] px-3.5 py-3 text-[14.5px] outline-none"
                style={{ border: `1px solid ${tel.length > 0 && tel.replace(/\D/g,"").length !== 10 ? "#D85A30" : "#EAEFED"}` }} />
              {tel.length > 0 && tel.replace(/\D/g,"").length !== 10 && <p className="mt-1 text-[11.5px] font-bold" style={{ color: "#D85A30" }}>Numéro invalide (10 chiffres requis)</p>}
              <FieldLabel>Email <Req /></FieldLabel>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@email.com"
                className="w-full rounded-[11px] px-3.5 py-3 text-[14.5px] outline-none"
                style={{ border: "1px solid #EAEFED" }} />
              <div className="mt-4 rounded-[12px] p-3.5 flex items-start gap-3" style={{ background: "#F4F6F5" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#1D9E75" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#1D9E75" strokeWidth="2"/></svg>
                <p className="text-[12.5px] font-semibold leading-relaxed m-0" style={{ color: "#6B7280" }}>
                  Vos coordonnées restent masquées tant qu'aucun réparateur n'a débloqué votre fiche. Conforme RGPD.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 4 — Confirmation + Compte ── */}
          {step === 4 && (
            <div className="animate-mgFade">
              <h2 className="m-0 mb-1 text-[19px] font-extrabold">Confirmation</h2>
              <p className="m-0 mb-5 text-[13.5px]" style={{ color: "#6B7280" }}>Vérifiez votre demande avant publication.</p>

              {/* Récap */}
              <div className="rounded-[14px] p-4 flex gap-4 mb-5" style={{ background: "#FAFBFB", border: "1px solid #EEF2F0" }}>
                <div className="flex-shrink-0 w-24 h-20 rounded-[10px] overflow-hidden" style={{ background: "linear-gradient(150deg,#cfd9d4,#e8eeeb)" }}>
                  {photos.length > 0
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={photos[0].dataUrl} alt="Photo" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#9aa39e" strokeWidth="1.5"/><circle cx="9" cy="10" r="2" stroke="#9aa39e" strokeWidth="1.5"/><path d="M3 17l4-4 3 3 3-4 5 5" stroke="#9aa39e" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                  }
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {[
                    { label: "Véhicule", value: `${marque} ${modele} · ${annee}` },
                    { label: "Localisation", value: `${ville} (${cp})` },
                    { label: "Intervention", value: INTERV_LABELS[intervention ?? "remplacement"] },
                    { label: "Assurance", value: insurance === "oui" ? "Oui, assuré" : "Non / ne sais pas" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>{row.label}</div>
                      <div className="font-bold text-[13.5px] mt-0.5">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Création compte si pas connecté */}
              {!alreadyAuth && (
                <div className="rounded-[14px] p-5 mb-5" style={{ background: "#F6FBF9", border: "1px solid #cdeadd" }}>
                  <div className="font-extrabold text-[15px] mb-1" style={{ color: "#0F5C44" }}>Créez votre espace gratuit</div>
                  <p className="text-[12.5px] font-semibold mb-4 m-0" style={{ color: "#6B7280" }}>
                    Pour suivre vos demandes et échanger avec les réparateurs.
                  </p>
                  <div className="rounded-[10px] px-3.5 py-3 text-[14px] font-semibold mb-3" style={{ background: "#EAEFED", color: "#9aa39e" }}>
                    {email}
                  </div>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      placeholder="Choisissez un mot de passe (6 car. min)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-[11px] px-3.5 py-3 text-[14px] outline-none"
                      style={{ border: "1px solid #EAEFED", paddingRight: "44px" }}
                    />
                    <button type="button" onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent cursor-pointer p-0" style={{ color: "#9aa39e" }}>
                      {showPwd
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                      }
                    </button>
                  </div>
                  <p className="text-[11.5px] font-semibold mt-2 mb-0" style={{ color: "#9aa39e" }}>
                    Déjà un compte ?{" "}
                    <a href="/connexion" className="no-underline font-bold" style={{ color: "#1D9E75" }}>Se connecter</a>
                  </p>
                </div>
              )}

              {/* CGU */}
              <label className="flex gap-3 items-start cursor-pointer rounded-[11px] p-3.5" style={{ background: "#FAFBFB", border: "1px solid #EEF2F0" }}>
                <input type="checkbox" checked={cgu} onChange={(e) => setCgu(e.target.checked)}
                  className="mt-0.5 cursor-pointer" style={{ width: 17, height: 17, accentColor: "#1D9E75" }} />
                <span className="text-[12.5px] leading-relaxed" style={{ color: "#3d4b44" }}>
                  J'accepte les <b style={{ color: "#1D9E75" }}>conditions générales d'utilisation</b> et la politique de confidentialité.
                  Mes coordonnées restent masquées jusqu'au déblocage par un réparateur (conforme RGPD).
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-5" style={{ borderTop: "1px solid #EAEFED" }}>
            {step === 1
              ? <Link href="/" className="bg-transparent border-0 font-bold text-[14px] cursor-pointer no-underline" style={{ color: "#6B7280" }}>Annuler</Link>
              : <button onClick={prev} className="font-bold text-[14px] rounded-[11px] px-5 py-3 cursor-pointer" style={{ background: "#fff", border: "1px solid #EAEFED", color: "#11211B" }}>Précédent</button>
            }
            {step < 4
              ? <button onClick={next}
                  disabled={step === 1 ? !canStep1 : step === 2 ? !canStep2 : !canStep3}
                  className="font-bold text-[14px] text-white rounded-[11px] px-6 py-3 border-0 cursor-pointer disabled:cursor-not-allowed transition-all"
                  style={{ background: (step === 1 ? canStep1 : step === 2 ? canStep2 : canStep3) ? "#1D9E75" : "#cdd6d1", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}>
                  Continuer
                </button>
              : <button onClick={publish} disabled={!canStep4}
                  className="font-bold text-[14px] text-white rounded-[11px] px-6 py-3 border-0 cursor-pointer disabled:cursor-not-allowed"
                  style={{ background: canStep4 ? "#1D9E75" : "#cdd6d1", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}>
                  Publier ma demande
                </button>
            }
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── SuccessScreen ── */
function SuccessScreen({ refNumber, vehicle, city, intervention, insurance, email }: {
  refNumber: string; vehicle: string; city: string; intervention: string; insurance: string; email: string;
}) {
  const steps = [
    { icon: "👁️", label: "Votre annonce est visible", sub: "Les réparateurs de votre zone peuvent la consulter maintenant.", done: true },
    { icon: "🔓", label: "Un partenaire débloque votre fiche", sub: "Il accède à vos coordonnées pour vous contacter directement.", done: false },
    { icon: "📞", label: "Vous êtes contacté", sub: "Le réparateur vous appelle ou vous envoie un devis.", done: false },
    { icon: "✅", label: "Vous choisissez votre prestataire", sub: "Comparez les offres et sélectionnez le meilleur.", done: false },
  ];
  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />
      <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-10 pb-20 animate-mgFade">
        <div className="bg-white rounded-[22px] p-8 text-center mb-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 4px 20px rgba(17,33,27,.06)" }}>
          <div className="w-[80px] h-[80px] rounded-full mx-auto flex items-center justify-center mb-5" style={{ background: "linear-gradient(150deg,#E8F6F0,#cdeadd)" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#1D9E75" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-tight">Demande publiée !</h1>
          <p className="mt-2.5 mb-0 text-[14.5px] leading-relaxed font-medium mx-auto max-w-[420px]" style={{ color: "#6B7280" }}>
            Les réparateurs de votre zone vont vous contacter directement.
          </p>
          <div className="inline-flex items-center gap-3 mt-5 rounded-[13px] px-5 py-3" style={{ background: "#F4F6F5", border: "1px dashed #c8d5ce" }}>
            <div className="text-left">
              <div className="text-[10.5px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#9aa39e" }}>Référence dossier</div>
              <div className="text-[20px] font-extrabold tracking-wider" style={{ color: "#0F5C44" }}>{refNumber}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[18px] p-6 mb-5" style={{ border: "1px solid #EAEFED" }}>
          <h2 className="m-0 mb-4 text-[15px] font-extrabold">Récapitulatif</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🚗", label: "Véhicule", value: vehicle },
              { icon: "📍", label: "Localisation", value: city },
              { icon: "🔧", label: "Intervention", value: INTERV_LABELS[intervention] ?? intervention },
              { icon: "🛡️", label: "Assurance", value: insurance === "avec" ? "Avec prise en charge" : "Sans assurance" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-[12px] p-3.5" style={{ background: "#F8FAFA", border: "1px solid #EAEFED" }}>
                <div className="text-[18px] mb-1">{icon}</div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#9aa39e" }}>{label}</div>
                <div className="font-bold text-[13.5px]">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[18px] p-6 mb-5" style={{ border: "1px solid #EAEFED" }}>
          <h2 className="m-0 mb-5 text-[15px] font-extrabold">Que se passe-t-il maintenant ?</h2>
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3.5 relative">
              {i < steps.length - 1 && <div className="absolute left-[19px] top-[42px] bottom-0 w-[2px]" style={{ background: "#EAEFED" }} />}
              <div className="flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center text-[16px] z-10"
                style={{ background: s.done ? "#E8F6F0" : "#F4F6F5", border: s.done ? "2px solid #1D9E75" : "2px solid #EAEFED" }}>
                {s.icon}
              </div>
              <div className="pb-5">
                <div className="font-bold text-[14px]" style={{ color: s.done ? "#0F5C44" : "#11211B" }}>{s.label}</div>
                <div className="text-[12.5px] font-medium mt-0.5" style={{ color: "#6B7280" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Link href="/mes-demandes" className="no-underline flex-1">
            <button className="w-full text-white border-0 rounded-[12px] px-6 py-3.5 font-bold text-[14.5px] cursor-pointer" style={{ background: "#1D9E75", boxShadow: "0 4px 14px rgba(29,158,117,.3)" }}>
              Voir mes demandes
            </button>
          </Link>
          <Link href="/" className="no-underline">
            <button className="rounded-[12px] px-6 py-3.5 font-bold text-[14.5px] cursor-pointer" style={{ background: "#fff", color: "#11211B", border: "1px solid #EAEFED" }}>
              Retour à l'accueil
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

/* ── Micro-components ── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[13px] font-bold mb-1.5 mt-4 first:mt-0">{children}</label>;
}
function Req() { return <span style={{ color: "#D85A30" }}>*</span>; }
function InputField({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className="w-full rounded-[11px] px-3.5 py-3 text-[14.5px] outline-none" style={{ border: "1px solid #EAEFED" }} />;
}
function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-[11px] px-3 py-3 text-[14px] font-semibold cursor-pointer outline-none bg-white" style={{ border: "1px solid #EAEFED", color: "#11211B" }}>
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>;
}
function InsuranceBtn({ active, onClick, color, label }: { active: boolean; onClick: () => void; color: "green" | "orange"; label: string }) {
  const green = color === "green";
  return <button onClick={onClick} className="flex-1 rounded-[11px] py-3 font-bold text-[14px] cursor-pointer transition-all"
    style={active
      ? { border: `2px solid ${green ? "#1D9E75" : "#D85A30"}`, background: green ? "#E8F6F0" : "#FCEDE7", color: green ? "#0F5C44" : "#B0431F" }
      : { border: "1px solid #EAEFED", background: "#fff", color: "#3d4b44" }}>
    {label}
  </button>;
}
