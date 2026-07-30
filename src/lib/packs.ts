export type Pack = {
  id: "solo" | "starter" | "essentiel" | "pro";
  name: string;
  badge: string;
  tokens: number;
  priceCents: number; // montant envoyé à Stripe
  highlight: boolean;
};

export const PACKS: Pack[] = [
  { id: "solo",      name: "1 jeton",   badge: "🎯", tokens: 1,  priceCents: 1000,  highlight: false },
  { id: "starter",   name: "Starter",   badge: "🚀", tokens: 3,  priceCents: 2400,  highlight: false },
  { id: "essentiel", name: "Essentiel", badge: "⭐", tokens: 10, priceCents: 7500,  highlight: true  },
  { id: "pro",       name: "Pro",       badge: "💎", tokens: 25, priceCents: 17500, highlight: false },
];

/** Prix en euros avec virgule : "24,00" */
export function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

/** Prix par jeton en euros avec virgule */
export function pricePerToken(pack: Pack) {
  return (pack.priceCents / 100 / pack.tokens).toFixed(2).replace(".", ",");
}
