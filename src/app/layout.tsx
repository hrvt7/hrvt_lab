import type { Metadata, Viewport } from "next";
import "@fontsource-variable/lexend-giga";
import "@fontsource-variable/geist/index.css";
import "@fontsource-variable/geist-mono/index.css";
import "./globals.css";
import { Motion } from "@/components/Motion";
import { Cursor } from "@/components/Cursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://hrvt.vercel.app"),
  title: "HRVT — weboldal-készítés, egyedi fejlesztés, AI és automatizálás",
  description:
    "Egyedi weboldal-készítés, egyedi szoftverfejlesztés, AI-rendszerek, automatizálás és interaktív 3D — tervezéstől az élesítésig, egy kézben.",
  openGraph: {
    title: "HRVT — Weboldalt és szoftvert építek, ami dolgozik.",
    description: "Egyedi weboldalak, egyedi fejlesztés, AI-rendszerek, automatizálás és interaktív 3D.",
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
