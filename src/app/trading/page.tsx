import type { Metadata, Viewport } from "next";
import { Trading } from "@/components/trading/Trading";

export const metadata: Metadata = {
  title: "HRVT TRADING — fiktív trading platform, webdesign-koncepció",
  description: "Portfólióprojekt: egy kitalált kereskedési platform látványos, interaktív weboldala WebGL árfolyam-tájjal és böngészőben futó, szimulált demó terminállal. Nem valódi brókercég.",
};
export const viewport: Viewport = { themeColor: "#06070a", colorScheme: "dark" };
export default function Page() { return <Trading />; }
