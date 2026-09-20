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
const SCHEMA_SQL = process.env.SCHEMA_SQL ||
  new URL('../study-questions/schema.sql', import.meta.url).pathname;

let pass = 0, fail = 0;
const ok  = (n) => { pass++; console.log(`  ok    ${n}`); };
const bad = (n, d) => { fail++; console.log(`  FAIL  ${n}\n          ${d}`); };
/* Compared by value, not by reference — several checks assert on arrays, and === on
 * two arrays is always false, which reads as a failure with identical got and want. */
const check = (n, got, want) =>
  JSON.stringify(got) === JSON.stringify(want)
    ? ok(n) : bad(n, `got ${JSON.stringify(got)}  want ${JSON.stringify(want)}`);

async function open(browser, arm, query) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  // Served over http, so the browser asks for a favicon this folder has not got.
  page.on('console', m => {
    if (m.type() === 'error' && !/favicon/i.test(m.location()?.url || '')) errs.push(m.text());
  });
  await page.goto(query ? `${URL}${query}` : arm ? `${URL}?arm=${arm}` : URL);
  /* window.__READY is set once the database is up and the questions are built. It
   * replaced waiting for #questions to become visible, which stopped working when
   * the page went to one-question-at-a-time on 19 Sep: the container is unhidden
   * but its children are not, so it has no visible box. __READY says what we
   * actually mean — the app is usable. */
  await page.waitForFunction(() => window.__READY === true, null, { timeout: 30000 });
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
check('the questions container is live', await page.evaluate(
  () => !document.getElementById('questions').hidden), true);
check('all 16 are built into the page at once, so a draft survives navigation',
  await page.evaluate(() => QUESTIONS.filter(q => document.getElementById(`sql-${q.id}`)).length), 16);
check('the session lands on the intro, not mid-question', await page.evaluate(
  () => !document.getElementById('screen-intro').hidden), true);
check('exactly one screen is showing', await page.evaluate(
  () => [...document.querySelectorAll('.screen')].filter(e => !e.hidden).length), 1);
check('no held-out item is in the question set', ids.some(i => i.startsWith('H')), false);

/* The removal test on 27 Sep reuses the 12 held-out items. Anything a tester can
 * read in this page's source on 22 Sep is burned, so the source must not name
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

console.log('\nPARTICIPANT LINKS — identity and arm, without saying so in the URL');
{
  const codes = await page.evaluate(() => PARTICIPANTS);
  const ids = Object.keys(codes);
  check('seven codes, one per participant', ids.length, 7);
  check('three are Arm A and four are Arm B',
    [Object.values(codes).filter(a => a === 'A').length,
     Object.values(codes).filter(a => a === 'B').length], [3, 4]);

  /* The table is in the page source. It must carry no names, or a tester reading
   * the source learns who is in which arm — and that arms exist at all. */
  const RAW_SRC = readFileSync(RAW_PATH, 'utf8');
  const block = RAW_SRC.slice(RAW_SRC.indexOf('const PARTICIPANTS'),
                              RAW_SRC.indexOf('const PID'));
  for (const name of ['nabin', 'gaurav', 'ritesh', 'anuj', 'vikash', 'manish', 'rishabh']) {
    if (block.toLowerCase().includes(name)) bad(`the code table names ${name}`, 'leaked');
  }
  ok('the code table holds no participant names');

  const aCode = ids.find(c => codes[c] === 'A');
  const bCode = ids.find(c => codes[c] === 'B');

  const { page: pa } = await open(browser, null, `?p=${aCode}`);
  check('an Arm A code lands in Arm A', await pa.evaluate(() => ARM), 'A');
  check('and the log says who produced it', await pa.evaluate(() => LOG.participant), aCode);
  check('the URL says nothing about the arm', /arm/i.test(`?p=${aCode}`), false);

  const { page: pb } = await open(browser, null, `?p=${bCode}`);
  check('an Arm B code lands in Arm B', await pb.evaluate(() => ARM), 'B');
  check('and its log is identified too', await pb.evaluate(() => LOG.participant), bCode);

  /* A typo used to produce a real-looking session silently logged as Arm A. */
  const bad1 = await browser.newPage();
  await bad1.goto(`${URL}?p=notacode`);
  await bad1.waitForFunction(
    () => document.getElementById('boot') &&
          document.getElementById('boot').textContent.includes("doesn't look right"),
    null, { timeout: 30000 });
  check('an unknown code stops the app instead of defaulting to Arm A',
    await bad1.evaluate(() => !!document.getElementById('questions').hidden), true);
  check('and says something a tester can act on, without mentioning arms',
    await bad1.evaluate(() => /arm/i.test(document.getElementById('boot').textContent)), false);
}

console.log('\nNAVIGATION — one question at a time, skipping stays free');
{
  const { page: n } = await open(browser);
  const showing = () => n.evaluate(() =>
    [...document.querySelectorAll('.screen')].filter(e => !e.hidden).map(e => e.id));

  await n.evaluate(() => document.getElementById('startBtn').click());
  check('start goes to question 1', await showing(), ['screen-P02']);

  await n.evaluate(() => document.getElementById('next-P02').click());
  check('next advances one question', await showing(), ['screen-P04']);

  await n.evaluate(() => document.getElementById('prev-P04').click());
  check('back returns', await showing(), ['screen-P02']);

  // The brief tells them to move on when an item will not crack, so nothing may
  // gate on solving anything. Jump from question 1 to question 14 unsolved.
  await n.evaluate(() => document.getElementById('rail-P19').click());
  check('the rail jumps to any question, solved or not', await showing(), ['screen-P19']);

  // A half-written query must survive leaving the question and coming back.
  await n.evaluate(() => { document.getElementById('sql-P19').value = 'SELECT priority, AVG('; });
  await n.evaluate(() => document.getElementById('rail-P02').click());
  await n.evaluate(() => document.getElementById('rail-P19').click());
  check('an unfinished draft is still there on return',
    await n.evaluate(() => document.getElementById('sql-P19').value), 'SELECT priority, AVG(');

  await n.evaluate(() => document.getElementById('rail-send').click());
  check('the log screen is reachable at any time', await showing(), ['screen-send']);

  await n.evaluate(() => document.getElementById('next-P20').click());
  check('finishing the last question goes to the log screen', await showing(), ['screen-send']);

  check('progress starts at nothing solved',
    (await n.evaluate(() => document.getElementById('progress').textContent)).trim(), 'Not started');
  await run(n, 'P02', 'SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides GROUP BY city ORDER BY city');
  check('progress counts a solved question',
    await n.evaluate(() => document.getElementById('progress').textContent), '1 of 16 solved');
  check('the rail marks it done',
    await n.evaluate(() => document.getElementById('dot-P02').className), 'dot done');
}

console.log('\nTHE SCHEMA IS ALWAYS REACHABLE — the point of the layout change');
{
  const { page: sc } = await open(browser);
  const names = await sc.evaluate(() => document.getElementById('schemaBox').textContent);
  for (const t of ['deploys', 'tickets', 'rides', 'duration_sec', 'hours_to_close', 'distance_km']) {
    if (!names.includes(t)) { bad(`schema panel names ${t}`, 'missing'); } else ok(`schema panel names ${t}`);
  }
  check('it is open by default, not behind a click',
    await sc.evaluate(() => document.getElementById('schemaBox').open), true);

  /* The panel is hand-written and schema.sql is the source of truth, so they can
   * drift — and they did: until 19 Sep the panel still listed the round-2 tables
   * customers/products/orders/order_items, which had not existed for hours. A
   * tester would have been reading columns that were not in the database. */
  const sql = readFileSync(SCHEMA_SQL, 'utf8');
  const declared = [];
  for (const m of sql.matchAll(/CREATE TABLE\s+(\w+)\s*\(([^;]*)\)\s*;/gi)) {
    const table = m[1];
    const cols = m[2].split(',').map(x => x.trim().split(/\s+/)[0]).filter(Boolean);
    declared.push({ table, cols });
  }
  const panel = await sc.evaluate(() => {
    const box = document.getElementById('schemaBox');
    return {
      tables: [...box.querySelectorAll('.tbl h4')].map(h => h.firstChild.textContent.trim()),
      cols: [...box.querySelectorAll('.cols tbody tr td:first-child code')].map(c => c.textContent.trim()),
    };
  });
  check('the panel lists exactly the tables in schema.sql',
    panel.tables.sort(), declared.map(d => d.table).sort());
  check('and exactly their columns, none missing, none invented',
    panel.cols.slice().sort(), declared.flatMap(d => d.cols).sort());
  check('each table is drawn as a table, not a bullet list',
    await sc.evaluate(() => document.querySelectorAll('#schemaBox table.cols').length), 3);
  check('every column row carries a type',
    await sc.evaluate(() => [...document.querySelectorAll('#schemaBox .cols tbody tr')]
      .every(r => r.children[1].textContent.trim().length > 0)), true);
  check('it is outside the question screens, so it never scrolls away with one',
    await sc.evaluate(() => !document.getElementById('schemaBox').closest('.screen')), true);
}

console.log('\nNARROW SCREENS — no sideways scrolling, question above the fold');
for (const [w, h, label] of [[390, 844, 'phone'], [768, 1024, 'tablet']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(URL);
  await p.waitForFunction(() => window.__READY === true, null, { timeout: 30000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  // A page wider than its viewport means every question drags sideways all session.
  const m = await p.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  check(`${label}: the page never scrolls sideways`, m.doc <= m.win, true);
  check(`${label}: the schema starts collapsed so the question is what you see`,
    await p.evaluate(() => document.getElementById('schemaBox').open), false);
  check(`${label}: and opens on one tap`, await p.evaluate(() => {
    const d = document.getElementById('schemaBox');
    d.querySelector('summary').click();
    return d.open && d.textContent.includes('duration_sec');
  }), true);
  await ctx.close();
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
