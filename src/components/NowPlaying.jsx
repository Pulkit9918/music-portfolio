// src/components/NowPlaying.jsx
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiPlay, FiPause, FiSkipBack, FiSkipForward } from "react-icons/fi";
import { useAudio } from "../context/AudioProvider";
import { lyrics } from "../data/lyrics";
import Blob from "./Blob";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

export default function NowPlaying() {
  const { open, setOpen, track, playing, time, dur, analyser, toggle, next, prev, seekTo } = useAudio();

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const words = lyrics.find((l) => l.title === track.title);
  const pct = dur ? (time / dur) * 100 : 0;
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    seekTo((e.clientX - r.left) / r.width);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="np" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <button className="np-close" onClick={() => setOpen(false)} aria-label="Close"><FiX size={24} /></button>
          <motion.div
            className="np-inner"
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="np-visual"><Blob analyser={analyser} playing={playing} /></div>
            <div className="np-info">
              <p className="eyebrow">Now Playing</p>
              <h2 className="np-title">{track.title}</h2>
              <p className="np-note">{track.note}</p>
              <div className="np-controls">
                <button onClick={prev} aria-label="Previous"><FiSkipBack size={22} /></button>
                <button className="np-play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
                  {playing ? <FiPause size={24} /> : <FiPlay size={24} style={{ marginLeft: 3 }} />}
                </button>
                <button onClick={next} aria-label="Next"><FiSkipForward size={22} /></button>
              </div>
              <div className="np-progress" onClick={seek}>
                <div className="np-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="np-time"><span>{fmt(time)}</span><span>{fmt(dur)}</span></div>
              <div className="np-lyrics">{words ? words.text : "Lyrics coming soon."}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}