import type { Metadata, Viewport } from "next";
import { Galeria } from "@/components/galeria/Galeria";

export const metadata: Metadata = {
  title: "HRVT Galéria: végigsétálható online kiállítás (koncepcióterv)",
  description: "Koncepcióterv: egy fehér múzeumfolyosó a böngészőben. Görgetésre végigsétálsz, a képre kattintva szembefordul veled, és meg is veheted. Minden adat minta.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#e4e0d8", colorScheme: "light" };

export default function Page() {
  return <Galeria />;
}
