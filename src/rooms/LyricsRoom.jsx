import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { lyrics } from "../data/lyrics";

export default function LyricsRoom() {
  const [idx, setIdx] = useState(0);
  const [tab, setTab] = useState(0);
  const song = lyrics[idx];

  const pick = (i) => { setIdx(i); setTab(0); };

  return (
    <section className="room room--lyrics" data-room="lyrics">
      <span className="watermark" data-parallax="0.22" aria-hidden="true">WORDS</span>

      <div className="room-wrap">
        <div className="room-head">
          <div>
            <span className="label"><b>02</b> — Lyrics</span>
            <h2 className="h-display">The words<span className="accent">.</span></h2>
          </div>
        </div>

        <div className="lyrics-grid">
          <div className="card songs-card" data-lenis-prevent>
            {lyrics.map((l, i) => (
              <button key={i} type="button" className={`song-row ${i === idx ? "active" : ""}`} onClick={() => pick(i)}>
                <span className="track-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="song-name">{l.title}</span>
              </button>
            ))}
          </div>

          <div className="card spot reader-card">
            {song && (
              <>
                <h3 className="reader-title">{song.title}</h3>
                <div className="reader-tabs">
                  {song.sections.map((s, i) => (
                    <button key={i} type="button" className={`reader-tab ${tab === i ? "active" : ""}`} onClick={() => setTab(i)}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="reader-scroll" data-lenis-prevent>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${idx}-${tab}`}
                      className="reader-text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {song.sections[tab].text}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}