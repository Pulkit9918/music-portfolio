// src/components/Cursor.jsx
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip touch devices
    const el = dot.current;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, x = mx, y = my, raf;

    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      x += (mx - x) * 0.2;
      y += (my - y) * 0.2;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();

    // delegation: works on any element, including ones added later
    const SEL = "a, button, .track, .lyric-head, .progress-bar, .mini-disc-wrap, [role='button']";
    const over = (e) => { if (e.target.closest?.(SEL)) el.classList.add("cursor--grow"); };
    const out  = (e) => { if (e.target.closest?.(SEL)) el.classList.remove("cursor--grow"); };
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