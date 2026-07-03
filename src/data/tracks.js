// src/data/tracks.js
// Group tracks under releases. Types: "Single" | "EP" | "Album" | "Demo"
export const releases = [
  {
    id: "midnight-ep",
    title: "Missing Pieces",
    type: "EP",
    year: 2026,
    cover: "/images/covers/midnight.jpg",
    tracks: [
      { title: "Calling Me Back", src: "/audio/track1.mp3" },
      { title: "Khaali Apartment", src: "/audio/track2.mp3" },
      { title: "Andhera Saath", src: "/audio/track3.mp3" },
    ],
  },
  // Add an Album or Demo the same way:
  // { id: "first-lp", title: "Long Nights", type: "Album", year: 2027,
  //   cover: "/images/covers/lp.jpg", tracks: [{ title: "…", src: "/audio/…" }] },
];

// Build a flat, indexed list (this is what the player uses).
export const tracks = [];
export const groupedReleases = releases.map((r) => ({
  ...r,
  tracks: r.tracks.map((t) => {
    const track = {
      ...t,
      type: r.type,
      release: r.title,
      cover: r.cover,
      year: r.year,
      note: r.type === "Single" || r.type === "Demo"
        ? `${r.type} · ${r.year}`
        : `${r.type} · ${r.title}`,
      index: tracks.length,
    };
    tracks.push(track);
    return track;
  }),
}));