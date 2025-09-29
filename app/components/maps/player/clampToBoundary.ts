type Vec3 = { x: number; y: number; z: number };

export type Boundary = {
  type: string;
  center: [number, number];   // [x, z]
  radius?: number;
  size?: [number, number];
  y?: number;
}

export function clampToBoundary(nextPos: Vec3, boundaries: Boundary[]): Vec3 {
  const clamped = { ...nextPos };

  // check if inside any circle
  for (const b of boundaries) {
    if (b.type === "circle") {
      const [cx, cz] = b.center;
      const dx = clamped.x - cx;
      const dz = clamped.z - cz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const radius = b.radius ?? 0;

      if (dist <= radius) {
        // ✅ already inside this circle
        return clamped;
      }
    }
    if (b.type === "rect") {
      const [cx, cz] = b.center;
      const [w, d] = b.size ?? [0, 0];
      const halfW = w / 2;
      const halfD = d / 2;

      if (
        clamped.x >= cx - halfW &&
        clamped.x <= cx + halfW &&
        clamped.z >= cz - halfD &&
        clamped.z <= cz + halfD
      ) {
        // ✅ inside this rect
        return clamped;
      }
    }
  }

  // ❌ outside all boundaries → snap to nearest circle edge
  let nearest: { pos: Vec3; dist: number } | null = null;

  for (const b of boundaries) {
    if (b.type === "circle") {
      const [cx, cz] = b.center;
      const dx = clamped.x - cx;
      const dz = clamped.z - cz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const radius = b.radius ?? 0;

      if (dist > 0) {
        const scale = radius / dist;
        const candidate = {
          x: cx + dx * scale,
          y: clamped.y,
          z: cz + dz * scale,
        };

        if (!nearest || dist < nearest.dist) {
          nearest = { pos: candidate, dist };
        }
      }
    }

    if (b.type === "rect") {
      const [cx, cz] = b.center;
      const [w, d] = b.size ?? [0, 0];
      const halfW = w / 2;
      const halfD = d / 2;

      const candidate = {
        x: Math.max(cx - halfW, Math.min(clamped.x, cx + halfW)),
        y: clamped.y,
        z: Math.max(cz - halfD, Math.min(clamped.z, cz + halfD)),
      };

      // distance from original position to candidate
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