// src/context/AudioProvider.jsx
import { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import { tracks } from "../data/tracks";

const AudioCtx = createContext(null);
export const useAudio = () => useContext(AudioCtx);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const acRef = useRef(null);
  const [analyser, setAnalyser] = useState(null);

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);

  const track = tracks[current];

  const initGraph = useCallback(() => {
    if (acRef.current) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    const ac = new AC();
    const src = ac.createMediaElementSource(audioRef.current);
    const an = ac.createAnalyser();
    an.fftSize = 128;
    src.connect(an);
    an.connect(ac.destination);
    acRef.current = ac;
    setAnalyser(an);
  }, []);

  const start = useCallback(() => {
    initGraph();
    if (acRef.current?.state === "suspended") acRef.current.resume();
    setStarted(true);
    setPlaying(true);
  }, [initGraph]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.play().catch(() => {});
    else a.pause();
  }, [playing, current]);

  const select = useCallback((i) => { setCurrent(i); start(); }, [start]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % tracks.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + tracks.length) % tracks.length), []);
  const toggle = useCallback(() => (playing ? setPlaying(false) : start()), [playing, start]);
  const seekTo = useCallback((pct) => {
    if (audioRef.current && dur) audioRef.current.currentTime = pct * dur;
  }, [dur]);

  // Spacebar toggles play/pause
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" && e.target === document.body) { e.preventDefault(); toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const value = {
    tracks, track, current, playing, time, dur, analyser, started, open, setOpen,
    select, next, prev, toggle, seekTo,
  };

  return (
    <AudioCtx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={(e) => setTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDur(e.target.duration)}
        onEnded={next}
      />
    </AudioCtx.Provider>
  );
}