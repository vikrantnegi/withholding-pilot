/* verify-app.mjs — drives app/index.html in a real headless browser.
 *
 * The unit suites cover policy.js, hint-guard.js, hint-writer.js and
 * help-session.js in isolation. This covers the thing none of them can: that
 * index.html wires them together correctly, and that all 16 practice
 * references actually grade correct against the app's own EXPECTED map.
 *
 * Run: 19 Sep 2026, after the question-set swap. 37 checks, 0 failed.
 *
 * SETUP. The app loads sql.js from cdnjs, which a headless browser on a
 * restricted network cannot reach, and a file:// page cannot fetch the .wasm at
 * all. So this script needs a served copy pointed at a local sql.js:
 *
 *   npm i playwright sql.js@1.8.0 && npx playwright install chromium
 *   cd app && cp index.html index.test.html
 *   cp ../node_modules/sql.js/dist/sql-wasm.{js,wasm} .
 *   # in index.test.html, swap the two cdnjs references for the local files:
 *   #   <script src="sql-wasm.js"></script>
 *   #   initSqlJs({ locateFile: f => f })
 *   python3 -m http.server 8731
 *   node ../evals/verify-app.mjs            # override with APP_URL=...
 *
 * index.test.html is a throwaway. Never commit it, and never point the testers
 * at it — they get index.html, which loads sql.js from the CDN.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const URL = process.env.APP_URL || 'http://127.0.0.1:8731/index.test.html';
const RAW_PATH = process.env.APP_RAW || new URL('../app/index.html', import.meta.url).pathname;

let pass = 0, fail = 0;
const ok  = (n) => { pass++; console.log(`  ok    ${n}`); };
const bad = (n, d) => { fail++; console.log(`  FAIL  ${n}\n          ${d}`); };
const check = (n, got, want) =>
  got === want ? ok(n) : bad(n, `got ${JSON.stringify(got)}  want ${JSON.stringify(want)}`);

async function open(browser, arm) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  // Served over http, so the browser asks for a favicon this folder has not got.
  page.on('console', m => {
    if (m.type() === 'error' && !/favicon/i.test(m.location()?.url || '')) errs.push(m.text());
  });
  await page.goto(arm ? `${URL}?arm=${arm}` : URL);
  await page.waitForSelector('#questions:not([hidden])', { timeout: 30000 });
  return { page, errs };
}

const run = (page, id, sql) => page.evaluate(([id, sql]) => {
  document.getElementById(`sql-${id}`).value = sql;
  document.getElementById(`run-${id}`).click();
  return document.getElementById(`out-${id}`).textContent.trim();
}, [id, sql]);

// The help box keeps the previous message, so clear it or the next read returns the old one.
const help = async (page, id) => {
  await page.evaluate(id => {
    document.getElementById(`help-out-${id}`).innerHTML = '';
    document.getElementById(`help-${id}`).click();
  }, id);
  await page.waitForFunction(
    id => document.getElementById(`help-out-${id}`).textContent.trim() !== '',
    id, { timeout: 15000 });
  return page.evaluate(id => document.getElementById(`help-out-${id}`).textContent.trim(), id);
};

const browser = await chromium.launch();

console.log('\nBOOT');
const { page, errs } = await open(browser);
const ids = await page.evaluate(() => QUESTIONS.map(q => q.id));
check('16 practice items are served', ids.length, 16);
check('no held-out item is in the question set', ids.some(i => i.startsWith('H')), false);

/* The removal test on 26 Sep reuses the 12 held-out items. Anything a tester can
 * read in this page's source on 21 Sep is burned, so the source must not name
 * them at all — not as a prompt, not as an answer, not even as a pair label. */
const RAW = readFileSync(RAW_PATH, 'utf8');
check('no held-out id appears anywhere in the raw source', /\bH(0[1-9]|1[0-2])\b/.test(RAW), false);
check('no page errors during boot', errs.length, 0);

console.log('\nEVERY PRACTICE REFERENCE GRADES CORRECT');
const refs = await page.evaluate(() => QUESTIONS.map(q => [q.id, q.reference]));
for (const [id, ref] of refs) {
  const out = await run(page, id, ref);
  out.startsWith('Correct.') ? ok(`${id} correct`) : bad(id, out.slice(0, 120));
}

console.log('\nTHE FROZEN RULE, IN THE APP — DECISIONS.md section 5');
{
  const { page: r } = await open(browser);

  // P02 asks for the average fare per city rounded to 1 decimal. Omitting ROUND
  // used to read as wrong, because the app compared at 2 decimals while the scoring
  // rule compared at 1. The concept under test is grouping, not rounding.
  const noRound = await run(r, 'P02', 'SELECT city, AVG(fare) FROM rides GROUP BY city ORDER BY city');
  check('grouping right but no ROUND now grades correct', noRound.startsWith('Correct.'), true);

  // The anuj shape: filters groups on a row value. SQLite allows it and the rows can
  // come back matching, so result comparison alone called it correct and switched Help off.
  const anuj = await run(r, 'P14',
    "SELECT service, COUNT(*) FROM deploys GROUP BY service HAVING env = 'prod'");
  check('the anuj-shaped query is no longer called correct', anuj.startsWith('Correct.'), false);
  check('and Help is still available on it',
        await r.evaluate(() => document.getElementById('help-P14').disabled), false);

  const ev = await r.evaluate(() => LOG.events.filter(e => e.type === 'attempt' && e.q === 'P14').pop());
  check('the log records the frozen verdict', ev.grade, 'invalid');
  check('and why, for analysis', ev.gradeReason,
        'filters groups on env, which is a row value, not a group value');

  // The reason names the learner's mistake. On screen that is help from outside the
  // policy, handed to both arms. It must stay in the log only.
  const shown = await r.evaluate(() => document.body.textContent);
  check('the reason is never shown to the learner', shown.includes('row value, not a group value'), false);
  check('a failing submission reads the same as any other', anuj.startsWith('Not right yet'), true);
}

console.log('\nARM A — the gate, then two levels (PRD-v1 §7), N = 2');
{
  const { page: a } = await open(browser, 'A');
  check('help with no attempt at all is refused',
        (await help(a, 'P02')).includes('give it one run first'), true);

  await run(a, 'P04', 'asdf');
  check('keystroke mashing does not open the gate',
        (await help(a, 'P04')).includes('write a query'), true);

  await run(a, 'P07', 'SELECT service, COUNT(*) FROM deploys GROUP BY service');
  const h1 = await help(a, 'P07');
  check('one real wrong attempt earns the hint', h1.startsWith('Hint.'), true);
  check('it is the hand-written fallback, no hint URL configured', h1.includes('(fallback)'), true);
  check('the hint does not leak the answer', /SELECT/i.test(h1.replace(/^Hint\./, '')), false);

  // Two levels means ONE hint then the answer. The second press must neither hint
  // again nor reveal — N=2 counted attempts have to pass with the hint in hand.
  await run(a, 'P07', "SELECT service, COUNT(*) FROM deploys WHERE status='failed'");
  check('the second press asks for another try, it does not hint again',
        await help(a, 'P07'), 'try once more with the hint');

  await run(a, 'P07', 'SELECT service FROM deploys GROUP BY env');
  const rev = await help(a, 'P07');
  check('the answer is revealed once N=2 attempts carried the hint', rev.startsWith('The answer.'), true);
  check('the revealed answer is that item\'s reference', rev.includes("WHERE status = 'failed'"), true);
}

console.log('\nARM B — unconditional reveal, no gate');
{
  const { page: b } = await open(browser, 'B');
  const r = await help(b, 'P02');
  check('reveals with zero attempts', r.startsWith('The answer.'), true);
  check('and it is that item\'s reference', r.includes('ROUND(AVG(fare),1)'), true);
}

console.log('\nTHE LOG — the only artefact the study gets back');
{
  const { page: l } = await open(browser, 'A');
  await run(l, 'P14', 'SELECT service FROM deploys');
  await help(l, 'P14');
  const log = await l.evaluate(() => LOG);
  check('arm is recorded', log.arm, 'A');
  check('started is recorded', typeof log.started === 'string' && log.started.length > 0, true);
  const types = log.events.map(e => e.type);
  check('an attempt event is logged', types.includes('attempt'), true);
  check('a help_decided event is logged', types.includes('help_decided'), true);
  check('a help_delivered event is logged', types.includes('help_delivered'), true);
}

await browser.close();
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
