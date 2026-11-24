import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

// Police enregistrée dans le projet (licence OFL, voir fonts/OFL.txt) : la compilation
// ne dépend plus d'un téléchargement chez Google Fonts, qui faisait échouer Vercel.
const plusJakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Minute Glass — Réparation vitrage automobile",
  description:
    "Plateforme de mise en relation entre particuliers et réparateurs professionnels pour le vitrage automobile.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${plusJakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)]" style={{ background: "#F4F6F5" }}>
        {children}
        <Footer />
        <CookieBanner />
        <ToastContainer />
      </body>
    </html>
  );
}
