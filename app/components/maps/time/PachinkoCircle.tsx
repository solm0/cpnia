import ClonedModel from "../../util/ClonedModels";

export default function PachinkoCircle({
  center = [0, 0, 0],
  count = 6,
  distance = 5,
  scale = 0.7,
}: {
  center?: [number, number, number];
  count?: number;
  distance?: number;
  scale?: number;
}) {
  const [cx, cy, cz] = center;

  // Generate positions + rotations
  const items = [
    {
      position: [cx, cy, cz] as [number, number, number], // center pachinko
      rotation: [0, 0, 0] as [number, number, number],
      scale: scale * 1.7,
    },
    ...Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2; // spread around circle
      const x = cx + Math.cos(angle) * distance;
      const z = cz + Math.sin(angle) * distance;

      return {
        position: [x, cy, z] as [number, number, number],
        rotation: [0, -angle -1.5, 0] as [number, number, number],
        scale: scale,
      };
    }),
  ];

  return (
    <>
      {items.map((item, i) => (
        <ClonedModel
          key={i}
          src="/models/pachinko.glb"
          scale={item.scale}
          position={item.position}
          rotation={item.rotation}
        />
      ))}
    </>
  );
}