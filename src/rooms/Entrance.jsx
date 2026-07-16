// src/rooms/Entrance.jsx
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playTick } from "../lib/sound";
import { useStore } from "../store/useStore";

const NAME = "PULKIT J";
const BAR_COUNT = 80;

const TAGLINES = [
  "quiet songs about loud feelings",
  "written at 2am, finished before sunrise",
  "one mic, one take, no second guesses",
];

export default function Entrance() {
  const [typed, setTyped] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const barsRef = useRef([]);

  useEffect(() => {
    let i = 0;
    const type = setInterval(() => {
      i++;
      setTyped(NAME.slice(0, i));
      if (i >= NAME.length) clearInterval(type);
    }, 90);
    return () => clearInterval(type);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setLineIdx((i) => (i + 1) % TAGLINES.length), 3200);
    return () => clearInterval(id);
  }, []);

  // waveform bars: idle breathing, or real audio-reactive once a track plays
  useEffect(() => {
    let raf;
    let buf = null;
    const t0 = performance.now();

    const tick = () => {
      const { analyser, playing } = useStore.getState();
      const elapsed = (performance.now() - t0) / 1000;

      if (analyser && playing) {
        if (!buf || buf.length !== analyser.frequencyBinCount) buf = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buf);
        barsRef.current.forEach((el, i) => {
          if (!el) return;
          const idx = Math.floor((i / BAR_COUNT) * buf.length * 0.6);
          const v = buf[idx] / 255;
          el.style.height = `${8 + v * 52}px`;
        });
      } else {
        barsRef.current.forEach((el, i) => {
          if (!el) return;
          const v = 8 + Math.sin(elapsed * 0.8 + i * 0.4) * 6;
          el.style.height = `${v}px`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="room room--entrance" data-room="entrance">
      <div className="tape-deck">
        <div className="tape-waveform">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <span key={i} ref={(el) => (barsRef.current[i] = el)} className="tape-bar" />
          ))}
        </div>

        <h1 className="tape-title">
          {typed}
          <span className="tape-cursor">|</span>
        </h1>

        <div className="tape-tagline-wrap">
          <AnimatePresence mode="wait">
            <motion.p
              key={lineIdx}
              className="tape-tagline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {TAGLINES[lineIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.span
          className="tape-cta"
          onMouseEnter={playTick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          play the tape →
        </motion.span>
      </div>
    </section>
  );
}