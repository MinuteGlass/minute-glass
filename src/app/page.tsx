"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { FiltersPanel, type FiltersState } from "@/components/FiltersPanel";
import { DemandeCard } from "@/components/DemandeCard";
import { AdBannerPartner, AdSidebarTop, AdSidebarPromo, AdSidebarBottom } from "@/components/AdBanner";
import { getAuth, onAuthChange } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Demande } from "@/types";

const INITIAL_FILTERS: FiltersState = {
  sans: true,
  avec: true,
  remplacement: true,
  reparation: true,
  vitre: true,
  region: "",
  date: "",
};

const AD_EVERY = 3;

export default function ListingPage() {
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [sort, setSort] = useState("proche");
  const [page, setPage] = useState(1);
  const [allDemandes, setAllDemandes] = useState<Demande[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [isParticulier, setIsParticulier] = useState(false);
  const [partnerContacts, setPartnerContacts] = useState<Record<string, { phone: string; email: string }>>({});

  useEffect(() => {
    fetch("/api/demandes").then(r => r.json()).then(({ demandes }) => {
      if (Array.isArray(demandes)) setAllDemandes(demandes);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const update = async () => {
      const auth = getAuth();
      const isP = auth?.role === "partenaire";
      setIsPartner(isP);
      setIsParticulier(auth?.role === "particulier");

      // Si réparateur connecté, charge les vraies coordonnées des fiches débloquées
      if (isP) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) return;
        fetch("/api/partenaire/demandes", { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json())
          .then(({ demandes: pd }) => {
            if (!Array.isArray(pd)) return;
            const contacts: Record<string, { phone: string; email: string }> = {};
            pd.filter((d: Demande) => d.isUnlocked && d.phone && !d.phone.includes("●"))
              .forEach((d: Demande) => { contacts[d.id] = { phone: d.phone!, email: d.email ?? "" }; });
            setPartnerContacts(contacts);
          }).catch(() => {});
      }
    };
    update();
    return onAuthChange(update);
  }, []);

  const filtered = useMemo(() => {
    return allDemandes.filter((d) => {
      if (!filters.sans && d.insurance === "sans") return false;
      if (!filters.avec && d.insurance === "avec") return false;
      if (!filters.remplacement && d.intervention === "remplacement") return false;
      if (!filters.reparation  && d.intervention === "reparation")   return false;
      if (!filters.vitre       && d.intervention === "vitre")        return false;
      if (filters.region && d.region !== filters.region)            return false;
      return true;
    });
  }, [allDemandes, filters]);

  const sorted = useMemo(() => {
    if (sort === "recent") return [...filtered].sort((a, b) => a.age.localeCompare(b.age));
    return filtered;
  }, [filtered, sort]);

  const PER_PAGE = 6;
  const pageCount = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 sm:px-6 pb-16 pt-7">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <h1 className="m-0 text-[22px] sm:text-[27px] font-extrabold tracking-tight">
              Demandes près de vous
            </h1>
            <p className="m-0 mt-1.5 text-[13px] sm:text-[14px] font-medium" style={{ color: "#6B7280" }}>
              <b style={{ color: "#1D9E75" }}>{sorted.length} demandes</b> disponibles · {filters.region || "Toutes les régions"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile filters toggle */}
            <button
              className="sm:hidden inline-flex items-center gap-2 bg-white rounded-[10px] px-3 py-2.5 font-bold text-[13px] cursor-pointer border"
              style={{ borderColor: "#EAEFED", color: "#11211B" }}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Filtres
            </button>
            <label
              className="inline-flex items-center gap-2.5 bg-white rounded-[10px] px-3 py-2.5"
              style={{ border: "1px solid #EAEFED" }}
            >
              <span className="text-[13px] font-semibold hidden sm:inline" style={{ color: "#6B7280" }}>Trier&nbsp;:</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="border-0 bg-transparent font-bold text-[13.5px] cursor-pointer outline-none"
                style={{ color: "#11211B" }}
              >
                <option value="proche">Plus proche</option>
                <option value="recent">Plus récent</option>
              </select>
            </label>
          </div>
        </div>

        {/* Mobile filters drawer */}
        {filtersOpen && (
          <div className="sm:hidden mb-4 bg-white rounded-[16px] p-4" style={{ border: "1px solid #EAEFED" }}>
            <FiltersPanel filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </div>
        )}

        {/* 3-column layout */}
        <div className="flex gap-[22px] items-start">
          {/* Desktop sidebar filters */}
          <div className="hidden sm:block">
            <FiltersPanel filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </div>

          <section className="flex-1 min-w-0 flex flex-col gap-3.5">
            {paginated.length === 0 ? (
              <div
                className="bg-white rounded-2xl p-10 text-center font-semibold"
                style={{ color: "#6B7280", border: "1px solid #EAEFED" }}
              >
                Aucune demande ne correspond à vos filtres.
              </div>
            ) : (
              paginated.map((d, i) => (
                <div key={d.id}>
                  <DemandeCard demande={d} isPartner={isPartner} isParticulier={isParticulier} contactsOverride={partnerContacts[d.id] ?? null} />
                  {(i + 1) % AD_EVERY === 0 && i !== paginated.length - 1 && (
                    <div className="mt-3.5">
                      <AdBannerPartner />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-3.5">
                <PaginBtn label="‹" onClick={() => setPage((p) => Math.max(1, p - 1))} variant="outline" />
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <PaginBtn key={n} label={String(n)} onClick={() => setPage(n)} variant={page === n ? "active" : "outline"} />
                ))}
                <PaginBtn label="›" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} variant="outline" />
              </div>
            )}
          </section>

          {/* Desktop sidebar ads */}
          <aside className="flex-shrink-0 w-[272px] sticky top-[92px] hidden lg:flex flex-col gap-3.5">
            <AdSidebarTop />
            <AdSidebarPromo />
            <AdSidebarBottom />
          </aside>
        </div>
      </main>
    </div>
  );
}

function PaginBtn({ label, onClick, variant }: { label: string; onClick: () => void; variant: "active" | "outline" }) {
  return (
    <button
      onClick={onClick}
      className="w-[38px] h-[38px] rounded-[10px] cursor-pointer border-0 transition-colors font-bold text-[14px]"
      style={
        variant === "active"
          ? { background: "#1D9E75", color: "#fff" }
          : { background: "#fff", color: "#6B7280", border: "1px solid #EAEFED" }
      }
    >
      {label}
    </button>
  );
}
