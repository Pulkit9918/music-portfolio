// src/rooms/LyricsRoom.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { lyrics } from "../data/lyrics";

export default function LyricsRoom() {
  const [openIdx, setOpenIdx] = useState(null);
  const [tab, setTab] = useState(0);
  const song = openIdx !== null ? lyrics[openIdx] : null;

  const openSong = (i) => { setOpenIdx(i); setTab(0); };

  return (
    <section className="room room--lyrics" data-room="lyrics">
      <div className="room-content lyrics-panel">
        <AnimatePresence mode="wait">
          {!song ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <p className="eyebrow">Words</p>
              <h2 className="room-title">Lyrics</h2>
              <div className="lyrics-list">
                {lyrics.map((l, i) => (
                  <button key={i} className="lyrics-list-item" onClick={() => openSong(i)}>{l.title}</button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="sheet" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <button className="sheet-back" onClick={() => setOpenIdx(null)}><FiArrowLeft /> All lyrics</button>
              <h3 className="sheet-title">{song.title}</h3>

              <div className="sheet-tabs">
                {song.sections.map((s, i) => (
                  <button key={i} className={`sheet-tab ${tab === i ? "active" : ""}`} onClick={() => setTab(i)}>
                    {s.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  className="lyric-sheet"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="sheet-text">{song.sections[tab].text}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}