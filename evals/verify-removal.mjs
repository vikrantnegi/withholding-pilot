/* verify-removal.mjs — drives the removal-test page in a real headless browser.
 *
 * What it proves, that no unit test can:
 *   - the page loads with no errors and serves exactly H01-H12, in order
 *   - there is no Help button and no request to anything but sql.js
 *   - every held-out reference grades Correct IN THE PAGE, and every listed
 *     wrong model gets the same verdict in the page as grade_rule.py gives it
 *   - the log says session "removal", carries the participant code and arm,
 *     holds only `attempt` events, and records the three survey answers
 *   - an unknown ?p= code stops the page instead of starting a session
 *
 * SETUP, same as verify-app.mjs: a served copy of app/dist-removal with sql.js
 * local, because a headless browser may not reach cdnjs.
 *   npm i playwright sql.js@1.8.0
 *   cp -r app/dist-removal /tmp/r && cd /tmp/r
 *   cp <node_modules>/sql.js/dist/sql-wasm.{js,wasm} .
 *   sed -i 's|https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js|sql-wasm.js|;
 *           s|locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}`|locateFile: f => f|' index.html
 *   python3 -m http.server 8732 &
 *   node evals/verify-removal.mjs          # override with APP_URL=...
 */
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.APP_URL || 'http://127.0.0.1:8732/index.html';

let pass = 0, fail = 0;
const check = (n, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) { pass++; console.log(`  ok    ${n}`); }
  else { fail++; console.log(`  FAIL  ${n}\n          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`); }
};

// Held-out references and wrong models, with the verdict grade_rule.py gives each.
const cases = JSON.parse(execFileSync('python3', ['-c', `
import json, sqlite3, sys
sys.path.insert(0, ${JSON.stringify(join(ROOT, 'study-questions'))})
from items import ITEMS
from grade_rule import grade
c = sqlite3.connect(':memory:'); c.executescript(open(${JSON.stringify(join(ROOT, 'study-questions', 'schema.sql'))}).read())
out = []
for iid, st, sk, pair, prompt, ref, wrongs, _ in ITEMS:
    if st != 'heldout': continue
    out.append(dict(q=iid, sql=ref, verdict='correct', ask=prompt))
    for name, w in wrongs:
        v, r = grade(c, w, ref); out.append(dict(q=iid, sql=w, verdict=v, name=name))
print(json.dumps(out))
`], { encoding: 'utf8' }));

// CHROMIUM=/path/to/chrome when the installed playwright's own browser is missing.
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});

async function open(query) {
  const page = await browser.newPage();
  const errs = [], reqs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/favicon/i.test(m.location()?.url || '')) errs.push(m.text()); });
  page.on('request', r => reqs.push(r.url()));
  await page.goto(BASE + query);
  return { page, errs, reqs };
}

console.log('\nLOADS, AND SERVES ONLY THE HELD-OUT SET');
const { page, errs, reqs } = await open('?p=4cwkq');
await page.waitForFunction(() => window.__READY === true, null, { timeout: 20000 });
check('no page errors on load', errs, []);
const ids = await page.evaluate(() => QUESTIONS.map(q => q.id));
check('exactly H01-H12, in order', ids,
  ['H01','H02','H03','H04','H05','H06','H07','H08','H09','H10','H11','H12']);
check('no Help button anywhere', await page.$$eval('[id^="help-"]', els => els.length), 0);
check('no help globals', await page.evaluate(() =>
  ['POLICY','SESSION','WRITER','TRANSPORT','GUARD','helpQ','callModel'].filter(k => typeof window[k] !== 'undefined')), []);
check('the arm and code come from ?p=', await page.evaluate(() => [LOG.participant, LOG.arm, LOG.session]),
  ['4cwkq', 'A', 'removal']);

console.log('\nEVERY HELD-OUT REFERENCE AND WRONG MODEL, GRADED IN THE PAGE');
const verdictOf = async (q, sql) => {
  await page.evaluate(q => show(q), q);
  await page.fill(`#sql-${q}`, sql);
  await page.click(`#run-${q}`);
  return page.evaluate(q => { const e = LOG.events.filter(e => e.q === q).pop(); return e.grade; }, q);
};
let agree = 0; const drift = [];
for (const c of cases) {
  const got = await verdictOf(c.q, c.sql);
  if (got === c.verdict) agree++; else drift.push({ q: c.q, name: c.name || 'reference', got, want: c.verdict });
}
check(`page verdict equals grade_rule.py on all ${cases.length} held-out queries`, drift, []);
// The wrong models ran after each reference and overwrote the screen, so run
// every reference once more, last, before reading what the learner would see.
for (const c of cases.filter(c => c.verdict === 'correct' && !c.name)) await verdictOf(c.q, c.sql);
check('all 12 references are Correct on screen',
  await page.evaluate(() => QUESTIONS.filter(q => /Correct/.test(document.getElementById(`out-${q.id}`).textContent)).length), 12);
check('gradeReason is never rendered', await page.evaluate(() =>
  LOG.events.filter(e => e.gradeReason && document.body.innerText.includes(e.gradeReason)).length), 0);

console.log('\nTHE LOG');
await page.evaluate(() => show('send'));
await page.check('input[name="sv-enjoyed"][value="4"]');
await page.check('input[name="sv-confident"][value="2"]');
const log = JSON.parse(await page.evaluate(() => payload()));
check('only attempt events', [...new Set(log.events.map(e => e.type))], ['attempt']);
check('survey answers recorded, unanswered stays null', log.survey, { enjoyed: 4, learned: null, confident: 2 });
check('started and finished stamped', [!!log.started, !!log.finished], [true, true]);
check('no summary from the help module', log.summary, undefined);

console.log('\nNETWORK');
const external = reqs.filter(u => !u.startsWith(new URL(BASE).origin));
check('no request leaves the page origin (no hint function, no CDN in the test copy)', external, []);
check('no page errors after all runs', errs, []);

console.log('\nAN UNKNOWN CODE STOPS THE PAGE');
const bad = await open('?p=zzzzz');
await bad.page.waitForTimeout(2500);
check('unknown ?p= shows the bad-link message', await bad.page.evaluate(() =>
  /doesn't look right/.test(document.getElementById('boot')?.textContent || '')), true);
check('and builds no questions', await bad.page.$$eval('[id^="sql-"]', els => els.length), 0);

await browser.close();
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
