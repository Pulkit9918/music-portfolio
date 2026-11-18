import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";

const hex = (h) => {
  const n = parseInt(h.replace("#", "").trim(), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export default function Visualizer({ mode = "bars", count = 56, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const c1 = hex(css.getPropertyValue("--accent") || "#0099ff");
    const c2 = hex(css.getPropertyValue("--accent-2") || "#7c5cff");
    const mix = (t) => `rgb(${c1.map((v, i) => Math.round(v + (c2[i] - v) * t)).join(",")})`;
    let w = 0, h = 0, raf, buf = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const t0 = performance.now();
    // s = 0 (centre / bass) ... 1 (edges / treble)
    const level = (s, i, data, t) => {
      if (data) return Math.min(1, (data[Math.min(data.length - 1, Math.floor(s * data.length * 0.7))] / 255) * 1.1);
      return 0.1 + 0.07 * (Math.sin(t * 1.3 + i * 0.5) + 1);
    };

    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const { analyser, playing } = useStore.getState();
      let data = null;
      if (analyser && playing) {
        if (!buf || buf.length !== analyser.frequencyBinCount) buf = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buf);
        data = buf;
      }
      ctx.clearRect(0, 0, w, h);
      const idle = "rgba(255,255,255,0.28)";

      if (mode === "bars") {
        const gap = 3;
        const bw = Math.max(2, (w - gap * (count - 1)) / count);
        for (let i = 0; i < count; i++) {
          const s = Math.abs(i - (count - 1) / 2) / ((count - 1) / 2);
          const bh = Math.max(3, level(s, i, data, t) * h * 0.92);
          ctx.fillStyle = data ? mix(i / (count - 1)) : idle;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(i * (bw + gap), (h - bh) / 2, bw, bh, bw / 2);
          else ctx.rect(i * (bw + gap), (h - bh) / 2, bw, bh);
          ctx.fill();
        }
      } else {
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2;
        const inner = 0.74; // vinyl radius as a fraction of the canvas radius
        const r0 = R * inner + 6, maxLen = R * (1 - inner) * 0.9;
        ctx.lineWidth = Math.max(2, ((2 * Math.PI * r0) / count) * 0.42);
        ctx.lineCap = "round";
        for (let i = 0; i < count; i++) {
          const s = i < count / 2 ? i / (count / 2) : (count - i) / (count / 2);
          const len = Math.max(2, level(s, i, data, t) * maxLen);
          const a = (i / count) * Math.PI * 2 - Math.PI / 2;
          ctx.strokeStyle = data ? mix(s) : idle;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
          ctx.lineTo(cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len));
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [mode, count]);

  return <canvas ref={ref} className={`viz viz--${mode} ${className}`} aria-hidden="true" />;
}