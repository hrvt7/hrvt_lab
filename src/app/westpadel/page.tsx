import type { Metadata, Viewport } from "next";
import { WestPadel } from "@/components/westpadel/WestPadel";
import { ADDRESS, EMAIL, FB, IG, PHONE_TEL } from "@/components/westpadel/data";

export const metadata: Metadata = {
  title: "Padel Szombathely: pályafoglalás, árak, edzők — West Padel (koncepcióterv)",
  description: "Fedett panoráma padelpályák Szombathelyen, minden nap 8 és 23 óra között. Pályabérlés 3 000 Ft/fő/órától, edzők, bérletek, versenyek, online foglalás.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#081629", colorScheme: "dark" };

const ld = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "West Padel",
  sport: "Padel",
  telephone: PHONE_TEL,
  email: EMAIL,
  address: { "@type": "PostalAddress", streetAddress: "Galamb József utca 6.", addressLocality: "Szombathely", postalCode: "9700", addressCountry: "HU" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "08:00", closes: "23:00" }],
  priceRange: "3000–4500 Ft / fő / óra",
  sameAs: [FB, IG],
  description: ADDRESS,
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <WestPadel />
    </>
  );
}
