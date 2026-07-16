// src/components/Footer.jsx
import { useState, useEffect } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");

  return (
    <header className="site-header">
      <span className="header-name">PULKIT J</span>
      <span className="header-clock">
        <span className="header-note">♪</span>
        {hh}<span className="header-colon">:</span>{mm}<span className="header-colon">:</span>{ss}
      </span>
      <span className="header-year">{new Date().getFullYear()}</span>
    </header>
  );
}