"use client";
/**
 * Liquid sound effects, synthesised with WebAudio (no files). Off by default; the visitor turns
 * them on with the speaker button in the nav, and the choice is remembered.
 */
let ctx: AudioContext | null = null;
let on = false;
const KEY = "hrvt:sound";
const listeners = new Set<(v: boolean) => void>();

export const soundOn = () => on;
export function initSound() {
  try { on = localStorage.getItem(KEY) === "1"; } catch { on = false; }
  listeners.forEach((f) => f(on));
}
export function onSoundChange(f: (v: boolean) => void) { listeners.add(f); return () => void listeners.delete(f); }
export function setSound(v: boolean) {
  on = v;
  try { localStorage.setItem(KEY, v ? "1" : "0"); } catch {}
  if (v) { ac(); plop({ pitch: 1.2 }); }
  listeners.forEach((f) => f(on));
}
function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** A water drop: a sine whose pitch leaps up fast (the bubble), with a soft attack and short tail. */
export function plop({ pitch = 1, gain = 0.22, delay = 0 } = {}) {
  if (!on) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator(), g = c.createGain();
  o.type = "sine";
  const f0 = 260 * pitch * (0.9 + Math.random() * 0.2);
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f0 * 3.2, t + 0.07);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.2);
}

/** Pouring / gurgling: band-passed noise with a wandering filter, plus a few bubbles on top. */
export function pour({ dur = 0.7, gain = 0.12, bubbles = 5 } = {}) {
  if (!on) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 6;
  bp.frequency.setValueAtTime(500, t);
  for (let k = 1; k <= 6; k++) bp.frequency.linearRampToValueAtTime(380 + Math.random() * 900, t + (dur * k) / 6);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t);
  for (let i = 0; i < bubbles; i++) plop({ pitch: 0.8 + Math.random() * 1.2, gain: 0.08, delay: Math.random() * dur * 0.8 });
}
