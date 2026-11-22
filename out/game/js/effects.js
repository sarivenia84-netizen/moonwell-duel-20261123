// effects.js — resolves a card's verbs against the duel state and reports events for the renderer.
import { applyDamage, removeFromHand, drawCards } from './gamestate.js';

// Resolve the player's card. Returns a list of events:
// {kind:'strike'|'ward'|'bloom'|'chill'|'toll'|'draw'|'spark', side, amount}
export function playPlayerCard(state, uid) {
  const events = [];
  const card = removeFromHand(state.player, uid);
  if (!card) return events;
  state.player.mana -= card.cost;
  state.player.discard.push(card);
  state.stats.cardsPlayed += 1;

  let strike = card.verbs.strike ?? 0;
  let sparkBonus = 0;
  if (card.verbs.spark && state.playedSuitsThisTurn.includes('ember')) {
    sparkBonus = card.verbs.spark;
    strike += sparkBonus;
    events.push({ kind: 'spark', side: 'player', amount: sparkBonus });
  }
  state.playedSuitsThisTurn.push(card.suit);

  if (strike > 0) {
    const eff = Math.max(0, strike - (state.enemy.chill ?? 0) * 0); // chill weakens enemy strikes, not the player's
    const { dealt, absorbed } = applyDamage(state, state.enemy, eff);
    events.push({ kind: 'strike', side: 'enemy', amount: dealt, absorbed, card });
    state.stats.damageDealt += dealt;
  }
  if (card.verbs.ward) {
    state.player.shield += card.verbs.ward;
    events.push({ kind: 'ward', side: 'player', amount: card.verbs.ward });
  }
  if (card.verbs.bloom) {
    const healed = Math.min(card.verbs.bloom, state.player.maxLife - state.player.life);
    state.player.life += healed;
    events.push({ kind: 'bloom', side: 'player', amount: healed });
  }
  if (card.verbs.chill) {
    state.enemy.chill = (state.enemy.chill ?? 0) + card.verbs.chill;
    events.push({ kind: 'chill', side: 'enemy', amount: card.verbs.chill });
  }
  if (card.verbs.toll) {
    state.enemy.toll += card.verbs.toll;
    events.push({ kind: 'toll', side: 'enemy', amount: card.verbs.toll });
  }
  if (card.verbs.draw) {
    drawCards(state, state.player, card.verbs.draw);
    events.push({ kind: 'draw', side: 'player', amount: card.verbs.draw });
  }
  state.log = `You played ${card.name}.`;
  return events;
}

// The enemy's chilled strike is weakened by its chill counter.
export function enemyStrike(state, amount) {
  const eff = Math.max(0, amount - (state.enemy.chill ?? 0));
  state.enemy.chill = 0; // a chill is spent on the next enemy strike
  const { dealt, absorbed } = applyDamage(state, state.player, eff);
  state.stats.damageTaken = (state.stats.damageTaken ?? 0) + dealt;
  return { dealt, absorbed, planned: amount, effective: eff };
}
