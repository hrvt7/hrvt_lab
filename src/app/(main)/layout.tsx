import type { Metadata, Viewport } from "next";
import "./foto.css";
import { Ready } from "@/components/Ready";

export const metadata: Metadata = {
  title: "HRVT — fotók: autók, pálya, épületek, részletek",
  description:
    "A HRVT saját fotói: autók és pályanapok, épületek, természet és részletek. Görgess végig a fotóalagúton: minden kép fekete-fehér, amíg rá nem nézel.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HRVT — fotók",
    description: "Autók, pálya, épületek, részletek. Minden kép fekete-fehér, amíg rá nem nézel.",
    url: "/",
    siteName: "HRVT",
    type: "website",
    locale: "hu_HU",
  },
};

export const viewport: Viewport = { themeColor: "#0b0b0b", colorScheme: "dark" };

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="foto">
      <Ready />
      {children}
    </div>
  );
}
