import { PhoneScene } from "./PhoneScene";

/** "Mit vállalok" opener: the 3D phone walks through the four mobile-first promises, then floods into the kiwi services. */
export function PhoneStage() {
  return (
    <section id="mobil" data-theme="night" aria-label="Mobilra tervezett weboldal" className="relative bg-night" style={{ height: "460svh" }}>
      <PhoneScene intro />
    </section>
  );
}
