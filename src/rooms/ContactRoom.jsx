import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import SplitReveal from "../components/SplitReveal";

const LINKS = [
  { label: "Email", href: "pulkitjain9918@gmail.com" },
  { label: "Instagram", href: "https://instagram.com/pulkit.reverb" },
  { label: "Spotify", href: "https://open.spotify.com" },
  { label: "Website", href: "https://jain-pulkit.com" },
];

const encode = (data) =>
  Object.keys(data).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");

export default function ContactRoom() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setStatus("sending");
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "booking", ...form }),
    }).then(() => setStatus("sent")).catch(() => setStatus("error"));
  };

  return (
    <section className="room room--contact" data-room="contact">
      <span className="watermark" data-parallax="0.22" aria-hidden="true">HELLO</span>

      <div className="room-wrap">
        <div className="contact-grid">
          <div>
            <span className="label" style={{ display: "block", marginBottom: 20 }}><b>04</b> — Contact</span>
            <h2 className="contact-title">
              <SplitReveal text="Let's make" /><br /><SplitReveal text="something" delay={0.2} className="grad" /><span className="accent">.</span>
            </h2>
            <p className="contact-note">
              Booking, collaborations, session work, or just to say the song meant something. I read everything myself.
            </p>
            <div className="link-pills">
              {LINKS.map((l) => (
                <a key={l.label} className="pill-link" href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {l.label} <FiArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </div>

          <div className="card spot form-card">
            {status === "sent" ? (
              <motion.div className="contact-thanks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="label"><b>●</b> Sent</span>
                <h3>Thanks — talk soon.</h3>
                <p className="contact-note" style={{ margin: 0 }}>I'll be in touch as soon as I can.</p>
              </motion.div>
            ) : (
              <form name="booking" method="POST" data-netlify="true" onSubmit={submit} className="contact-form">
                <input type="hidden" name="form-name" value="booking" />
                <div className="field">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" name="name" value={form.name} onChange={change} required />
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" type="email" name="email" value={form.email} onChange={change} required />
                </div>
                <div className="field">
                  <label htmlFor="c-msg">Message</label>
                  <textarea id="c-msg" name="message" value={form.message} onChange={change} required />
                </div>
                <button type="submit" className="btn btn--accent contact-submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : status === "error" ? "Something went wrong — try again" : "Send message"}
                  <FiArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <span className="label contact-foot">© {new Date().getFullYear()} Pulkit J</span>
    </section>
  );
}