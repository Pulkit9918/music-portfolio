// src/three/AlbumPlane.jsx
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";

export default function AlbumPlane({ image = "/images/covers/sleeve-art.jpg" }) {
  const meshRef = useRef();
  const matRef = useRef();
  const opacityRef = useRef(0);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(image, (tex) => setTexture(tex), undefined, () => setTexture(null));
  }, [image]);

  useFrame((state) => {
    const room = useStore.getState().currentRoom;
    const target = room === "music" ? 1 : 0;
    opacityRef.current += (target - opacityRef.current) * 0.05;

    if (matRef.current) matRef.current.opacity = opacityRef.current;
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.15;
      meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
      meshRef.current.visible = opacityRef.current > 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[1.6, 0, -2]}>
      <planeGeometry args={[1.6, 1.6]} />
      <meshStandardMaterial ref={matRef} transparent opacity={0} color={texture ? "#ffffff" : "#2b2822"} map={texture} />
    </mesh>
  );
}