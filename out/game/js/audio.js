// audio.js — original sound effects, synthesized with WebAudio: no audio files, nothing borrowed.
let ctx = null;
let muted = false;

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type = 'sine', gain = 0.15, when = 0, slide = 0) {
  const c = audio();
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(dur, gain = 0.2, when = 0) {
  const c = audio();
  const t = c.currentTime + when;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  src.buffer = buf;
  src.connect(g).connect(c.destination);
  src.start(t);
}

export const sfx = {
  deal() { tone(880, 0.08, 'triangle', 0.08, 0, 200); },
  playCard() { tone(520, 0.12, 'triangle', 0.12, 0, 160); },
  strike() { noise(0.16, 0.25); tone(180, 0.14, 'sawtooth', 0.14, 0, -80); },
  ward() { tone(420, 0.25, 'sine', 0.12); tone(630, 0.2, 'sine', 0.08, 0.05); },
  heal() { tone(520, 0.18, 'sine', 0.1); tone(780, 0.22, 'sine', 0.1, 0.08); },
  chill() { tone(1200, 0.3, 'sine', 0.08, 0, -600); },
  toll() { tone(300, 0.4, 'triangle', 0.12, 0, -100); },
  spark() { tone(980, 0.1, 'square', 0.08); tone(1400, 0.12, 'square', 0.06, 0.06); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.35, 'triangle', 0.14, i * 0.14)); },
  lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.4, 'sawtooth', 0.1, i * 0.18)); },
};

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }
