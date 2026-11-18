import { motion } from "framer-motion";
import { FiPlay } from "react-icons/fi";
import { useStore } from "../store/useStore";
import { tracks } from "../data/releases";
import { goToRoom } from "../lib/goToRoom";
import { playTick } from "../lib/sound";

const LINKS = [
  { key: "music", label: "Music" },
  { key: "lyrics", label: "Lyrics" },
  { key: "story", label: "About" },
  { key: "contact", label: "Contact" },
];

export default function Nav() {
  const currentRoom = useStore((s) => s.currentRoom);
  const currentTrack = useStore((s) => s.currentTrack);
  const playing = useStore((s) => s.playing);
  const setPlaying = useStore((s) => s.setPlaying);
  const setCurrentTrack = useStore((s) => s.setCurrentTrack);

  const togglePlay = () => {
    if (!currentTrack) {
      if (!tracks.length) return;
      setCurrentTrack(tracks[0]);
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
    playTick();
  };

  return (
    <nav className="nav" aria-label="Main">
      <button type="button" className="nav-brand" onClick={() => goToRoom("entrance")}>
        <span className="nav-dot" />
        <span>PULKIT J</span>
      </button>

      <div className="nav-links">
        {LINKS.map((l) => {
          const active = currentRoom === l.key;
          return (
            <button key={l.key} type="button" className={`nav-link ${active ? "active" : ""}`} onClick={() => goToRoom(l.key)}>
              {active && <motion.span layoutId="nav-active" className="nav-active" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="nav-label">{l.label}</span>
            </button>
          );
        })}
      </div>

      <button type="button" className="nav-play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
        {playing ? (
          <span className="eq"><i /><i /><i /><i /></span>
        ) : (
          <FiPlay size={16} style={{ marginLeft: 2 }} />
        )}
      </button>
    </nav>
  );
}