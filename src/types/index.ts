export type InsuranceType = "avec" | "sans";
export type InterventionType = "remplacement" | "reparation" | "vitre";

export interface Demande {
  id: string;
  title: string;
  city: string;
  distance: string;
  age: string;
  insurance: InsuranceType;
  intervention: InterventionType;
  damage: string;
  isNew?: boolean;
  isUnlocked?: boolean;
  status?: "active" | "booked";
  phone?: string;
  email?: string;
  /* enriched */
  clientName?: string;
  availability?: string;
  damageZone?: string;
  isLocal?: boolean; /* posted via deposer form */
  region?: string;   /* région administrative */
  photos?: string[]; /* base64 dataUrls */
}
