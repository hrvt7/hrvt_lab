"use client";
import { useEffect } from "react";

/** Pages without the intro curtain announce themselves as ready, so smooth scroll and reveals start. */
export function Ready() {
  useEffect(() => {
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) {
      w.__hrvtReady = true;
      window.dispatchEvent(new Event("hrvt:ready"));
    }
  }, []);
  return null;
}
