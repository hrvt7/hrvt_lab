import { Hero } from "@/components/sections/Hero";
import { PhoneStage } from "@/components/sections/PhoneStage";
import { Services } from "@/components/sections/Services";
import { Turnkey } from "@/components/sections/Turnkey";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <Hero />
      <PhoneStage />
      <Services />
      <Turnkey />
      <Process />
      <Contact />
    </>
  );
}
