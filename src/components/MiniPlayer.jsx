// src/components/MiniPlayer.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlay, FiPause, FiChevronUp, FiChevronDown, FiSkipBack, FiSkipForward } from "react-icons/fi";
import { useStore } from "../store/useStore";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

export default function MiniPlayer() {
  const currentTrack = useStore((s) => s.currentTrack);
  const playing = useStore((s) => s.playing);
  const setPlaying = useStore((s) => s.setPlaying);
  const time = useStore((s) => s.time);
  const duration = useStore((s) => s.duration);
  const next = useStore((s) => s.next);
  const prev = useStore((s) => s.prev);
  const [expanded, setExpanded] = useState(false);

  const pct = duration ? (time / duration) * 100 : 0;

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    window.__audioSeek?.(fraction);
  };

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          className="orb-player"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="orb-row">
            <button className={`orb-disc ${playing ? "spin" : ""}`} onClick={() => setPlaying(!playing)}>
              {playing ? <FiPause size={14} /> : <FiPlay size={14} style={{ marginLeft: 1 }} />}
            </button>

            <button className="orb-meta" onClick={() => setExpanded((e) => !e)}>
              <span className="orb-title">{currentTrack.title}</span>
              <span className="orb-sub">{currentTrack.release || "now playing"}</span>
              {expanded ? <FiChevronDown className="orb-chevron" /> : <FiChevronUp className="orb-chevron" />}
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                className="orb-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="orb-progress" onClick={seek}>
                  <div className="orb-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="orb-times">
                  <span>{fmt(time)}</span>
                  <span>{fmt(duration)}</span>
                </div>
                <div className="orb-controls">
                  <button className="orb-btn" onClick={prev}><FiSkipBack size={15} /></button>
                  <button className="orb-btn orb-btn--main" onClick={() => setPlaying(!playing)}>
                    {playing ? <FiPause size={16} /> : <FiPlay size={16} style={{ marginLeft: 1 }} />}
                  </button>
                  <button className="orb-btn" onClick={next}><FiSkipForward size={15} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}