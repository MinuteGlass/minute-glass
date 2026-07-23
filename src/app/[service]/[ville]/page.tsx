import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SEO_SERVICES, SEO_CITIES, getCityBySlug, getServiceBySlug } from "@/data/seo";
import { SeoForm } from "@/components/SeoForm";

export async function generateStaticParams() {
  const params: { service: string; ville: string }[] = [];
  for (const service of Object.values(SEO_SERVICES)) {
    for (const city of SEO_CITIES) {
      params.push({ service: service.slug, ville: city.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ service: string; ville: string }> }): Promise<Metadata> {
  const { service: serviceSlug, ville } = await params;
  const city = getCityBySlug(ville);
  const service = getServiceBySlug(serviceSlug);
  if (!city || !service) return {};

  return {
    title: `${service.h1(city.nom)} | MinuteGlass`,
    description: service.description(city.nom),
    alternates: {
      canonical: `/${service.slug}/${city.slug}`,
    },
    openGraph: {
      title: service.h1(city.nom),
      description: service.description(city.nom),
      locale: "fr_FR",
    },
  };
}

export default async function SeoPage({ params }: { params: Promise<{ service: string; ville: string }> }) {
  const { service: serviceSlug, ville } = await params;
  const city = getCityBySlug(ville);
  const service = getServiceBySlug(serviceSlug);
  if (!city || !service) notFound();

  const autresServices = Object.values(SEO_SERVICES).filter((s) => s.slug !== service.slug);
  const deposerUrl = `/deposer?intervention=${service.intervention}&ville=${encodeURIComponent(city.nom)}`;

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />

      {/* Fil d'Ariane */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-4 pb-0">
        <nav className="text-[12px] font-medium" style={{ color: "#9aa39e" }}>
          <Link href="/" style={{ color: "#9aa39e" }}>Accueil</Link>
          <span className="mx-1.5">›</span>
          <span style={{ color: "#1D9E75" }}>{service.label}</span>
          <span className="mx-1.5">›</span>
          <span style={{ color: "#11211B" }}>{city.nom}</span>
        </nav>
      </div>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 pb-20 pt-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Colonne principale */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Hero */}
            <div className="bg-white rounded-[20px] p-7" style={{ border: "1px solid #EAEFED" }}>
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold mb-4" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0F5C44"/></svg>
                {city.nom} ({city.departement})
              </div>

              <h1 className="font-extrabold tracking-tight leading-tight mb-3" style={{ fontSize: "clamp(20px,4vw,28px)", color: "#11211B" }}>
                {service.h1(city.nom)}
              </h1>
              <p className="text-[14px] font-medium leading-relaxed mb-6" style={{ color: "#6B7280" }}>
                {service.description(city.nom)}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Réparateurs", value: String(city.reparateurs) },
                  { label: "Délai moyen", value: "48h" },
                  { label: "Pour vous", value: "Gratuit" },
                ].map((s) => (
                  <div key={s.label} className="rounded-[12px] p-3 text-center" style={{ background: "#F4F6F5" }}>
                    <div className="font-extrabold text-[18px]" style={{ color: "#1D9E75" }}>{s.value}</div>
                    <div className="text-[11px] font-semibold mt-0.5" style={{ color: "#9aa39e" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <Link
                href={deposerUrl}
                className="no-underline flex items-center justify-center gap-2 w-full py-4 rounded-[13px] font-extrabold text-[15px] text-white"
                style={{ background: "linear-gradient(135deg,#1D9E75,#0F5C44)", boxShadow: "0 4px 16px rgba(29,158,117,.3)" }}
              >
                Déposer ma demande gratuitement →
              </Link>
              <p className="text-center text-[11px] font-semibold mt-2.5" style={{ color: "#9aa39e" }}>
                Sans engagement · Les réparateurs vous contactent · Vous choisissez
              </p>
            </div>

            {/* Pourquoi MinuteGlass sans assurance */}
            <div className="bg-white rounded-[20px] p-7" style={{ border: "1px solid #EAEFED" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex w-8 h-8 rounded-[9px] items-center justify-center" style={{ background: "#E8F6F0" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="#1D9E75" strokeWidth="2" strokeLinejoin="round"/></svg>
                </span>
                <h2 className="font-extrabold text-[16px]" style={{ color: "#11211B" }}>Sans assurance bris de glace ?</h2>
              </div>
              <div className="rounded-[12px] p-4 mb-4" style={{ background: "#FFF9EC", border: "1px solid #FDE68A" }}>
                <p className="text-[13px] font-semibold leading-relaxed" style={{ color: "#92400E" }}>
                  Sans garantie bris de glace, vous devez payer de votre poche — mais vous n'avez pas à appeler chaque réparateur un par un. <strong>Déposez une demande, les pros de {city.nom} vous contactent avec leurs tarifs.</strong> Vous comparez et choisissez. Vous payez directement le réparateur à la fin de l'intervention — zéro avance, zéro paperasse.
                </p>
              </div>
            </div>

            {/* Comment ça marche */}
            <div className="bg-white rounded-[20px] p-7" style={{ border: "1px solid #EAEFED" }}>
              <h2 className="font-extrabold text-[17px] mb-5" style={{ color: "#11211B" }}>Comment ça marche à {city.nom} ?</h2>
              <div className="flex flex-col gap-4">
                {[
                  { n: "1", titre: "Décrivez votre problème", desc: `Marque, modèle, type de dommage — 2 minutes suffisent. Pas besoin d'appeler.` },
                  { n: "2", titre: "Les réparateurs vous contactent", desc: `Les pros de ${city.nom} et alentours consultent votre demande et vous envoient leurs devis directement.` },
                  { n: "3", titre: "Choisissez et c'est réglé", desc: `Acceptez l'offre qui vous convient. Vous payez directement le réparateur après l'intervention. Rapide, sans intermédiaire.` },
                ].map((step) => (
                  <div key={step.n} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[13px] flex-shrink-0 text-white" style={{ background: "#1D9E75" }}>{step.n}</div>
                    <div>
                      <div className="font-bold text-[14px] mb-0.5" style={{ color: "#11211B" }}>{step.titre}</div>
                      <div className="text-[13px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contenu SEO */}
            <div className="bg-white rounded-[20px] p-7" style={{ border: "1px solid #EAEFED" }}>
              <h2 className="font-extrabold text-[17px] mb-4" style={{ color: "#11211B" }}>{service.label} à {city.nom} : ce qu'il faut savoir</h2>
              <p className="text-[13.5px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>
                {service.contenu(city.nom)}
              </p>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-[20px] p-7" style={{ border: "1px solid #EAEFED" }}>
              <h2 className="font-extrabold text-[17px] mb-5" style={{ color: "#11211B" }}>Questions fréquentes — {city.nom}</h2>
              <div className="flex flex-col divide-y" style={{ borderColor: "#EAEFED" }}>
                {service.faq.map((item, i) => (
                  <details key={i} className="group py-4 first:pt-0 last:pb-0">
                    <summary className="font-bold text-[13.5px] cursor-pointer list-none flex items-center justify-between gap-3" style={{ color: "#11211B" }}>
                      {item.q(city.nom)}
                      <svg className="flex-shrink-0 transition-transform group-open:rotate-180" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </summary>
                    <p className="mt-3 text-[13px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>
                      {item.a(city.nom)}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Formulaire mobile — visible uniquement sous lg */}
            <div className="lg:hidden bg-white rounded-[20px] p-6" style={{ border: "1px solid #EAEFED" }}>
              <div className="font-extrabold text-[16px] mb-1" style={{ color: "#11211B" }}>Déposer une demande</div>
              <p className="text-[12px] font-medium mb-4" style={{ color: "#6B7280" }}>
                Gratuit · Sans engagement · Les réparateurs de {city.nom} vous contactent.
              </p>
              <SeoForm intervention={service.intervention} ville={city.nom} />
            </div>

            {/* Maillage villes proches */}
            <div className="bg-white rounded-[20px] p-7" style={{ border: "1px solid #EAEFED" }}>
              <h2 className="font-extrabold text-[15px] mb-4" style={{ color: "#11211B" }}>{service.label} près de {city.nom}</h2>
              <div className="flex flex-wrap gap-2">
                {city.villesProches.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/${service.slug}/${v.slug}`}
                    className="no-underline rounded-full px-3.5 py-1.5 text-[12px] font-bold"
                    style={{ background: "#F4F6F5", color: "#6B7280", border: "1px solid #EAEFED" }}
                  >
                    {service.labelCourt} {v.nom}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar sticky */}
          <div className="w-full lg:w-[300px] flex-shrink-0 lg:sticky lg:top-[88px] flex flex-col gap-4">

            {/* Formulaire intégré */}
            <div className="bg-white rounded-[20px] p-6" style={{ border: "1px solid #EAEFED" }}>
              <div className="font-extrabold text-[16px] mb-1" style={{ color: "#11211B" }}>Déposer une demande</div>
              <p className="text-[12px] font-medium mb-4" style={{ color: "#6B7280" }}>
                Gratuit · Sans engagement · Les réparateurs de {city.nom} vous contactent.
              </p>
              <SeoForm intervention={service.intervention} ville={city.nom} />
            </div>

            {/* Autres services */}
            <div className="bg-white rounded-[20px] p-5" style={{ border: "1px solid #EAEFED" }}>
              <div className="font-bold text-[12px] mb-3" style={{ color: "#9aa39e" }}>AUTRES SERVICES À {city.nom.toUpperCase()}</div>
              <div className="flex flex-col gap-2">
                {autresServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}/${city.slug}`}
                    className="no-underline flex items-center justify-between rounded-[10px] px-3 py-2.5"
                    style={{ background: "#F4F6F5", color: "#11211B" }}
                  >
                    <span className="font-semibold text-[12.5px]">{s.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9aa39e" strokeWidth="2" strokeLinecap="round"/></svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
