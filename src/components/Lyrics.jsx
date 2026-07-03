// src/components/Lyrics.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import { lyrics } from "../data/lyrics";
import { tracks } from "../data/tracks";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { useAudio } from "../context/AudioProvider";

export default function Lyrics() {
  const [open, setOpen] = useState(null);
  const { select } = useAudio();

  const playByTitle = (title) => {
    const t = tracks.find((tr) => tr.title === title);
    if (t) select(t.index);
  };

  return (
    <section className="section" id="lyrics">
      <div className="container">
        <SectionHead index="02" eyebrow="Words" title="Lyrics" />

        <div className="lyrics-grid">
          {lyrics.map((l, i) => {
            const lines = l.text.split("\n").filter((x) => x.trim());
            const teaser = lines.slice(0, 2).join("\n");
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div className={`lyric-card ${isOpen ? "open" : ""}`}>
                  <div className="lyric-head" onClick={() => setOpen(isOpen ? null : i)}>
                    <div>
                      <span className="lyric-title">{l.title}</span>
                      {!isOpen && <p className="lyric-teaser">{teaser}…</p>}
                    </div>
                    <span className="lyric-toggle">{isOpen ? <FiMinus /> : <FiPlus />}</span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="lyric-body">{l.text}</div>
                        <button className="lyric-play" onClick={() => playByTitle(l.title)}>
                          ▶ Listen to “{l.title}”
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}