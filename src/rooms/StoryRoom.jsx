// src/rooms/StoryRoom.jsx
import { motion } from "framer-motion";

export default function StoryRoom() {
  return (
    <section className="room room--story" data-room="story">
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        About
      </motion.p>
      <motion.h2
        className="room-title"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        The Story So Far
      </motion.h2>
      <motion.p
        className="room-tagline"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 }}
        style={{ maxWidth: 520 }}
      >
        Writing songs before I knew what to call them — this is the room where they live before the world hears them.
      </motion.p>
    </section>
  );
}