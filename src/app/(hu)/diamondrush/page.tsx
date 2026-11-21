import type { Metadata, Viewport } from "next";
import { DiamondRush } from "@/components/diamondrush/DiamondRush";
import { EMAIL, IG, PHONE_TEL } from "@/components/diamondrush/data";

export const metadata: Metadata = {
  title: "Cheerleader csapat Szombathely: Diamond Rush és Golden Girls Club (koncepcióterv)",
  description: "Szombathelyi cheer csapat új néven: Diamond Rush fellépések meccsekre és rendezvényekre, Golden Girls Club a nőiességről és az önbizalomról. Jelentkezz táncosnak, vagy kérj fellépést.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#0b0709" };

const ld = {
  "@context": "https://schema.org",
  "@type": "SportsTeam",
  name: "Golden Girls Club – Diamond Rush Cheer Team",
  sport: "Cheerleading",
  telephone: PHONE_TEL,
  email: EMAIL,
  address: { "@type": "PostalAddress", streetAddress: "Széll Kálmán utca", addressLocality: "Szombathely", postalCode: "9700", addressCountry: "HU" },
  sameAs: [IG],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <DiamondRush />
    </>
  );
}
