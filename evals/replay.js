#!/usr/bin/env node
/*
 * replay.js — the 18 Sep deliverable. Hint quality, judged without touching a participant.
 *
 *   node evals/replay.js                        20 cases, to stdout
 *   node evals/replay.js --all                  every case
 *   node evals/replay.js --out evals/sheet.md   write it to a file
 *
 * WHY THIS EXISTS
 * The leak guard checks a hint does not give the answer away. Nothing checks
 * it is useful. A useless hint makes Arm A's treatment half-absent, and on
 * 28 Sep that looks exactly like "withholding does not work".
 *
 * WHY IT NEEDS NOBODY
 * The hint writer's only input is a learner's wrong query. 122 of those are
 * already on disk from round 2. Replaying stored data costs nothing; asking
 * the seven to try again would burn them as participants.
 *
 * WHAT IT PRODUCES
 * A review sheet. Per case: the learner's query, the reference query, THE
 * DIFFERENCE between them in plain English, and the hint that would have been
 * served. Reading it needs no SQL — the difference is computed for you.
 */

const fs = require('fs');
const path = require('path');
const { serveHint, isGeneric, SOURCE } = require('../app/hint-guard.js');

const LOGS = path.join(__dirname, '..', 'screener/round-2-runbutton/logs');

// The answer key — screener/round-2-runbutton/reference-mini.sql
const REFERENCE = {
  M1: "SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) >= 3 ORDER BY COUNT(*) DESC, category ASC",
  M2: "SELECT category, MAX(price) FROM products GROUP BY category HAVING MAX(price) > 10000 ORDER BY category ASC",
  M3: "SELECT o.id, c.name, c.city, o.order_date FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status='cancelled' ORDER BY o.order_date ASC, o.id ASC",
};
const ASK = {
  M1: "count of products per category, only categories with at least 3, sorted by count then name",
  M2: "highest price per category, only where that price is above 10000, sorted by name",
  M3: "every cancelled order with the customer's name and city, sorted by date then order id",
};
const FALLBACK = {
  M1: "You are counting rows inside each group, then keeping only some groups. Two different clauses do those two jobs.",
  M2: "Your filter is running on single rows, before they are collected into groups. Which clause filters after the grouping?",
  M3: "The order id and date live in one table; the name and city live in another. You need to say which column connects them.",
};

// ---------------------------------------------------------------------------
// THE DIFFERENCE — what makes the sheet readable without knowing SQL
// ---------------------------------------------------------------------------

const KEYWORDS = ['SELECT','FROM','WHERE','GROUP BY','HAVING','ORDER BY','JOIN','ON',
                  'LIMIT','DISTINCT','COUNT','SUM','AVG','MIN','MAX','ASC','DESC'];
const flat = s => String(s || '').replace(/\s+/g, ' ').trim();

/* Spacing-insensitive on purpose: "GROUPBY" is a broken GROUP BY and we want
 * to see it as one, not as an absence. */
function keywordsIn(sql) {
  const spaced   = flat(sql).toUpperCase();
  const squashed = spaced.replace(/\s+/g, '');
  const found = new Set();
  for (const k of KEYWORDS) {
    if (spaced.includes(k)) found.add(k);
    else if (squashed.includes(k.replace(/\s/g, ''))) found.add(k + ' (written without the space)');
  }
  return found;
}

function difference(learnerSql, referenceSql, ev) {
  const out = [];
  if (ev.outcome === 'error') out.push(`the query never ran — the database said: ${ev.error}`);

  const mine = keywordsIn(learnerSql), theirs = keywordsIn(referenceSql);
  const missing = [...theirs].filter(k => !mine.has(k) && !mine.has(k + ' (written without the space)'));
  const extra   = [...mine].filter(k => !theirs.has(k) && !k.includes('without the space'));
  const broken  = [...mine].filter(k => k.includes('without the space'));

  if (broken.length)  out.push(`keyword typed without a space: ${broken.map(k => k.split(' (')[0]).join(', ')}`);
  if (missing.length) out.push(`the reference uses these, the learner does not: ${missing.join(', ')}`);
  if (extra.length)   out.push(`the learner uses these, the reference does not: ${extra.join(', ')}`);
  if (ev.outcome !== 'error' && typeof ev.rows === 'number') {
    out.push(`it ran and returned ${ev.rows} row(s); outcome "${ev.outcome}"`);
  }
  if (!out.length) out.push('no keyword-level difference — the arguments or the wording differ');
  return out;
}

// ---------------------------------------------------------------------------
// The hint writer under test.
//
// PRD-v1 §6 item 2 is not built. Drop a module at evals/model.js exporting
//   module.exports = async (ctx, attempt) => "<hint text>"
// and this harness uses it. Without one, every case shows the fallback.
// ---------------------------------------------------------------------------

let callModel, haveModel = false;
try { callModel = require('./model.js'); haveModel = true; }
catch { callModel = async () => null; }

// ---------------------------------------------------------------------------

function cases() {
  const out = [];
  for (const f of fs.readdirSync(LOGS).filter(f => f.endsWith('.json')).sort()) {
    const who = f.replace(/\.json$/, '');
    const log = JSON.parse(fs.readFileSync(path.join(LOGS, f), 'utf8'));
    for (const ev of log.events) {
      if (!ev.sql || !REFERENCE[ev.q]) continue;
      if (ev.outcome === 'correct' || ev.outcome === 'skipped') continue;
      out.push({ who, ...ev });
    }
  }
  return out;
}

/* Spread across people and questions rather than taking the first N —
 * one person produced 80 of the 122 attempts. */
function spread(all, n) {
  const byKey = {};
  for (const c of all) (byKey[`${c.who}/${c.q}`] ||= []).push(c);
  const keys = Object.keys(byKey).sort();
  const picked = [];
  for (let round = 0; picked.length < n && round < 60; round++) {
    for (const k of keys) if (byKey[k][round] && picked.length < n) picked.push(byKey[k][round]);
  }
  return picked;
}

(async () => {
  const argv = process.argv;
  const all = cases();
  const chosen = spread(all, argv.includes('--all') ? all.length : 20);

  const outIdx = argv.indexOf('--out');
  const outFile = outIdx !== -1 ? argv[outIdx + 1] : null;
  if (outIdx !== -1 && (!outFile || outFile.startsWith('--'))) {
    console.error('--out needs a filename'); process.exit(2);
  }

  const lines = [];
  const say = s => lines.push(s);

  say(`# Hint review sheet\n`);
  say(`Generated ${new Date().toISOString().slice(0,10)} from \`screener/round-2-runbutton/logs/\`.`);
  say(`${all.length} wrong or errored attempts on disk; ${chosen.length} shown, spread across people and questions.\n`);
  say(`No participant was contacted to produce this. Replaying stored attempts costs nothing —`);
  say(`asking the seven to try again would burn them as study participants.\n`);
  if (!haveModel) {
    say(`> **No hint writer configured.** Every case below shows the hand-written fallback.`);
    say(`> Drop a module at \`evals/model.js\` exporting \`async (ctx, attempt) => text\` and re-run.\n`);
  }
  say(`## How to read it\n`);
  say(`You do not need to know SQL. **THE DIFFERENCE** is computed for you. Per case, ask:\n`);
  say(`1. Does the hint point at that difference?`);
  say(`2. Does it stop short of writing the fix?`);
  say(`3. Would you know what to try next after reading it?\n`);
  say(`Three noes on the same question is the writer's fault, not the learner's.\n---\n`);

  let served = 0, fallbacks = 0, generic = 0, rejected = 0;

  for (const [i, c] of chosen.entries()) {
    const ctx = { referenceQuery: REFERENCE[c.q], learnerQuery: c.sql, fallbackHint: FALLBACK[c.q] };
    // With no model there is nothing to reject — don't report empty generations
    // as leak-guard rejections, that would overstate the guard's work.
    const r = haveModel
      ? await serveHint(ctx, callModel)
      : { text: ctx.fallbackHint, source: SOURCE.FALLBACK, modelAttempts: 0, rejections: [] };
    served++;
    if (r.source === SOURCE.FALLBACK) fallbacks++;
    rejected += r.rejections.length;
    const gen = isGeneric(r.text, ctx);
    if (gen) generic++;

    say(`## ${i + 1}. ${c.who} — ${c.q}, attempt ${c.n}\n`);
    say(`**Asked for:** ${ASK[c.q]}\n`);
    say('```sql');
    say('-- they wrote');
    say(flat(c.sql));
    say('-- the reference');
    say(flat(REFERENCE[c.q]));
    say('```\n');
    say(`**THE DIFFERENCE**\n`);
    for (const d of difference(c.sql, REFERENCE[c.q], c)) say(`- ${d}`);
    say('');
    const tags = [`source: ${r.source}`];
    if (r.rejections.length) tags.push(`${r.rejections.length} rejected by the guard`);
    if (gen) tags.push('flagged GENERIC');
    say(`**HINT SERVED** _(${tags.join(', ')})_\n`);
    say(`> ${r.text}\n`);
    for (const rj of r.rejections) say(`- attempt ${rj.attempt} rejected: ${rj.reason}`);
    if (r.rejections.length) say('');
    say(`1. points at the difference?  [ ] yes  [ ] no`);
    say(`2. stops short of the fix?    [ ] yes  [ ] no`);
    say(`3. you'd know what to try?    [ ] yes  [ ] no\n`);
    say('---\n');
  }

  say(`## Totals\n`);
  say(`| | |`);
  say(`|---|---|`);
  say(`| wrong/errored attempts on disk | ${all.length} |`);
  say(`| cases in this sheet | ${served} |`);
  if (haveModel) {
    say(`| served from the model | ${served - fallbacks} |`);
    say(`| fell back to the hand-written hint | ${fallbacks} |`);
    say(`| generations rejected by the leak guard | ${rejected} |`);
    say(`| hints flagged generic (reported, not rejected) | ${generic} |`);
  } else {
    say(`| served from the model | none — no hint writer configured |`);
    say(`| showing the hand-written fallback | ${fallbacks} |`);
    say(`| of those, flagged generic | ${generic} — these fallbacks mention nothing from the learner's own query |`);
  }
  say(``);
  say(`A high fallback count means the model keeps leaking the answer.`);
  say(`A high generic count means it is producing boilerplate that helps nobody.`);
  say(`Both are treatment-quality problems, not hypothesis problems — they belong in`);
  say(`the triage checks in \`TODO-HYPOTHESIS-v1.md\` §4, not in the conclusion.`);

  const text = lines.join('\n');
  if (outFile) { fs.writeFileSync(outFile, text); console.error(`wrote ${outFile} — ${served} cases`); }
  else console.log(text);
})();
