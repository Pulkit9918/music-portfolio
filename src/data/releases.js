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
  {
    id: "single-1",
    title: "Tum Paas Nahi",
    type: "Single",
    year: 2026,
    cover: "/images/covers/single-1.jpg", 
    tracks: [{ title: "Tum Paas Nahi", src: "/audio/single-1.mp3" }],
  },
  {
    id: "single-2",
    title: "Tera Pata", 
    type: "Single",
    year: 2026,
    cover: "/images/covers/single-2.jpg",
    tracks: [{ title: "Tera Pata", src: "/audio/single-2.mp3" }],
  },
];

export const tracks = releases.flatMap((r) =>
  r.tracks.map((t) => ({ ...t, release: r.title, type: r.type, year: r.year, cover: r.cover }))
);