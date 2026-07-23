"use client";

import { useState } from "react";

const REGIONS = [
  "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne",
  "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France",
  "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie",
  "Pays de la Loire", "Provence-Alpes-Côte d'Azur",
];

interface FiltersState {
  sans: boolean;
  avec: boolean;
  remplacement: boolean;
  reparation: boolean;
  vitre: boolean;
  region: string;
  date: string;
}

interface FiltersPanelProps {
  filters: FiltersState;
  onChange: (f: FiltersState) => void;
}

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const set = (k: keyof FiltersState, v: boolean | string) =>
    onChange({ ...filters, [k]: v });

  const reset = () =>
    onChange({ sans: true, avec: true, remplacement: true, reparation: true, vitre: true, region: "", date: "" });

  return (
    <aside
      className="flex-shrink-0 w-[248px] sticky top-[92px] max-h-[calc(100vh-110px)] overflow-y-auto bg-white rounded-2xl p-5"
      style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="m-0 text-[15px] font-extrabold">Filtres</h2>
        <button
          onClick={reset}
          className="bg-transparent border-0 font-bold text-[12.5px] cursor-pointer p-0"
          style={{ color: "#1D9E75" }}
        >
          Réinitialiser
        </button>
      </div>

      {/* Type client */}
      <div className="mt-[18px]">
        <div className="text-xs font-bold tracking-wider uppercase mb-2.5" style={{ color: "#9aa39e" }}>
          Type de client
        </div>
        <Checkbox label="Sans assurance" checked={filters.sans} onChange={(v) => set("sans", v)} color="#D85A30" />
        <Checkbox label="Avec assurance" checked={filters.avec} onChange={(v) => set("avec", v)} color="#1D9E75" />
      </div>

      <Divider />

      {/* Intervention */}
      <div>
        <div className="text-xs font-bold tracking-wider uppercase mb-2.5" style={{ color: "#9aa39e" }}>
          Intervention
        </div>
        <Checkbox label="Remplacement pare-brise" checked={filters.remplacement} onChange={(v) => set("remplacement", v)} color="#2563EB" />
        <Checkbox label="Réparation d'impact"     checked={filters.reparation}   onChange={(v) => set("reparation", v)}   color="#1D9E75" />
        <Checkbox label="Vitre latérale"          checked={filters.vitre}        onChange={(v) => set("vitre", v)}        color="#6D28D9" />
      </div>

      <Divider />

      {/* Localisation */}
      <div>
        <div className="text-xs font-bold tracking-wider uppercase mb-2.5" style={{ color: "#9aa39e" }}>
          Localisation
        </div>
        <label className="block text-xs font-bold mb-1.5" style={{ color: "#6B7280" }}>Région</label>
        <select
          value={filters.region}
          onChange={(e) => set("region", e.target.value)}
          className="w-full rounded-[9px] px-[11px] py-2.5 text-[13.5px] font-semibold cursor-pointer outline-none bg-white"
          style={{ border: "1px solid #EAEFED", color: "#11211B" }}
        >
          <option value="">Toutes les régions</option>
          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <Divider />

      {/* Date */}
      <div>
        <div className="text-xs font-bold tracking-wider uppercase mb-2.5" style={{ color: "#9aa39e" }}>
          Date de dépôt
        </div>
        <select
          value={filters.date}
          onChange={(e) => set("date", e.target.value)}
          className="w-full rounded-[9px] px-[11px] py-2.5 text-[13.5px] font-semibold cursor-pointer outline-none bg-white"
          style={{ border: "1px solid #EAEFED", color: "#11211B" }}
        >
          <option value="">Toutes les dates</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
        </select>
      </div>
    </aside>
  );
}

function Checkbox({
  label, checked, onChange, color,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void; color: string;
}) {
  return (
    <label className="flex items-center gap-2.5 py-[7px] cursor-pointer text-[13.5px] font-semibold">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-[17px] h-[17px] cursor-pointer"
        style={{ accentColor: color }}
      />
      {label}
    </label>
  );
}

function Divider() {
  return <div className="h-px my-4" style={{ background: "#EAEFED" }} />;
}

export type { FiltersState };
