// src/components/Scene3D.jsx
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const reduce =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });
}

function Particles() {
  const ref = useRef();
  const count = 700;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 16;
      a[i * 3 + 1] = (Math.random() - 0.5) * 16;
      a[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    return a;
  }, []);
  const accent =
    getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c97b4a";

  useFrame((state) => {
    if (reduce || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.018 + pointer.x * 0.12;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.04 + pointer.y * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={accent} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function ScrollRig() {
  const { camera } = useThree();
  useFrame(() => {
    const y = window.scrollY / window.innerHeight;
    camera.position.y = -y * 0.6;
    camera.lookAt(0, camera.position.y, 0);
  });
  return null;
}

export default function Scene3D() {
  return (
    <div className="scene3d">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <Particles />
        <ScrollRig />
        {!reduce && (
          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.1} luminanceSmoothing={0.4} mipmapBlur />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0006, 0.0006]} />
            <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.4} />
            <Vignette offset={0.28} darkness={0.75} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}