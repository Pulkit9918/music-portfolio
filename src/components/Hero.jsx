// src/components/Hero.jsx
import { motion } from "framer-motion";
import Marquee from "./Marquee";
import AlbumCard3D from "./AlbumCard3D";

const container = {
  hide: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hide: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ ready }) {
  return (
    <header className="hero" id="top">
      <motion.div className="hero-inner" variants={container} initial="hide" animate={ready ? "show" : "hide"}>
        <motion.p className="eyebrow" variants={item}>Singer · Songwriter</motion.p>
        <motion.h1 variants={item}>PULKIT J</motion.h1>
        <motion.p className="tagline" variants={item}>
          Quiet songs about loud feelings. New music coming soon.
        </motion.p>
        <motion.div variants={item} style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href="#music" className="btn btn-fill">Listen</a>
          <a href="#contact" className="btn">Booking</a>
        </motion.div>
      </motion.div>

      <AlbumCard3D />
      <Marquee items={["NEW MUSIC", "COMING SOON", "PULKIT J"]} />
    </header>
  );
}