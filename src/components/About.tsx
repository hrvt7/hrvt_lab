import { Label, Lines } from "./Lines";
import { STACK } from "@/lib/content";

const FACTS = [
  { k: "1", v: "person, from first call to production. No account managers, no hand-offs." },
  { k: "4", v: "disciplines under one roof: AI, automation, web and real-time 3D." },
  { k: "∞", v: "attention to the details most teams leave for “phase two”." },
];

export function About() {
  return (
    <section id="about" className="wrap section">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <Label n="05">About</Label>
        </div>
        <div className="md:col-span-9">
          <Lines
            className="t-display-l"
            lines={[
              "From wiring",
              <>
                buildings to <span className="t-serif">wiring</span>
              </>,
              "software.",
            ]}
          />
        </div>
      </div>

      <div className="mt-16 grid gap-[var(--gutter)] md:mt-24 md:grid-cols-12">
        <div className="space-y-6 md:col-span-5 md:col-start-4">
          <p className="t-body-l text-bone" data-fade="">
            I&apos;m Ádám, the person behind HRVT. Before software, I worked inside real systems: electrical contracting,
            building automation, hotel automation and engine tuning.
          </p>
          <p className="text-bone-2" data-fade="0.1">
            That background shapes how I build. I think in signals, loads and failure modes. I care what happens when
            the input is messy, the connection drops or the user does the unexpected — and I design for it before it
            happens.
          </p>
          <p className="text-bone-2" data-fade="0.2">
            Today I build for businesses across Hungary, Austria and beyond, in English and Hungarian. Small enough to
            care about every pixel, technical enough to own the whole stack.
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-10">
          <p className="t-meta mb-4 text-bone-3" data-fade="">
            Toolkit
          </p>
          <ul className="flex flex-wrap gap-2" data-fade="0.1">
            {STACK.map((s) => (
              <li key={s} className="t-meta rounded-full border border-line px-3 py-1.5 text-[0.62rem] text-bone-2">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 grid border-t border-line md:mt-28 md:grid-cols-3">
        {FACTS.map((f, i) => (
          <div
            key={f.k}
            className={`py-10 md:px-8 md:py-12 ${i ? "border-t border-line md:border-l md:border-t-0" : "md:pl-0"}`}
            data-fade={String(i * 0.1)}
          >
            <p className="font-display text-[clamp(4rem,8vw,7.5rem)] font-[720] leading-[0.85] tracking-[-0.06em]">
              {f.k}
            </p>
            <p className="mt-6 max-w-[30ch] text-bone-2">{f.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
