// gamestate.js — the duel's state machine: turns, mana, hands, shields, chill and toll.
import { MAX_LIFE, WARDEN_LIFE, WITHER_TURN, MAX_MANA, START_MANA, HAND_SIZE } from './config.js';
import { buildDeck } from './cards.js';

export function newDuel() {
  const state = {
    player: freshSide(MAX_LIFE),
    enemy: freshSide(WARDEN_LIFE),
    turn: 'player',
    turnNumber: 1,
    over: null, // null | 'win' | 'lose'
    log: 'The duel begins.',
    playedSuitsThisTurn: [],
    stats: { turnsPlayed: 0, damageDealt: 0, cardsPlayed: 0 },
  };
  return state;
}

function freshSide(life) {
  return {
    life,
    maxLife: life,
    mana: START_MANA,
    maxMana: START_MANA,
    shield: 0,
    chill: 0,
    toll: 0,
    deck: shuffle(buildDeck()),
    hand: [],
    discard: [],
  };
}

export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function drawCards(state, side, n) {
  const drawn = [];
  for (let i = 0; i < n; i++) {
    if (side.deck.length === 0) side.deck = shuffle(side.discard.splice(0));
    if (side.deck.length === 0) break;
    if (side.hand.length < 7) {
      const card = side.deck.pop();
      side.hand.push(card);
      drawn.push(card);
    }
  }
  return drawn;
}

export function beginPlayerTurn(state) {
  state.turn = 'player';
  state.turnNumber += 1;
  state.playedSuitsThisTurn = [];
  const p = state.player;
  p.maxMana = Math.min(MAX_MANA, p.maxMana + 1);
  p.mana = Math.max(0, p.maxMana - p.toll);
  p.toll = 0;
  p.chill = 0; // chill sits on the enemy side only
  drawCards(state, p, 1);
  if (p.hand.length === 0) drawCards(state, p, HAND_SIZE);
  wither(state, p);
  state.log = `Turn ${state.turnNumber}: your light refills to ${p.mana}.`;
}

export function beginEnemyTurn(state) {
  state.turn = 'enemy';
  const e = state.enemy;
  e.maxMana = Math.min(MAX_MANA, e.maxMana + 1);
  e.mana = Math.max(0, e.maxMana - e.toll);
  e.toll = 0;
  drawCards(state, e, 1);
  if (e.hand.length === 0) drawCards(state, e, 5);
  wither(state, e);
}

// The moonwell's cold presses in as the duel drags on: both duelists fade after the
// wither turn, so the duel always finds an end.
export function wither(state, side) {
  const cold = state.turnNumber - WITHER_TURN;
  if (cold > 0) side.life = Math.max(0, side.life - cold);
}

export function canPlay(state, card) {
  return state.turn === 'player' && !state.over && state.player.mana >= card.cost;
}

export function removeFromHand(side, uid) {
  const i = side.hand.findIndex((c) => c.uid === uid);
  if (i === -1) return null;
  return side.hand.splice(i, 1)[0];
}

export function applyDamage(state, targetSide, amount) {
  let dealt = 0;
  let left = amount;
  if (targetSide.shield > 0) {
    const absorbed = Math.min(targetSide.shield, left);
    targetSide.shield -= absorbed;
    left -= absorbed;
  }
  if (left > 0) {
    targetSide.life = Math.max(0, targetSide.life - left);
    dealt = left;
  }
  return { dealt, absorbed: amount - dealt };
}

export function checkEnd(state) {
  if (state.enemy.life <= 0 && state.player.life <= 0) state.over = 'lose'; // mutual fall favors the warden
  else if (state.enemy.life <= 0) state.over = 'win';
  else if (state.player.life <= 0) state.over = 'lose';
  return state.over;
}
