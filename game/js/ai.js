// ai.js — the Thorn Warden: a readable opponent. Each of her turns she announces her intent
// one turn ahead (the telegraph), then plays the announced card if she can afford it.
// Her style: strike when you are low or unwary, ward before striking big, heal when hurt.
import { beginEnemyTurn, drawCards, removeFromHand } from './gamestate.js';
import { enemyStrike } from './effects.js';
import { WARDEN_HESITATION } from './config.js';

// Choose the card she announces for her next turn. Shown to the player the whole time.
export function planIntent(state) {
  const e = state.enemy;
  const affordable = e.hand.filter((c) => c.cost <= e.maxMana);
  if (affordable.length === 0) return { kind: 'gather', text: 'Gather light' };

  const wantHeal = e.life <= 12 && affordable.some((c) => c.verbs.bloom);
  const wantWard = affordable.some((c) => c.verbs.ward && c.cost >= 2) && e.shield === 0;
  const strikes = affordable.filter((c) => c.verbs.strike);
  const playerVulnerable = state.player.shield === 0;

  if (wantHeal) return pick(affordable.filter((c) => c.verbs.bloom));
  if (wantWard && !playerVulnerable === false) return pick(affordable.filter((c) => c.verbs.ward));
  if (strikes.length && (playerVulnerable || Math.random() < 0.6)) return pick(strikes);
  return pick(affordable);
}

function pick(list) {
  const card = list[Math.floor(Math.random() * list.length)];
  return { kind: 'play', card, text: card.name, cost: card.cost };
}

// She takes her turn: plays the announced card, then one more if she has light for it.
export function takeEnemyTurn(state) {
  beginEnemyTurn(state);
  const events = [];
  const plan = state.enemyIntent;
  if (plan && plan.kind === 'play' && plan.card && Math.random() >= WARDEN_HESITATION) {
    const card = state.enemy.hand.find((c) => c.uid === plan.card.uid) ??
                 state.enemy.hand.find((c) => c.id === plan.card.id);
    if (card && state.enemy.mana >= card.cost) {
      state.enemy.mana -= card.cost;
      removeFromHand(state.enemy, card.uid);
      state.enemy.discard.push(card);
      events.push({ kind: 'enemy-play', card });
      if (card.verbs.strike) {
        const result = enemyStrike(state, card.verbs.strike);
        events.push({ kind: 'enemy-strike', ...result, card });
      }
      if (card.verbs.ward) {
        state.enemy.shield += card.verbs.ward;
        events.push({ kind: 'enemy-ward', amount: card.verbs.ward, card });
      }
      if (card.verbs.bloom) {
        const healed = Math.min(card.verbs.bloom, state.enemy.maxLife - state.enemy.life);
        state.enemy.life += healed;
        events.push({ kind: 'enemy-bloom', amount: healed, card });
      }
      if (card.verbs.chill) {
        // her chill weakens the player's next... no: chill she casts chills nothing of hers;
        // for flavor her chill cards reduce the player's ward by its amount instead.
        const drained = Math.min(card.verbs.chill, state.player.shield);
        state.player.shield -= drained;
        events.push({ kind: 'enemy-drain', amount: drained, card });
      }
      if (card.verbs.toll) {
        state.player.toll += card.verbs.toll;
        events.push({ kind: 'enemy-toll', amount: card.verbs.toll, card });
      }
      if (card.verbs.draw) drawCards(state, state.enemy, card.verbs.draw);
      state.log = `The Warden plays ${card.name}.`;
    } else {
      events.push({ kind: 'enemy-pass' });
      state.log = 'The Warden hesitates.';
    }
  } else {
    events.push({ kind: 'enemy-pass' });
    state.log = 'The Warden gathers her light.';
  }
  return events;
}

export function refreshIntent(state) {
  state.enemyIntent = planIntent(state);
  return state.enemyIntent;
}
