import type { Metadata, Viewport } from "next";
import { PalyaTabor } from "@/components/palyatabor/PalyaTabor";

export const metadata: Metadata = {
  title: "Pálya-Tábor 2026 · Grafico BMW Meet · Pannónia-Ring, augusztus 1–2. (koncepcióterv)",
  description: "Kétnapos autós pálya-hétvége a Pannónia-Ringen: pályázás 3 csoportban, BMW-találkozó, esti buli és táborozás a depóban. 2026. augusztus 1–2.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#001231" };
const ld = {
  "@context": "https://schema.org", "@type": "Event",
  name: "Pálya-Tábor 2026 – Grafico BMW Meet és Magyar Autós Pálya-Tábor",
  startDate: "2026-08-01", endDate: "2026-08-02",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: { "@type": "Place", name: "Pannónia-Ring", address: { "@type": "PostalAddress", addressLocality: "Ostffyasszonyfa", postalCode: "9512", addressCountry: "HU" } },
  offers: { "@type": "Offer", url: "https://www.palyaautozas.hu" },
};
export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} /><PalyaTabor /></>);
}
