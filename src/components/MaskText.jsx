// src/components/MaskText.jsx
import { motion } from "framer-motion";

const container = { hide: {}, show: { transition: { staggerChildren: 0.06 } } };
const word = {
  hide: { y: "110%" },
  show: { y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function MaskText({ text, as = "h2", className = "" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={container}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {text.split(" ").map((w, i) => (
        <span className="mask-line" key={i}>
          <motion.span className="mask-inner" variants={word}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </Tag>
  );
}