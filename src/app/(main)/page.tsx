import { Hero } from "@/components/sections/Hero";
import { TypeRibbon } from "@/components/sections/TypeRibbon";
import { Services } from "@/components/sections/Services";
import { Turnkey } from "@/components/sections/Turnkey";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <Hero />
      <TypeRibbon />
      <Services />
      <Turnkey />
      <Process />
      <Contact />
    </>
  );
}
