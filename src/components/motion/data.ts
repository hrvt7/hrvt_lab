import { EMAIL, PHONE, PHONE_TEL } from "@/lib/content";

export { EMAIL, PHONE, PHONE_TEL };
export const WHATSAPP = `https://wa.me/${PHONE_TEL.replace("+", "")}?text=${encodeURIComponent("Hi Ádám, I’d like to talk about a product video for our SaaS.")}`;
export const INSTAGRAM = "https://www.instagram.com/hrvt.7/";
export const CALL = `mailto:${EMAIL}?subject=${encodeURIComponent("Free 15-min call — SaaS product video")}`;
export const DISCOVERY = `mailto:${EMAIL}?subject=${encodeURIComponent("Discovery call — SaaS product video")}`;

/** The three pieces, in the order they sit on the hero reel (30 s each). */
export const WORK = [
  { id: "orlo", name: "Orlo", len: "30s", what: "scheduling product video", line: "Time, arranged.", bg: "#efe8ff", ink: "#1a1530", acc: "#6f4dff" },
  { id: "mirra", name: "Mirra", len: "30s", what: "AI support inbox explainer", line: "Support at the speed of now.", bg: "#0a0a0a", ink: "#f4f4f0", acc: "#c8ff2e" },
  { id: "halden", name: "Halden", len: "30s", what: "runway forecasting product video", line: "Know your runway.", bg: "#f1ede4", ink: "#161613", acc: "#ff4a1c" },
] as const;

export const SERVICES = [
  { k: "story", name: "30–60s Product Explainer Videos" },
  { k: "ui", name: "Feature & UI Animation Videos" },
  { k: "launch", name: "Launch & Announcement Videos" },
  { k: "cut", name: "Social & Ad Cutdowns", note: "from the main video" },
] as const;

export const GET = [
  "Clean, modern visual language that matches today’s best SaaS brands",
  "Clear storytelling (problem → solution → result)",
  "High production value with 3D depth, smooth transitions, and refined micro-interactions",
  "Ready-for-website and ready-for-ads deliverables",
];

export const WHO = [
  "Early-stage and growth-stage SaaS companies",
  "Founders and marketing teams who need a strong product video",
  "Products that are powerful but hard to explain in plain screenshots",
  "Teams that care about design quality and brand perception",
];

export const STEPS = [
  ["Discovery call", "We discuss your product, goals, and key messages."],
  ["Concept & script direction", "I propose a clear structure and visual approach."],
  ["Design & animation", "Full motion design with regular check-ins."],
  ["Delivery", "Final video + social cutdowns + source files (if needed)."],
] as const;

export const WHY = [
  "I only do SaaS motion design — no generic corporate videos",
  "Strong focus on clarity and storytelling, not just “nice visuals”",
  "Experience with complex products (AI tools, internal apps, workflows, data platforms)",
  "Clean communication and reliable delivery",
  "You get a video that actually helps sell the product, not just look pretty",
];

export const PRICES = [
  { name: "30-second Feature / Explainer Video", from: "Starting from", price: "$2,800", span: 30, cuts: 1 },
  { name: "60-second Product Story Video", from: "Starting from", price: "$5,500", span: 60, cuts: 1 },
  { name: "Social Cutdown Pack", sub: "3–5 shorter versions", from: "From", price: "$900", span: 60, cuts: 5 },
] as const;

export const FAQ = [
  ["Do you write the script?", "I can help refine the message and structure. Most clients come with core points, and we shape it together."],
  ["Can you match our existing brand?", "Yes. I adapt to your visual identity, colors, and tone."],
  ["What do I need to provide?", "Product access or recordings, key benefits, brand guidelines (if you have them), and any existing assets."],
  ["Do you offer revisions?", "Yes. Every package includes structured revision rounds."],
  ["Can you also do shorter social versions?", "Yes, most clients order a main video + cutdowns for LinkedIn, X, and ads."],
] as const;

export const SECTIONS = [
  ["top", "Reel"], ["services", "Services"], ["for", "Fit"], ["work", "Work"], ["process", "Process"], ["why", "Why"], ["pricing", "Pricing"], ["faq", "FAQ"], ["contact", "Contact"],
] as const;

export const tc = (s: number) => {
  const ss = Math.floor(s) % 60, m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};
