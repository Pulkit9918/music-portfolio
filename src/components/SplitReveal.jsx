import { motion } from "framer-motion";

export default function SplitReveal({ text, mode = "words", className = "", delay = 0, stagger = 0.06, trigger = "view" }) {
  const parts = mode === "chars" ? Array.from(text) : text.split(" ");
  const anim = trigger === "view"
    ? { whileInView: { y: 0, rotate: 0 }, viewport: { once: true } }
    : { animate: { y: 0, rotate: 0 } };

  return (
    <span className={`sr ${className}`} aria-label={text}>
      {parts.map((p, i) => (
        <span key={i} className="sr-mask" aria-hidden="true">
          <motion.span
            className="sr-inner"
            initial={{ y: "115%", rotate: 5 }}
            {...anim}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {p === " " ? "\u00A0" : p}
            {mode === "words" && i < parts.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}