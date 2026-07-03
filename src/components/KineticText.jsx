// src/components/KineticText.jsx
import { useRef, useEffect } from "react";
import { useAudio } from "../context/AudioProvider";

export default function KineticText({ text = "PULKIT J" }) {
  const { analyser, playing } = useAudio();
  const letters = useRef([]);
  const buf = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const loop = () => {
      const live = analyser && playing && !reduce;
      if (live) {
        if (!buf.current || buf.current.length !== analyser.frequencyBinCount)
          buf.current = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buf.current);
      }
      const n = letters.current.length;
      letters.current.forEach((el, i) => {
        if (!el) return;
        let v = 0;
        if (live && buf.current) {
          const idx = Math.floor((i / n) * buf.current.length * 0.6);
          v = buf.current[idx] / 255;
        }
        el.style.transform = `translateY(${-v * 20}px) scaleY(${1 + v * 0.45})`;
        el.style.color = v > 0.5 ? "var(--accent)" : "";
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [analyser, playing]);

  return (
    <div className="kinetic" aria-hidden="true">
      {text.split("").map((c, i) => (
        <span key={i} ref={(el) => (letters.current[i] = el)} className="kinetic-letter">
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </div>
  );
}