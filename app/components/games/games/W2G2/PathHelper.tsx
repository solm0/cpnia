import { Line } from '@react-three/drei';
import { Vector3, CatmullRomCurve3 } from 'three';
import { useMemo } from 'react';

export function PathHelper({
  start,
  end,
  controlOffset = new Vector3(0, 5, -10),
  points = 20,
  color = 'yellow'
}: {
  start: Vector3;
  end: Vector3;
  controlOffset?: Vector3; // curve peak relative to start
  points?: number;
  color?: string;
}) {
  // Generate a smooth curve using a control point
  const curvePoints = useMemo(() => {
    const mid = start.clone().lerp(end, 0.5).add(controlOffset);
    const curve = new CatmullRomCurve3([start.clone(), mid, end.clone()]);
    return curve.getPoints(points);
  }, [start, end, controlOffset, points]);

  return <Line points={curvePoints} color={color} lineWidth={2} />;
}