import "@/lib/fonts";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { LiquidCursor } from "@/components/LiquidCursor";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Intro />
      <Nav />
      <LiquidCursor />
      <main>{children}</main>
    </>
  );
}
