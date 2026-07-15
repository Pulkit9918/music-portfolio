// src/rooms/Entrance.jsx
import { motion } from "framer-motion";
import { playTick } from "../lib/sound";

export default function Entrance() {
  return (
    <section className="room room--entrance" data-room="entrance">
      <div className="wave-title-wrap">
        <div className="wave-bars">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.06}s`, height: `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 10}px` }} />
          ))}
        </div>
        <motion.h1
          className="wave-name"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          PULKIT J
        </motion.h1>
      </div>

      <motion.p className="wave-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
        singer · songwriter — quiet songs about loud feelings
      </motion.p>

      <motion.a href="#music" className="wave-cta" onMouseEnter={playTick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        listen →
      </motion.a>
    </section>
  );
}