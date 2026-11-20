import { CatmullRomCurve3, Vector3 } from "three";

export const HALF_W = 2.7, HEIGHT = 4.4, EYE = 1.62, ART_Y = 1.72;
const v3 = (x: number, y: number, z: number) => new Vector3(x, y, z);

export function makeCurve() {
  return new CatmullRomCurve3([v3(0, 0, 8), v3(0, 0, 0), v3(1.8, 0, -13), v3(-1.8, 0, -27), v3(1.8, 0, -41), v3(-0.9, 0, -53), v3(0, 0, -62)], false, "centripetal");
}
/** Where each work hangs along the rail (0..1). */
export const artU = (i: number, n: number) => 0.15 + (i * 0.74) / Math.max(1, n - 1);
/** Scroll progress (0..1) → rail position. */
export const railU = (p: number) => 0.012 + p * 0.958;
export const railP = (u: number) => Math.min(1, Math.max(0, (u - 0.012) / 0.958));

