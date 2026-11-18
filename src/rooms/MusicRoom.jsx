import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlay, FiPause } from "react-icons/fi";
import Visualizer from "../components/Visualizer";
import SplitReveal from "../components/SplitReveal";
import { releases } from "../data/releases";
import { playTick } from "../lib/sound";
import { useStore } from "../store/useStore";

const FALLBACK_COVER = "/images/covers/sleeve-art.jpg";
const pad = (n) => String(n).padStart(2, "0");

export default function MusicRoom() {
  const [sel, setSel] = useState(0);
  const release = releases[sel];

  const currentTrack = useStore((s) => s.currentTrack);
  const playing = useStore((s) => s.playing);
  const time = useStore((s) => s.time);
  const duration = useStore((s) => s.duration);
  const setCurrentTrack = useStore((s) => s.setCurrentTrack);
  const setPlaying = useStore((s) => s.setPlaying);

  const play = (track) => { setCurrentTrack(track); setPlaying(true); playTick(); };
  const inRelease = release.tracks.some((t) => t.src === currentTrack?.src);
  const releasePlaying = playing && inRelease;

  const toggleRelease = () => {
    if (releasePlaying) setPlaying(false);
    else if (inRelease) setPlaying(true);
    else play(release.tracks[0]);
  };

  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    window.__audioSeek?.((e.clientX - r.left) / r.width);
  };

  const progress = duration > 0 ? Math.min(1, time / duration) : 0;

  return (
    <section className="room room--music" data-room="music">
      <span className="watermark" data-parallax="0.22" aria-hidden="true">LISTEN</span>

      <div className="room-wrap">
        <div className="room-head">
          <span className="label"><b>01</b> — Music</span>
          <h2 className="h-display">
            <SplitReveal text="Selected" /> <SplitReveal text="works" delay={0.1} className="grad" /><span className="accent">.</span>
          </h2>

          {releases.length > 1 && (
            <div className="release-tabs" role="tablist" aria-label="Releases">
              {releases.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={i === sel}
                  className={`release-tab ${i === sel ? "active" : ""}`}
                  onClick={() => { setSel(i); playTick(); }}
                >
                  {i === sel && <motion.span layoutId="release-active" className="release-active" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="release-tab-label">{r.title}</span>
                  <em className="release-tab-type">{r.type}</em>
                </button>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={release.id}
            className="music-grid"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="tilt">
              <div className="card spot cover-card" data-cursor={releasePlaying ? "Pause" : "Play"} onClick={toggleRelease}>
                <img
                  src={release.cover}
                  alt={`${release.title} cover art`}
                  onError={(e) => { if (!e.currentTarget.src.endsWith(FALLBACK_COVER)) e.currentTarget.src = FALLBACK_COVER; }}
                />
                <div className="cover-shade" />
                <div className="cover-top"><span className="chip">{release.type} · {release.year}</span></div>
                <div className="cover-bottom">
                  <h3 className="cover-title">{release.title}</h3>
                  <span className="play-fab" aria-hidden="true">
                    {releasePlaying ? <FiPause size={24} /> : <FiPlay size={24} style={{ marginLeft: 3 }} />}
                  </span>
                </div>
              </div>
            </div>

            <div className="card spot tracks-card">
              {release.tracks.map((t, i) => {
                const active = currentTrack?.src === t.src;
                return (
                  <button key={t.src} type="button" className={`track-row ${active ? "active" : ""}`} onClick={() => play(t)} onMouseEnter={playTick}>
                    <span className="track-index">{pad(i + 1)}</span>
                    <span className="track-name">{t.title}</span>
                    {active ? (
                      <span className={`eq ${playing ? "" : "paused"}`}><i /><i /><i /><i /></span>
                    ) : (
                      <span className="track-hint">Play</span>
                    )}
                  </button>
                );
              })}
              <div className="release-meta">
                <span><b>{release.type}</b>Format</span>
                <span><b>{release.year}</b>Year</span>
                <span><b>{pad(release.tracks.length)}</b>{release.tracks.length === 1 ? "Track" : "Tracks"}</span>
              </div>
            </div>

            <div className="card viz-card" data-cursor="Seek" onClick={seek}>
              <Visualizer mode="bars" count={80} />
              {inRelease && duration > 0 && <span className="playhead" style={{ left: `calc(22px + (100% - 44px) * ${progress})` }} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}