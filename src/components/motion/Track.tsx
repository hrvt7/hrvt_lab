"use client";
import { useEffect } from "react";

/** One delegated listener: every [data-track] click becomes an event in whichever analytics tool is present. */
export function Track() {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]"); if (!t) return;
      const name = t.dataset.track!, w = window as unknown as { va?: (a: string, b: object) => void; plausible?: (n: string) => void; gtag?: (a: string, n: string) => void };
      w.va?.("event", { name }); w.plausible?.(name); w.gtag?.("event", name);
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  return null;
}
