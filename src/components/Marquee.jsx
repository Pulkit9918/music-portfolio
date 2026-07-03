// src/components/Marquee.jsx
import { useRef } from "react";
import {
  motion, useScroll, useVelocity, useSpring, useTransform, useMotionValue, useAnimationFrame, wrap,
} from "framer-motion";

export default function Marquee({ items = ["NEW MUSIC", "COMING SOON", "PULKIT J"], baseVelocity = -2 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((t, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });

  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee">
      <motion.div className="marquee-track" style={{ x }}>
        {loop.map((t, i) => (
          <span className="marquee-item" key={i}>{t}<span className="marquee-dot">✦</span></span>
        ))}
      </motion.div>
    </div>
  );
}