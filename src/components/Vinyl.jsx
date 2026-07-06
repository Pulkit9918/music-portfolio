// src/components/Vinyl.jsx
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAudio } from "../context/AudioProvider";

const reduce =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// shared pointer so the canvas can stay pointer-events:none
const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });
}

function Record({ playing }) {
  const tilt = useRef();
  const spin = useRef();
  const accent =
    getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c97b4a";
  const rings = [0.55, 0.75, 0.95, 1.15, 1.3];

  useFrame((_, delta) => {
    // smooth tilt toward the mouse (never grabs your drags)
    if (tilt.current) {
      const tx = pointer.y * 0.25;
      const ty = pointer.x * 0.4;
      tilt.current.rotation.x += (tx - tilt.current.rotation.x) * 0.06;
      tilt.current.rotation.y += (ty - tilt.current.rotation.y) * 0.06;
    }
    // record spins only while playing
    if (spin.current && playing && !reduce) {
      spin.current.rotation.z -= delta * 1.4;
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.04, 96]} />
          <meshStandardMaterial color="#0c0b0a" roughness={0.45} metalness={0.35} />
        </mesh>
        {rings.map((r, i) => (
          <mesh key={i} position={[0, 0, 0.021]}>
            <ringGeometry args={[r - 0.004, r, 96]} />
            <meshBasicMaterial color="#211d19" side={2} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.022]}>
          <circleGeometry args={[0.45, 64]} />
          <meshStandardMaterial color={accent} roughness={0.6} />
        </mesh>
        <mesh position={[0.22, 0.12, 0.024]}>
          <circleGeometry args={[0.04, 24]} />
          <meshBasicMaterial color="#0f0e0d" />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <circleGeometry args={[0.035, 24]} />
          <meshBasicMaterial color="#0f0e0d" />
        </mesh>
      </group>
    </group>
  );
}

export default function Vinyl() {
  const { playing } = useAudio(); // safe: OUTSIDE the Canvas
  return (
    <div className="vinyl">
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1.3} />
        <Record playing={playing} />
      </Canvas>
    </div>
  );
}