import type { Metadata, Viewport } from "next";
import "@fontsource-variable/lexend-giga";
import "@fontsource-variable/geist/index.css";
import "@fontsource-variable/geist-mono/index.css";
import "./globals.css";
import { Motion } from "@/components/Motion";
import { Cursor } from "@/components/Cursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://hrvt.vercel.app"),
  title: "Weboldal készítés Szombathely — egyedi weboldal | HRVT",
  description:
    "Egyedi weboldal készítés és honlapkészítés Szombathelyen: design, szöveg, fejlesztés, keresőoptimalizálás és élesítés egy kézben, sablon nélkül.",
  openGraph: {
    title: "HRVT — Egyedi weboldalt építek, ami dolgozik.",
    description: "Egyedi weboldal készítés Szombathelyen: design, szöveg, fejlesztés és élesítés egy kézben.",
    type: "website",
    locale: "hu_HU",
  },
};

export const viewport: Viewport = { themeColor: "#222222", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" data-nav="night" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');if(history.scrollRestoration)history.scrollRestoration='manual';`,
          }}
        />
      </head>
      <body>
        {children}
        <div className="grain" aria-hidden />
        <Cursor />
        <Motion />
      </body>
    </html>
  );
}
