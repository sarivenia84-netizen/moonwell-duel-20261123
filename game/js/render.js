// render.js — draws the whole table as DOM: plates, mana pips, the hand, the intent.
import { SUITS } from './config.js';
import { floatNumber, pulse, announce } from './anim.js';

const $ = (id) => document.getElementById(id);

export function renderAll(state) {
  renderPlates(state);
  renderMana(state);
  renderHand(state);
  renderIntent(state);
  renderNotes(state);
  announce(state.log);
  $('deck-n').textContent = String(state.player.deck.length);
}

export function renderPlates(state) {
  const p = state.player, e = state.enemy;
  $('player-life').style.width = `${(p.life / p.maxLife) * 100}%`;
  $('player-life-text').textContent = `${p.life} / ${p.maxLife}`;
  $('warden-life').style.width = `${(e.life / e.maxLife) * 100}%`;
  $('warden-life-text').textContent = `${e.life} / ${e.maxLife}`;
  setShield('player', p.shield);
  setShield('warden', e.shield);
}

function setShield(prefix, n) {
  const badge = $(`${prefix}-shield`);
  badge.classList.toggle('hidden', n <= 0);
  $(`${prefix}-shield-n`).textContent = String(n);
}

export function renderMana(state) {
  const box = $('mana-pips');
  const p = state.player;
  box.innerHTML = '';
  for (let i = 0; i < p.maxMana; i++) {
    const pip = document.createElement('span');
    pip.className = `pip ${i < p.mana ? 'lit' : 'spent'}`;
    box.appendChild(pip);
  }
  $('mana-text').textContent = `${p.mana}/${p.maxMana}`;
}

export function renderHand(state, playable = () => true) {
  const hand = $('hand');
  hand.innerHTML = '';
  state.player.hand.forEach((card, i) => {
    const el = document.createElement('button');
    el.className = `card ${card.suit} ${playable(card) ? '' : 'unplayable'}`;
    el.dataset.uid = card.uid;
    el.dataset.index = i;
    el.style.setProperty('--tilt', `${(i - 2) * 1.6}deg`);
    el.innerHTML = cardFace(card, i + 1);
    hand.appendChild(el);
  });
}

export function cardFace(card, keyHint) {
  const suit = SUITS[card.suit];
  return `
    <span class="key-hint">${keyHint}</span>
    <span class="cost">${card.cost}</span>
    <span class="glyph">${suit.glyph}</span>
    <span class="card-name">${card.name}</span>
    <span class="card-text">${card.text}</span>
    <span class="suit-tag" style="color:${suit.color}">${suit.name}</span>`;
}

export function renderIntent(state) {
  const it = state.enemyIntent;
  $('intent-text').textContent = it ? it.text : '…';
}

export function renderNotes(state) {
  $('chill-note').classList.toggle('hidden', !(state.enemy.chill > 0));
  $('toll-note').classList.toggle('hidden', !(state.enemy.toll > 0));
}

// Event → animation. Called by main.js after each resolution.
export function animateEvents(events) {
  for (const ev of events) {
    switch (ev.kind) {
      case 'strike': {
        const side = ev.side;
        if (ev.amount > 0) { floatNumber(`-${ev.amount}`, side, 'dmg'); shake('screen-table'); pulse(side === 'enemy' ? 'warden-life' : 'player-life', 'flash'); }
        else if (ev.absorbed > 0) floatNumber(`🛡 ${ev.absorbed}`, side, 'block');
        if (ev.card) break;
        break;
      }
      case 'enemy-strike':
        if (ev.dealt > 0) { floatNumber(`-${ev.dealt}`, 'player', 'dmg'); shake('screen-table'); pulse('player-life', 'flash'); }
        else if (ev.absorbed > 0) floatNumber(`🛡 ${ev.absorbed}`, 'player', 'block');
        break;
      case 'ward': floatNumber(`🛡 +${ev.amount}`, ev.side, 'block'); pulse(ev.side === 'player' ? 'player-plate' : 'warden-plate'); break;
      case 'enemy-ward': floatNumber(`🛡 +${ev.amount}`, 'enemy', 'block'); pulse('warden-plate'); break;
      case 'bloom': if (ev.amount > 0) floatNumber(`+${ev.amount}`, ev.side, 'heal'); break;
      case 'enemy-bloom': if (ev.amount > 0) floatNumber(`+${ev.amount}`, 'enemy', 'heal'); break;
      case 'chill': floatNumber(`❄ chill ${ev.amount}`, 'enemy', 'frosty'); break;
      case 'toll': floatNumber(`✦ toll ${ev.amount}`, 'enemy', 'frosty'); break;
      case 'enemy-toll': floatNumber(`✦ toll ${ev.amount}`, 'player', 'frosty'); break;
      case 'enemy-drain': if (ev.amount > 0) floatNumber(`🛡 -${ev.amount}`, 'player', 'block'); break;
      case 'spark': floatNumber(`✹ spark +${ev.amount}`, 'player', 'dmg'); break;
      default: break;
    }
  }
}
