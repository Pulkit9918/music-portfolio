// src/components/Music.jsx
import { FiPlay, FiPause, FiSkipBack, FiSkipForward } from "react-icons/fi";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import Blob from "./Blob";
import { useAudio } from "../context/AudioProvider";
import { groupedReleases } from "../data/tracks";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

export default function Music() {
  const { tracks, track, current, playing, time, dur, analyser, select, next, prev, toggle, seekTo, setOpen } = useAudio();

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seekTo((e.clientX - rect.left) / rect.width);
  };

  return (
    <section className="section" id="music">
      <div className="container">
        <SectionHead index="01" eyebrow="Listen" title="Selected Works" />

        <Reveal delay={0.1}>
          <div className="player">
            <div className="player-now">
              <div>
                <div className="player-title">{track.title}</div>
                <div className="player-sub">{track.note}</div>
              </div>
              <button className="btn np-open-btn" onClick={() => setOpen(true)}>Expand ⤢</button>
            </div>

            <Blob analyser={analyser} playing={playing} />

            <div className="player-controls">
              <button className="player-btn" onClick={prev} aria-label="Previous"><FiSkipBack size={22} /></button>
              <button className="player-btn player-play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
                {playing ? <FiPause size={22} /> : <FiPlay size={22} style={{ marginLeft: 3 }} />}
              </button>
              <button className="player-btn" onClick={next} aria-label="Next"><FiSkipForward size={22} /></button>

              <div className="progress">
                <span className="time">{fmt(time)}</span>
                <div className="progress-bar" onClick={seek}>
                  <div className="progress-fill" style={{ width: dur ? `${(time / dur) * 100}%` : "0%" }} />
                </div>
                <span className="time">{fmt(dur)}</span>
              </div>
            </div>

            <div className="discography">
              {groupedReleases.map((r) => (
                <div className="release" key={r.id}>
                  <div className="release-head">
                    <div className="release-cover">
                      <img src={r.cover} alt={r.title} onError={(e) => (e.target.style.opacity = 0)} />
                    </div>
                    <div>
                      <span className="release-type">{r.type} · {r.year}</span>
                      <h3 className="release-title">{r.title}</h3>
                    </div>
                  </div>
                  <div className="release-tracks">
                    {r.tracks.map((t) => (
                      <div
                        key={t.index}
                        className={`track ${t.index === current ? "active" : ""}`}
                        onClick={() => select(t.index)}
                      >
                        <span className="track-name">
                          <span className="track-idx">0{t.index + 1}</span>&nbsp;&nbsp;{t.title}
                        </span>
                        <span className="track-idx">
                          {playing && t.index === current ? "► playing" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}