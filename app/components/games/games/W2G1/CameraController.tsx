import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { Vector3, Euler } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

interface CameraControllerProps {
  position?: [number, number, number];
  rotation?: [number, number, number]; // [pitch, yaw, roll] in radians
}

export default function CameraController({
  position = [-1.5, 5, 10],
  rotation = [degToRad(-20),0,0],
}: CameraControllerProps) {
  const { camera } = useThree();

  // Initialize rotation
  const rotationRef = useRef(new Euler(rotation[0], rotation[1], rotation[2], "YXZ"));
  const keys = useRef<{ [key: string]: boolean }>({
    w: false, a: false, s: false, d: false,
    i: false, k: false, j: false, l: false,
  });

  // Set initial camera position & rotation once
  useEffect(() => {
    camera.position.set(...position);
    camera.rotation.copy(rotationRef.current);
  }, [camera, position]);

  // Key listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(k)) keys.current[k] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(k)) keys.current[k] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Movement & rotation
  useFrame((_, delta) => {
    // --- Yaw & pitch ---
    if (keys.current.j) rotationRef.current.y += delta * 1; // yaw left
    if (keys.current.l) rotationRef.current.y -= delta * 1; // yaw right
    if (keys.current.i) rotationRef.current.x += delta * 1; // pitch up
    if (keys.current.k) rotationRef.current.x -= delta * 1; // pitch down
    rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));

    camera.rotation.x = rotationRef.current.x;
    camera.rotation.y = rotationRef.current.y;
    camera.rotation.z = 0;

    // --- Movement (XZ plane only) ---
    const moveDir = new Vector3();
    if (keys.current.w) moveDir.z += 1;
    if (keys.current.s) moveDir.z -= 1;
    if (keys.current.a) moveDir.x -= 1;
    if (keys.current.d) moveDir.x += 1;

    if (moveDir.length() > 0) {
      moveDir.normalize();
      const speed = 10 * delta;

      const forward = new Vector3(0, 0, -1).applyEuler(new Euler(0, rotationRef.current.y, 0));
      const right = new Vector3(1, 0, 0).applyEuler(new Euler(0, rotationRef.current.y, 0));

      camera.position.add(forward.multiplyScalar(moveDir.z * speed));
      camera.position.add(right.multiplyScalar(moveDir.x * speed));
    }
  });

  return null;
}