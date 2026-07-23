import type { Demande } from "@/types";

const KEY = "mg_demandes";
const EVENT = "mg_demandes_change";

export function getLocalDemandes(): Demande[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Demande[]) : [];
  } catch {
    return [];
  }
}

export function addLocalDemande(d: Demande): void {
  const existing = getLocalDemandes();
  localStorage.setItem(KEY, JSON.stringify([d, ...existing]));
  window.dispatchEvent(new Event(EVENT));
}

export function onDemandesChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
