// src/components/Contact.jsx
import { useState } from "react";
import { FiInstagram, FiYoutube, FiMusic, FiCheck } from "react-icons/fi";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

const encode = (data) =>
  Object.keys(data).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setStatus("sending");
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "booking", ...form }),
    })
      .then(() => setStatus("sent"))
      .catch(() => setStatus("error"));
  };

  return (
    <section className="section section--tight-bottom" id="contact">
      <div className="container">
        <SectionHead index="04" eyebrow="Get in touch" title="Booking & Contact" />

        <div className="contact-grid">
          <Reveal delay={0.1}>
            <div className="contact-form-card">
              {status === "sent" ? (
                <div className="contact-success">
                  <span className="contact-success-icon"><FiCheck size={22} /></span>
                  <p>Thanks — I'll get back to you soon.</p>
                </div>
              ) : (
                <form name="booking" method="POST" data-netlify="true" onSubmit={submit} className="contact-form">
                  <input type="hidden" name="form-name" value="booking" />
                  <div className="field">
                    <label htmlFor="c-name">Name</label>
                    <input id="c-name" name="name" value={form.name} onChange={change} required autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" name="email" value={form.email} onChange={change} required autoComplete="email" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-message">Message</label>
                    <textarea id="c-message" name="message" value={form.message} onChange={change} required placeholder="Tell me about the show, session, or project…" />
                  </div>
                  <button type="submit" className="btn btn-fill contact-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                  {status === "error" && (
                    <p className="contact-error">Something went wrong — try again, or email me directly.</p>
                  )}
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="contact-side">
              <p className="contact-quote">
                Quiet songs about loud feelings — always up for a session, a show, or just to talk music.
              </p>
              <div className="contact-divider" />
              <p className="contact-side-label">Find me elsewhere</p>
              <div className="contact-socials">
                <a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram size={19} /><span>Instagram</span></a>
                <a href="https://youtube.com/@yourhandle" target="_blank" rel="noreferrer" aria-label="YouTube"><FiYoutube size={19} /><span>YouTube</span></a>
                <a href="https://open.spotify.com" target="_blank" rel="noreferrer" aria-label="Spotify"><FiMusic size={19} /><span>Spotify</span></a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}