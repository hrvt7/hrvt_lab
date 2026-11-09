import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <Hero />
      <Services />
      <Work />
      <Process />
      <Contact />
    </>
  );
}
