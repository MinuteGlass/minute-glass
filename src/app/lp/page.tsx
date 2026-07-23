"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { addLocalDemande } from "@/lib/demandes-store";
import { setAuth, getAuth } from "@/lib/auth";
import { DEMANDES } from "@/data/demandes";
import type { InterventionType } from "@/types";

/* ─── constants ─── */
const MARQUES = [
  "Alfa Romeo","Audi","BMW","Citroën","Cupra","Dacia","DS","Fiat",
  "Ford","Honda","Hyundai","Kia","Mercedes-Benz","MINI","Nissan",
  "Opel","Peugeot","Renault","SEAT","Škoda","Toyota","Volkswagen","Volvo","Autre",
];
const ANNEES = Array.from({ length: 30 }, (_, i) => String(2025 - i));
const DISPOS = ["Dès que possible","Cette semaine","La semaine prochaine","Je suis flexible"];
const ZONES: Record<InterventionType, string[]> = {
  reparation:   ["Pare-brise avant","Pare-brise arrière"],
  remplacement: ["Pare-brise avant","Pare-brise arrière","Lunette arrière"],
  vitre:        ["Vitre avant gauche","Vitre avant droite","Vitre arrière gauche","Vitre arrière droite","Custode","Toit panoramique"],
};
const SERVICES: { id: InterventionType; label: string }[] = [
  { id: "remplacement", label: "Remplacement pare-brise" },
  { id: "reparation",   label: "Réparation impact" },
  { id: "vitre",        label: "Vitre latérale" },
];

/* ─── Form intégré (service en étape 1) ─── */
function LeadForm() {
  const router = useRouter();
  const [step, setStep] = useState<1|2|3|4>(1);

  const [intervention, setIntervention] = useState<InterventionType>("remplacement");
  const [marque,  setMarque]  = useState("");
  const [modele,  setModele]  = useState("");
  const [annee,   setAnnee]   = useState("");
  const [ville,   setVille]   = useState("");

  const [zone,      setZone]      = useState("");
  const [damage,    setDamage]    = useState("");
  const [insurance, setInsurance] = useState<"sans"|"avec"|null>(null);
  const [dispo,     setDispo]     = useState("");

  const [prenom, setPrenom] = useState("");
  const [tel,    setTel]    = useState("");
  const [email,  setEmail]  = useState("");

  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyAuth, setAlreadyAuth] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth?.role === "particulier") setAlreadyAuth(true);
  }, []);

  const step1Ok = marque && modele.trim() && annee && ville.trim();
  const step2Ok = zone && damage.trim().length >= 10 && insurance !== null && dispo;
  const step3Ok = prenom.trim() && tel.trim().length >= 10 && email.trim().includes("@");
  const step4Ok = password.length >= 6;

  function next2() { setZone(""); setStep(2); }
  function next3or4() {
    if (alreadyAuth) { submit(getAuth()!.email!); return; }
    setStep(3);
  }
  function next4() {
    if (alreadyAuth) { submit(getAuth()!.email!); return; }
    setStep(4);
  }
  function submit(userEmail: string) {
    setSubmitting(true);
    addLocalDemande({
      id: `lp-${Date.now()}`,
      title: `${marque} ${modele} · ${annee}`,
      city: ville, distance: "—", age: "À l'instant",
      insurance: insurance!, intervention,
      damage, damageZone: zone, availability: dispo,
      clientName: prenom, phone: tel, email: userEmail,
      isNew: true, isLocal: true, region: "",
    });
    setAuth("particulier", userEmail, prenom);
    router.push("/mes-demandes");
  }

  const inp = "w-full rounded-[10px] px-3.5 py-3 text-[13.5px] font-semibold border-0 outline-none";
  const is = { background: "#F4F6F5", color: "#11211B" };

  const Prog = () => (
    <div className="flex gap-1.5 mb-5">
      {[1,2,3,4].map(n => (
        <div key={n} className="h-1 flex-1 rounded-full transition-all"
          style={{ background: n <= step ? "#1D9E75" : "rgba(255,255,255,.15)" }} />
      ))}
    </div>
  );

  const BtnNext = ({ onClick, disabled, label="Continuer →" }: { onClick:()=>void; disabled:boolean; label?:string }) => (
    <button disabled={disabled} onClick={onClick}
      className="flex-1 py-3.5 rounded-[11px] font-extrabold text-[14px] text-white border-0 cursor-pointer"
      style={{ background:"#1D9E75", opacity:disabled?.35:1, boxShadow:disabled?"none":"0 4px 14px rgba(29,158,117,.35)", transition:"opacity .15s" }}>
      {label}
    </button>
  );
  const BtnBack = ({ onClick }: { onClick:()=>void }) => (
    <button onClick={onClick} className="px-4 py-3.5 rounded-[11px] font-bold text-[13px] border-0 cursor-pointer flex-shrink-0"
      style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.5)" }}>←</button>
  );

  /* STEP 1 */
  if (step === 1) return (
    <div>
      <Prog />
      {/* Service — compact inline */}
      <div className="flex gap-2 mb-4">
        {SERVICES.map(s => (
          <button key={s.id} onClick={() => { setIntervention(s.id); setZone(""); }}
            className="flex-1 rounded-[10px] py-2.5 font-bold text-[11.5px] border-0 cursor-pointer text-center leading-tight transition-all"
            style={{ background: intervention===s.id ? "#1D9E75" : "rgba(255,255,255,.08)", color: intervention===s.id ? "#fff" : "rgba(255,255,255,.5)" }}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <select value={marque} onChange={e=>setMarque(e.target.value)} className={inp}
            style={{...is, color: marque?"#11211B":"#9aa39e"}}>
            <option value="">Marque…</option>
            {MARQUES.map(m=><option key={m}>{m}</option>)}
          </select>
          <input type="text" placeholder="Modèle" value={modele} onChange={e=>setModele(e.target.value)} className={inp} style={is} />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <select value={annee} onChange={e=>setAnnee(e.target.value)} className={inp}
            style={{...is, color: annee?"#11211B":"#9aa39e"}}>
            <option value="">Année…</option>
            {ANNEES.map(a=><option key={a}>{a}</option>)}
          </select>
          <input type="text" placeholder="Votre ville" value={ville} onChange={e=>setVille(e.target.value)} className={inp} style={is} />
        </div>
        <BtnNext onClick={next2} disabled={!step1Ok} label="Recevoir des devis gratuits →" />
      </div>
    </div>
  );

  /* STEP 2 */
  if (step === 2) return (
    <div>
      <Prog />
      <div className="flex flex-col gap-2.5">
        <select value={zone} onChange={e=>setZone(e.target.value)} className={inp}
          style={{...is, color:zone?"#11211B":"#9aa39e"}}>
          <option value="">Zone touchée…</option>
          {ZONES[intervention].map(z=><option key={z}>{z}</option>)}
        </select>
        <textarea placeholder="Décrivez le dégât (taille, localisation…)" value={damage}
          onChange={e=>setDamage(e.target.value)} rows={3} className={`${inp} resize-none`} style={is} />
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color:"rgba(255,255,255,.35)" }}>Assurance bris de glace ?</div>
          <div className="grid grid-cols-2 gap-2">
            {(["sans","avec"] as const).map(v=>(
              <button key={v} onClick={()=>setInsurance(v)}
                className="py-2.5 rounded-[10px] font-bold text-[12.5px] border-0 cursor-pointer transition-all"
                style={{ background:insurance===v?"#1D9E75":"rgba(255,255,255,.08)", color:insurance===v?"#fff":"rgba(255,255,255,.5)" }}>
                {v==="sans"?"Non, sans assurance":"Oui, tous risques"}
              </button>
            ))}
          </div>
        </div>
        <select value={dispo} onChange={e=>setDispo(e.target.value)} className={inp}
          style={{...is, color:dispo?"#11211B":"#9aa39e"}}>
          <option value="">Disponibilité…</option>
          {DISPOS.map(d=><option key={d}>{d}</option>)}
        </select>
        <div className="flex gap-2">
          <BtnBack onClick={()=>setStep(1)} />
          <BtnNext onClick={next3or4} disabled={!step2Ok} />
        </div>
      </div>
    </div>
  );

  /* STEP 3 */
  if (step === 3) return (
    <div>
      <Prog />
      <div className="flex flex-col gap-2.5">
        <input type="text" placeholder="Votre prénom" value={prenom} onChange={e=>setPrenom(e.target.value)} className={inp} style={is} />
        <input type="tel" placeholder="Téléphone (06 xx xx xx xx)" value={tel} onChange={e=>setTel(e.target.value)} className={inp} style={is} />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className={inp} style={is} />
        <p className="text-[11px] font-semibold leading-relaxed" style={{ color:"rgba(255,255,255,.3)" }}>
          Coordonnées transmises uniquement aux réparateurs qui répondent.
        </p>
        <div className="flex gap-2">
          <BtnBack onClick={()=>setStep(2)} />
          <BtnNext onClick={next4} disabled={!step3Ok} />
        </div>
      </div>
    </div>
  );

  /* STEP 4 */
  return (
    <div>
      <Prog />
      <div className="rounded-[11px] p-3.5 mb-4" style={{ background:"rgba(255,255,255,.06)" }}>
        {[
          { label:"Véhicule", value:`${marque} ${modele} ${annee}` },
          { label:"Ville",    value:ville },
          { label:"Assurance",value:insurance==="avec"?"Tous risques":"Sans assurance" },
        ].map(({label,value})=>(
          <div key={label} className="flex justify-between items-baseline gap-2 mb-1">
            <span className="text-[11px] font-semibold" style={{ color:"rgba(255,255,255,.35)" }}>{label}</span>
            <span className="text-[11.5px] font-bold text-right text-white">{value}</span>
          </div>
        ))}
      </div>
      <p className="text-[12px] font-semibold mb-3" style={{ color:"rgba(255,255,255,.45)" }}>
        Créez votre espace pour recevoir et suivre les devis.
      </p>
      <div className="flex flex-col gap-2.5 mb-3">
        <input type="email" value={email} readOnly className={inp} style={{...is, color:"#9aa39e", cursor:"default"}} />
        <div className="relative">
          <input type={showPwd?"text":"password"} placeholder="Mot de passe (6 car. min)"
            value={password} onChange={e=>setPassword(e.target.value)}
            className={inp} style={{...is, paddingRight:"44px"}} />
          <button type="button" onClick={()=>setShowPwd(v=>!v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent cursor-pointer p-0" style={{color:"#9aa39e"}}>
            {showPwd
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
            }
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <BtnBack onClick={()=>setStep(3)} />
        <BtnNext onClick={()=>submit(email)} disabled={!step4Ok||submitting}
          label={submitting?"Création…":"Publier ma demande →"} />
      </div>
      <p className="text-[10.5px] font-semibold text-center mt-2.5" style={{color:"rgba(255,255,255,.3)"}}>
        Déjà un compte ?{" "}
        <a href="/connexion" className="no-underline font-bold" style={{color:"#1D9E75"}}>Se connecter</a>
      </p>
    </div>
  );
}

/* ─── Mini demande card ─── */
function MiniDemandeCard({ d }: { d: typeof DEMANDES[0] }) {
  const intervLabel = d.intervention==="remplacement"?"Remplacement":d.intervention==="reparation"?"Réparation":"Vitre";
  return (
    <div className="bg-white rounded-[14px] p-4" style={{ border:"1px solid #EAEFED" }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="font-extrabold text-[13.5px]" style={{color:"#11211B"}}>{d.title}</div>
          <div className="text-[12px] font-semibold mt-0.5" style={{color:"#9aa39e"}}>{d.city} · {d.age}</div>
        </div>
        {d.isNew && <span className="text-[10px] font-extrabold text-white rounded-full px-2 py-0.5 flex-shrink-0" style={{background:"#D8302F"}}>NOUVEAU</span>}
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className="text-[11px] font-bold rounded-full px-2.5 py-1" style={{background:"#EAF1FE",color:"#2563EB"}}>{intervLabel}</span>
        <span className="text-[11px] font-bold rounded-full px-2.5 py-1" style={{background:"#FCEDE7",color:"#B0431F"}}>Sans assurance</span>
      </div>
    </div>
  );
}

const PREVIEW_DEMANDES = DEMANDES.filter(d => d.insurance === "sans").slice(0, 6);

const AVIS = [
  { nom: "Jean-Marc B.", ville: "Lyon", note: 5, texte: "Reçu 4 devis en moins de 24h sans assurance. J'ai économisé 180€ par rapport au prix Carglass." },
  { nom: "Sabrina K.", ville: "Marseille", note: 5, texte: "Super simple, j'avais peur de devoir avancer de l'argent mais le réparateur m'a tout expliqué. Payé directement chez lui." },
  { nom: "Thomas R.", ville: "Paris 15e", note: 5, texte: "Pas d'assurance bris de glace, je ne savais pas quoi faire. En 2 minutes de formulaire j'ai eu 3 offres le lendemain matin." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>

      {/* Navbar minimaliste */}
      <header className="bg-white sticky top-0 z-40" style={{ borderBottom:"1px solid #EAEFED" }}>
        <div className="max-w-[1100px] mx-auto px-5 flex items-center justify-between" style={{ height:58 }}>
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-3">
            <Link href="/connexion" className="text-[13px] font-bold no-underline hidden sm:block" style={{color:"#6B7280"}}>Se connecter</Link>
            <Link href="/partenaire" className="text-[12.5px] font-bold no-underline rounded-[9px] px-3 py-2 hidden sm:block" style={{background:"#F4F6F5",color:"#3d4b44"}}>Espace réparateur</Link>
          </div>
        </div>
      </header>

      <main>

        {/* ── HERO ── */}
        <section style={{ background:"#fff" }}>
          <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-10 sm:py-16">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

              {/* Formulaire — EN PREMIER dans le DOM = premier sur mobile */}
              <div className="w-full lg:w-[420px] flex-shrink-0 order-first lg:order-last lg:sticky lg:top-[78px]">
                <div className="rounded-[20px] p-6" style={{ background:"#11211B", boxShadow:"0 12px 40px rgba(17,33,27,.2)" }}>
                  <div className="font-extrabold text-[17px] text-white mb-0.5">Déposer ma demande</div>
                  <p className="text-[12px] font-medium mb-5" style={{color:"rgba(255,255,255,.35)"}}>Gratuit · Sans engagement · Réponse sous 48h</p>
                  <LeadForm />
                </div>

                {/* Badge confiance sous le form */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  {["🔒 Données sécurisées","⭐ 4.8/5 client","✓ 0€ pour vous"].map(t => (
                    <span key={t} className="text-[11px] font-bold" style={{color:"#9aa39e"}}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Texte — second dans le DOM = sous le form sur mobile */}
              <div className="flex-1 min-w-0 lg:pt-2">

                {/* Badge sans assurance */}
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-[12px] font-bold"
                  style={{background:"#FEF3E8", color:"#B06B10", border:"1px solid #FDE68A"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" fill="#F59E0B" fillOpacity=".25" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round"/></svg>
                  Pas d'assurance bris de glace ? Cette page est pour vous
                </div>

                <h1 className="font-extrabold tracking-tight leading-[1.1] mb-4"
                  style={{fontSize:"clamp(28px,4vw,48px)", color:"#11211B", letterSpacing:"-0.025em"}}>
                  Pare-brise cassé<br />
                  <span style={{color:"#1D9E75"}}>sans assurance ?</span><br />
                  Recevez des devis.
                </h1>

                <p className="text-[15px] font-semibold leading-relaxed mb-6" style={{color:"#6B7280", maxWidth:420}}>
                  Déposez votre demande en 2 minutes. Les réparateurs vous envoient leurs tarifs. Vous choisissez la meilleure offre et payez directement le professionnel. <strong style={{color:"#11211B"}}>La mise en relation est gratuite.</strong>
                </p>

                {/* Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {[
                    {l:"✓ Mise en relation gratuite", bg:"#E8F6F0", c:"#0F5C44"},
                    {l:"✓ Aucune commission", bg:"#E8F6F0", c:"#0F5C44"},
                    {l:"✓ Sans engagement", bg:"#F4F6F5", c:"#3d4b44"},
                    {l:"✓ Réponse sous 48h", bg:"#F4F6F5", c:"#3d4b44"},
                  ].map(t=>(
                    <span key={t.l} className="rounded-full px-3 py-1.5 text-[12px] font-bold"
                      style={{background:t.bg, color:t.c}}>{t.l}</span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-8 mb-8">
                  {[
                    {v:"500+", l:"Réparateurs"},
                    {v:"48h",  l:"Délai moyen"},
                    {v:"0 €",  l:"Pour vous"},
                  ].map((s,i)=>(
                    <div key={s.l} style={{paddingLeft:i>0?24:0, borderLeft:i>0?"1.5px solid #EAEFED":undefined}}>
                      <div className="font-extrabold text-[24px] tracking-tight" style={{color:"#11211B"}}>{s.v}</div>
                      <div className="text-[11.5px] font-semibold" style={{color:"#9aa39e"}}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Avis clients */}
                <div className="flex flex-col gap-3">
                  {AVIS.map(a=>(
                    <div key={a.nom} className="rounded-[14px] p-4" style={{background:"#F4F6F5"}}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[11px] text-white flex-shrink-0" style={{background:"#1D9E75"}}>
                          {a.nom[0]}
                        </div>
                        <div>
                          <div className="font-bold text-[12.5px]" style={{color:"#11211B"}}>{a.nom} <span style={{color:"#9aa39e"}}>· {a.ville}</span></div>
                          <div className="text-[11px]" style={{color:"#F59E0B"}}>{"★".repeat(a.note)}</div>
                        </div>
                      </div>
                      <p className="text-[12.5px] font-medium leading-relaxed m-0" style={{color:"#6B7280"}}>"{a.texte}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          <div style={{height:3, background:"linear-gradient(90deg,#1D9E75,#0F5C44 50%,#1D9E75)"}} />
        </section>

        {/* ── Comment ça marche ── */}
        <section className="max-w-[760px] mx-auto px-5 py-14">
          <h2 className="font-extrabold text-center mb-8" style={{fontSize:"clamp(18px,3vw,24px)", color:"#11211B"}}>
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {n:"1", t:"Déposez votre demande", d:"2 minutes. Marque, dégât, disponibilité. Pas besoin d'appeler."},
              {n:"2", t:"Les pros vous contactent", d:"Les réparateurs de votre ville reçoivent votre demande et envoient leurs offres."},
              {n:"3", t:"Choisissez et payez", d:"Vous choisissez le meilleur devis. Vous payez directement le réparateur, rien de plus."},
            ].map(s=>(
              <div key={s.n} className="bg-white rounded-[16px] p-5" style={{border:"1px solid #EAEFED"}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[13px] text-white mb-3" style={{background:"#1D9E75"}}>{s.n}</div>
                <div className="font-extrabold text-[14px] mb-1.5" style={{color:"#11211B"}}>{s.t}</div>
                <div className="text-[12.5px] font-medium leading-relaxed" style={{color:"#6B7280"}}>{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Demandes actives ── */}
        <section style={{background:"#fff", borderTop:"1px solid #EAEFED"}}>
          <div className="max-w-[900px] mx-auto px-5 py-14">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="font-extrabold m-0" style={{fontSize:"clamp(16px,2.5vw,21px)", color:"#11211B"}}>Demandes en cours</h2>
                <p className="m-0 mt-1 text-[12.5px] font-semibold" style={{color:"#9aa39e"}}>Des clients sans assurance qui attendent un devis près de chez vous.</p>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold" style={{background:"#E8F6F0", color:"#0F5C44"}}>
                <span className="w-1.5 h-1.5 rounded-full" style={{background:"#1D9E75"}} />
                Mis à jour en temps réel
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
              {PREVIEW_DEMANDES.map(d=><MiniDemandeCard key={d.id} d={d} />)}
            </div>
            <div className="text-center">
              <a href="#" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}}
                className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3.5 font-extrabold text-[14px] text-white no-underline"
                style={{background:"linear-gradient(135deg,#1D9E75,#0F5C44)", boxShadow:"0 4px 16px rgba(29,158,117,.3)"}}>
                Déposer ma demande gratuitement →
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-[680px] mx-auto px-5 py-14">
          <h2 className="font-extrabold text-center mb-6" style={{fontSize:"clamp(17px,2.5vw,22px)", color:"#11211B"}}>Questions fréquentes</h2>
          <div className="flex flex-col gap-2">
            {[
              {q:"C'est vraiment gratuit ?", a:"Oui. Ce sont les réparateurs qui paient pour accéder aux demandes. Pour vous, c'est 100% gratuit."},
              {q:"Je n'ai pas d'assurance bris de glace, ça marche quand même ?", a:"C'est même notre spécialité. Recevez des devis, comparez, payez directement le réparateur. Zéro paperasse."},
              {q:"Combien de temps pour recevoir des devis ?", a:"La plupart des réparateurs répondent en moins de 24h. Souvent le jour même."},
              {q:"Suis-je obligé d'accepter une offre ?", a:"Non. Aucun engagement. Vous comparez et vous décidez librement."},
            ].map((item,i)=>(
              <details key={i} className="bg-white rounded-[13px] group" style={{border:"1px solid #EAEFED"}}>
                <summary className="flex items-center justify-between gap-3 px-5 py-4 font-bold text-[13.5px] cursor-pointer list-none" style={{color:"#11211B"}}>
                  {item.q}
                  <svg className="flex-shrink-0 transition-transform group-open:rotate-180" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round"/></svg>
                </summary>
                <p className="px-5 pb-4 pt-0 m-0 text-[13px] font-medium leading-relaxed" style={{color:"#6B7280"}}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

      </main>

      <footer className="text-center py-5 text-[12px] font-semibold" style={{color:"#9aa39e", borderTop:"1px solid #EAEFED", background:"#fff"}}>
        © {new Date().getFullYear()} Minute Glass ·{" "}
        <a href="/tarifs" className="no-underline hover:underline" style={{color:"#9aa39e"}}>Tarifs réparateurs</a> ·{" "}
        <a href="/partenaire" className="no-underline hover:underline" style={{color:"#9aa39e"}}>Espace réparateur</a>
      </footer>
    </div>
  );
}
