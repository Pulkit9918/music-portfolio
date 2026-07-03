// src/components/Loader.jsx
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Loader({ onComplete }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // lock scroll during intro
    const t = setTimeout(() => {
      document.body.style.overflow = "";
      onComplete();
    }, 2400);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <motion.div
      className="loader"
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loader-inner">
        <motion.span
          className="loader-name"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          PULKIT J
        </motion.span>
        <div className="loader-line">
          <motion.div
            className="loader-line-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}