// main.js — wires the duel together: boot, turn loop, event timing, end of duel.
import { TIMING, HAND_SIZE } from './config.js';
import { newDuel, canPlay, drawCards, beginPlayerTurn, checkEnd } from './gamestate.js';
import { playPlayerCard } from './effects.js';
import { takeEnemyTurn, refreshIntent } from './ai.js';
import { renderAll, animateEvents } from './render.js';
import { showTitle, showTable, showEnd } from './screens.js';
import { bindInput } from './input.js';
import { sfx } from './audio.js';
import { announce } from './anim.js';

let state = null;
let busy = false; // true while an animation sequence runs

// A fresh duel with the opener's draws and her announced intent.
function freshDuel() {
  const s = newDuel();
  drawCards(s, s.player, HAND_SIZE);
  drawCards(s, s.enemy, HAND_SIZE);
  refreshIntent(s);
  s.stats.turnsPlayed = 1;
  return s;
}

function repaint() {
  renderAll(state);
}

function playCard(index) {
  if (busy || !state || state.over || state.turn !== 'player') return;
  const card = state.player.hand[index];
  if (!card || !canPlay(state, card)) return;
  busy = true;
  const uid = card.uid;
  sfx.playCard();
  markPlayingCard(uid);
  setTimeout(() => {
    const events = playPlayerCard(state, uid);
    for (const ev of events) {
      if (ev.kind === 'strike') sfx.strike();
      if (ev.kind === 'ward') sfx.ward();
      if (ev.kind === 'bloom') sfx.heal();
      if (ev.kind === 'chill') sfx.chill();
      if (ev.kind === 'toll') sfx.toll();
      if (ev.kind === 'spark') sfx.spark();
    }
    animateEvents(events);
    repaint();
    if (!checkEnd(state)) busy = false;
    else finish();
  }, TIMING.cardPlay / 2);
}

function markPlayingCard(uid) {
  const el = document.querySelector(`.card[data-uid="${uid}"]`);
  if (el) el.classList.add('playing');
}

function endTurn() {
  if (busy || !state || state.over || state.turn !== 'player') return;
  busy = true;
  runEnemyTurn();
}

function runEnemyTurn() {
  const events = takeEnemyTurn(state);
  renderAll(state);
  for (const ev of events) {
    if (ev.kind === 'enemy-strike') sfx.strike();
    if (ev.kind === 'enemy-ward') sfx.ward();
    if (ev.kind === 'enemy-bloom') sfx.heal();
    if (ev.kind === 'enemy-drain') sfx.chill();
    if (ev.kind === 'enemy-toll') sfx.toll();
  }
  animateEvents(events);

  setTimeout(() => {
    if (checkEnd(state)) { finish(); return; }
    // She plans her next move, visible to the player during their whole turn.
    refreshIntent(state);
    beginPlayerTurn(state);
    if (state.player.toll > 0) announce('✦ Toll: your light is dimmed this turn.');
    repaint();
    state.stats.turnsPlayed += 1;
    busy = false;
  }, 900);
}

function finish() {
  busy = true;
  setTimeout(() => {
    if (state.over === 'win') sfx.win(); else sfx.lose();
    showEnd(state);
    busy = false;
  }, 800);
}

function start() {
  state = freshDuel();
  showTable();
  repaint();
}

// Showcase mode: ?demo=win or ?demo=lose lands on that end screen for screenshots
// and streaming previews, with a sample duel's stats filled in.
function showcase() {
  const demo = new URLSearchParams(location.search).get('demo');
  if (demo !== 'win' && demo !== 'lose') return false;
  state = freshDuel();
  if (demo === 'win') {
    state.enemy.life = 0;
    state.stats = { turnsPlayed: 14, damageDealt: 31, cardsPlayed: 22, damageTaken: 19 };
  } else {
    state.player.life = 0;
    state.stats = { turnsPlayed: 12, damageDealt: 18, cardsPlayed: 19, damageTaken: 26 };
  }
  state.over = demo;
  showTable();
  showEnd(state);
  return true;
}

function boot() {
  if (showcase()) return;
  showTitle();
  bindInput({
    onPlayIndex: playCard,
    onEndTurn: endTurn,
    onBegin: () => { sfx.deal(); start(); },
    onAgain: () => { sfx.deal(); start(); },
  });
}

boot();

// Test hook: lets automated checks read the duel and drive turns.
window.__moon = { get state() { return state; }, playCard, endTurn, start };
