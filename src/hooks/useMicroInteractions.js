import { useEffect } from "react";

const MAGNETIC = ".btn, .magnetic";
const TILT = ".tilt";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function useMicroInteractions() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let magnet = null;
    let tilt = null;

    const resetMagnet = (el) => {
      el.style.transition = `transform 0.5s ${EASE}`;
      el.style.transform = "translate(0, 0)";
    };
    const resetTilt = (el) => {
      el.style.transition = `transform 0.6s ${EASE}`;
      el.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };

    const onMove = (e) => {
      const m = e.target.closest?.(MAGNETIC) || null;
      const t = e.target.closest?.(TILT) || null;

      if (magnet && magnet !== m) resetMagnet(magnet);
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.transition = "";
        m.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.28}px, ${(e.clientY - (r.top + r.height / 2)) * 0.28}px)`;
      }

      if (tilt && tilt !== t) resetTilt(tilt);
      tilt = t;
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        t.style.transition = "transform 0.1s linear";
        t.style.transform = `perspective(1000px) rotateX(${-py * 7}deg) rotateY(${px * 7}deg)`;
      }
    };

    const onLeave = () => {
      if (magnet) resetMagnet(magnet);
      if (tilt) resetTilt(tilt);
      magnet = tilt = null;
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);
}