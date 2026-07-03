// src/components/Lyrics.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import { lyrics } from "../data/lyrics";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Lyrics() {
  const [open, setOpen] = useState(null);

  return (
    <section className="section" id="lyrics">
      <div className="container">
        <Reveal>
          <SectionHead index="02" eyebrow="Words" title="Lyrics" />
        </Reveal>

        <div className="lyrics-grid">
          {lyrics.map((l, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="lyric-card">
                <div className="lyric-head" onClick={() => setOpen(open === i ? null : i)}>
                  <span className="lyric-title">{l.title}</span>
                  {open === i ? <FiMinus /> : <FiPlus />}
                </div>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="lyric-body">{l.text}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}