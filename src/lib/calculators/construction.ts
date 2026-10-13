/**
 * Material estimator for brick walls (Indian standard practice).
 *
 * Standard modular brick: 190 × 90 × 90 mm, 10 mm mortar joint → 200 × 100 × 100 mm.
 * ≈ 500 bricks per m³ of masonry. Mortar ≈ 25–30% of wall volume (wet);
 * dry volume = wet × 1.33. Defaults below are typical site estimates, not a
 * structural design — always shown with a disclaimer.
 */

export type WallInput = {
  lengthM: number;
  heightM: number;
  /** 0.1 m (half-brick / 4.5") or 0.2 m (full brick / 9") */
  thicknessM: 0.1 | 0.2;
  /** Doors + windows area to subtract */
  openingsM2?: number;
  /** Cement : sand ratio, e.g. 6 → 1:6 */
  mortarRatio?: 4 | 5 | 6;
  /** Extra for breakage, default 5% */
  wastagePc?: number;
};

export type WallEstimate = {
  wallVolumeM3: number;
  bricks: number;
  cementBags: number;
  sandM3: number;
  sandCft: number;
};

const BRICK_WITH_MORTAR_M3 = 0.2 * 0.1 * 0.1;
const BRICK_ONLY_M3 = 0.19 * 0.09 * 0.09;
const CEMENT_BAG_M3 = 0.0347; // 50 kg bag
const M3_TO_CFT = 35.3147;

export function estimateWall(input: WallInput): WallEstimate {
  const { lengthM, heightM, thicknessM, openingsM2 = 0, mortarRatio = 6, wastagePc = 5 } = input;
  if (lengthM <= 0 || heightM <= 0) throw new Error("Length and height must be positive");
  const area = Math.max(0, lengthM * heightM - openingsM2);
  const volume = area * thicknessM;

  const bricksExact = volume / BRICK_WITH_MORTAR_M3;
  const bricks = Math.ceil(bricksExact * (1 + wastagePc / 100));

  const wetMortar = volume - bricksExact * BRICK_ONLY_M3;
  const dryMortar = wetMortar * 1.33;
  const parts = 1 + mortarRatio;
  const cementM3 = dryMortar / parts;
  const sandM3 = (dryMortar * mortarRatio) / parts;

  return {
    wallVolumeM3: round(volume, 2),
    bricks,
    cementBags: Math.ceil(cementM3 / CEMENT_BAG_M3),
    sandM3: round(sandM3, 2),
    sandCft: Math.ceil(sandM3 * M3_TO_CFT),
  };
}

/** Feet → metres helper, since many customers measure in feet. */
export const ft = (feet: number) => feet * 0.3048;

const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;
