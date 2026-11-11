import "@/lib/fonts";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Intro />
      <Nav />
      <main>{children}</main>
    </>
  );
}
