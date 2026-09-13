/*
 * hint-guard.test.js — node hint-guard.test.js
 *
 * The leaked examples below are the ones that would turn Arm A into Arm B.
 */
const { inspect, serveHint, SOURCE, REJECT } = require('./hint-guard.js');

let pass = 0, fail = 0;
const check = (name, got, want) => {
  if (got === want) { pass++; console.log(`  ok    ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}\n          got  ${got}\n          want ${want}`); }
};

const REF = 'SELECT category, MAX(price) FROM products GROUP BY category HAVING MAX(price) > 10000 ORDER BY category';
const ctx = {
  referenceQuery: REF,
  learnerQuery: 'SELECT category, MAX(price) FROM products WHERE price > 10000 GROUP BY category',
  fallbackHint: 'Your filter runs before the rows are grouped. Look up which clause filters after a GROUP BY.',
};

console.log('\nHINTS THAT MUST PASS');
check('names the concept without the clause',
  inspect('Your filter runs before the rows are grouped. Which clause filters after grouping?', ctx).ok, true);
check('points at the learner\'s own mistake',
  inspect('You used WHERE. That runs on individual rows, before they are collected into groups.', ctx).ok, true);
check('mentions a bare keyword as a concept',
  inspect('The clause you want is HAVING. Work out what to put in it.', ctx).ok, true);

console.log('\nHINTS THAT MUST BE REJECTED');
check('the whole answer',
  inspect(`Use this: ${REF}`, ctx).reason, REJECT.RUNNABLE_QUERY);
check('a runnable fragment',
  inspect('Try SELECT category FROM products instead.', ctx).reason, REJECT.RUNNABLE_QUERY);
check('the distinguishing HAVING clause',
  inspect('Replace your WHERE with HAVING MAX(price) > 10000.', ctx).reason, REJECT.REFERENCE_CLAUSE);
check('the GROUP BY with its column',
  inspect('You need GROUP BY category here.', ctx).reason, REJECT.REFERENCE_CLAUSE);
check('the aggregate expression',
  inspect('The value you want is MAX(price).', ctx).reason, REJECT.REFERENCE_CLAUSE);
check('an empty hint',
  inspect('   ', ctx).reason, REJECT.EMPTY);

console.log('\nSERVE — retry twice, then fall back');
(async () => {
  let r = await serveHint(ctx, async () => 'Which clause filters after grouping?');
  check('clean first attempt is served from the model', r.source, SOURCE.MODEL);
  check('  and records one attempt', r.modelAttempts, 1);

  let n = 0;
  r = await serveHint(ctx, async () => ++n === 1 ? 'Use HAVING MAX(price) > 10000.' : 'Which clause filters after grouping?');
  check('a leak on attempt 1 is retried', r.source, SOURCE.MODEL);
  check('  and the rejection is kept', r.rejections.length, 1);

  r = await serveHint(ctx, async () => `Use this: ${REF}`);
  check('two leaks fall back to the hand-written hint', r.source, SOURCE.FALLBACK);
  check('  and the learner sees the fallback text', r.text, ctx.fallbackHint);
  check('  and both rejections are logged', r.rejections.length, 2);
  check('  and it never tries a third time', r.modelAttempts, 2);

  r = await serveHint(ctx, async () => { throw new Error('timeout'); });
  check('a failed model call falls back too', r.source, SOURCE.FALLBACK);

  let threw = false;
  try { await serveHint({ ...ctx, fallbackHint: undefined }, async () => 'x'); } catch { threw = true; }
  check('a question with no fallback is a crash, not a silent gap', threw, true);

  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})();
