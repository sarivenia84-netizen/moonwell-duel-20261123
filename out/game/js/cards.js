// cards.js — the lantern card catalog and deck building.
// Effects are data, resolved once by effects.js: cost, suit, and one or more verbs.
import { DECK_COPIES } from './config.js';

// cost: mana. verbs: strike (damage), ward (shield), bloom (heal),
// chill (enemy strikes weakened), toll (enemy loses 1 mana next turn),
// draw (cards drawn now), spark (ember chain bonus applies to strike).
export const CARD_CATALOG = [
  { id: 'firefly',    name: 'Firefly Dart',   suit: 'ember', cost: 1, text: 'Strike 2.',            verbs: { strike: 2 } },
  { id: 'cinder',     name: 'Cinder Lash',    suit: 'ember', cost: 2, text: 'Strike 4. +2 if you played an Ember this turn.', verbs: { strike: 4, spark: 2 } },
  { id: 'bonfire',    name: 'Bonfire Roar',   suit: 'ember', cost: 4, text: 'Strike 7.',            verbs: { strike: 7 } },
  { id: 'mossgown',   name: 'Mossgown Rest',  suit: 'bloom', cost: 1, text: 'Heal 3.',              verbs: { bloom: 3 } },
  { id: 'seedling',   name: 'Seedling Vigil', suit: 'bloom', cost: 2, text: 'Heal 4. Draw 1.',      verbs: { bloom: 4, draw: 1 } },
  { id: 'grove',      name: 'Grove of Wards', suit: 'bloom', cost: 3, text: 'Ward 5. Heal 2.',      verbs: { ward: 5, bloom: 2 } },
  { id: 'rime',       name: 'Rime Sigil',     suit: 'frost', cost: 1, text: 'Her next strike deals 2 less.', verbs: { chill: 2 } },
  { id: 'glacier',    name: 'Glacier Veil',   suit: 'frost', cost: 2, text: 'Ward 4. Chill 1.',     verbs: { ward: 4, chill: 1 } },
  { id: 'hoarfrost',  name: 'Hoarfrost Tide', suit: 'frost', cost: 3, text: 'Ward 3. Her next strike deals 3 less.', verbs: { ward: 3, chill: 3 } },
  { id: 'duskmoth',   name: 'Dusk Moth',      suit: 'shade', cost: 1, text: 'Strike 1. Draw 1.',    verbs: { strike: 1, draw: 1 } },
  { id: 'tollbell',   name: 'Toll Bell',      suit: 'shade', cost: 2, text: 'She loses 1 light next turn.', verbs: { toll: 1 } },
  { id: 'nightbloom', name: 'Nightbloom Kiss',suit: 'shade', cost: 3, text: 'Strike 3. Heal 3.',    verbs: { strike: 3, bloom: 3 } },
];

// A duel deck: two of each card, shuffled by the state layer.
export function buildDeck() {
  const deck = [];
  for (const card of CARD_CATALOG) {
    for (let i = 0; i < DECK_COPIES; i++) deck.push({ ...card, uid: `${card.id}-${i}` });
  }
  return deck;
}

export function cardById(id) {
  return CARD_CATALOG.find((c) => c.id === id);
}
