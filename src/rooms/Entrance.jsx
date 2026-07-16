// src/rooms/Entrance.jsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playTick } from "../lib/sound";

const NAME = "PULKIT J";

const TAGLINES = [
  "quiet songs about loud feelings",
  "written at 2am, finished before sunrise",
  "one mic, one take, no second guesses",
];

export default function Entrance() {
  const [typed, setTyped] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const type = setInterval(() => {
      i++;
      setTyped(NAME.slice(0, i));
      if (i >= NAME.length) clearInterval(type);
    }, 90);
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { clearInterval(type); clearInterval(timer); };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setLineIdx((i) => (i + 1) % TAGLINES.length), 3200);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <section className="room room--entrance" data-room="entrance">
      <div className="tape-deck">
        <div className="tape-waveform">
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="tape-bar"
              style={{
                animationDelay: `${i * 0.04}s`,
                height: `${8 + Math.sin(i * 0.4) * 6 + Math.random() * 8}px`,
              }}
            />
          ))}
        </div>

        <div className="tape-readout">
          <span className="tape-rec">
            <span className="tape-rec-dot" /> REC
          </span>
          <span className="tape-time">{mm}:{ss}</span>
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