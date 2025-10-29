type Vec3 = { x: number; y: number; z: number };

export type Boundary = {
  type: "circle" | "rect";
  center: [number, number];   // [x, z]
  radius?: number;            // for circle
  size?: [number, number];    // for rect
  y?: number;                 // floor height
  rotation?: [number, number, number]
};

export function clampToBoundary(nextPos: Vec3, boundaries: Boundary[]): Vec3 {
  const clamped = { ...nextPos };

  let nearest: { pos: Vec3; dist: number } | null = null;

  for (const b of boundaries) {
    const [cx, cz] = b.center;
    const rotationY = b.rotation?.[1] ?? 0;
    const cos = Math.cos(rotationY);
    const sin = Math.sin(rotationY);

    // Transform point into local space of boundary
    const localX = (clamped.x - cx) * cos - (clamped.z - cz) * sin;
    const localZ = (clamped.x - cx) * sin + (clamped.z - cz) * cos;

    let inside = false;
    let candidate: Vec3 | null = null;

    if (b.type === "circle") {
      const dist = Math.sqrt(localX * localX + localZ * localZ);
      const radius = b.radius ?? 0;

      if (dist <= radius) {
        inside = true;
      } else if (dist > 0) {
        const scale = radius / dist;
        candidate = {
          x: cx + (localX * cos + localZ * sin) * scale,
          y: b.y ?? clamped.y,
          z: cz + (-localX * sin + localZ * cos) * scale,
        };
      }
    }

    if (b.type === "rect") {
      const [w, d] = b.size ?? [0, 0];
      const halfW = w / 2;
      const halfD = d / 2;

      if (
        localX >= -halfW &&
        localX <= halfW &&
        localZ >= -halfD &&
        localZ <= halfD
      ) {
        inside = true;
      } else {
        const clampedLocalX = Math.max(-halfW, Math.min(localX, halfW));
        const clampedLocalZ = Math.max(-halfD, Math.min(localZ, halfD));

        // Rotate back to world space
        const worldX = cx + clampedLocalX * cos + clampedLocalZ * sin;
        const worldZ = cz - clampedLocalX * sin + clampedLocalZ * cos;

        candidate = {
          x: worldX,
          y: b.y ?? clamped.y,
          z: worldZ,
        };
      }
    }

    if (inside) {
      return { ...clamped, y: b.y ?? clamped.y };
    }

    if (candidate) {
      const dx = clamped.x - candidate.x;
      const dz = clamped.z - candidate.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (!nearest || dist < nearest.dist) {
        nearest = { pos: candidate, dist };
      }
    }
  }

  return nearest ? nearest.pos : clamped;
}