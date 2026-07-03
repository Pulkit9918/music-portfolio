// src/components/Contact.jsx
import { useState } from "react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const encode = (data) =>
  Object.keys(data).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "booking", ...form }),
    })
      .then(() => setSent(true))
      .catch(() => setSent(true));
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <Reveal>
          <SectionHead index="05" eyebrow="Get in touch" title="Booking & Contact" />
        </Reveal>

        <Reveal delay={0.1}>
          {sent ? (
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem" }}>
              Thank you — I'll be in touch soon. ♥
            </p>
          ) : (
            <form
              name="booking"
              method="POST"
              data-netlify="true"
              onSubmit={submit}
              className="contact-form"
            >
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
              <button type="submit" className="btn btn-fill" style={{ justifySelf: "start" }}>
                Send
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}