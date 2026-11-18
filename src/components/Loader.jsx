import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BARS = 30;

export default function Loader({ onComplete }) {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t0 = performance.now();
    const dur = 2200;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const enter = () => {
    setLeaving(true);
    setTimeout(onComplete, 1000);
  };

  return (
    <motion.div
      className="loader"
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loader-eq" style={{ "--p": Math.max(0.04, n / 100) }} aria-hidden="true">
        {Array.from({ length: BARS }).map((_, i) => (
          <i key={i} style={{ animationDelay: `${-(i * 0.13).toFixed(2)}s`, animationDuration: `${1.1 + (i % 5) * 0.18}s` }} />
        ))}
      </div>

      <div className="loader-top">
        <span className="label"><b>●</b> Pulkit J — Music</span>
        <span className="label">{n < 100 ? "Tuning up…" : "Ready"}</span>
      </div>

      <div className="loader-bottom">
        <div className="loader-count grad-text">{n}<small>%</small></div>
        {n >= 100 && !leaving && (
          <motion.button
            type="button"
            className="btn btn--accent"
            data-cursor="Go"
            onClick={enter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Enter
          </motion.button>
        )}
        <p className="loader-sub">a mind full of half-finished songs</p>
      </div>
    </motion.div>
  );
}