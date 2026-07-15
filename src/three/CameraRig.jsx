// src/three/CameraRig.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";

export default function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0, 6));

  useFrame((state) => {
    const progress = useStore.getState().scrollProgress;
    const x = progress * 32;
    const sway = Math.sin(progress * Math.PI * 3) * 0.8;

    target.current.set(x, sway * 0.3, 6);
    state.camera.position.lerp(target.current, 0.06);
    state.camera.lookAt(x + 5, 0, 0);
  });

  return null;
}