import type { Metadata, Viewport } from "next";
import { Galeria } from "@/components/galeria/Galeria";
import { HRVT_GALLERY } from "@/components/galeria/data";

export const metadata: Metadata = {
  title: "HRVT Fotó: végigsétálható fotós portfólió · Horváth Ádám",
  description: "Horváth Ádám autós és motorsport fotói egy végigsétálható fehér galériában. Görgess, és kattints arra a képre, amelyik megállít.",
};
export const viewport: Viewport = { themeColor: "#e4e0d8", colorScheme: "light" };

export default function Page() {
  return <Galeria cfg={HRVT_GALLERY} />;
}
