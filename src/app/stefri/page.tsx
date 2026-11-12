import type { Metadata } from "next";
import { Stefri } from "@/components/stefri/Stefri";
import { PHONE_TEL, EMAIL, FB } from "@/components/stefri/data";

export const metadata: Metadata = {
  title: "Osztrák felvágott házhoz, Szombathely és Sárvár környékén — Stefri mozgóbolt (koncepcióterv)",
  description: "Minőségi húskészítmények Ausztriából: virsli, kolbász, sonka, felvágott és gyorsfagyasztott áru mozgóbolttal, közel 100 településen. Nézd meg, mikor jön hozzád az autó. Koncepcióterv, nem hivatalos oldal.",
  robots: { index: false, follow: false },
};

const ld = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  name: "Minőségi húskészítmények Ausztriából",
  url: "https://stefri.hu",
  telephone: PHONE_TEL,
  email: EMAIL,
  sameAs: [FB],
  foundingDate: "2014",
  description: "Mozgóbolt: osztrák felvágottak és gyorsfagyasztott termékek közel 100 településen.",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Stefri />
    </>
  );
}
