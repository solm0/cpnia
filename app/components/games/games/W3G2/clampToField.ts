import { Field } from "../W3G2";

type Vec3 = { x: number; y: number; z: number };

export function clampToField(nextPos: Vec3, field: Field): Vec3 {
  const clamped = { ...nextPos };

  // 1. Check if inside any boundary
  const [cx, cz] = field.center;
    const [w, d] = field.size ?? [0, 0];
    const halfW = w / 2;
    const halfD = d / 2;

    if (
      clamped.x >= cx - halfW &&
      clamped.x <= cx + halfW &&
      clamped.z >= cz - halfD &&
      clamped.z <= cz + halfD
    ) {
      return { ...clamped, y: clamped.y };
    }

  // 2. Snap to nearest boundary edge if outside
  let nearest: { pos: Vec3; dist: number } = { pos: clamped, dist: Infinity };

  const [ncx, ncz] = field.center;
  const [nw, nd] = field.size ?? [0, 0];
  const nhalfW = nw / 2;
  const nhalfD = nd / 2;

  const candidate = {
    x: Math.max(ncx - nhalfW, Math.min(clamped.x, ncx + nhalfW)),
    y: clamped.y,
    z: Math.max(ncz - nhalfD, Math.min(clamped.z, ncz + nhalfD)),
  };

  const dx = clamped.x - candidate.x;
  const dz = clamped.z - candidate.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (!nearest || dist < nearest.dist) {
    nearest = { pos: candidate, dist };
  }

  return nearest ? nearest.pos : clamped;
}