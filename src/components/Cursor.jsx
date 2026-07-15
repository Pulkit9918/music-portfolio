// src/components/Cursor.jsx
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = dot.current;
    let mx = 0, my = 0, x = 0, y = 0, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      x += (mx - x) * 0.2; y += (my - y) * 0.2;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();
    const SEL = "a, button, .room-track, .room-card";
    const over = (e) => { if (e.target.closest?.(SEL)) el.classList.add("cursor--grow"); };
    const out = (e) => { if (e.target.closest?.(SEL)) el.classList.remove("cursor--grow"); };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);
  return <div className="cursor" ref={dot} aria-hidden="true" />;
}