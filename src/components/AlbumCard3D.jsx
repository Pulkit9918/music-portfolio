// src/components/AlbumCard3D.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AlbumCard3D({ image = "/images/hero.jpg" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = containerRef.current;
    const w = container.clientWidth, h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    const accentHex = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#e8783f";

    // key light + soft rim light for a "product shot" feel
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2, 3, 3);
    scene.add(key);
    const rim = new THREE.PointLight(accentHex, 2.2, 12);
    rim.position.set(-2, -1, 1.5);
    scene.add(rim);

    // the card
    const loader = new THREE.TextureLoader();
    const geo = new THREE.PlaneGeometry(1.7, 1.7, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x2b2822, roughness: 0.5, metalness: 0.1 });
    const card = new THREE.Mesh(geo, mat);
    scene.add(card);

    loader.load(
      image,
      (tex) => { mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true; },
      undefined,
      () => { /* keep the fallback color card if the image 404s */ }
    );

    // thin glowing edge behind the card
    const edgeGeo = new THREE.PlaneGeometry(1.82, 1.82);
    const edgeMat = new THREE.MeshBasicMaterial({ color: accentHex, transparent: true, opacity: 0.35 });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.z = -0.02;
    scene.add(edge);

    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      const w2 = container.clientWidth, h2 = container.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();

      if (!reduce) {
        card.position.y = Math.sin(t * 0.5) * 0.08;
        card.rotation.y = Math.sin(t * 0.3) * 0.08;   // slow, self-driven sway, not mouse-driven
        edge.position.y = card.position.y;
        edge.rotation.y = card.rotation.y;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose(); mat.dispose(); edgeGeo.dispose(); edgeMat.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [image]);

  return <div className="album-card-3d" ref={containerRef} />;
}