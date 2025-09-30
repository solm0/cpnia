type Vec3 = { x: number; y: number; z: number };

export type Boundary = {
  type: "circle" | "rect";
  center: [number, number];   // [x, z]
  radius?: number;            // for circle
  size?: [number, number];    // for rect
  y?: number;                 // floor height
};

export function clampToBoundary(nextPos: Vec3, boundaries: Boundary[]): Vec3 {
  const clamped = { ...nextPos };

  // 1. Check if inside any boundary
  for (const b of boundaries) {
    if (b.type === "circle") {
      const [cx, cz] = b.center;
      const dx = clamped.x - cx;
      const dz = clamped.z - cz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const radius = b.radius ?? 0;

      if (dist <= radius) {
        return { ...clamped, y: b.y ?? clamped.y };
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
        return { ...clamped, y: b.y ?? clamped.y };
      }
    }
  }

  // 2. Snap to nearest boundary edge if outside
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
          y: b.y ?? clamped.y,
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
        y: b.y ?? clamped.y,
        z: Math.max(cz - halfD, Math.min(clamped.z, cz + halfD)),
      };

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