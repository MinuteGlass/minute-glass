import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/Toast";
import { Footer } from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
        <ToastContainer />
      </body>
    </html>
  );
}
