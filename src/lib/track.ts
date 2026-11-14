/** Fires a conversion event on whichever analytics tool is present; silently does nothing when there is none. */
export function track(name: string, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { va?: (e: string, d: object) => void; plausible?: (n: string, o?: object) => void; gtag?: (c: string, n: string, p?: object) => void };
  try {
    if (w.va) w.va("event", { name, data: props });
    else if (w.plausible) w.plausible(name, { props });
    else if (w.gtag) w.gtag("event", name, props);
  } catch {}
}
