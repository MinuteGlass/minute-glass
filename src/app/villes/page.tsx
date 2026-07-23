import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SEO_CITIES, SEO_SERVICES } from "@/data/seo";

export const metadata: Metadata = {
  title: "Toutes les villes — Réparation vitrage automobile | MinuteGlass",
  description:
    "Trouvez un réparateur de vitrage automobile près de chez vous. MinuteGlass couvre Paris, Lyon, Marseille, Toulouse, et toutes les grandes villes de France.",
  alternates: { canonical: "/villes" },
};

const SERVICES = Object.values(SEO_SERVICES);

export default function VillesPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 pb-20 pt-8">

        {/* Header */}
        <div className="mb-8">
          <nav className="text-[12px] font-medium mb-4" style={{ color: "#9aa39e" }}>
            <Link href="/" style={{ color: "#9aa39e" }}>Accueil</Link>
            <span className="mx-1.5">›</span>
            <span style={{ color: "#11211B" }}>Toutes les villes</span>
          </nav>
          <h1 className="font-extrabold tracking-tight mb-2" style={{ fontSize: "clamp(22px,4vw,30px)", color: "#11211B" }}>
            Réparation vitrage automobile — toutes les villes
          </h1>
          <p className="text-[14px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>
            MinuteGlass met en relation particuliers et réparateurs professionnels dans toute la France. Choisissez votre ville et votre type d'intervention.
          </p>
        </div>

        {/* Grille par service */}
        <div className="flex flex-col gap-6">
          {SERVICES.map((service) => (
            <div key={service.slug} className="bg-white rounded-[20px] p-6" style={{ border: "1px solid #EAEFED" }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#1D9E75" }} />
                <h2 className="font-extrabold text-[16px] m-0" style={{ color: "#11211B" }}>{service.label}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {SEO_CITIES.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${service.slug}/${city.slug}`}
                    className="no-underline flex items-center justify-between rounded-[10px] px-3.5 py-2.5 transition-all hover:opacity-80"
                    style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}
                  >
                    <span className="font-semibold text-[13px]" style={{ color: "#11211B" }}>{city.nom}</span>
                    <span className="text-[11px] font-bold ml-1" style={{ color: "#9aa39e" }}>{city.departement}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
