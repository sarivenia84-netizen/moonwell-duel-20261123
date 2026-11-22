// input.js — keyboard and mouse: cards by click or 1–5, end turn by Space or button.
export function bindInput({ onPlayIndex, onEndTurn, onBegin, onAgain }) {
  const hand = document.getElementById('hand');

  hand.addEventListener('click', (ev) => {
    const cardEl = ev.target.closest('.card');
    if (!cardEl) return;
    onPlayIndex(Number(cardEl.dataset.index));
  });

  hand.addEventListener('mouseover', (ev) => {
    const cardEl = ev.target.closest('.card');
    if (cardEl) cardEl.classList.add('hovered');
  });
  hand.addEventListener('mouseout', (ev) => {
    const cardEl = ev.target.closest('.card');
    if (cardEl) cardEl.classList.remove('hovered');
  });

  document.getElementById('btn-end').addEventListener('click', onEndTurn);
  document.getElementById('btn-begin').addEventListener('click', onBegin);
  document.getElementById('btn-again').addEventListener('click', onAgain);
  document.getElementById('btn-retry').addEventListener('click', onAgain);

  const how = document.getElementById('howto');
  document.getElementById('btn-how').addEventListener('click', () => how.classList.toggle('hidden'));
  document.getElementById('btn-close-how').addEventListener('click', () => how.classList.add('hidden'));

  document.addEventListener('keydown', (ev) => {
    if (ev.repeat) return;
    if (ev.code === 'Space') {
      ev.preventDefault();
      onEndTurn();
      return;
    }
    const n = Number(ev.key);
    if (n >= 1 && n <= 7) onPlayIndex(n - 1);
  });
}
