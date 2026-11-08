import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap flex min-h-[100svh] flex-col justify-end pb-16">
      <p className="t-meta mb-6 text-bone-3">404 — Not found</p>
      <h1 className="t-display-xl">
        Lost <span className="t-serif text-ember">signal</span>.
      </h1>
      <Link href="/" className="btn mt-12 self-start">Back to HRVT</Link>
    </section>
  );
}
