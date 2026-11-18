import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlay, FiPause, FiArrowRight } from "react-icons/fi";
import Visualizer from "../components/Visualizer";
import SplitReveal from "../components/SplitReveal";
import { playTick } from "../lib/sound";
import { goToRoom } from "../lib/goToRoom";
import { useStore } from "../store/useStore";
import { releases, tracks } from "../data/releases";
import { lyrics } from "../data/lyrics";

const FALLBACK_COVER = "/images/covers/sleeve-art.jpg";

const TAGLINES = [
  "quiet songs about loud feelings",
  "written at 2am, finished before sunrise",
  "one mic, one take, no second guesses",
];

export default function Entrance() {
  const CHAPTERS = [
    { key: "music", n: "01", title: "Music", meta: `${tracks.length} tracks` },
    { key: "lyrics", n: "02", title: "Lyrics", meta: `${lyrics.length} songs` },
    { key: "story", n: "03", title: "About", meta: "The story" },
    { key: "contact", n: "04", title: "Contact", meta: "Say hello" },
  ];

  const [lineIdx, setLineIdx] = useState(0);
  const playing = useStore((s) => s.playing);
  const currentTrack = useStore((s) => s.currentTrack);
  const setCurrentTrack = useStore((s) => s.setCurrentTrack);
  const setPlaying = useStore((s) => s.setPlaying);
  const latest = releases[0];

  useEffect(() => {
    const id = setInterval(() => setLineIdx((i) => (i + 1) % TAGLINES.length), 3200);
    return () => clearInterval(id);
  }, []);

  const onPlay = () => {
    if (!currentTrack) {
      if (!tracks.length) return;
      setCurrentTrack(tracks[0]);
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
    playTick();
  };

  const ringText = `PULKIT J ✺ ${latest ? latest.title : "MUSIC"} ✺ NOW PLAYING ✺ `.toUpperCase();

  return (
    <section className="room room--entrance" data-room="entrance">
      <div className="hero-stage">
        <div className="hero-glow" aria-hidden="true" />

        {latest && (
          <motion.span className="hero-chip" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}>
            <i /> New {latest.type} — {latest.title}
          </motion.span>
        )}

        <h1 className="hero-name" aria-label="PULKIT J">
          <SplitReveal text="PULKIT" mode="chars" trigger="mount" delay={0.15} stagger={0.07} />{" "}
          <SplitReveal text="J" mode="chars" trigger="mount" delay={0.65} className="grad" />
        </h1>

        <motion.div className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.0 }}>
          <div className="hero-tagline-wrap">
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIdx}
                className="hero-tagline"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                {TAGLINES[lineIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn btn--accent" onClick={onPlay} onMouseEnter={playTick}>
              {playing ? <FiPause size={15} /> : <FiPlay size={15} />} {playing ? "Pause" : `Play the ${latest ? latest.type : "music"}`}
            </button>
            <button type="button" className="btn" onClick={() => goToRoom("music")} onMouseEnter={playTick}>
              Browse music <FiArrowRight size={15} />
            </button>
          </div>
        </motion.div>

        <div className="hero-vinyl">
          <motion.div
            className="vinyl-anim"
            initial={{ opacity: 0, scale: 0.85, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Visualizer mode="ring" count={72} className="vinyl-viz" />
            <div className={`vinyl-disc ${playing ? "is-playing" : ""}`} data-cursor={playing ? "Pause" : "Play"} onClick={onPlay}>
              <svg className="vinyl-text" viewBox="0 0 200 200" aria-hidden="true">
                <defs><path id="vinyl-circle" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" /></defs>
                <text><textPath href="#vinyl-circle" textLength="530" lengthAdjust="spacing">{ringText}</textPath></text>
              </svg>
              <div className="vinyl-label">
                <img
                  src={latest?.cover}
                  alt=""
                  onError={(e) => { if (!e.currentTarget.src.endsWith(FALLBACK_COVER)) e.currentTarget.src = FALLBACK_COVER; }}
                />
              </div>
            </div>
            <div className="vinyl-sheen" />
          </motion.div>
        </div>
      </div>

      <Visualizer mode="bars" count={140} className="hero-wave" />

      <div className="chapters">
        {CHAPTERS.map((c, i) => (
          <motion.button
            key={c.key}
            type="button"
            className="chapter"
            data-cursor="Go"
            onClick={() => goToRoom(c.key)}
            onMouseEnter={playTick}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="chapter-n">{c.n}</span>
            <span className="chapter-title">{c.title}</span>
            <span className="chapter-meta">{c.meta}</span>
            <FiArrowRight className="chapter-arrow" size={18} />
          </motion.button>
        ))}
      </div>
    </section>
  );
}