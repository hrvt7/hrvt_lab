import type { Metadata, Viewport } from "next";
import { DomoSpa } from "@/components/domospa/DomoSpa";
import { EMAIL, FB, IG, PHONE_TEL } from "@/components/domospa/data";

export const metadata: Metadata = {
  title: "Jakuzzi, szauna, medence, pergola Szombathely — domoSPA bemutatóterem (koncepcióterv)",
  description: "Wellis jakuzzik 2 399 000 Ft-tól, swimspák, szaunák, grillek és bioklimatikus pergolák egy 400 m²-es szombathelyi bemutatóteremben. Több termék raktárról azonnal vihető.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#0f211d" };
const ld = {
  "@context": "https://schema.org", "@type": "Store", name: "domoSPA", telephone: PHONE_TEL, email: EMAIL,
  address: { "@type": "PostalAddress", streetAddress: "Vépi út 8.", addressLocality: "Szombathely", postalCode: "9700", addressCountry: "HU" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "16:30" }],
  sameAs: [FB, IG],
};
export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} /><DomoSpa /></>);
}
