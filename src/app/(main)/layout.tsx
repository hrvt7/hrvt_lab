import type { Metadata, Viewport } from "next";
import "@fontsource-variable/anybody/wdth.css";
import "@fontsource-variable/martian-mono";
import "./motion.css";
import { Ready } from "@/components/Ready";
import { Track } from "@/components/motion/Track";

const T = "SaaS Motion Design — Product Videos & UI Animation | HRVT";
const D = "High-end motion design for SaaS: 30–60 second product videos, feature explainers and UI animations that explain complex products clearly. From $400.";

export const metadata: Metadata = {
  title: T, description: D, keywords: ["SaaS motion design", "SaaS product video", "SaaS explainer video", "UI animation video", "product launch video", "motion designer for SaaS"], alternates: { canonical: "/" },
  openGraph: { title: "HRVT — High-end motion design for SaaS products", description: D, url: "/", siteName: "HRVT", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: T, description: D },
};
export const viewport: Viewport = { themeColor: "#0c0c0f", colorScheme: "dark" };

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{background:#0c0c0f}`}</style>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang="en"` }} />
      <Ready />
      <Track />
      {children}
    </>
  );
}
