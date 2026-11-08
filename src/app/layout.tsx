import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/geist/index.css";
import "@fontsource-variable/geist-mono/index.css";
import "./globals.css";
import { Motion } from "@/components/Motion";
import { Cursor } from "@/components/Cursor";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://hrvt.vercel.app"),
  title: "HRVT — Digital products with gravity",
  description:
    "HRVT designs and engineers AI systems, intelligent automations, cinematic websites and real-time 3D software — end to end.",
  openGraph: {
    title: "HRVT — Digital products with gravity",
    description: "AI systems, automations, high-end websites and real-time 3D software. Designed and engineered end to end.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080807",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');if(history.scrollRestoration)history.scrollRestoration='manual';`,
          }}
        />
      </head>
      <body>
        <Preloader />
        <Nav />
        <main>{children}</main>
        <div className="grain" aria-hidden />
        <Cursor />
        <Motion />
      </body>
    </html>
  );
}
