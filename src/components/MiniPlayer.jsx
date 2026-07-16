// src/components/MiniPlayer.jsx
// add FiX to the import
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiX } from "react-icons/fi";
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
  const setCurrentTrack = useStore((s) => s.setCurrentTrack);

  if (!currentTrack) return null;

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  function handleSeek(e) {
    if (!duration || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    window.__audioSeek?.(fraction);
  }

  function handleClose() {
    setPlaying(false);
    setCurrentTrack(null);
  }

  return (
    <div className="player-bar">
      <div className={`player-disc ${playing ? "spin" : ""}`} />

      <div className="player-main">
        <div className="player-meta">
          <span className="player-title">{currentTrack.title}</span>
          <span className="player-time">{fmt(time)} / {fmt(duration)}</span>
        </div>
        <div className="player-scrub" onClick={handleSeek}>
          <div className="player-scrub-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="player-controls">
        <button type="button" className="player-btn" onClick={() => prev?.()}>
          <FiSkipBack size={15} />
        </button>
        <button type="button" className="player-btn player-btn--main" onClick={() => setPlaying(!playing)}>
          {playing ? <FiPause size={16} /> : <FiPlay size={16} style={{ marginLeft: 1 }} />}
        </button>
        <button type="button" className="player-btn" onClick={() => next?.()}>
          <FiSkipForward size={15} />
        </button>
      </div>

      <button type="button" className="player-close" onClick={handleClose} aria-label="Close player">
        <FiX size={14} />
      </button>
    </div>
  );
}