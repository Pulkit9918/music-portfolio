// src/components/Loader.jsx
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const NODE_COUNT = 60;

// Draw a real note shape with canvas paths — no font glyph dependency, renders identically everywhere
function drawNote(ctx, size, color) {
  ctx.fillStyle = color;
  // notehead
  ctx.beginPath();
  ctx.ellipse(-size * 0.15, size * 0.32, size * 0.22, size * 0.16, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // stem
  ctx.fillRect(size * 0.05, -size * 0.4, size * 0.06, size * 0.72);
  // flag
  ctx.beginPath();
  ctx.moveTo(size * 0.11, -size * 0.4);
  ctx.quadraticCurveTo(size * 0.45, -size * 0.3, size * 0.35, size * 0.02);
  ctx.quadraticCurveTo(size * 0.25, -size * 0.12, size * 0.11, -size * 0.08);
  ctx.closePath();
  ctx.fill();
}

function makeNoteSprite(color) {
  const size = 40;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const cctx = c.getContext("2d");
  cctx.translate(size / 2, size / 2);
  drawNote(cctx, size * 0.8, color);
  return c;
}

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
    const noteSprite = makeNoteSprite(accent2);

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 0.2 + Math.random() * 0.9,
      z: Math.random(),
      isNote: Math.random() > 0.65, // ~35% notes now, more visibly present
      spin: (Math.random() - 0.5) * 0.02,
      rotation: Math.random() * Math.PI * 2,
    }));

    let raf;
    const tick = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const cx = w / 2, cy = h / 2;

      ctx.fillStyle = "rgba(28,20,16,0.4)";
      ctx.fillRect(0, 0, w, h);

      const speed = 0.004;

      ctx.beginPath();
      nodes.forEach((n) => {
        n.z -= speed;
        if (n.z <= 0) n.z = 1;
        if (n.isNote) return;
        const scale = 1 / n.z;
        const px = cx + Math.cos(n.angle) * n.radius * scale * (w * 0.4);
        const py = cy + Math.sin(n.angle) * n.radius * scale * (h * 0.4);
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) return;
        const size = Math.max(0.5, (1 - n.z) * 2.5);
        ctx.moveTo(px + size, py);
        ctx.arc(px, py, size, 0, Math.PI * 2);
      });
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      nodes.forEach((n) => {
        if (!n.isNote) return;
        n.rotation += n.spin;
        const scale = 1 / n.z;
        const px = cx + Math.cos(n.angle) * n.radius * scale * (w * 0.4);
        const py = cy + Math.sin(n.angle) * n.radius * scale * (h * 0.4);
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) return;
        const size = Math.max(6, (1 - n.z) * 28);
        ctx.save();
        ctx.globalAlpha = Math.min(1, (1 - n.z) * 1.3);
        ctx.translate(px, py);
        ctx.rotate(n.rotation);
        ctx.drawImage(noteSprite, -size / 2, -size / 2, size, size);
        ctx.restore();
      });

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
        <div className="loader-core" />
        <span className="loader-label">a mind full of half-finished songs</span>
        <span className="loader-sublabel">waiting for the right moment</span>
        {!fading && (
          <button type="button" className="loader-dive-btn" onClick={enter}>
            step inside
          </button>
        )}
      </div>
    </motion.div>
  );
}