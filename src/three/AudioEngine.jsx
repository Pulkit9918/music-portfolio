// src/three/AudioEngine.jsx
import { useRef, useEffect } from "react";
import { useStore } from "../store/useStore";

export default function AudioEngine() {
  const audioRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const a = audioRef.current;

    const onTimeUpdate = () => useStore.getState().setTime(a.currentTime);
    const onLoadedMeta = () => useStore.getState().setDuration(a.duration || 0);
    const onEnded = () => useStore.getState().next();

    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("loadedmetadata", onLoadedMeta);
    a.addEventListener("ended", onEnded);

    window.__audioSeek = (fraction) => {
      if (a.duration) a.currentTime = fraction * a.duration;
    };

    const unsub = useStore.subscribe((state, prev) => {
      if (state.currentTrack && state.currentTrack !== prev.currentTrack) {
        a.src = state.currentTrack.src;
        if (!ctxRef.current) {
          const AC = window.AudioContext || window.webkitAudioContext;
          const ac = new AC();
          const src = ac.createMediaElementSource(a);
          const analyser = ac.createAnalyser();
          analyser.fftSize = 128;
          src.connect(analyser);
          analyser.connect(ac.destination);
          ctxRef.current = ac;
          useStore.getState().setAnalyser(analyser);
        }
        if (ctxRef.current.state === "suspended") ctxRef.current.resume();
        a.play().catch(() => {});
      }
      if (state.playing !== prev.playing) {
        if (state.playing) a.play().catch(() => {});
        else a.pause();
      }
    });

    return () => {
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("loadedmetadata", onLoadedMeta);
      a.removeEventListener("ended", onEnded);
      unsub();
    };
  }, []);

  return <audio ref={audioRef} />;
}