export const EMAIL = "hrvtadam.7@icloud.com";

export const NAV = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
];

export const CAPABILITIES = [
  {
    n: "01",
    title: "AI systems",
    lede: "Tools that read, decide and draft, wired into the way your business already works.",
    body: "LLM-powered assistants, document and plan analysis, quoting engines and internal copilots. Built with guardrails, evaluation and a clear path from prototype to production, not demos that collapse on real data.",
    tags: ["LLM integration", "Document & plan analysis", "Internal copilots", "Evaluation"],
    icon: "ai",
  },
  {
    n: "02",
    title: "Automations",
    lede: "The repetitive work removed, quietly, end to end.",
    body: "Lead capture to CRM, quote to PDF to inbox, data syncs between tools that were never meant to talk. Designed around failure states, so nothing silently breaks at 2 a.m.",
    tags: ["n8n / Make", "API integration", "Lead pipelines", "Reporting"],
    icon: "flow",
  },
  {
    n: "03",
    title: "Websites & landing pages",
    lede: "Fast, cinematic, and built to convert, not only to impress.",
    body: "Art-directed marketing sites and landing pages with real motion design, measured performance budgets and a CMS-free setup that stays fast for years.",
    tags: ["Art direction", "Motion design", "Next.js", "Performance"],
    icon: "web",
  },
  {
    n: "04",
    title: "Real-time 3D software",
    lede: "Products your customers configure, rotate and price themselves, in the browser.",
    body: "3D configurators, interactive product explainers and visualisation tools. Parametric geometry, live pricing and lead capture, running smoothly on a mid-range phone.",
    tags: ["Three.js / WebGL", "Configurators", "Live pricing", "AR-ready"],
    icon: "cube",
  },
] as const;

export const STEPS = [
  {
    n: "01",
    title: "Interrogate",
    body: "Before design, the economics. Where does the money move, what slows it down, and what would a perfect outcome look like in numbers?",
    meta: "Week 0 — 1",
  },
  {
    n: "02",
    title: "Prototype",
    body: "A working thing in days, not a deck in weeks. You click it, break it and react to something real. Decisions get faster when they are tangible.",
    meta: "Week 1 — 2",
  },
  {
    n: "03",
    title: "Engineer",
    body: "Production code with performance budgets, typed data and failure states designed in. The craft you feel comes from the parts you never see.",
    meta: "Week 2 — 6",
  },
  {
    n: "04",
    title: "Ship & refine",
    body: "Launch, measure, tighten. I stay close after go-live, because the first real users always teach the product something new.",
    meta: "Ongoing",
  },
] as const;

export const LAB = [
  { name: "KNX Plan Analyzer", kind: "AI · Building automation", status: "R&D", year: "2026" },
  { name: "Strain wave gear teardown", kind: "Interactive 3D explainer", status: "Concept", year: "2026" },
  { name: "CompliPack", kind: "EU packaging compliance SaaS", status: "In build", year: "2026" },
  { name: "Burger builder", kind: "Interactive commerce demo", status: "Concept", year: "2026" },
] as const;

export const STACK = [
  "TypeScript",
  "Next.js",
  "Three.js",
  "WebGL / GLSL",
  "GSAP",
  "Supabase",
  "n8n",
  "LLM APIs",
  "Vercel",
];
