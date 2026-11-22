// Hand-in program for the Moonwell Duel entry (Node 22, standard library only).
// The game itself is the game/ folder: plain static ES modules a desktop browser
// loads offline, no build step and no network request. This program copies game/
// and screenshots/ into /output (MAKEFUN_OUTPUT_DIR stands in outside the grader)
// and writes /output/dossier.json — the judge view the make.fun library builds.
//
// Play locally: `node serve.ts`, then open http://localhost:8080 in desktop Chrome.
// Build the hand-in: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const entryDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(entryDir, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(entryDir, 'screenshots'))) {
  cpSync(join(entryDir, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps, restated: the dossier text budget, the screenshot count and
// size, and the game/ folder limits. Passing them here refuses an entry the gate
// would refuse anyway (over-large screenshots, too many game files, long paths).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

// Say what was handed in, so a local run confirms itself at a glance.
const dossierBytes = statSync(join(outputDir, 'dossier.json')).size;
console.log(`handed in: game/, ${existsSync(join(outputDir, 'screenshots')) ? '4 screenshots, ' : ''}dossier.json (${dossierBytes} bytes) -> ${outputDir}`);
