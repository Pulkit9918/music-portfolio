// src/components/Countdown.jsx
import { useState, useEffect } from "react";

// 👉 set your release date here
const TARGET = new Date("2026-10-01T00:00:00");

const calc = () => {
  const diff = Math.max(0, TARGET - new Date());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
};

export default function Countdown() {
  const [t, setT] = useState(calc());
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const unit = (val, label) => (
    <div className="cd-unit">
      <span className="cd-num">{String(val).padStart(2, "0")}</span>
      <span className="cd-label">{label}</span>
    </div>
  );

  return (
    <div className="countdown">
      {unit(t.d, "days")}
      {unit(t.h, "hrs")}
      {unit(t.m, "min")}
      {unit(t.s, "sec")}
    </div>
  );
}