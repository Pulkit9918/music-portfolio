// src/data/releases.js
// Fill in your real songs, grouped by release. Types: "Single" | "EP" | "Album" | "Demo"
export const releases = [

  {
    id: "midnight-ep",
    title: "Midnight Pages",
    type: "EP",
    year: 2026,
    cover: "/images/covers/midnight.jpg",
    tracks: [
      { title: "Calling Me Back", src: "/audio/track1.mp3" },
      { title: "Frozen", src: "/audio/track2.mp3" },
      { title: "NoWhere To Go", src: "/audio/track3.mp3" },
      { title: "Lost Time", src: "/audio/track4.mp3" },
    ],
  },
];

export const tracks = [];
releases.forEach((r) => {
  r.tracks.forEach((t) => {
    tracks.push({ ...t, release: r.title, type: r.type, year: r.year, cover: r.cover, index: tracks.length });
  });
});