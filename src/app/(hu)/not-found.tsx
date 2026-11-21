import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap flex min-h-[100svh] flex-col justify-end pb-16">
      <p className="t-meta mb-6 text-smoke">404 — Az oldal nem található</p>
      <h1 className="t-xl">
        Nincs <span className="text-kiwi">jel.</span>
      </h1>
      <Link href="/" className="pill pill--kiwi mt-12 self-start">Vissza a főoldalra</Link>
    </section>
  );
}
