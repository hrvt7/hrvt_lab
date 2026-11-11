"use client";
import { useEffect, useState } from "react";

type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

/** Phones only: tells the visitor the wordmark reacts to tilting. On iOS the motion sensor needs a tap to unlock. */
export function TiltHint() {
  const [mode, setMode] = useState<"off" | "ask" | "on">("off");
  useEffect(() => {
    if (!matchMedia("(hover: none) and (pointer: coarse)").matches || typeof DeviceOrientationEvent === "undefined") return;
    setMode(typeof (DeviceOrientationEvent as DOE).requestPermission === "function" ? "ask" : "on");
  }, []);
  if (mode === "off") return null;
  const ask = async () => {
    try { if ((await (DeviceOrientationEvent as DOE).requestPermission!()) === "granted") setMode("on"); else setMode("off"); } catch { setMode("off"); }
  };
  return mode === "ask" ? (
    <button onClick={ask} className="t-meta pointer-events-auto mt-3 self-start rounded-full px-3.5 py-2 text-[0.62rem] shadow-[inset_0_0_0_1px_rgba(34,34,34,.35)]">
      ↻ Koppints, aztán döntsd meg a telefont
    </button>
  ) : (
    <p className="t-meta mt-3 text-[0.62rem] text-night/75">↻ Döntsd meg a telefont, vagy húzd végig az ujjad</p>
  );
}
