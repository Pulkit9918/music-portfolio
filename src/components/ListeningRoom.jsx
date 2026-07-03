// src/components/ListeningRoom.jsx
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiPlay, FiPause } from "react-icons/fi";
import { useAudio } from "../context/AudioProvider";
import { lyrics } from "../data/lyrics";

export default function ListeningRoom() {
  const { room, setRoom, track, time, dur, playing, toggle } = useAudio();
  const words = lyrics.find((l) => l.title === track.title);
  const lines = words ? words.text.split("\n").filter((l) => l.trim()) : [];
  const idx = lines.length && dur
    ? Math.min(lines.length - 1, Math.floor((time / dur) * lines.length))
    : 0;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setRoom(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setRoom]);

  return (
    <AnimatePresence>
      {room && (
        <motion.div className="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <button className="room-close" onClick={() => setRoom(false)} aria-label="Exit"><FiX size={26} /></button>

          <div className="room-stage">
            <motion.div
              className="room-scroll"
              animate={{ y: -idx * 72 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {lines.length ? (
                lines.map((line, i) => (
                  <motion.p
                    key={i}
                    className={`room-line ${i === idx ? "active" : ""}`}
                    animate={{
                      opacity: i === idx ? 1 : Math.abs(i - idx) === 1 ? 0.3 : 0.1,
                      filter: i === idx ? "blur(0px)" : "blur(1.5px)",
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {line}
                  </motion.p>
                ))
              ) : (
                <p className="room-line active">Lyrics for this track coming soon.</p>
              )}
            </motion.div>
          </div>

          <div className="room-foot">
            <span className="room-track">{track.title} — {track.note}</span>
            <button className="room-toggle" onClick={toggle}>
              {playing ? <FiPause size={18} /> : <FiPlay size={18} style={{ marginLeft: 2 }} />}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}