/*
 * link-check.mjs — every file path named in the docs must exist.
 *
 * This project's recurring failure is a reference that outlives the thing it
 * points at: LEARNING-LOG.md L17 (a baseline that could not be reproduced),
 * L18 (a test fixture naming a dead schema), and the 19 Sep swap, where the
 * app's schema panel still listed four tables that had been replaced.
 * Prose rots the same way and nothing was checking it.
 *
 * It reads every .md file, pulls out anything that looks like a path — a
 * backticked `app/policy.js`, a markdown link to a local file — and reports the
 * ones that do not exist. External URLs are not fetched; only counted.
 *
 * Run: node evals/link-check.mjs
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', '__pycache__']);

/* A backticked token counts as a path if it has a slash or a known extension.
 * Prose in backticks (`GROUP BY`, `HAVING`) must not be mistaken for a file. */
const EXT = /\.(md|py|js|mjs|json|html|sql|css|png|sh|txt|ipynb|zip)$/i;

/* Things that are shaped like paths and are not paths:
 *   openai/gpt-oss-120b   a model id — a slash, no extension
 *   <firstname>.json      a placeholder in a naming convention
 *   .json / .sql          an extension being discussed as an extension
 * A real directory reference keeps its trailing slash and is checked. */
const PLACEHOLDER_STEMS = new Set(['firstname', 'lastname', 'name', 'yourname', 'id', 'ref']);
const isPlaceholder = t =>
  /[<>*]/.test(t) || /^\.[a-z]+$/i.test(t) ||
  PLACEHOLDER_STEMS.has((t.split('/').pop() || '').replace(EXT, '').toLowerCase());
const isModelId = t => t.includes('/') && !t.endsWith('/') && !EXT.test(t);

const looksLikePath = t =>
  !/\s/.test(t) && !isPlaceholder(t) && !isModelId(t) &&
  (EXT.test(t) || (t.includes('/') && !t.startsWith('http')));

function markdownFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) markdownFiles(join(dir, e.name), out);
    } else if (e.name.endsWith('.md')) out.push(join(dir, e.name));
  }
  return out;
}

/* `path§4`, `path` followed by a trailing comma, and anchors all resolve to the
 * file itself. Strip what is not part of the name. */
function clean(t) {
  return t.replace(/[#§].*$/, '').replace(/[.,;:)]+$/, '').trim();
}

/* Docs name a file by its basename far more often than by its full path —
 * "`verify.py` reports problems: 0" rather than "study-questions/verify.py".
 * So build a basename index once and accept a match anywhere in the repo. */
function indexBasenames(dir, into = new Set()) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      into.add(e.name + '/');
      indexBasenames(join(dir, e.name), into);
    } else into.add(e.name);
  }
  return into;
}
const BASENAMES = indexBasenames(ROOT);

/* Append-only logs name files that were deliberately renamed or deleted. Those
 * references are the record, not rot — LEARNING-LOG.md L8 and L10, and the
 * TODO-HYPOTHESIS-v1.md to ANALYSIS-PLAN.md rename. Listing them here is the
 * only way a link check can coexist with a history that must not be edited. */
const HISTORICAL = new Set([
  'TODO-HYPOTHESIS-v1.md',        // renamed to ANALYSIS-PLAN.md, 14 Sep
  'hackathon/',                   // deleted 13 Sep, LEARNING-LOG.md L10
  'hackathon/evidence/mini-screen-submission/',
  'screener/mini-screen-submission/',
  'RECRUITMENT-2SEP.md',          // superseded by RECRUITMENT.md
  'DISCORD-QUERY.md',
  'SUBMISSION.md',                // not written yet; due 7 Oct
  'rounds-compare.py',            // read the deleted hackathon/ copy, LEARNING-LOG.md L10
]);

const files = markdownFiles(ROOT);
let checked = 0, external = 0, historical = 0;
const missing = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const here = dirname(file);
  const found = new Set();

  for (const m of text.matchAll(/`([^`\n]+)`/g)) if (looksLikePath(m[1])) found.add(m[1]);
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(m[1])) { external++; continue; }
    found.add(m[1]);
  }

  for (const raw of found) {
    const t = clean(raw);
    if (!t || t.startsWith('http')) continue;
    if (HISTORICAL.has(t)) { historical++; continue; }
    checked++;
    // Written relative to this file, relative to the repo root, or by basename.
    const ok =
      [join(here, t), join(ROOT, t)].some(p => {
        try { return existsSync(p) && statSync(p) && true; } catch { return false; }
      }) || BASENAMES.has(t) || BASENAMES.has(t.replace(/\/$/, '') + '/');
    if (!ok) missing.push({ file: relative(ROOT, file), path: t });
  }
}

console.log(`\nmarkdown files: ${files.length}   paths checked: ${checked}   ` +
            `missing: ${missing.length}`);
console.log(`external links (not fetched): ${external}   ` +
            `deliberately historical, skipped: ${historical}`);

if (missing.length) {
  console.log('\nMISSING — named in the docs, not on disk:\n');
  const byFile = {};
  for (const m of missing) (byFile[m.file] ||= []).push(m.path);
  for (const [f, paths] of Object.entries(byFile)) {
    console.log(`  ${f}`);
    for (const p of [...new Set(paths)].sort()) console.log(`      ${p}`);
  }
  console.log('');
}

console.log(missing.length ? 'FAILED\n' : 'OK\n');
process.exit(missing.length ? 1 : 0);
