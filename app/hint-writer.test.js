/* node hint-writer.test.js — the deterministic half of the writer. */
const { MODEL, TEMPERATURE, buildUser, makeWriter } = require('./hint-writer.js');
const { serveHint, SOURCE } = require('./hint-guard.js');

let pass = 0, fail = 0;
const check = (n, got, want) => {
  if (got === want) { pass++; console.log(`  ok    ${n}`); }
  else { fail++; console.log(`  FAIL  ${n}\n          got  ${got}\n          want ${want}`); }
};

const ctx = {
  ask: 'highest price per category, only above 10000',
  referenceQuery: 'SELECT category, MAX(price) FROM products GROUP BY category HAVING MAX(price) > 10000',
  learnerQuery: 'SELECT category, MAX(price) FROM products WHERE price > 10000 GROUP BY category',
  fallbackHint: 'Your filter runs before the rows are grouped.',
  difference: ['the learner uses these, the reference does not: WHERE'],
};

console.log('\nPINNING');
check('the model id is pinned', MODEL, 'openai/gpt-oss-120b');
check('the temperature is pinned', TEMPERATURE, 0.3);

console.log('\nTHE PROMPT');
const u = buildUser(ctx, []);
check('carries the learner query', u.includes('WHERE price > 10000'), true);
check('carries the reference for the model only', u.includes('never reveal'), true);
check('carries the computed difference', u.includes('the reference does not: WHERE'), true);
check('says nothing about a retry on attempt 1', u.includes('REJECTED'), false);

const u2 = buildUser(ctx, [{ attempt: 1, reason: 'contains a runnable SELECT' }]);
check('a retry is told why the last one died', u2.includes('contains a runnable SELECT'), true);

console.log('\nTRANSPORT CONTRACT');
(async () => {
  let seen = null;
  const spy = async a => { seen = a; return '  You used WHERE, which runs before grouping.  '; };
  const w = makeWriter(spy);
  const out = await w(ctx, 1, []);
  check('sends the pinned model', seen.model, MODEL);
  check('sends the pinned temperature', seen.temperature, TEMPERATURE);
  check('trims the reply', out, 'You used WHERE, which runs before grouping.');

  const dead = makeWriter(async () => { throw new Error('502'); });
  const r = await serveHint(ctx, dead);
  check('a dead model degrades to the fallback, not a blank screen', r.source, SOURCE.FALLBACK);
  check('  and both failures are logged', r.rejections.length, 2);

  const leaky = makeWriter(async () => 'Use HAVING MAX(price) > 10000.');
  const r2 = await serveHint(ctx, leaky);
  check('a leaking model is caught by the guard', r2.source, SOURCE.FALLBACK);

  let n = 0, sawReason = false;
  const learns = makeWriter(async () => (++n === 1 ? 'SELECT category FROM products' : 'ok'));
  const wrapped = async (c, a, rej) => { if (a === 2 && rej.length) sawReason = true; return learns(c, a, rej); };
  await serveHint(ctx, wrapped);
  check('the retry receives the rejection reasons', sawReason, true);

  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})();
