// src/rooms/LyricsRoom.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { lyrics } from "../data/lyrics";

export default function LyricsRoom() {
  const [openIdx, setOpenIdx] = useState(null);
  const song = openIdx !== null ? lyrics[openIdx] : null;

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
                  <button key={i} className="lyrics-list-item" onClick={() => setOpenIdx(i)}>
                    {l.title}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="sheet-back" onClick={() => setOpenIdx(null)}>
                <FiArrowLeft /> All lyrics
              </button>
              <div className="lyric-sheet">
                <h3 className="sheet-title">{song.title}</h3>
                <p className="sheet-text">{song.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}