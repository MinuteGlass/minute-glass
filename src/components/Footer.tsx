import Link from "next/link";
import { SEO_CITIES, SEO_SERVICES } from "@/data/seo";

const TOP_CITIES = SEO_CITIES.slice(0, 6);
const SERVICES = Object.values(SEO_SERVICES);

export function Footer() {
  return (
    <footer className="mt-auto" style={{ borderTop: "1px solid #EAEFED", background: "#fff" }}>

      {/* Liens SEO condensés */}
      <div className="max-w-[1320px] mx-auto px-6 pt-8 pb-7" style={{ borderBottom: "1px solid #EAEFED" }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.slug}>
              <div className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9aa39e" }}>
                {service.label}
              </div>
              <div className="flex flex-col gap-1.5">
                {TOP_CITIES.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${service.slug}/${city.slug}`}
                    className="no-underline text-[12.5px] font-semibold hover:underline"
                    style={{ color: "#6B7280" }}
                  >
                    {city.nom}
                  </Link>
                ))}
                <Link
                  href="/villes"
                  className="no-underline text-[12.5px] font-bold hover:underline mt-1"
                  style={{ color: "#1D9E75" }}
                >
                  Toutes les villes →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barre basse */}
      <div className="max-w-[1320px] mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-3">
        <span className="text-[13px] font-semibold" style={{ color: "#9aa39e" }}>
          © {new Date().getFullYear()} Minute Glass · Tous droits réservés
        </span>
        <div className="flex items-center gap-5 flex-wrap">
          <Link href="/comment-ca-marche" className="text-[13px] font-semibold no-underline hover:underline" style={{ color: "#9aa39e" }}>Comment ça marche</Link>
          <Link href="/deposer" className="text-[13px] font-semibold no-underline hover:underline" style={{ color: "#9aa39e" }}>Déposer une demande</Link>
          <Link href="/partenaire" className="text-[13px] font-semibold no-underline hover:underline" style={{ color: "#9aa39e" }}>Espace réparateur</Link>
          <Link href="/mentions-legales" className="text-[13px] font-semibold no-underline hover:underline" style={{ color: "#9aa39e" }}>Mentions légales</Link>
          <Link href="/politique-confidentialite" className="text-[13px] font-semibold no-underline hover:underline" style={{ color: "#9aa39e" }}>Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
