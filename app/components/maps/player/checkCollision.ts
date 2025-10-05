import { chatNpcs } from "@/app/lib/data/positions/chatNpcs";
import { mapNpcs } from "@/app/lib/data/positions/mapNpcs";
import { gamePortals } from "@/app/lib/data/positions/gamePortals";

export function checkCollision(nextPos: {x: number, y: number, z: number }, worldKey: string) {
  const objects = [
    ...mapNpcs[worldKey],
    ...gamePortals[worldKey],
    chatNpcs[worldKey],
  ];

  const obstacles = objects.filter(object => object.position !=null && object.rotation !=null);

  for (const obs of obstacles) {
    if (!obs.position) continue;
    
    const [ox, oy, oz] = obs.position;
    const [sx, sy, sz] = obs.size?.map(v=>v/2) ?? [2,2,2];
    const px = nextPos.x;
    const py = nextPos.y;
    const pz = nextPos.z;

    // assume player size 1,1,1
    if (
      px + 0.5 > ox - sx && px - 0.5 < ox + sx &&
      py + 2 > oy - sy && py - 2 < oy + sy &&
      pz + 1 > oz - sz && pz - 1 < oz + sz
    ) {
      return true; // collision
    }
  }
  return false;
}