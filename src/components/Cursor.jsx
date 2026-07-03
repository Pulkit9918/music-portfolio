// src/components/Cursor.jsx
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip touch
    const el = dot.current;
    let mx = 0, my = 0, x = 0, y = 0, raf;

    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      x += (mx - x) * 0.2;
      y += (my - y) * 0.2;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();

    const grow = () => el.classList.add("cursor--grow");
    const shrink = () => el.classList.remove("cursor--grow");
    const targets = document.querySelectorAll(
      "a, button, .track, .lyric-head, .progress-bar"
    );
    targets.forEach((t) => {
      t.addEventListener("mouseenter", grow);
      t.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      targets.forEach((t) => {
        t.removeEventListener("mouseenter", grow);
        t.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return <div className="cursor" ref={dot} aria-hidden="true" />;
}