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
import SideNav from "./components/SideNav";
import ScrollBar from "./components/ScrollBar";
import MiniPlayer from "./components/MiniPlayer";
import Entrance from "./rooms/Entrance";
import MusicRoom from "./rooms/MusicRoom";
import LyricsRoom from "./rooms/LyricsRoom";
import StoryRoom from "./rooms/StoryRoom";
import ContactRoom from "./rooms/ContactRoom";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useMicroInteractions();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const track = trackRef.current;
    const pin = pinRef.current;
    const getScrollLength = () => track.scrollWidth - window.innerWidth;
    const rooms = Array.from(track.querySelectorAll(".room"));

    // Single ScrollTrigger drives everything: horizontal position AND which room is active.
    // No snap config anywhere — snapping was likely the cause of the jump-around behavior.
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

        // room detection lives here now — one calculation per frame, not N separate triggers
        const scrollX = self.progress * scrollLength;
        const viewportCenter = scrollX + window.innerWidth / 2;
        for (const room of rooms) {
          const left = room.offsetLeft;
          const right = left + room.offsetWidth;
          if (viewportCenter >= left && viewportCenter < right) {
            const current = useStore.getState().currentRoom;
            if (current !== room.dataset.room) {
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
      <Cursor />
      <AnimatePresence>{loading && <Loader onComplete={() => setLoading(false)} />}</AnimatePresence>
      <SideNav />
      <ScrollBar />
      <Footer />
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