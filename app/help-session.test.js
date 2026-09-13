/*
 * help-session.test.js — node help-session.test.js
 *
 * The test that matters is the first block: two learners whose policy decisions
 * are identical and whose experience was not, and the log can tell them apart.
 */
const { pressHelp, summarise } = require('./help-session.js');
const { ACTION } = require('./policy.js');
const { SOURCE } = require('./hint-guard.js');

let pass = 0, fail = 0;
const check = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log(`  ok    ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}\n          got  ${g}\n          want ${w}`); }
};

const REF = 'SELECT category, MAX(price) FROM products GROUP BY category HAVING MAX(price) > 10000 ORDER BY category';
const CTX = {
  referenceQuery: REF,
  learnerQuery: 'SELECT category, MAX(price) FROM products WHERE price > 10000',
  fallbackHint: 'Your filter runs before the rows are grouped. Which clause filters after a GROUP BY?',
};
const GOOD = async () => 'You used WHERE. That runs on single rows, before they are collected into groups.';
const LEAKY = async () => `Use this: ${REF}`;
const attempt = (q, sql, rows) => ({ type: 'attempt', q, sql, outcome: 'wrong', rows });
const decided = log => log.filter(e => e.type === 'help_decided').map(e => [e.action, e.counted]);

(async () => {
  console.log('\nTWO LEARNERS, SAME DECISION, DIFFERENT EXPERIENCE');
  const A = [attempt('M2', 'select 1', [[1]])];
  const B = [attempt('M2', 'select 1', [[1]])];
  const rA = await pressHelp({ log: A, qid: 'M2', arm: 'A', hintCtx: CTX, callModel: GOOD });
  const rB = await pressHelp({ log: B, qid: 'M2', arm: 'A', hintCtx: CTX, callModel: LEAKY });

  check('both policies chose hint', [rA.action, rB.action], [ACTION.HINT, ACTION.HINT]);
  check('their help_decided entries are identical', decided(A), decided(B));
  check('A was served by the model', rA.source, SOURCE.MODEL);
  check('B fell back', rB.source, SOURCE.FALLBACK);
  check('B saw the hand-written text', rB.text, CTX.fallbackHint);
  check('and the log can tell them apart',
    [A.at(-1).source, B.at(-1).source], [SOURCE.MODEL, SOURCE.FALLBACK]);
  check('B\'s rejections are on the record', B.at(-1).rejections.length, 2);

  console.log('\nTHE DECISION ENTRY NEVER WAITS ON THE MODEL');
  const slow = [attempt('M2', 'select 1', [[1]])];
  const p = pressHelp({ log: slow, qid: 'M2', arm: 'A', hintCtx: CTX,
    callModel: () => new Promise(r => setTimeout(() => r('Which clause filters after grouping?'), 30)) });
  check('help_decided is written before the model returns', slow.length, 2);
  await p;
  check('help_delivered lands afterwards', slow.length, 3);

  console.log('\nTHE GATE AND THE LADDER, DRIVEN FROM THE LOG');
  const L = [];
  let r = await pressHelp({ log: L, qid: 'M2', arm: 'A', hintCtx: CTX, callModel: GOOD });
  check('no attempt yet is refused', r.action, ACTION.REFUSE_GATE);
  check('  and a refusal writes no delivered entry', L.filter(e => e.type === 'help_delivered').length, 0);

  L.push(attempt('M2', 'select a', [[1]]));
  r = await pressHelp({ log: L, qid: 'M2', arm: 'A', hintCtx: CTX, callModel: GOOD });
  check('first help after an attempt is a hint', r.action, ACTION.HINT);

  L.push(attempt('M2', 'select b', [[2]]));
  r = await pressHelp({ log: L, qid: 'M2', arm: 'A', hintCtx: CTX, callModel: GOOD });
  check('one attempt later is still a refusal (N=2)', r.action, ACTION.REFUSE_RETRY);

  L.push(attempt('M2', 'select c', [[3]]));
  r = await pressHelp({ log: L, qid: 'M2', arm: 'A', hintCtx: CTX, callModel: GOOD });
  check('two attempts later escalates to reveal', r.action, ACTION.REVEAL);

  console.log('\nA FALLBACK MUST NOT CHANGE THE LADDER');
  const F = [attempt('M2', 'select a', [[1]])];
  await pressHelp({ log: F, qid: 'M2', arm: 'A', hintCtx: CTX, callModel: LEAKY });   // fallback
  F.push(attempt('M2', 'select b', [[2]]));
  r = await pressHelp({ log: F, qid: 'M2', arm: 'A', hintCtx: CTX, callModel: GOOD });
  check('the fallback still counts as help served', r.action, ACTION.REFUSE_RETRY);

  console.log('\nARM B');
  const Bv = [];
  r = await pressHelp({ log: Bv, qid: 'M2', arm: 'B', hintCtx: CTX, callModel: GOOD });
  check('reveals with no attempt and no gate', r.action, ACTION.REVEAL);
  check('  and never touches the model', Bv.filter(e => e.type === 'help_delivered').length, 0);

  console.log('\nWHAT 28 SEP READS OFF THE LOG');
  const s = summarise([...A, ...B, ...Bv]);
  check('arm A hints counted', s.byAction['A:hint'], 2);
  check('arm B reveals counted', s.byAction['B:reveal'], 1);
  check('fallback rate is reportable', s.fallbackRate, 0.5);

  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})();
