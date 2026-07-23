import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side — utilisé dans les composants React
export const supabase = createClient(url, anon);

// Types base de données
export interface DbProfile {
  id: string;           // = auth.users.id
  role: "particulier" | "partenaire";
  name: string;
  email: string;
  phone?: string;
  company?: string;     // réparateur seulement
  siret?: string;
  city?: string;
  created_at: string;
}

export interface DbDemande {
  id: string;
  client_id: string;
  title: string;
  city: string;
  intervention: "remplacement" | "reparation" | "vitre";
  insurance: "avec" | "sans";
  damage?: string;
  availability?: string;
  phone?: string;
  email?: string;
  photos?: string[];
  status: "active" | "attributed" | "aboutie" | "annulee";
  accepted_repairer_id?: string;
  unlock_count: number;
  created_at: string;
}

export interface DbUnlock {
  id: string;
  demande_id: string;
  repairer_id: string;
  tokens_spent: number;
  created_at: string;
}

export interface DbThread {
  id: string;
  demande_id: string;
  repairer_id: string;
  last_message?: string;
  offer_label?: string;
  offer_status?: "pending" | "accepted" | "refused";
  created_at: string;
}

export interface DbTokenTransaction {
  id: string;
  user_id: string;
  pack_name: string;
  tokens: number;
  amount_cents: number;
  stripe_payment_id?: string;
  status: "pending" | "paid" | "refunded";
  created_at: string;
}
