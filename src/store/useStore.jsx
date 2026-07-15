// src/store/useStore.js
import { create } from "zustand";

export const useStore = create((set) => ({
  scrollProgress: 0,       // 0..1 across the whole page, driven by GSAP
  currentRoom: "entrance", // which section/room is active
  playing: false,
  currentTrack: null,
  analyser: null,

  setScrollProgress: (v) => set({ scrollProgress: v }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setPlaying: (playing) => set({ playing }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setAnalyser: (analyser) => set({ analyser }),
}));