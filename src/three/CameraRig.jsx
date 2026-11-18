import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";

export default function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0, 6));
  const last = useRef(0);

  useFrame((state) => {
    const progress = useStore.getState().scrollProgress;
    const x = progress * 32;
    const sway = Math.sin(progress * Math.PI * 3) * 0.8;

    target.current.set(x, sway * 0.3, 6);
    state.camera.position.lerp(target.current, 0.06);
    state.camera.lookAt(x + 5, 0, 0);

    const speed = Math.abs(progress - last.current);
    last.current = progress;
    const targetFov = 50 + Math.min(speed * 1400, 16);
    state.camera.fov += (targetFov - state.camera.fov) * 0.08;
    state.camera.updateProjectionMatrix();
  });

  return null;
}