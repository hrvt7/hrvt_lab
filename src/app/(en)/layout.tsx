import type { Metadata, Viewport } from "next";
import "@fontsource-variable/lexend-giga";
import "@fontsource-variable/geist/index.css";
import "@fontsource-variable/geist-mono/index.css";
import "../globals.css";
import { Motion } from "@/components/Motion";
import { Cursor } from "@/components/Cursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://hrvtmotion.com"),
  title: "SaaS Motion Design — Product Videos & UI Animation | HRVT",
};

export const viewport: Viewport = { themeColor: "#222222", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-nav="night" suppressHydrationWarning>
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
