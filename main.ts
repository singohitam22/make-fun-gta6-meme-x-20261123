// gta6-meme-x-01 — "Post a GTA 6 meme on X" (make.fun bounty, $500, top 50).
//
// The entry IS the X post, not this program. The meme (meme.png) was made by
// an AI agent: a tired gamer watches GTA VI crawl down at 87% while the
// make.fun ghost — the white ghost with sparkle eyes and a magenta star coin
// from make.fun's press kit — sits on the couch next to him. The joke is the
// download: "GTA 6 NEEDS 400 GB" / "MY WEDDING PHOTOS: DELETED".
//
// This program has one job, and it is deliberately boring: copy POST.json
// from the repository root into the grader's output directory, where the
// house reads the post's address, fetches the post from X itself, and hands
// the post's first picture plus its text to the judge. Nothing written here
// is judged; the post is.
//
// POST.json currently holds the starter placeholder address. It MUST be
// replaced with the real post address (https://x.com/<handle>/status/<id>)
// after the meme is posted on X, before this entry is submitted — the gate
// refuses the placeholder (valid 0).
//
// Run locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The grader mounts the repository at /bot and wants output at /output.
// The two environment variables let us run the same file outside the
// grader, against a local checkout, without changing any behaviour.
const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_FILE = 'POST.json';

// Read the post file exactly as it is in the repository — no parsing, no
// rewriting — so the bytes the gate sees are the bytes we ship. A malformed
// POST.json is the entrant's problem to fix before submitting, not something
// to paper over here: fail loudly instead of writing a guess.
mkdirSync(OUTPUT_DIR, { recursive: true });

let postJson: string;
try {
  postJson = readFileSync(join(BOT_DIR, POST_FILE), 'utf8');
} catch (err) {
  console.error(`Could not read ${POST_FILE} from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// A quick sanity check that costs nothing: the file must at least look like
// a JSON object with a url string. The gate does the real validation; this
// only catches the "empty file / wrong file" mistake early, locally.
let parsed: unknown;
try {
  parsed = JSON.parse(postJson);
} catch (err) {
  console.error(`${POST_FILE} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error(`${POST_FILE} must be a JSON object with a string "url" field.`);
  process.exit(1);
}

writeFileSync(join(OUTPUT_DIR, POST_FILE), postJson);
console.log(`Copied ${POST_FILE} to ${OUTPUT_DIR}.`);
