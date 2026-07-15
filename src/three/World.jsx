// src/three/World.jsx
import { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import AlbumPlane from "./AlbumPlane";
import { useStore } from "../store/useStore";
import { lyrics } from "../data/lyrics";

const ROOM_MOODS = {
  entrance: { fog: "#10121c", fogNear: 5, fogFar: 24, light: "#6ee7d4", cluster: "#6ee7d4" },
  music: { fog: "#151a2e", fogNear: 4, fogFar: 20, light: "#8b7fd6", cluster: "#8b7fd6" },
  lyrics: { fog: "#12182a", fogNear: 4, fogFar: 20, light: "#5fb3d9", cluster: "#5fb3d9" },
  story: { fog: "#181430", fogNear: 5, fogFar: 22, light: "#b48ee0", cluster: "#b48ee0" },
  contact: { fog: "#0f1420", fogNear: 6, fogFar: 26, light: "#6ee7d4", cluster: "#6ee7d4" },
};

const ROOM_X = { entrance: 0, music: 8, lyrics: 16, story: 24, contact: 32 };

function Atmosphere() {
  const { scene } = useThree();
  useEffect(() => {
    let raf;
    const light = new THREE.DirectionalLight("#ff8c42", 1.4);
    light.position.set(3, 4, 3);
    scene.add(light);
    if (!scene.fog) scene.fog = new THREE.Fog("#2a2e38", 5, 24);
    const current = new THREE.Color("#2a2e38");
    const currentLight = new THREE.Color("#ff8c42");
    const tick = () => {
      const room = useStore.getState().currentRoom;
      const mood = ROOM_MOODS[room] || ROOM_MOODS.entrance;
      current.lerp(new THREE.Color(mood.fog), 0.03);
      scene.fog.color.copy(current);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, mood.fogNear, 0.03);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, mood.fogFar, 0.03);
      currentLight.lerp(new THREE.Color(mood.light), 0.03);
      light.color.copy(currentLight);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); scene.remove(light); };
  }, [scene]);
  return null;
}

function makeThoughtSprite(text, color = "#f2efe8") {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.font = "italic 44px Georgia, serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.28, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.4, 0.6, 1);
  return sprite;
}

function NeuralField() {
  const { scene } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const group = new THREE.Group();
    const NODE_COUNT = 100; // denser, so clusters visually connect across rooms
    const nodes = [];

    // Musical geometries: torus reads as a "note loop", octahedron as a shard/chime,
    // ring as a cymbal/halo, icosahedron as a plain thought-node
    const noteGeo = new THREE.TorusGeometry(0.07, 0.022, 8, 16);
    const chimeGeo = new THREE.OctahedronGeometry(0.06, 0);
    const haloGeo = new THREE.RingGeometry(0.07, 0.09, 20);
    const nodeGeo = new THREE.IcosahedronGeometry(0.05, 0);
    const geometries = [noteGeo, chimeGeo, haloGeo, nodeGeo];

    const rooms = Object.keys(ROOM_X);
    for (let i = 0; i < NODE_COUNT; i++) {
      const room = rooms[i % rooms.length];
      const baseX = ROOM_X[room];
      const geo = geometries[i % geometries.length];
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(ROOM_MOODS[room].cluster),
        emissive: new THREE.Color(ROOM_MOODS[room].cluster),
        emissiveIntensity: 0.55,
        roughness: 0.3,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(baseX + (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 10);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const baseScale = 0.9 + Math.random() * 0.7;
      mesh.scale.setScalar(baseScale);
      group.add(mesh);
      nodes.push({ mesh, spin: (Math.random() - 0.5) * 0.4, bob: Math.random() * Math.PI * 2, speed: 0.2 + Math.random() * 0.3, baseScale, baseEmissive: 0.55 });
    }

    // Real lyric fragments pulled straight from data/lyrics.js
    const words = lyrics.flatMap((l) => l.text.split("\n")).flatMap((l) => l.trim().split(" "));
    const thoughtTexts = [];
    for (let i = 0; i < words.length - 2 && thoughtTexts.length < 10; i += 3) {
      const chunk = words.slice(i, i + 3).join(" ");
      if (chunk.length > 4 && chunk.length < 22) thoughtTexts.push(chunk);
    }
    if (!thoughtTexts.length) thoughtTexts.push("quiet songs", "loud feelings", "slow morning");
    thoughtTexts.forEach((text, i) => {
      const sprite = makeThoughtSprite(text);
      sprite.position.set(4 + i * 3.2, (Math.random() - 0.5) * 6, -6 - (Math.random() * 4)); // pushed back in Z
      group.add(sprite);
      nodes.push({ mesh: sprite, bob: Math.random() * Math.PI * 2, speed: 0.15, isThought: true });
    });

    scene.add(group);

    const lineGeo = new THREE.BufferGeometry();
    const maxLines = NODE_COUNT * 2;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: "#ff8c42", transparent: true, opacity: 0.12 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const sparkGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: "#ffd27a", transparent: true, opacity: 0 });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    scene.add(spark);
    let lastScrollProgress = 0;
    let sparkLife = 0;

    let raf;
    const clock = new THREE.Clock();
    let audioBuf = null;

    const tick = () => {
      const t = clock.getElapsedTime();
      const { analyser, playing, scrollProgress } = useStore.getState();

      let amp = 0;
      if (analyser && playing) {
        if (!audioBuf || audioBuf.length !== analyser.frequencyBinCount) audioBuf = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(audioBuf);
        let sum = 0;
        for (let i = 0; i < audioBuf.length; i++) sum += audioBuf[i];
        amp = sum / audioBuf.length / 255;
      }

      nodes.forEach((n) => {
        n.mesh.position.y += Math.sin(t * n.speed + n.bob) * 0.0015;
        if (!n.isThought) {
          n.mesh.rotation.x += (n.spin || 0.2) * 0.01;
          n.mesh.rotation.y += (n.spin || 0.2) * 0.015;
          const pulse = 1 + amp * 0.6;
          n.mesh.scale.setScalar(n.baseScale * pulse);
          n.mesh.material.emissiveIntensity = n.baseEmissive + amp * 1.2;
        }
      });
      lineMat.opacity = 0.1 + amp * 0.35;

      group.rotation.y += (mouse.current.x * 0.15 - group.rotation.y) * 0.02;
      group.rotation.x += (-mouse.current.y * 0.1 - group.rotation.x) * 0.02;

      let idx = 0;
      const geomNodes = nodes.filter((n) => !n.isThought);
      geomNodes.forEach((n, i) => {
        let nearest = null, nearestDist = Infinity;
        geomNodes.forEach((m, j) => {
          if (i === j) return;
          const d = n.mesh.position.distanceTo(m.mesh.position);
          if (d < nearestDist) { nearestDist = d; nearest = m; }
        });
        if (nearest && nearestDist < 3.5 && idx < maxLines) {
          const a = n.mesh.position, b = nearest.mesh.position;
          linePositions[idx * 6] = a.x; linePositions[idx * 6 + 1] = a.y; linePositions[idx * 6 + 2] = a.z;
          linePositions[idx * 6 + 3] = b.x; linePositions[idx * 6 + 4] = b.y; linePositions[idx * 6 + 5] = b.z;
          idx++;
        }
      });
      for (let k = idx; k < maxLines; k++) {
        linePositions[k * 6] = 0; linePositions[k * 6 + 1] = 0; linePositions[k * 6 + 2] = 0;
        linePositions[k * 6 + 3] = 0; linePositions[k * 6 + 4] = 0; linePositions[k * 6 + 5] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;

      const delta = Math.abs(scrollProgress - lastScrollProgress);
      if (delta > 0.0005) {
        sparkLife = 1;
        const x = scrollProgress * 32;
        spark.position.set(x + 2, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2);
      }
      lastScrollProgress = scrollProgress;
      sparkLife = Math.max(0, sparkLife - 0.02);
      sparkMat.opacity = sparkLife * 0.8;

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      scene.remove(group); scene.remove(lines); scene.remove(spark);
      noteGeo.dispose(); chimeGeo.dispose(); haloGeo.dispose(); nodeGeo.dispose();
      lineGeo.dispose(); lineMat.dispose();
      sparkGeo.dispose(); sparkMat.dispose();
      nodes.forEach((n) => n.mesh.material && n.mesh.material.dispose());
    };
  }, [scene]);

  return null;
}

export default function World() {
  return (
    <div className="world-canvas">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: false, antialias: true }}>
        <color attach="background" args={["#10121c"]} />
        <ambientLight intensity={0.5} />
        <Atmosphere />
        <NeuralField />
        <CameraRig />
        <AlbumPlane />
        <EffectComposer>
          <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3} />
          <Bloom intensity={0.6} luminanceThreshold={0.25} luminanceSmoothing={0.4} mipmapBlur />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}