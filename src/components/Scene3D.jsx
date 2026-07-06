// src/components/Scene3D.jsx
import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useAudio } from "../context/AudioProvider";
import { lyrics } from "../data/lyrics";

const NOTES = ["♪", "♫", "♩", "♬"];

function extractFragments() {
  const words = lyrics.flatMap((l) => l.text.split("\n")).flatMap((line) => line.trim().split(" "));
  const fragments = [];
  for (let i = 0; i < words.length - 2 && fragments.length < 12; i += 3) {
    const chunk = words.slice(i, i + (Math.random() > 0.5 ? 2 : 3)).join(" ");
    if (chunk.length > 3 && chunk.length < 26) fragments.push({ type: "text", value: chunk });
  }
  if (!fragments.length) ["quiet songs", "loud feelings", "slow morning", "paper walls"].forEach((v) => fragments.push({ type: "text", value: v }));
  const withNotes = [];
  fragments.forEach((f, i) => {
    withNotes.push(f);
    if (i % 2 === 1) withNotes.push({ type: "note", value: NOTES[i % NOTES.length] });
  });
  return withNotes;
}

export default function Scene3D() {
  const { playing } = useAudio();
  const [reduce, setReduce] = useState(false);
  const fragments = useMemo(() => extractFragments(), []);
  const fieldRef = useRef(null);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reduce) return;
    const onMove = (e) => {
      if (!fieldRef.current) return;
      const px = (e.clientX / window.innerWidth - 0.5) * 2;
      const py = (e.clientY / window.innerHeight - 0.5) * 2;
      fieldRef.current.style.transform = `rotateY(${px * 4}deg) rotateX(${-py * 4}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  const layout = useMemo(
    () =>
      fragments.map((f, i) => {
        const cols = 4, rows = Math.ceil(fragments.length / cols);
        const col = i % cols, row = Math.floor(i / cols);
        const baseTop = (row / rows) * 85 + 5;
        const baseLeft = (col / cols) * 85 + 5;
        const jitterT = ((i * 29) % 20) - 10;
        const jitterL = ((i * 41) % 20) - 10;
        const z = -260 + ((i * 71) % 460); // depth range, no blur — just size/opacity change
        const depthT = (z + 260) / 460; // 0 far .. 1 near
        return {
          top: `${Math.min(92, Math.max(3, baseTop + jitterT))}%`,
          left: `${Math.min(90, Math.max(2, baseLeft + jitterL))}%`,
          z,
          scale: 0.75 + depthT * 0.55,
          size: f.type === "note" ? 1.7 : 1,
          rotate: ((i * 17) % 14) - 7,
          dur: 30 + (i % 5) * 8,
          delay: (i % 7) * 1.4,
          drift: 16 + (i % 4) * 8,
          maxOpacity: (f.type === "note" ? 0.34 : 0.28) * (0.6 + depthT * 0.6),
        };
      }),
    [fragments]
  );

  return (
    <div className="scene3d" aria-hidden="true">
      <div className="scene3d-field" ref={fieldRef}>
        {fragments.map((f, i) => {
          const l = layout[i];
          return (
            <motion.span
              key={i}
              className={`fragment ${f.type === "note" ? "fragment--note" : ""} ${playing ? "fragment--live" : ""}`}
              style={{
                top: l.top,
                left: l.left,
                fontSize: `${l.size}rem`,
                transform: `translateZ(${l.z}px) scale(${l.scale}) rotate(${l.rotate}deg)`,
              }}
              animate={
                reduce
                  ? {}
                  : {
                      y: [0, -l.drift, 0],
                      x: [0, l.drift * 0.3, 0],
                      opacity: [l.maxOpacity * 0.5, playing ? l.maxOpacity * 1.4 : l.maxOpacity, l.maxOpacity * 0.5],
                    }
              }
              transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              {f.value}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}