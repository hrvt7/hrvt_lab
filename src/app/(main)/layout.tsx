import type { Metadata, Viewport } from "next";
import "@fontsource-variable/league-gothic/wdth.css";
import "@fontsource-variable/outfit";
import "./lux.css";

export const metadata: Metadata = {
  title: "Weboldal készítés Szombathely – egyedi, sablon nélkül | HRVT",
  description:
    "Egyedi weboldal készítés és honlapkészítés Szombathelyen és Vas megyében. Design, szöveg, fejlesztés, keresőoptimalizálás és élesítés egy kézben, sablon nélkül.",
  alternates: { canonical: "/" },
  keywords: ["weboldal készítés Szombathely", "honlapkészítés Szombathely", "egyedi weboldal", "webfejlesztő Szombathely", "weboldal készítés Vas megye"],
  openGraph: {
    title: "HRVT – Egyedi weboldalt készítek. Sablon nélkül.",
    description: "Weboldal készítés Szombathelyen és Vas megyében: design, szöveg, fejlesztés és élesítés egy kézben.",
    url: "/",
    siteName: "HRVT",
    type: "website",
    locale: "hu_HU",
  },
};

export const viewport: Viewport = { themeColor: "#fedc00", colorScheme: "dark" };

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{background:#323232}`}</style>
      {children}
    </>
  );
}
