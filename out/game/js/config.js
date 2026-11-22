// config.js — the duel's constants: suits, life, mana curve, timing.
export const MAX_LIFE = 26;
export const WARDEN_LIFE = 24;
export const MAX_MANA = 6;
export const START_MANA = 1;
export const HAND_SIZE = 5;
export const DECK_COPIES = 2; // copies of each card in a deck
export const WITHER_TURN = 11; // the moonwell's cold bites both duelists from this turn
export const WARDEN_HESITATION = 0.08; // the Warden occasionally loses her nerve

export const SUITS = {
  bloom: { name: 'Bloom', glyph: '✿', color: '#67d98b', dark: '#123722', shape: 'round' },
  frost: { name: 'Frost', glyph: '❄', color: '#6fc3ff', dark: '#0f2a44', shape: 'hex' },
  ember: { name: 'Ember', glyph: '✹', color: '#ff8a5c', dark: '#3d1408', shape: 'spike' },
  shade: { name: 'Shade', glyph: '✦', color: '#b58cff', dark: '#221242', shape: 'diamond' },
};

export const SUIT_ORDER = ['bloom', 'frost', 'ember', 'shade'];

// Animation timing the render layer respects (ms).
export const TIMING = {
  cardPlay: 340,
  floatLife: 1100,
  dealStagger: 70,
};
