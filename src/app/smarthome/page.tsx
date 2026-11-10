import type { Metadata } from "next";
import { SmartHome } from "@/components/smarthome/SmartHome";

export const metadata: Metadata = {
  title: "HRVT Smart Home — okosotthon, egy érintésre (bemutató oldal)",
  description: "Bemutató oldal: okosotthon-kivitelező cég weboldala interaktív 3D röntgen-házzal. Világítás, árnyékolás, fűtés egy rendszerben. Készítette: HRVT.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SmartHome />;
}
