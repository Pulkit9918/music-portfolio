// src/components/Loader.jsx
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const NODE_COUNT = 60;

export default function Loader({ onComplete }) {
  const canvasRef = useRef(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#d4a24e";
    const accent2 = getComputedStyle(document.documentElement).getPropertyValue("--accent-2").trim() || "#8c5a3c";

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 0.2 + Math.random() * 0.9,
      z: Math.random(),
      isNote: Math.random() > 0.7,
    }));

    let raf;
    const tick = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const cx = w / 2, cy = h / 2;

      ctx.fillStyle = "rgba(28,20,16,0.4)";
      ctx.fillRect(0, 0, w, h);

      // gentle constant idle drift — no beat, no dive, no acceleration
      const speed = 0.004;

      ctx.beginPath();
      nodes.forEach((n) => {
        n.z -= speed;
        if (n.z <= 0) n.z = 1;
        const scale = 1 / n.z;
        const px = cx + Math.cos(n.angle) * n.radius * scale * (w * 0.4);
        const py = cy + Math.sin(n.angle) * n.radius * scale * (h * 0.4);
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) return;
        const size = Math.max(0.5, (1 - n.z) * (n.isNote ? 4.5 : 2.5));
        ctx.moveTo(px + size, py);
        ctx.arc(px, py, size, 0, Math.PI * 2);
      });
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fillStyle = accent2;
      ctx.globalAlpha = 0.18;
      ctx.fill();
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const enter = () => {
    setFading(true);
    setTimeout(onComplete, 800);
  };

  return (
    <motion.div
      className="loader"
      animate={fading ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <canvas ref={canvasRef} className="loader-canvas" />
      <div className="loader-overlay">
        <span className="loader-name">YOUR NAME</span>
        {!fading && (
          <button className="loader-dive-btn" onClick={enter}>
            step into the mind
          </button>
        )}
      </div>
    </motion.div>
  );
}