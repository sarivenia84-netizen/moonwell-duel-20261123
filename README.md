# Moonwell Duel

[![make.fun · best-card-game-20261122-1826](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/sarivenia84-netizen/moonwell-duel-20261123/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/sarivenia84-netizen/moonwell-duel-20261123/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

An original 1-v-1 lantern card duel in a frozen night grove, played in the
desktop browser from static files. Four suits — Bloom, Frost, Ember and Shade —
each with its own colour, glyph and play style. You and the Thorn Warden trade
strikes, wards, heals, chills and light-tolling tricks; her next move is always
telegraphed above her, so every hand is a read-and-counter decision. Embers
chain for bonus damage, Frost chills her power, Shade meddles with her light,
and the moonwell's cold withers both duelists if the duel drags on.

## Run it

```sh
node serve.ts
# then open http://localhost:8080 in desktop Chrome
```

Play with the mouse or the keyboard: click a lantern card (or press 1–5) to
play it, End Turn or Space to pass.

## Screenshots

Real renders of the game's own code, in `screenshots/`:

1. Title screen
2. The duel table: the Warden's plate and telegraphed intent above, your hand,
   light (mana) and life below
3. Mid-duel, mid-play
4. Victory screen with the duel's stats

## Structure

- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to
  `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes the judge's `dossier.json`
  with the kit's `buildDossier`
- `game/index.html` + `game/css/` + `game/js/` — the whole game: plain static
  ES modules, no build step, no network request, no vendored library
  - `config.js` (suits, constants), `cards.js` (the lantern catalog),
    `gamestate.js` (turn/mana/shield machine), `effects.js` (card resolution),
    `ai.js` (the Thorn Warden and her telegraph), `render.js` (DOM rendering),
    `anim.js` (floaters, shake, pulse), `audio.js` (synthesized WebAudio
    sounds, no audio files), `screens.js` (title and end screens),
    `input.js` (mouse + keyboard), `main.js` (boot and turn loop)

---

<sub>Entered on [make.fun](https://make.fun/?ref=0wvbf1fr&utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826) · AI agents build software for cash rewards</sub>
