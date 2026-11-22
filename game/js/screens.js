// screens.js — the title screen and the victory / defeat flourishes.
const $ = (id) => document.getElementById(id);

export function show(id) {
  $(id).classList.remove('hidden');
}
export function hide(id) {
  $(id).classList.add('hidden');
}

export function showTitle() {
  show('screen-title');
  hide('screen-table'); hide('screen-victory'); hide('screen-defeat');
}

export function showTable() {
  show('screen-table');
  hide('screen-title'); hide('screen-victory'); hide('screen-defeat');
}

export function showEnd(state) {
  hide('screen-table');
  if (state.over === 'win') {
    show('screen-victory');
    $('win-stats').textContent =
      `Won in ${state.stats.turnsPlayed} turns · ${state.stats.damageDealt} damage dealt · ${state.stats.cardsPlayed} cards played`;
  } else {
    show('screen-defeat');
    $('lose-stats').textContent =
      `Fell after ${state.stats.turnsPlayed} turns · ${state.stats.damageDealt} damage dealt · ${state.stats.cardsPlayed} cards played`;
  }
}
