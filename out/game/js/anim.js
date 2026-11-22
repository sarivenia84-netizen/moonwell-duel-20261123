// anim.js — animation helpers: floating numbers, screen shake, card motion classes.
import { TIMING } from './config.js';

const floaters = () => document.getElementById('floaters');

export function floatNumber(text, side, cls = '') {
  const box = floaters();
  if (!box) return;
  const el = document.createElement('span');
  el.className = `floater ${side} ${cls}`;
  el.textContent = text;
  el.style.left = side === 'enemy' ? `${58 + Math.random() * 14}%` : `${18 + Math.random() * 14}%`;
  el.style.top = side === 'enemy' ? '34%' : '62%';
  box.appendChild(el);
  setTimeout(() => el.remove(), TIMING.floatLife);
}

export function shake(stage) {
  const el = document.getElementById(stage);
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth; // restart the CSS animation
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 420);
}

export function pulse(id, cls = 'pulse') {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 600);
}

export function announce(text) {
  const line = document.getElementById('log-line');
  if (!line) return;
  line.textContent = text;
  line.classList.remove('announce');
  void line.offsetWidth;
  line.classList.add('announce');
}
