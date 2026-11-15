import type { Metadata, Viewport } from "next";
import { Smash } from "@/components/smash/Smash";

export const metadata: Metadata = {
  title: "SMASH — Audi RS e-tron GT és Aston Martin Vantage (koncepcióterv)",
  description: "A SMASH autói egy parkolóház tetején: fekete Audi RS e-tron GT és zöld Aston Martin Vantage. Görgess végig: minden kép fekete-fehér, amíg rá nem nézel. Koncepcióterv, nem hivatalos oldal.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/smash" },
};

export const viewport: Viewport = { themeColor: "#0a0a0a", colorScheme: "dark" };

export default function Page() {
  return <Smash />;
}
