"use client";

import { useEffect, useState } from "react";

export function Clock({ prefix = "VIE" }: { prefix?: string }) {
  const [t, setT] = useState<string>("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Vienna",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {prefix} {t}
    </span>
  );
}
