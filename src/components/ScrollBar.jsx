// src/components/ScrollBar.jsx
import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";

export default function ScrollBar() {
  const fillRef = useRef(null);

  useEffect(() => {
    let raf;
    const tick = () => {
      const progress = useStore.getState().scrollProgress;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="scrollbar-track">
      <div className="scrollbar-fill" ref={fillRef} />
    </div>
  );
}