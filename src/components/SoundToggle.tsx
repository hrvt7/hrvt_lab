"use client";
import { useEffect, useState } from "react";
import { initSound, onSoundChange, setSound } from "@/lib/sound";

/** Speaker button: liquid sounds on/off. Off by default, remembered per browser. */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => { const off = onSoundChange(setOn); initSound(); return off; }, []);
  return (
    <button
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={on ? "Hangok kikapcsolása" : "Hangok bekapcsolása"}
      data-cursor={on ? "Csend" : "Hang"}
      className="group grid h-10 w-10 place-items-center rounded-full shadow-[inset_0_0_0_1px_currentColor] transition-opacity hover:opacity-80"
    >
      <span className="flex h-3.5 items-end gap-[2.5px]" aria-hidden>
        {[0.45, 1, 0.7, 0.35].map((h, i) => (
          <i
            key={i}
            className={`w-[2px] rounded-full bg-current ${on ? "animate-[eq_0.9s_ease-in-out_infinite]" : ""}`}
            style={{ height: on ? `${h * 100}%` : "2px", animationDelay: `${i * 0.13}s`, transition: "height .3s" }}
          />
        ))}
      </span>
    </button>
  );
}
