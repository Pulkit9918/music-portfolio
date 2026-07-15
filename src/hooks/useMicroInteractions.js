// src/hooks/useMicroInteractions.js
import { useEffect } from "react";

export default function useMicroInteractions() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const MAGNETIC_SEL = ".btn, .room-cta";
    const TILT_SEL = ".room-card";
    const cleanups = [];

    document.querySelectorAll(MAGNETIC_SEL).forEach((el) => {
      let raf;
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.25;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { el.style.transform = `translate(${x}px, ${y}px)`; });
      };
      const reset = () => {
        cancelAnimationFrame(raf);
        el.style.transition = "transform 0.4s cubic-bezier(0.22,1,0.36,1)";
        el.style.transform = "translate(0,0)";
        setTimeout(() => { el.style.transition = ""; }, 400);
      };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", reset);
      cleanups.push(() => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", reset); });
    });

    document.querySelectorAll(TILT_SEL).forEach((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg)`;
      };
      const reset = () => {
        el.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
        el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
        setTimeout(() => { el.style.transition = ""; }, 500);
      };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", reset);
      cleanups.push(() => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", reset); });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);
}