// src/store/useStore.js
import { create } from "zustand";
import { tracks } from "../data/releases";

export const useStore = create((set, get) => ({
  scrollProgress: 0,
  currentRoom: "entrance",
  playing: false,
  currentTrack: null,
  analyser: null,
  time: 0,
  duration: 0,

  setScrollProgress: (v) => set({ scrollProgress: v }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setPlaying: (playing) => set({ playing }),
  setCurrentTrack: (track) => set({ currentTrack: track, time: 0, duration: 0 }),
  setAnalyser: (analyser) => set({ analyser }),
  setTime: (time) => set({ time }),
  setDuration: (duration) => set({ duration }),

  next: () => {
    const { currentTrack } = get();
    if (!currentTrack) return;
    const nextIdx = (currentTrack.index + 1) % tracks.length;
    set({ currentTrack: tracks[nextIdx], playing: true, time: 0, duration: 0 });
  },
  prev: () => {
    const { currentTrack } = get();
    if (!currentTrack) return;
    const prevIdx = (currentTrack.index - 1 + tracks.length) % tracks.length;
    set({ currentTrack: tracks[prevIdx], playing: true, time: 0, duration: 0 });
  },
}));