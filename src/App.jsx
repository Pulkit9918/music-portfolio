// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { AudioProvider } from "./context/AudioProvider";
import Scene3D from "./components/Scene3D";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Release from "./components/Release";
import Music from "./components/Music";
import Lyrics from "./components/Lyrics";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NowPlaying from "./components/NowPlaying";
import MiniPlayer from "./components/MiniPlayer";

export default function App() {
  const [loading, setLoading] = useState(true);
  const curtainRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    const onClick = async (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (id.length <= 1) return;
      e.preventDefault();
      const c = curtainRef.current;
      if (c) {
        await c.animate(
          [{ transform: "translateY(100%)" }, { transform: "translateY(0%)" }],
          { duration: 400, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }
        ).finished;
        lenis.scrollTo(id, { offset: -20, immediate: true });
        await c.animate(
          [{ transform: "translateY(0%)" }, { transform: "translateY(-100%)" }],
          { duration: 500, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }
        ).finished;
        c.style.transform = "translateY(100%)";
      } else {
        lenis.scrollTo(id, { offset: -20 });
      }
    };
    document.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("click", onClick); lenis.destroy(); };
  }, []);

  return (
    <AudioProvider>
      <Scene3D />
      <div className="curtain" ref={curtainRef} aria-hidden="true" />
      <Cursor />
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Nav />
      <Hero ready={!loading} />
      <Release />
      <Music />
      <Lyrics />
      <About />
      <Contact />
      <Footer />
      <NowPlaying />
      <MiniPlayer />
    </AudioProvider>
  );
}