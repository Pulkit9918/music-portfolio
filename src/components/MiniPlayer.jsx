// src/components/MiniPlayer.jsx
import { AnimatePresence, motion } from "framer-motion";
import { FiPlay, FiPause } from "react-icons/fi";
import { useStore } from "../store/useStore";

export default function MiniPlayer() {
  const currentTrack = useStore((s) => s.currentTrack);
  const playing = useStore((s) => s.playing);
  const setPlaying = useStore((s) => s.setPlaying);

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div className="scrub-bar" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ duration: 0.4 }}>
          <button className="scrub-play" onClick={() => setPlaying(!playing)}>
            {playing ? <FiPause size={14} /> : <FiPlay size={14} style={{ marginLeft: 1 }} />}
          </button>
          <span className="scrub-title">{currentTrack.title}</span>
          <div className="scrub-track">
            <div className={`scrub-fill ${playing ? "animating" : ""}`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}