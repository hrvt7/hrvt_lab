"use client";
import { useEffect, useState } from "react";

export function Clock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("hu-HU", { timeZone: "Europe/Budapest", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t}</span>;
}
