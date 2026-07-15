// src/rooms/ContactRoom.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiInstagram, FiMail, FiMusic, FiMonitor } from "react-icons/fi";

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
      <div className="contact-card">
        <div className="contact-side">
          <p className="eyebrow">Get in touch</p>
          <h2 className="room-title contact-heading">Let's make something.</h2>
          <p className="contact-note">
            Booking, collaborations, session work, or just to say the song meant something.
            I read everything myself.
          </p>
          <div className="contact-socials">
            <a href="mailto:you@example.com" aria-label="Email"><FiMail size={18} /></a>
            <a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram size={18} /></a>
            <a href="https://open.spotify.com" target="_blank" rel="noreferrer" aria-label="Spotify"><FiMusic size={18} /></a>
            <a href="https://jain-pulkit.com" target="_blank" rel="noopener noreferrer"> <FiMonitor size={18} /></a>
          </div>
        </div>

        <div className="contact-form-side">
          {status === "sent" ? (
            <motion.div className="contact-thanks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="contact-thanks-mark">✦</span>
              <p>Thanks — I'll be in touch soon.</p>
            </motion.div>
          ) : (
            <form name="booking" method="POST" data-netlify="true" onSubmit={submit} className="contact-form">
              <input type="hidden" name="form-name" value="booking" />
              <div className="field">
                <label>Name</label>
                <input name="name" value={form.name} onChange={change} required />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={change} required />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={change} required />
              </div>
              <button type="submit" className="btn contact-submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}