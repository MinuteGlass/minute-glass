"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

function VanIllustration() {
  return (
    <svg viewBox="0 0 580 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[560px]">
      {/* Atmospheric background glows */}
      <ellipse cx="460" cy="80" rx="120" ry="50" fill="rgba(126,237,199,.06)"/>
      <ellipse cx="100" cy="60" rx="80" ry="35" fill="rgba(255,255,255,.04)"/>

      {/* HOUSE — background left */}
      <ellipse cx="115" cy="325" rx="70" ry="8" fill="rgba(0,0,0,.18)"/>
      <polygon points="30,220 115,148 200,220" fill="rgba(255,255,255,.13)" stroke="rgba(255,255,255,.22)" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="48" y="220" width="135" height="100" rx="4" fill="rgba(255,255,255,.09)" stroke="rgba(255,255,255,.18)" strokeWidth="1.5"/>
      <rect x="62" y="235" width="38" height="32" rx="4" fill="rgba(126,237,199,.18)" stroke="rgba(126,237,199,.4)" strokeWidth="1.5"/>
      <line x1="81" y1="235" x2="81" y2="267" stroke="rgba(126,237,199,.5)" strokeWidth="1"/>
      <line x1="62" y1="251" x2="100" y2="251" stroke="rgba(126,237,199,.5)" strokeWidth="1"/>
      <rect x="130" y="235" width="38" height="32" rx="4" fill="rgba(126,237,199,.18)" stroke="rgba(126,237,199,.4)" strokeWidth="1.5"/>
      <line x1="149" y1="235" x2="149" y2="267" stroke="rgba(126,237,199,.5)" strokeWidth="1"/>
      <line x1="130" y1="251" x2="168" y2="251" stroke="rgba(126,237,199,.5)" strokeWidth="1"/>
      <rect x="96" y="272" width="38" height="48" rx="4" fill="rgba(126,237,199,.2)" stroke="rgba(126,237,199,.45)" strokeWidth="1.5"/>
      <circle cx="128" cy="296" r="3" fill="rgba(255,255,180,.7)"/>
      <rect x="148" y="155" width="16" height="28" rx="2" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.2)" strokeWidth="1"/>
      <ellipse cx="156" cy="148" rx="5" ry="8" fill="rgba(255,255,255,.08)"/>
      <ellipse cx="38" cy="322" rx="18" ry="14" fill="rgba(126,237,199,.18)" stroke="rgba(126,237,199,.3)" strokeWidth="1"/>
      <ellipse cx="58" cy="318" rx="16" ry="16" fill="rgba(126,237,199,.2)" stroke="rgba(126,237,199,.3)" strokeWidth="1"/>
      <ellipse cx="78" cy="320" rx="14" ry="14" fill="rgba(126,237,199,.16)" stroke="rgba(126,237,199,.28)" strokeWidth="1"/>
      <ellipse cx="195" cy="319" rx="16" ry="14" fill="rgba(126,237,199,.18)" stroke="rgba(126,237,199,.3)" strokeWidth="1"/>
      <ellipse cx="213" cy="317" rx="14" ry="15" fill="rgba(126,237,199,.2)" stroke="rgba(126,237,199,.3)" strokeWidth="1"/>

      {/* GROUND */}
      <rect x="0" y="328" width="580" height="72" fill="rgba(0,0,0,.22)"/>
      <rect x="55" y="345" width="60" height="5" rx="2.5" fill="rgba(255,255,255,.1)"/>
      <rect x="245" y="345" width="90" height="5" rx="2.5" fill="rgba(255,255,255,.1)"/>
      <rect x="420" y="345" width="70" height="5" rx="2.5" fill="rgba(255,255,255,.1)"/>
      <ellipse cx="290" cy="360" rx="260" ry="18" fill="rgba(0,0,0,.15)"/>

      {/* MINUTEGLASS VAN — background right */}
      <ellipse cx="490" cy="338" rx="75" ry="9" fill="rgba(0,0,0,.2)"/>
      <rect x="415" y="230" width="145" height="105" rx="10" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.28)" strokeWidth="2"/>
      <path d="M415,280 L415,245 Q415,230 428,230 L472,230 L472,290 L415,290Z" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
      <path d="M420,250 L420,282 Q420,288 426,288 L468,288 L468,255 Q464,243 455,243 L432,243 Q420,243 420,250Z" fill="rgba(126,237,199,.22)" stroke="rgba(126,237,199,.5)" strokeWidth="1.5"/>
      <path d="M426,246 L436,246 L434,270 L424,270Z" fill="rgba(255,255,255,.12)"/>
      <rect x="415" y="270" width="8" height="14" rx="3" fill="rgba(255,255,180,.55)" stroke="rgba(255,255,180,.7)" strokeWidth="1"/>
      <path d="M410,272 L385,266 L385,280 L410,278Z" fill="rgba(255,255,180,.06)"/>
      <rect x="472" y="223" width="88" height="6" rx="3" fill="rgba(255,255,255,.3)" stroke="rgba(255,255,255,.4)" strokeWidth="1"/>
      <rect x="476" y="219" width="4" height="12" rx="2" fill="rgba(255,255,255,.35)"/>
      <rect x="552" y="219" width="4" height="12" rx="2" fill="rgba(255,255,255,.35)"/>
      <rect x="490" y="210" width="50" height="14" rx="2" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.25)" strokeWidth="1"/>
      <line x1="500" y1="210" x2="500" y2="224" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
      <line x1="512" y1="210" x2="512" y2="224" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
      <line x1="524" y1="210" x2="524" y2="224" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
      <rect x="476" y="245" width="82" height="38" rx="7" fill="rgba(126,237,199,.18)" stroke="rgba(126,237,199,.45)" strokeWidth="1.5"/>
      <text x="517" y="261" textAnchor="middle" fill="rgba(255,255,255,.75)" fontSize="7.5" fontWeight="700" fontFamily="-apple-system,sans-serif">🔧</text>
      <text x="517" y="275" textAnchor="middle" fill="rgba(255,255,255,.92)" fontSize="9" fontWeight="800" fontFamily="-apple-system,sans-serif">MinuteGlass</text>
      <line x1="520" y1="232" x2="520" y2="333" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
      <circle cx="522" cy="283" r="3" fill="rgba(255,255,255,.25)"/>
      <circle cx="448" cy="337" r="22" fill="rgba(0,0,0,.35)" stroke="rgba(255,255,255,.28)" strokeWidth="2.5"/>
      <circle cx="448" cy="337" r="13" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
      <circle cx="448" cy="337" r="5" fill="rgba(255,255,255,.4)"/>
      <circle cx="536" cy="337" r="22" fill="rgba(0,0,0,.35)" stroke="rgba(255,255,255,.28)" strokeWidth="2.5"/>
      <circle cx="536" cy="337" r="13" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
      <circle cx="536" cy="337" r="5" fill="rgba(255,255,255,.4)"/>

      {/* CAR — center, 3/4 view */}
      <ellipse cx="265" cy="348" rx="110" ry="12" fill="rgba(0,0,0,.25)"/>
      <path d="M155,310 Q155,326 165,328 L370,328 Q380,326 382,310 L155,310Z" fill="rgba(0,0,0,.3)" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
      <path d="M158,310 L158,258 Q158,248 165,248 L218,200 Q226,192 238,192 L348,192 Q362,192 370,202 L395,248 Q400,255 400,264 L400,310Z" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.32)" strokeWidth="2"/>
      <path d="M218,200 L232,168 Q238,160 250,160 L342,160 Q355,160 360,170 L375,200Z" fill="rgba(255,255,255,.2)" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
      <path d="M158,258 L165,248 L218,200 L158,210Z" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
      {/* CRACKED WINDSHIELD */}
      <path d="M218,200 L232,168 L342,168 L358,200Z" fill="rgba(180,220,255,.15)" stroke="rgba(126,237,199,.45)" strokeWidth="2"/>
      <path d="M270,168 L252,200 M265,172 L280,200 M248,180 L272,200" stroke="rgba(255,80,80,.85)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M270,168 L258,178 L268,200" stroke="rgba(255,80,80,.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="268" cy="177" r="5" fill="rgba(255,80,80,.3)" stroke="rgba(255,80,80,.7)" strokeWidth="1.5"/>
      <circle cx="268" cy="177" r="2" fill="rgba(255,80,80,.8)"/>
      <path d="M228,172 L240,170 L238,190 L226,192Z" fill="rgba(255,255,255,.1)"/>
      <path d="M218,200 L232,168 L250,168 L250,200Z" fill="rgba(126,237,199,.12)" stroke="rgba(126,237,199,.3)" strokeWidth="1.5"/>
      <path d="M255,168 L340,168 L355,200 L255,200Z" fill="rgba(126,237,199,.1)" stroke="rgba(126,237,199,.25)" strokeWidth="1"/>
      <line x1="295" y1="168" x2="310" y2="200" stroke="rgba(126,237,199,.35)" strokeWidth="1.5"/>
      <path d="M158,258 L175,248 L182,262 L158,272Z" fill="rgba(255,255,180,.35)" stroke="rgba(255,255,180,.6)" strokeWidth="1.5"/>
      <ellipse cx="164" cy="264" rx="5" ry="8" fill="rgba(255,255,180,.55)"/>
      <path d="M160,276 L168,262 L192,260 L195,278Z" fill="rgba(0,0,0,.25)" stroke="rgba(255,255,255,.2)" strokeWidth="1"/>
      <circle cx="200" cy="203" r="7" fill="rgba(255,255,255,.2)" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
      <rect x="275" y="272" width="22" height="5" rx="2.5" fill="rgba(255,255,255,.25)"/>
      <path d="M170,235 L200,230 L200,240 L170,242Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
      <circle cx="195" cy="330" r="32" fill="rgba(0,0,0,.4)" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
      <circle cx="195" cy="330" r="20" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
      <circle cx="195" cy="330" r="7" fill="rgba(255,255,255,.35)"/>
      <line x1="195" y1="310" x2="195" y2="350" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
      <line x1="175" y1="330" x2="215" y2="330" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
      <line x1="181" y1="316" x2="209" y2="344" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/>
      <line x1="209" y1="316" x2="181" y2="344" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/>
      <circle cx="358" cy="330" r="32" fill="rgba(0,0,0,.4)" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
      <circle cx="358" cy="330" r="20" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
      <circle cx="358" cy="330" r="7" fill="rgba(255,255,255,.35)"/>
      <line x1="358" y1="310" x2="358" y2="350" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
      <line x1="338" y1="330" x2="378" y2="330" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>

      {/* TECHNICIAN */}
      <ellipse cx="398" cy="340" rx="22" ry="6" fill="rgba(0,0,0,.2)"/>
      <rect x="385" y="295" width="14" height="42" rx="5" fill="rgba(15,92,68,.7)" stroke="rgba(126,237,199,.3)" strokeWidth="1"/>
      <rect x="402" y="295" width="14" height="42" rx="5" fill="rgba(15,92,68,.7)" stroke="rgba(126,237,199,.3)" strokeWidth="1"/>
      <ellipse cx="392" cy="337" rx="10" ry="5" fill="rgba(0,0,0,.5)" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
      <ellipse cx="409" cy="337" rx="10" ry="5" fill="rgba(0,0,0,.5)" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
      <rect x="382" y="230" width="37" height="68" rx="10" fill="rgba(29,158,117,.6)" stroke="rgba(126,237,199,.5)" strokeWidth="1.5"/>
      <rect x="388" y="248" width="24" height="14" rx="3" fill="rgba(126,237,199,.3)" stroke="rgba(126,237,199,.5)" strokeWidth="1"/>
      <text x="400" y="259" textAnchor="middle" fill="rgba(255,255,255,.9)" fontSize="6" fontWeight="800" fontFamily="-apple-system,sans-serif">MG</text>
      <circle cx="400" cy="218" r="18" fill="rgba(255,220,180,.6)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
      <path d="M383,213 Q382,204 400,204 Q418,204 418,213Z" fill="rgba(15,92,68,.8)" stroke="rgba(126,237,199,.4)" strokeWidth="1"/>
      <rect x="378" y="210" width="12" height="6" rx="2" fill="rgba(15,92,68,.8)"/>
      <circle cx="394" cy="220" r="2" fill="rgba(80,50,30,.6)"/>
      <circle cx="406" cy="220" r="2" fill="rgba(80,50,30,.6)"/>
      <path d="M394,228 Q400,233 406,228" stroke="rgba(80,50,30,.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M382,250 L350,248" stroke="rgba(29,158,117,.7)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M419,250 L445,242" stroke="rgba(29,158,117,.7)" strokeWidth="10" strokeLinecap="round"/>
      <circle cx="348" cy="248" r="7" fill="rgba(255,220,180,.6)" stroke="rgba(255,255,255,.25)" strokeWidth="1"/>
      <circle cx="447" cy="241" r="7" fill="rgba(255,220,180,.6)" stroke="rgba(255,255,255,.25)" strokeWidth="1"/>

      {/* NEW WINDSHIELD held by technician */}
      <path d="M340,195 L450,190 L456,245 L346,250Z" fill="rgba(126,237,199,.15)" stroke="rgba(126,237,199,.7)" strokeWidth="2"/>
      <path d="M350,198 L370,196 L368,235 L348,237Z" fill="rgba(255,255,255,.15)"/>
      <path d="M420,192 L440,191 L438,230 L418,231Z" fill="rgba(255,255,255,.08)"/>
      <path d="M340,195 L450,190 L456,245 L346,250Z" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5"/>
      {/* Sparkles */}
      <path d="M335,185 L337,180 L339,185 L337,190Z" fill="rgba(255,255,180,.9)"/>
      <path d="M332,187 L337,185 L342,187 L337,189Z" fill="rgba(255,255,180,.9)"/>
      <path d="M462,185 L464,179 L466,185 L464,191Z" fill="rgba(255,255,180,.9)"/>
      <path d="M459,187 L464,185 L469,187 L464,189Z" fill="rgba(255,255,180,.9)"/>
      <path d="M455,255 L457,250 L459,255 L457,260Z" fill="rgba(255,255,180,.9)"/>
      <path d="M452,257 L457,255 L462,257 L457,259Z" fill="rgba(255,255,180,.9)"/>
      <circle cx="342" cy="258" r="2.5" fill="rgba(255,255,180,.7)"/>
      <circle cx="350" cy="170" r="2" fill="rgba(255,255,180,.6)"/>
      <circle cx="447" cy="175" r="2" fill="rgba(255,255,180,.6)"/>
      <rect x="374" y="210" width="50" height="18" rx="5" fill="rgba(126,237,199,.35)" stroke="rgba(126,237,199,.65)" strokeWidth="1"/>
      <text x="399" y="223" textAnchor="middle" fill="rgba(255,255,255,.95)" fontSize="8" fontWeight="800" fontFamily="-apple-system,sans-serif">NOUVEAU ✨</text>

      {/* BADGE top-left */}
      <rect x="14" y="14" width="148" height="52" rx="14" fill="rgba(0,0,0,.28)" stroke="rgba(255,255,255,.22)" strokeWidth="1.5"/>
      <text x="88" y="35" textAnchor="middle" fill="rgba(255,255,255,.85)" fontSize="11" fontWeight="700" fontFamily="-apple-system,sans-serif">⚡ Réponse en</text>
      <text x="88" y="54" textAnchor="middle" fill="#7EEDC7" fontSize="13.5" fontWeight="800" fontFamily="-apple-system,sans-serif">moins de 30 min</text>

      {/* BADGE top-right */}
      <rect x="418" y="14" width="148" height="52" rx="14" fill="rgba(126,237,199,.18)" stroke="rgba(126,237,199,.45)" strokeWidth="1.5"/>
      <text x="492" y="35" textAnchor="middle" fill="rgba(255,255,255,.85)" fontSize="11" fontWeight="700" fontFamily="-apple-system,sans-serif">🚐 Déplacement</text>
      <text x="492" y="54" textAnchor="middle" fill="#7EEDC7" fontSize="13.5" fontWeight="800" fontFamily="-apple-system,sans-serif">à domicile gratuit</text>

      {/* BADGE floating */}
      <rect x="190" y="130" width="90" height="30" rx="10" fill="rgba(0,0,0,.25)" stroke="rgba(255,255,255,.2)" strokeWidth="1"/>
      <text x="235" y="150" textAnchor="middle" fill="rgba(255,255,255,.9)" fontSize="10.5" fontWeight="700" fontFamily="-apple-system,sans-serif">🆓 100% gratuit</text>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: "#EAEFED" }}>
        <div className="max-w-[1100px] mx-auto px-5 h-[62px] flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/partenaire" className="text-[13.5px] font-bold hidden sm:block" style={{ color: "#6B7280" }}>
              Espace réparateur
            </Link>
            <Link
              href="/deposer"
              className="inline-flex items-center gap-2 text-white rounded-[11px] px-5 py-2.5 font-bold text-[14px] no-underline"
              style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.28)" }}
            >
              Déposer ma demande
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative w-full" style={{ background: "#071e12" }}>
        <img
          src="/hero.webp"
          alt="Technicien remplaçant un pare-brise à domicile"
          className="w-full block"
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 flex flex-col sm:flex-row gap-3" style={{ background: "linear-gradient(to top, rgba(7,30,18,0.9) 0%, transparent 100%)", paddingTop: "60px" }}>
          <Link
            href="/deposer"
            className="flex-1 flex items-center justify-center gap-2 rounded-[16px] py-4 font-extrabold text-[17px] no-underline text-center"
            style={{ background: "#1fdd6e", color: "#072d18", boxShadow: "0 6px 24px rgba(31,221,110,.4)" }}
          >
            Déposer une demande →
          </Link>
          <Link
            href="/deposer"
            className="flex-1 flex flex-col items-center justify-center rounded-[16px] py-3 no-underline text-center text-white"
            style={{ background: "#FF6B00", boxShadow: "0 4px 16px rgba(255,107,0,.4)" }}
          >
            <span className="font-semibold text-[12px] mb-1" style={{ color: "rgba(255,255,255,.8)" }}>
              Vous n'êtes pas assuré bris de glace ?
            </span>
            <span className="font-extrabold text-[16px]">Obtenir mon devis gratuit →</span>
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b" style={{ borderColor: "#EAEFED" }}>
        <div className="max-w-[1100px] mx-auto px-5 py-8 grid grid-cols-3 gap-3 text-center">
          {[
            ["Toute la France", "Couverture nationale"],
            ["< 30 min", "Délai de réponse"],
            ["0 €", "Pour le particulier"],
          ].map(([val, label]) => (
            <div key={label}>
              <div className="text-[18px] md:text-[32px] font-extrabold leading-tight" style={{ color: "#0F5C44" }}>{val}</div>
              <div className="text-[11px] md:text-[12.5px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sans assurance ── */}
      <section style={{ background: "#FFF8F0", borderBottom: "1px solid #FFE8CC" }}>
        <div className="max-w-[1100px] mx-auto px-5 py-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-[56px] flex-shrink-0">💰</div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold mb-3" style={{ background: "#FFE8CC", color: "#B45309" }}>
              Pas d'assurance bris de glace ?
            </div>
            <h2 className="m-0 text-[20px] md:text-[24px] font-extrabold mb-2" style={{ color: "#11211B" }}>
              Pas de panique — on trouve le meilleur prix
            </h2>
            <p className="m-0 text-[14.5px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>
              Sans garantie bris de glace, votre assureur ne prend rien en charge. Déposez votre demande sur MinuteGlass et plusieurs réparateurs locaux vous feront un devis au meilleur prix. Vous comparez et choisissez librement — <strong style={{ color: "#11211B" }}>sans engagement</strong>.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/deposer"
              className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3.5 font-bold text-[14px] no-underline whitespace-nowrap"
              style={{ background: "#F59E0B", color: "#fff", boxShadow: "0 4px 14px rgba(245,158,11,.35)" }}
            >
              Obtenir des devis gratuits →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="comment" className="max-w-[1100px] mx-auto px-5 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="m-0 text-[26px] md:text-[34px] font-extrabold tracking-tight" style={{ color: "#11211B" }}>
            Simple comme bonjour
          </h2>
          <p className="m-0 mt-3 text-[15px] font-medium" style={{ color: "#6B7280" }}>
            3 étapes pour recevoir des devis sans bouger de chez vous.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: "1", icon: "📋", title: "Décrivez votre problème", desc: "Modèle, type de vitrage, avec ou sans assurance. Ça prend 2 minutes." },
            { n: "2", icon: "📞", title: "Les réparateurs vous contactent", desc: "Les vitriers de votre zone reçoivent votre demande et vous rappellent en moins de 30 min." },
            { n: "3", icon: "✅", title: "Choisissez le meilleur", desc: "Comparez les offres et choisissez librement. Déplacement à domicile gratuit. Aucune obligation." },
          ].map((step) => (
            <div key={step.n} className="rounded-[20px] p-7 relative" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
              <div className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-extrabold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
                {step.n}
              </div>
              <div className="text-[40px] mb-4">{step.icon}</div>
              <h3 className="m-0 text-[16px] font-extrabold mb-2" style={{ color: "#11211B" }}>{step.title}</h3>
              <p className="m-0 text-[13.5px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/deposer"
            className="inline-flex items-center gap-2 text-white rounded-[14px] px-8 py-4 font-extrabold text-[15px] no-underline"
            style={{ background: "#1D9E75", boxShadow: "0 6px 20px rgba(29,158,117,.3)" }}
          >
            Je dépose ma demande gratuitement →
          </Link>
        </div>
      </section>

      {/* ── Avantages ── */}
      <section style={{ background: "#F4F6F5", borderTop: "1px solid #EAEFED", borderBottom: "1px solid #EAEFED" }}>
        <div className="max-w-[1100px] mx-auto px-5 py-14">
          <div className="text-center mb-10">
            <h2 className="m-0 text-[26px] md:text-[32px] font-extrabold tracking-tight" style={{ color: "#11211B" }}>
              Pourquoi choisir MinuteGlass ?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🆓", title: "Gratuit", desc: "Le service est entièrement gratuit pour les particuliers." },
              { icon: "⚡", title: "Rapide", desc: "Recevez vos premiers appels en moins de 30 minutes." },
              { icon: "📍", title: "Local", desc: "Uniquement des réparateurs proches de chez vous." },
              { icon: "🚐", title: "Déplacement gratuit", desc: "Beaucoup de nos partenaires se déplacent chez vous gratuitement." },
            ].map((a) => (
              <div key={a.title} className="bg-white rounded-[16px] p-6" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 4px rgba(17,33,27,.04)" }}>
                <div className="text-[36px] mb-3">{a.icon}</div>
                <div className="font-extrabold text-[15px] mb-1" style={{ color: "#11211B" }}>{a.title}</div>
                <div className="text-[13px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Types d'intervention ── */}
      <section className="max-w-[1100px] mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <h2 className="m-0 text-[24px] md:text-[30px] font-extrabold tracking-tight" style={{ color: "#11211B" }}>
            Tous types de réparation vitrage
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: "🚗", title: "Pare-brise", desc: "Remplacement ou réparation d'impact. Avec ou sans assurance." },
            { icon: "🚙", title: "Vitres latérales", desc: "Vitre avant, arrière, custode. Toutes marques." },
            { icon: "🚕", title: "Lunette arrière", desc: "Remplacement complet avec dégivrage si nécessaire." },
          ].map((t) => (
            <div key={t.title} className="rounded-[18px] p-6 flex gap-4" style={{ border: "1.5px solid #EAEFED" }}>
              <div className="text-[36px] flex-shrink-0">{t.icon}</div>
              <div>
                <div className="font-extrabold text-[15px] mb-1" style={{ color: "#11211B" }}>{t.title}</div>
                <div className="text-[13px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-[700px] mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <h2 className="m-0 text-[24px] md:text-[30px] font-extrabold tracking-tight" style={{ color: "#11211B" }}>
            Questions fréquentes
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {[
            {
              q: "Est-ce vraiment gratuit pour le particulier ?",
              a: "Oui, publier une annonce sur MinuteGlass est entièrement gratuit pour les particuliers. Vous décrivez votre problème, les réparateurs vous contactent — vous ne payez rien, à aucun moment.",
            },
            {
              q: "Combien de temps avant d'être rappelé ?",
              a: "En moyenne moins de 30 minutes. Les réparateurs de votre zone reçoivent votre demande en temps réel et vous contactent directement par téléphone.",
            },
            {
              q: "Mon assurance couvre-t-elle le remplacement ?",
              a: "Si vous avez la garantie « bris de glace » dans votre contrat auto, le remplacement est généralement pris en charge sans franchise. Si vous n'êtes pas sûr, nos partenaires vérifient ça avec vous lors du rappel.",
            },
            {
              q: "Que se passe-t-il après avoir déposé ma demande ?",
              a: "Vos informations sont transmises aux vitriers partenaires de votre secteur. Chacun peut vous rappeler et vous faire une offre. Vous comparez et choisissez librement — sans aucune obligation.",
            },
            {
              q: "Le réparateur se déplace-t-il à domicile ?",
              a: "Oui, la plupart de nos partenaires proposent le déplacement à domicile, au bureau ou sur votre lieu de travail. C'est précisé lors de l'échange.",
            },
            {
              q: "MinuteGlass intervient dans quelle zone ?",
              a: "Sur toute la France métropolitaine. Notre réseau couvre les grandes villes comme Paris, Lyon, Marseille, Toulouse, Bordeaux, Nantes, Lille, et les zones périphériques.",
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group rounded-[16px] px-6 py-5 cursor-pointer"
              style={{ border: "1.5px solid #EAEFED", background: "#fff" }}
            >
              <summary className="flex items-center justify-between gap-4 font-bold text-[15px] list-none" style={{ color: "#11211B" }}>
                {faq.q}
                <span className="text-[20px] flex-shrink-0 transition-transform group-open:rotate-45" style={{ color: "#1D9E75" }}>+</span>
              </summary>
              <p className="m-0 mt-4 text-[14px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-[1100px] mx-auto px-5 pb-10">
        <div className="rounded-[24px] p-10 md:p-14 text-center text-white" style={{ background: "linear-gradient(150deg, #0F5C44, #1D9E75)", boxShadow: "0 12px 40px rgba(15,92,68,.22)" }}>
          <h2 className="m-0 text-[24px] md:text-[32px] font-extrabold mb-3">Prêt à recevoir des devis ?</h2>
          <p className="m-0 text-[15px] font-medium mb-7" style={{ color: "rgba(255,255,255,.8)" }}>
            Décrivez votre problème en 2 minutes. Réponse des réparateurs en moins de 30 min.
          </p>
          <Link
            href="/deposer"
            className="inline-flex items-center gap-2 rounded-[14px] px-8 py-4 font-extrabold text-[16px] no-underline"
            style={{ background: "#fff", color: "#0F5C44", boxShadow: "0 6px 20px rgba(0,0,0,.15)" }}
          >
            Déposer ma demande — c'est gratuit →
          </Link>
        </div>
      </section>

      {/* ── Section réparateurs ── */}
      <section style={{ background: "#11211B" }}>
        <div className="max-w-[1100px] mx-auto px-5 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-[12.5px] font-bold uppercase tracking-wider mb-3" style={{ color: "#1D9E75" }}>
              Pour les professionnels
            </div>
            <h2 className="m-0 text-[22px] md:text-[28px] font-extrabold text-white mb-3">
              Vous êtes professionnel du vitrage ?
            </h2>
            <p className="m-0 text-[14.5px] font-medium" style={{ color: "rgba(255,255,255,.6)", maxWidth: "480px", lineHeight: 1.6 }}>
              Accédez aux demandes clients de votre zone et développez votre activité. Payez uniquement pour les contacts qui vous intéressent.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/partenaire"
              className="inline-flex items-center gap-2 rounded-[14px] px-7 py-4 font-extrabold text-[15px] no-underline whitespace-nowrap"
              style={{ background: "#1D9E75", color: "#fff", boxShadow: "0 6px 20px rgba(29,158,117,.35)" }}
            >
              Rejoindre le réseau →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
