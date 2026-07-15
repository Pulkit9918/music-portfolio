// src/lib/sound.js
import { Howl } from "howler";

// Generate a soft synthesized tick/swell via WebAudio instead of shipping audio files —
// keeps this zero-asset and lightweight.
let ctx;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function playTick() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.05, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.08);
}

export function playSwell() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.linearRampToValueAtTime(330, c.currentTime + 0.4);
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.04, c.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.5);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.5);
}