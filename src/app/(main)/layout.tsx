import "@/lib/fonts";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { LiquidCursor } from "@/components/LiquidCursor";
import { SelectionDrip } from "@/components/SelectionDrip";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Intro />
      <Nav />
      <LiquidCursor />
      <SelectionDrip />
      <main>{children}</main>
    </>
  );
}
