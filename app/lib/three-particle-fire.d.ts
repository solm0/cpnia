declare module 'three-particle-fire' {
  import * as THREE from 'three';

  export function install(options: { THREE: typeof THREE }): void;

  export class Geometry extends THREE.BufferGeometry {
    constructor(fireRadius: number, fireHeight: number, particleCount: number);
  }

  export class Material extends THREE.PointsMaterial {
    constructor(params?: { color?: number });
    setPerspective(fov: number, height: number): void;
    update(delta: number): void;
  }
}