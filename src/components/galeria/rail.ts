import { CatmullRomCurve3, Vector3 } from "three";

export const HALF_W = 2.7, HEIGHT = 4.4, EYE = 1.62, ART_Y = 1.72;
const v3 = (x: number, y: number, z: number) => new Vector3(x, y, z);

/** Corridor length in metres: 62 m holds up to 12 works, longer shows grow with the count. */
export const railLen = (n: number) => Math.max(62, Math.round(5.64 * (n - 1)));
/** Scales rail-space distances so they stay the same in metres on a longer corridor. */
export const unit = (n: number) => 62 / railLen(n);
export function makeCurve(n = 12) {
  const L = railLen(n), pts = [v3(0, 0, 8), v3(0, 0, 0)];
  let s = 1; for (let z = 13; z < L - 16; z += 14, s = -s) pts.push(v3(1.8 * s, 0, -z));
  pts.push(v3(0.9 * s, 0, -(L - 9)), v3(0, 0, -L));
  return new CatmullRomCurve3(pts, false, "centripetal");
}
/** Where each work hangs along the rail (0..1). */
export const artU = (i: number, n: number) => 0.15 * unit(n) + (i * (0.89 - 0.15 * unit(n))) / Math.max(1, n - 1);
/** The spot a few steps before a work, where the walk stops to look at it. */
export const approachU = (i: number, n: number) => Math.max(0.012, artU(i, n) - 0.045 * unit(n));
/** Scroll progress (0..1) → rail position. */
export const railU = (p: number) => 0.012 + p * 0.958;
export const railP = (u: number) => Math.min(1, Math.max(0, (u - 0.012) / 0.958));
