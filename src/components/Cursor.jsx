import { useEffect, useRef } from "react";

export default function Cursor() {
  const root = useRef(null);
  const tag = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = root.current;
    document.documentElement.classList.add("has-cursor");

    const move = (e) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.classList.add("is-visible");
    };
    const over = (e) => {
      const t = e.target.closest?.("a, button, input, textarea, [data-cursor]");
      el.classList.toggle("is-hover", !!t);
      const text = t?.closest("[data-cursor]")?.dataset.cursor;
      el.classList.toggle("has-tag", !!text);
      if (text) tag.current.textContent = text;
    };
    const leave = () => el.classList.remove("is-visible");
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <span className="cursor-dot" />
      <span className="cursor-tag" ref={tag} />
    </div>
  );
}