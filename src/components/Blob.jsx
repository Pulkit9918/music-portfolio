// src/components/Blob.jsx
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";

const reduce =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function BlobMesh({ analyser, playing }) {
  const mesh = useRef();
  const mat = useRef();
  const buf = useRef(null);

  const accent =
    getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c97b4a";

  useFrame((state) => {
    let amp = 0;
    if (analyser && playing && !reduce) {
      if (!buf.current || buf.current.length !== analyser.frequencyBinCount)
        buf.current = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(buf.current);
      let sum = 0;
      for (let i = 0; i < buf.current.length; i++) sum += buf.current[i];
      amp = sum / buf.current.length / 255;
    }
    const t = state.clock.elapsedTime;
    if (mat.current) {
      mat.current.distort = 0.25 + amp * 0.65;
      mat.current.speed = 1.5 + amp * 3;
    }
    if (mesh.current) {
      const s = 1 + amp * 0.35 + Math.sin(t) * 0.02;
      mesh.current.scale.set(s, s, s);
      mesh.current.rotation.y = t * 0.15;
    }
  });

  return (
    <Sphere ref={mesh} args={[1, 128, 128]}>
      <MeshDistortMaterial ref={mat} color={accent} roughness={0.35} metalness={0.1} distort={0.3} speed={2} />
    </Sphere>
  );
}

export default function Blob({ analyser, playing }) {
  return (
    <div className="blob">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <BlobMesh analyser={analyser} playing={playing} />
      </Canvas>
    </div>
  );
}