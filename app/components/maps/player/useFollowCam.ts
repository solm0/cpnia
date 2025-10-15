/* eslint-disable @typescript-eslint/no-explicit-any */
import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import { Object3D, Vector3 } from "three";

export function useFollowCam(
  ref: React.RefObject<any>,
  offset: [number, number, number],
  rotation: [number, number, number],
  pressedKeys: Set<string>,
  gamepad: {
    axes: number[];
    buttons: Record<string, boolean>;
  }
) {
  const { camera } = useThree();

  // Camera rotation pivots
  const yaw = useMemo(() => new Object3D(), []);
  const pitch = useMemo(() => new Object3D(), []);

  // State references
  const worldPos = useRef(new Vector3());
  const smoothTarget = useRef(new Vector3());
  const currentZoom = useRef(new Vector3(0, 0, offset[2]));
  const zoomDistance = useRef(offset[2]);

  useEffect(() => {
    yaw.rotation.y = rotation[1];
    pitch.rotation.x = rotation[0];
    camera.rotation.z = rotation[2];
  }, []);

  // ──────────────────────────────
  // Input handling (mouse, keys, gamepad)
  // ──────────────────────────────
  function updateCameraRotation() {
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

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    zoomDistance.current += e.deltaY * 0.01;
    zoomDistance.current = Math.min(Math.max(zoomDistance.current, 10), 300);
  }

  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // ──────────────────────────────
  // Main camera follow loop
  // ──────────────────────────────
  useFrame((_, delta) => {
    if (!ref.current) return;

    // Get world position of player (Rapier body translation)
    const pos = ref.current.translation();
    worldPos.current.set(pos.x, pos.y + offset[1], pos.z);

    // Smooth target to reduce jitter
    smoothTarget.current.lerp(worldPos.current, delta * 5);

    // Smooth zoom distance changes
    currentZoom.current.lerp(new Vector3(0, 0, zoomDistance.current), delta * 5);

    // Compute desired camera position relative to target
    const radius = zoomDistance.current;
    const x = radius * Math.sin(yaw.rotation.y) * Math.cos(pitch.rotation.x);
    const y = radius * Math.sin(pitch.rotation.x);
    const z = radius * Math.cos(yaw.rotation.y) * Math.cos(pitch.rotation.x);

    camera.position.set(
      smoothTarget.current.x + x,
      smoothTarget.current.y + y,
      smoothTarget.current.z + z
    );
    camera.lookAt(smoothTarget.current);

    updateCameraRotation();
  });

  return { yaw };
}