// src/components/SideNav.jsx
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

const ROOMS = [
  { key: "entrance", label: "Start" },
  { key: "music", label: "Music" },
  { key: "lyrics", label: "Lyrics" },
  { key: "story", label: "Story" },
  { key: "contact", label: "Contact" },
];

export default function SideNav() {
  const currentRoom = useStore((s) => s.currentRoom);

  const goTo = (key) => {
    const el = document.querySelector(`[data-room="${key}"]`);
    const track = document.querySelector(".horizontal-track");
    const st = window.__scrollTriggerHorizontal;
    if (!el || !track || !st || !window.__lenis) return;
    const scrollLength = track.scrollWidth - window.innerWidth;
    const roomProgress = el.offsetLeft / scrollLength;
    window.__lenis.scrollTo(st.start + roomProgress * (st.end - st.start), { duration: 1.2 });
  };

  return (
    <div className="side-nav">
      {ROOMS.map((r) => {
        const active = r.key === currentRoom;
        return (
          <button key={r.key} className="side-nav-item" onClick={() => goTo(r.key)}>
            <motion.span
              className="side-nav-dot"
              animate={{ scale: active ? 1.4 : 1, backgroundColor: active ? "var(--accent)" : "rgba(255,255,255,0.25)" }}
              transition={{ duration: 0.3 }}
            />
            <span className={`side-nav-label ${active ? "always-on" : ""}`}>{r.label}</span>
          </button>
        );
      })}
      <div className="side-nav-line" />
    </div>
  );
}