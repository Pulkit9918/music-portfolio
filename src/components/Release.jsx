// src/components/Release.jsx
import { useState } from "react";
import Countdown from "./Countdown";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

const encode = (data) =>
  Object.keys(data).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");

export default function Release() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "waitlist", email }),
    }).then(() => setSent(true)).catch(() => setSent(true));
  };

  return (
    <section className="section" id="release">
      <div className="container">
        <SectionHead index="04" eyebrow="On the way" title="Coming Soon" />

        <Reveal>
          <p style={{ color: "var(--muted)", maxWidth: 460, marginBottom: 40 }}>
            The first release drops soon. Be the first to hear it.
          </p>
        </Reveal>

        <Reveal delay={0.1}><Countdown /></Reveal>

        <Reveal delay={0.2}>
          {sent ? (
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", marginTop: 40 }}>
              You're on the list. ✦
            </p>
          ) : (
            <form
              name="waitlist"
              method="POST"
              data-netlify="true"
              onSubmit={submit}
              className="waitlist"
            >
              <input type="hidden" name="form-name" value="waitlist" />
              <input
                type="email" name="email" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
              <button type="submit" className="btn btn-fill">Notify me</button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}