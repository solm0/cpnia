/* eslint-disable @typescript-eslint/no-explicit-any */

import { useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import { Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export function useFollowCam(
  ref: React.RefObject<any>,
  offset: [number, number, number],
  pressedKeys: Set<string>,
  gamepad: {
    axes: number[];
    buttons: Record<string, boolean>;
  }
) {
  const { scene, camera } = useThree();

  const pivot = useMemo(() => new Object3D(), []);
  const alt = useMemo(() => new Object3D(), []);
  const yaw = useMemo(() => new Object3D(), []);
  const pitch = useMemo(() => new Object3D(), []);
  const worldPosition = useMemo(() => new Vector3(), []);
  const zoomDistance = useRef(offset[2]);

  function updateCameraFromKeys() {
    const rotateSpeed = 0.02;
    const deadzone = 0.5;

    if (pressedKeys.has("KeyJ") || (gamepad && gamepad.axes[2] < -deadzone)) {
      yaw.rotation.y += rotateSpeed;
    }
    if (pressedKeys.has("KeyL") || (gamepad && gamepad.axes[2] > deadzone)) {
      yaw.rotation.y -= rotateSpeed;
    }
    if (pressedKeys.has("KeyI") || (gamepad && gamepad.axes[3] < -deadzone)) {
      pitch.rotation.x = Math.max(-1, pitch.rotation.x - rotateSpeed);
    }
    if (pressedKeys.has("KeyK") || (gamepad && gamepad.axes[3] > deadzone)) {
      pitch.rotation.x = Math.min(0.1, pitch.rotation.x + rotateSpeed);
    }
  }

  function onDocumentMouseWheel(e: WheelEvent) {
    e.preventDefault();
    zoomDistance.current += e.deltaY * 0.01;
    zoomDistance.current = Math.min(Math.max(zoomDistance.current, 10), 300);
  }

  useEffect(() => {
    scene.add(pivot);
    pivot.add(alt);
    alt.position.y = offset[1];
    alt.add(yaw);
    yaw.add(pitch);
    pitch.add(camera);

    pitch.rotation.x = -Math.PI / 12;
    camera.position.set(0, 0, zoomDistance.current);

    window.addEventListener("wheel", onDocumentMouseWheel, { passive: false });
    return () => window.removeEventListener("wheel", onDocumentMouseWheel);
  }, [camera]);

  const currentZoom = new Vector3();
  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.translation();
    worldPosition.set(pos.x, pos.y, pos.z);

    pivot.position.lerp(worldPosition, delta * 5);

    currentZoom.lerp(new Vector3(0, 0, zoomDistance.current), delta * 5);
    camera.position.copy(currentZoom);

    updateCameraFromKeys();
  });

  return { yaw };
}