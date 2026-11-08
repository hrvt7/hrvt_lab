import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { Work } from "@/components/work/Work";
import { Capabilities } from "@/components/Capabilities";
import { Approach } from "@/components/Approach";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Page() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Marquee />
      <Work />
      <Capabilities />
      <Approach />
      <About />
      <Contact />
    </>
  );
}
