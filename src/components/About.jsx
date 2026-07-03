// src/components/About.jsx
import Reveal from "./Reveal";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="about-grid">
          <Reveal>
            <div>
              <p className="eyebrow">About</p>
              <h2 style={{ fontSize: "2.6rem", marginBottom: 28 }}>
                Writing songs before I knew what to call them.
              </h2>
              <p>
                I'm PULKIT J, a singer-songwriter working somewhere between
                acoustic folk and indie-pop. Everything here is unreleased —
                demos, voice memos, and lyrics that haven't found their final home yet.
              </p>
              <p>
                This is the room where the songs live before the world hears them.
                Stick around; there's more coming.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="about-img">
              {/* Add public/images/hero.jpg for your photo */}
              <img src="/images/hero.jpg" alt="PULKIT J" onError={(e) => (e.target.style.display = "none")} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}