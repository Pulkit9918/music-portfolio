import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import Marquee from "../components/Marquee";
import { releases, tracks } from "../data/releases";
import { lyrics } from "../data/lyrics";

const STATEMENT =
  "Writing songs before I knew what to call them — this is the room where they live before the world hears them.";
const HIGHLIGHT_FROM = 14;

export default function StoryRoom() {
  const latest = releases[0];
  const words = STATEMENT.split(" ");

  // First line of every lyric section -> scrolling ticker (real lines from your lyrics.js)
  const lines = lyrics
    .flatMap((l) => l.sections.map((s) => (s.text || "").split("\n")[0].trim()))
    .filter((t) => t.length > 3 && t.length < 60)
    .slice(0, 10);

  return (
    <section className="room room--story" data-room="story">
      <span className="watermark" data-parallax="0.22" aria-hidden="true">ABOUT</span>

      <div className="room-wrap">
        <div className="room-head">
          <div><span className="label"><b>03</b> — About</span></div>
        </div>

        <p className="story-statement">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className={`word ${i >= HIGHLIGHT_FROM ? "accent" : ""}`}
              initial={{ opacity: 0.12, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </p>

        <div className="about-grid">
          <div className="card spot stat-card">
            <span className="label">Tracks</span>
            <span className="stat-num">{tracks.length}</span>
          </div>
          <div className="card spot stat-card">
            <span className="label">Songs with lyrics</span>
            <span className="stat-num">{lyrics.length}</span>
          </div>
          <div className="card spot stat-card">
            <span className="label">Releases</span>
            <span className="stat-num">{releases.length}</span>
          </div>
          {latest && (
            <div className="card poster-card">
              <span className="label">Latest drop</span>
              <div>
                <p className="poster-title">{latest.title}</p>
                <span className="label" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                  {latest.type} · {latest.year} <FiArrowUpRight />
                </span>
              </div>
            </div>
          )}
        </div>

        {lines.length > 0 && <Marquee items={lines} speed={60} outline={false} sep="♪" className="marquee--inline" />}
      </div>
    </section>
  );
}