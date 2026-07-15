// src/components/SignatureMark.jsx
import { motion } from "framer-motion";

export default function SignatureMark() {
  return (
    <svg className="signature" viewBox="0 0 200 60" fill="none">
      <motion.path
        d="M10 40 Q 30 10, 50 40 T 90 40 Q 110 10, 130 40 T 190 30"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}