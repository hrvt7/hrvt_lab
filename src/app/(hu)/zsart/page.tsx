import type { Metadata, Viewport } from "next";
import { Galeria } from "@/components/galeria/Galeria";
import { ZSART } from "@/components/zsart/data";

export const metadata: Metadata = {
  title: "Zsoze festményei: végigsétálható kiállítás (koncepcióterv a zsart.hu-hoz)",
  description: "Koncepcióterv, nem hivatalos oldal: Zsoze húsz festménye egy végigsétálható fehér folyosón. A képek és a leírások forrása a zsart.hu.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#e4e0d8", colorScheme: "light" };

export default function Page() {
  return <Galeria cfg={ZSART} />;
}
