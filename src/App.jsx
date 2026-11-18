import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import World from "./three/World";
import AudioEngine from "./three/AudioEngine";
import { useStore } from "./store/useStore";
import useMicroInteractions from "./hooks/useMicroInteractions";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import ScrollBar from "./components/ScrollBar";
import MiniPlayer from "./components/MiniPlayer";
import Entrance from "./rooms/Entrance";
import MusicRoom from "./rooms/MusicRoom";
import LyricsRoom from "./rooms/LyricsRoom";
import StoryRoom from "./rooms/StoryRoom";
import ContactRoom from "./rooms/ContactRoom";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useMicroInteractions();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.room = useStore.getState().currentRoom;
    const unsub = useStore.subscribe((s, p) => {
      if (s.currentRoom !== p.currentRoom) root.dataset.room = s.currentRoom;
    });

    const onMove = (e) => {
      const el = e.target.closest?.(".spot");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    let raf, buf = null, amp = 0;
    const loop = () => {
      const { analyser, playing } = useStore.getState();
      let target = 0;
      if (analyser && playing) {
        if (!buf || buf.length !== analyser.frequencyBinCount) buf = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buf);
        const n = Math.min(12, buf.length);
        let sum = 0;
        for (let i = 0; i < n; i++) sum += buf[i];
        target = sum / n / 255;
      }
      amp += (target - amp) * 0.2;
      root.style.setProperty("--amp", amp.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => { unsub(); document.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const track = trackRef.current;
    const pin = pinRef.current;
    const getScrollLength = () => track.scrollWidth - window.innerWidth;
    const rooms = Array.from(track.querySelectorAll(".room"));
    const parallax = Array.from(track.querySelectorAll("[data-parallax]")).map((el) => ({ el, f: parseFloat(el.dataset.parallax) || 0 }));

    let skewTarget = 0, skew = 0;
    lenis.on("scroll", ({ velocity }) => {
      skewTarget = Math.max(-5, Math.min(5, -velocity * 0.12));
    });

    const tick = (time) => {
      lenis.raf(time * 1000);
      skewTarget *= 0.9;
      skew += (skewTarget - skew) * 0.12;
      const v = window.innerWidth > 700 ? skew : 0;
      document.documentElement.style.setProperty("--skew", `${v.toFixed(3)}deg`);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      id: "horizontal",
      trigger: pin,
      start: "top top",
      end: () => `+=${getScrollLength()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const scrollLength = getScrollLength();
        gsap.set(track, { x: -self.progress * scrollLength });
        useStore.getState().setScrollProgress(self.progress);

        if (window.innerWidth > 700) {
          const shift = self.progress * scrollLength;
          for (const p of parallax) p.el.style.translate = `${shift * p.f}px 0`;
        }

        const viewportCenter = self.progress * scrollLength + window.innerWidth / 2;
        for (const room of rooms) {
          const left = room.offsetLeft;
          if (viewportCenter >= left && viewportCenter < left + room.offsetWidth) {
            if (useStore.getState().currentRoom !== room.dataset.room) {
              useStore.getState().setCurrentRoom(room.dataset.room);
            }
            break;
          }
        }
      },
    });

    window.__scrollTriggerHorizontal = st;

    return () => {
      st.kill();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-root">
      <AudioEngine />
      <World />
      <div className="fx" aria-hidden="true">
        <span className="fx-grid" />
        <span className="fx-grain" />
      </div>

      <Cursor />
      <AnimatePresence>{loading && <Loader onComplete={() => setLoading(false)} />}</AnimatePresence>
      <Nav />
      <ScrollBar />

      <div className="horizontal-pin" ref={pinRef}>
        <div className="horizontal-track" ref={trackRef}>
          <Entrance />
          <MusicRoom />
          <LyricsRoom />
          <StoryRoom />
          <ContactRoom />
        </div>
      </div>

      <MiniPlayer />
    </div>
  );
}