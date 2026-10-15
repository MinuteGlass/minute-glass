import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Pare-brise fissuré ou cassé ? Déposez votre demande gratuitement et recevez des devis de réparateurs près de chez vous.",
};

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
