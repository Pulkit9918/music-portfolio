// src/three/LyricsPlane.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";

function makeTextTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, 512, 256);
  ctx.font = "italic 36px Georgia, serif";
  ctx.fillStyle = "#f2efe8";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // wrap text simply across two lines if needed
  const words = text.split(" ");
  const mid = Math.ceil(words.length / 2);
  ctx.fillText(words.slice(0, mid).join(" "), 256, 110);
  ctx.fillText(words.slice(mid).join(" "), 256, 150);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export default function LyricsPlane({ text = "quiet songs about loud feelings" }) {
  const meshRef = useRef();
  const matRef = useRef();
  const opacityRef = useRef(0);
  const texture = useMemo(() => makeTextTexture(text), [text]);

  useFrame((state) => {
    const room = useStore.getState().currentRoom;
    const target = room === "lyrics" ? 1 : 0;
    opacityRef.current += (target - opacityRef.current) * 0.05;

    if (matRef.current) matRef.current.opacity = opacityRef.current;
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.x = -1.4 + Math.sin(t * 0.4) * 0.2;
      meshRef.current.position.y = Math.cos(t * 0.3) * 0.2;
      meshRef.current.visible = opacityRef.current > 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[-1.4, 0, -3]}>
      <planeGeometry args={[3.2, 1.6]} />
      <meshBasicMaterial ref={matRef} transparent opacity={0} map={texture} />
    </mesh>
  );
}