// src/rooms/MusicRoom.jsx
import { releases } from "../data/releases";
import { playTick } from "../lib/sound";
import { useStore } from "../store/useStore";

export default function MusicRoom() {
  const setCurrentTrack = useStore((s) => s.setCurrentTrack);
  const setPlaying = useStore((s) => s.setPlaying);
  const currentTrack = useStore((s) => s.currentTrack);
  const playing = useStore((s) => s.playing);
  const play = (track) => { setCurrentTrack(track); setPlaying(true); playTick(); };

  return (
    <section className="room room--music" data-room="music">
      <p className="eyebrow">Listen</p>
      <h2 className="room-title liner-heading">Selected Works</h2>

      <div className="liner-notes">
        {releases.map((r) => (
          <div key={r.id} className="liner-release">
            <span className="liner-type">{r.type} · {r.year}</span>
            <h3 className="liner-title">{r.title}</h3>
            <div className="liner-tracks">
              {r.tracks.map((t, i) => {
                const isActive = currentTrack?.title === t.title;
                return (
                  <button key={i} className={`liner-track ${isActive ? "active" : ""}`} onClick={() => play(t)} onMouseEnter={playTick}>
                    <span className="liner-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="liner-track-title">{t.title}</span>
                    {isActive && playing && <span className="liner-live" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}