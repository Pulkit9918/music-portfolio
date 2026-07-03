// src/components/MiniPlayer.jsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiMaximize2 } from "react-icons/fi";
import { useAudio } from "../context/AudioProvider";

const R = 26;
const CIRC = 2 * Math.PI * R;

export default function MiniPlayer() {
  const { track, playing, time, dur, started, toggle, next, prev, setOpen } = useAudio();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.9);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pct = dur ? time / dur : 0;

  return (
    <AnimatePresence>
      {started && pastHero && (
        <motion.div
          className="mini"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* disc with progress ring */}
          <div className="mini-disc-wrap">
            <svg className="mini-ring" width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r={R} className="mini-ring-bg" />
              <circle
                cx="30" cy="30" r={R} className="mini-ring-fill"
                style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC * (1 - pct) }}
              />
            </svg>
            <span className={`mini-disc ${playing ? "spin" : ""}`}>
              <img src={track.cover} alt="" onError={(e) => (e.target.style.opacity = 0)} />
            </span>
          </div>

          <div className="mini-meta">
            <span className="mini-title">{track.title}</span>
            <span className="mini-sub">{track.note}</span>
          </div>

          <div className="mini-controls">
            <button className="mini-btn ghost" onClick={prev} aria-label="Previous">
              <FiSkipBack size={16} />
            </button>
            <button className="mini-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <FiPause size={18} /> : <FiPlay size={18} style={{ marginLeft: 2 }} />}
            </button>
            <button className="mini-btn ghost" onClick={next} aria-label="Next">
              <FiSkipForward size={16} />
            </button>
            <button className="mini-btn ghost expand" onClick={() => setOpen(true)} aria-label="Expand player">
              <FiMaximize2 size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}