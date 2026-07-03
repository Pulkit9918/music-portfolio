// src/components/Vinyl.jsx
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PresentationControls, Float } from "@react-three/drei";
import { useAudio } from "../context/AudioProvider";

const reduce =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Record() {
  const spin = useRef();
  const { playing } = useAudio();
  const accent =
    getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c97b4a";

  useFrame((_, delta) => {
    if (spin.current && playing && !reduce) spin.current.rotation.z -= delta * 1.6;
  });

  const rings = [0.55, 0.75, 0.95, 1.15, 1.3];

  return (
    <group ref={spin}>
      {/* disc (axis rotated to face camera) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.04, 96]} />
        <meshStandardMaterial color="#0c0b0a" roughness={0.45} metalness={0.35} />
      </mesh>
      {/* grooves */}
      {rings.map((r, i) => (
        <mesh key={i} position={[0, 0, 0.021]}>
          <ringGeometry args={[r - 0.004, r, 96]} />
          <meshBasicMaterial color="#211d19" side={2} />
        </mesh>
      ))}
      {/* label */}
      <mesh position={[0, 0, 0.022]}>
        <circleGeometry args={[0.45, 64]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
      {/* off-center mark so the spin reads */}
      <mesh position={[0.22, 0.12, 0.024]}>
        <circleGeometry args={[0.04, 24]} />
        <meshBasicMaterial color="#0f0e0d" />
      </mesh>
      {/* spindle hole */}
      <mesh position={[0, 0, 0.03]}>
        <circleGeometry args={[0.035, 24]} />
        <meshBasicMaterial color="#0f0e0d" />
      </mesh>
    </group>
  );
}

export default function Vinyl() {
  return (
    <div className="vinyl">
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1.3} />
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <PresentationControls
            global
            polar={[-0.4, 0.4]}
            azimuth={[-0.6, 0.6]}
            config={{ mass: 1, tension: 200 }}
            snap
          >
            <Record />
          </PresentationControls>
        </Float>
      </Canvas>
    </div>
  );
}