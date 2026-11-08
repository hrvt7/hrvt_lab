import Image from "next/image";
import { Featured, BrowserFrame } from "./Featured";
import { TakeoffPreview } from "./TakeoffPreview";
import { Label, Lines } from "../Lines";
import { ArrowUpRight } from "../Hero";
import { LAB } from "@/lib/content";

export function Work() {
  return (
    <section id="work" className="relative">
      <div className="wrap pt-[var(--section)]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <Label n="02">Selected work</Label>
          </div>
          <div className="md:col-span-9">
            <Lines
              className="t-display-l"
              lines={[
                "Built, shipped,",
                <>
                  <span className="t-serif">in use</span>.
                </>,
              ]}
            />
            <p className="t-body-l mt-8 max-w-[44ch] text-bone-2" data-fade="">
              A small number of products, each taken from first sketch to production. No templates, no hand-offs.
            </p>
          </div>
        </div>
      </div>

      <Featured />

      <div className="wrap pb-[var(--section)]">
        <div className="grid gap-x-[var(--gutter)] gap-y-20 md:grid-cols-12">
          <Project
            className="md:col-span-7"
            n="02"
            title="Haven72"
            kind="Crisis-preparedness platform"
            year="2026"
            href="https://haven72.vercel.app"
            desc="A calm, data-sourced guide to the first 72 hours of a crisis — 16 countries, a household planner, a 72-hour blackout simulator and an offline-first app."
            tags={["Next.js", "PWA / offline", "Data pipeline", "Motion design"]}
            status="Live"
          >
            <BrowserFrame url="haven72.vercel.app">
              <div className="overflow-hidden">
                <Image
                  src="/work/haven72.webp"
                  alt="Haven72 homepage: headline about three calm days, and a preparedness score of 62 with water, food, power and health bars."
                  width={2400}
                  height={1500}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="h-auto w-full scale-[1.02] transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
                />
              </div>
            </BrowserFrame>
          </Project>

          <Project
            className="md:col-span-5 md:mt-48"
            n="03"
            title="TakeoffPro"
            kind="AI estimating for electrical contractors"
            year="2026"
            desc="Reads an electrical floor plan, counts every socket, luminaire and switch, and turns it into a priced bill of materials in minutes instead of an afternoon."
            tags={["Plan analysis", "LLM + vision", "Supabase"]}
            status="In development"
          >
            <div className="overflow-hidden rounded-[14px] border border-line" data-clip="">
              <TakeoffPreview />
            </div>
          </Project>
        </div>

        {/* Lab */}
        <div className="mt-[var(--section)] grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="t-meta text-bone-3" data-fade="">
              In the lab
            </p>
          </div>
          <ul className="border-t border-line md:col-span-9">
            {LAB.map((l, i) => (
              <li
                key={l.name}
                className="group relative isolate grid grid-cols-[2.2rem_1fr_auto] items-baseline gap-4 overflow-hidden border-b border-line py-6 md:grid-cols-[3rem_1.1fr_1fr_8rem_4rem] md:py-7"
                data-fade=""
              >
                <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink-800 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                <span className="t-meta text-bone-3">0{i + 1}</span>
                <span className="t-h3 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3">
                  {l.name}
                </span>
                <span className="hidden text-bone-2 md:block">{l.kind}</span>
                <span className="t-meta flex items-center gap-2 text-bone-2">
                  <i className={`h-1.5 w-1.5 rounded-full ${l.status === "In build" ? "bg-ember" : "bg-bone-3"}`} />
                  {l.status}
                </span>
                <span className="t-meta hidden text-right text-bone-3 md:block">{l.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Project({
  className,
  n,
  title,
  kind,
  year,
  href,
  desc,
  tags,
  status,
  children,
}: {
  className?: string;
  n: string;
  title: string;
  kind: string;
  year: string;
  href?: string;
  desc: string;
  tags: string[];
  status: string;
  children: React.ReactNode;
}) {
  const Wrap = href ? "a" : "div";
  return (
    <article className={className}>
      <Wrap
        {...(href ? { href, target: "_blank", rel: "noreferrer", "data-cursor": "Visit" } : {})}
        className="group block"
      >
        {children}
      </Wrap>
      <div className="mt-6 grid grid-cols-[1fr_auto] gap-x-6 gap-y-3" data-fade="">
        <h3 className="t-h3 flex items-baseline gap-3">
          <span className="t-meta text-bone-3">{n}</span>
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="link-u inline-flex items-center gap-2 pb-0.5">
              {title}
              <ArrowUpRight className="h-4 w-4 text-bone-2" />
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="t-meta flex items-center gap-2 text-bone-2">
          <i className={`h-1.5 w-1.5 rounded-full ${status === "Live" ? "bg-ember" : "bg-bone-3"}`} />
          {status} · {year}
        </p>
        <p className="col-span-2 text-bone-3">{kind}</p>
        <p className="col-span-2 max-w-[52ch] text-bone-2">{desc}</p>
        <ul className="col-span-2 flex flex-wrap gap-2 pt-1">
          {tags.map((t) => (
            <li key={t} className="t-meta rounded-full border border-line px-3 py-1.5 text-[0.62rem] text-bone-2">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
