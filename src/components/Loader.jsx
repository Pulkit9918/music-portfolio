// src/components/Loader.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }) {
  const [locked, setLocked] = useState(false);
  const [freq, setFreq] = useState(88.0);
  const raf = useRef();

  useEffect(() => {
    if (locked) return;
    let f = 88.0;
    const tick = () => {
      f += 0.15;
      if (f > 108) f = 88;
      setFreq(f);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [locked]);

  const lock = () => {
    cancelAnimationFrame(raf.current);
    setFreq(99.7);
    setLocked(true);
    setTimeout(onComplete, 1500);
  };

  return (
    <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="tuner">
        <span className="tuner-freq">{freq.toFixed(1)}</span>
        <span className="tuner-unit">FM</span>
        <div className="tuner-bar">
          <div className="tuner-needle" style={{ left: `${((freq - 88) / 20) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait">
          {!locked ? (
            <motion.button key="tune" className="tuner-btn" onClick={lock} exit={{ opacity: 0 }}>
              tune in
            </motion.button>
          ) : (
            <motion.span key="on-air" className="tuner-on-air" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              PULKIT J — on air
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}