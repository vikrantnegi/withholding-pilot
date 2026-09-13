#!/usr/bin/env node
/*
 * recheck.js — re-run the CURRENT guard over generations a PAST run already
 * paid for. Zero model calls.
 *
 *   node evals/recheck.js evals/all.md
 *
 * Why this exists. A sheet costs ~100K tokens, half a day's free budget. When
 * the guard changes — and it will, L12 was the first of those — you need to
 * know whether yesterday's rejections were leaks or the guard's own mistakes.
 * Re-running the model to find out wastes the budget and answers a question
 * about the guard by re-testing the writer.
 *
 * The sheet already records every rejected generation verbatim. That makes a
 * finished run a permanent regression corpus: each rejected string is a case
 * the guard once called a leak, and each can be re-judged for free.
 */
const fs = require('fs');
const { inspect } = require('../app/hint-guard.js');

const REFERENCE = {
  M1: "SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) >= 3 ORDER BY COUNT(*) DESC, category ASC",
  M2: "SELECT category, MAX(price) FROM products GROUP BY category HAVING MAX(price) > 10000 ORDER BY category ASC",
  M3: "SELECT o.id, c.name, c.city, o.order_date FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status='cancelled' ORDER BY o.order_date ASC, o.id ASC",
};

const file = process.argv[2] || 'evals/all.md';
if (!fs.existsSync(file)) { console.error(`no such sheet: ${file}`); process.exit(1); }
const lines = fs.readFileSync(file, 'utf8').split('\n');

/* Walk the sheet, tracking which question each case belongs to AND what the
 * learner wrote — the guard needs both. A clause only counts as a leak if the
 * learner did not already have it. */
const found = [];
let q = null, pending = null, learner = null, grab = 0;
for (const line of lines) {
  const head = line.match(/^##\s+\d+\.\s+(\S+)\s+—\s+(M\d)/);
  if (head) { q = head[2]; learner = null; grab = 0; continue; }
  if (line.trim() === '-- they wrote') { grab = 1; continue; }
  if (grab === 1) { learner = line.trim(); grab = 0; continue; }
  const rej = line.match(/^-\s+attempt\s+(\S+)\s+rejected\s+—\s+(.*)$/);
  if (rej) { pending = { q, learner, attempt: rej[1], reason: rej[2].trim() }; continue; }
  if (pending && line.startsWith('  > ')) {
    found.push({ ...pending, text: line.slice(4).trim() });
    pending = null;
  }
}

if (!found.length) {
  console.log(`No rejected generations recorded in ${file}.`);
  console.log('Sheets generated before 13 Sep did not print them — re-run to build a corpus.');
  process.exit(0);
}

let stillRejected = 0, nowPasses = 0;
console.log(`Re-judging ${found.length} rejected generation(s) from ${file}\n`);
for (const f of found) {
  const ref = REFERENCE[f.q];
  if (!ref) continue;
  const v = inspect(f.text, { referenceQuery: ref, learnerQuery: f.learner });
  if (v.ok) {
    nowPasses++;
    console.log(`WAS A FALSE POSITIVE  [${f.q}] previously: ${f.reason}`);
    console.log(`  > ${f.text.slice(0, 160)}\n`);
  } else {
    stillRejected++;
    console.log(`STILL A LEAK          [${f.q}] ${v.reason}${v.matched ? ` (${v.matched})` : ''}`);
    console.log(`  > ${f.text.slice(0, 160)}\n`);
  }
}

console.log('---');
console.log(`still rejected by the current guard : ${stillRejected}`);
console.log(`now pass — they were guard mistakes : ${nowPasses}`);
console.log('');
console.log('The first number is the real leak count. The second is what the guard');
console.log('cost you in fallbacks for nothing.');
