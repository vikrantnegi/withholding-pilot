/*
 * grader-conformance.mjs — proves the app's grader and the scoring rule agree.
 *
 * The app tells a learner right or wrong with app/grade-rule.js. The study is
 * scored with study-questions/grade_rule.py. Those are two implementations of one
 * rule in two languages, which is exactly how they drift apart — and a drift here
 * is invisible, because each one looks correct on its own.
 *
 * So: grade all 75 queries in items.py with Python, hand the JS grader the same
 * inputs, and demand the same verdict AND the same reason every time. The JS side
 * needs no SQL engine; Python supplies the rows it saw.
 *
 * This is the same discipline as validate-substance-bar.js, which loads the real
 * isSubstantive() rather than reimplementing it. Here the port cannot be avoided —
 * the browser has no Python — so it gets tested instead of trusted.
 *
 * Run: node evals/grader-conformance.mjs
 */
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const GRADE = createRequire(import.meta.url)(join(ROOT, 'app', 'grade-rule.js'));

const raw = execFileSync('python3', [join(ROOT, 'study-questions', 'emit_verdicts.py')],
                         { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const cases = JSON.parse(raw);

let same = 0;
const drift = [];

for (const c of cases) {
  const js = GRADE.grade({ sql: c.sql, got: c.got, error: c.error, want: c.want });
  if (js.verdict === c.verdict && js.reason === c.reason) { same++; continue; }
  drift.push({ ...c, js });
}

const byVerdict = {};
for (const c of cases) byVerdict[c.verdict] = (byVerdict[c.verdict] || 0) + 1;

console.log(`\nqueries compared: ${cases.length}   agree: ${same}   drift: ${drift.length}`);
console.log(`python verdicts: ${JSON.stringify(byVerdict)}`);
console.log(`references: ${cases.filter(c => c.kind === 'reference').length}` +
            `   wrong models: ${cases.filter(c => c.kind === 'wrong_model').length}`);

if (drift.length) {
  console.log('\nDRIFT — the app and the scoring rule disagree on these:\n');
  for (const d of drift) {
    console.log(`--- ${d.item} (${d.label})`);
    console.log(`    ${d.sql.replace(/\s+/g, ' ').slice(0, 130)}`);
    console.log(`    python: ${d.verdict}  ${JSON.stringify(d.reason)}`);
    console.log(`    js:     ${d.js.verdict}  ${JSON.stringify(d.js.reason)}\n`);
  }
}

/* The corpus has to actually exercise the rule. All-correct or all-wrong would
 * agree trivially and prove nothing. */
const gates = [
  ['every reference grades correct',
   cases.filter(c => c.kind === 'reference').every(c => c.verdict === 'correct')],
  ['no listed wrong model grades correct',
   cases.filter(c => c.kind === 'wrong_model').every(c => c.verdict !== 'correct')],
  ['clause 2 catches something', (byVerdict.invalid || 0) > 0],
  ['some query errors', (byVerdict.error || 0) > 0],
  ['some query runs and returns different rows', (byVerdict.wrong || 0) > 0],
];
console.log('COVERAGE');
let bad = drift.length;
for (const [name, ok] of gates) {
  console.log(`  ${ok ? 'ok   ' : 'FAIL '} ${name}`);
  if (!ok) bad++;
}

console.log(`\n${bad ? 'FAILED' : 'OK'} — ${drift.length} drift, ${gates.filter(g => !g[1]).length} coverage failures\n`);
process.exit(bad ? 1 : 0);
