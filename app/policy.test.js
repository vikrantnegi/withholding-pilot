/*
 * policy.test.js — tests for the level selector.
 *
 * Plain node, no dependencies:  node policy.test.js
 *
 * Every case below is either a line of PRD-v1.md §4 or a real learner from the
 * screening rounds. Where it is a learner, the name is in the test title.
 */

const { decide, countableAttempts, ACTION } = require('./policy.js');

let pass = 0, fail = 0;

function check(name, got, want) {
  const ok = got === want;
  if (ok) { pass++; console.log(`  ok    ${name}`); }
  else    { fail++; console.log(`  FAIL  ${name}\n          got  ${got}\n          want ${want}`); }
}

function throws(name, fn) {
  try { fn(); fail++; console.log(`  FAIL  ${name} (did not throw)`); }
  catch { pass++; console.log(`  ok    ${name}`); }
}

// shorthand attempt builders.
// The label is expanded into a plausible query, because an attempt must now
// clear the substance bar before it counts at all. Distinct labels still
// produce distinct query text, which is what the repeat-press rule reads.
const q = label => `SELECT ${label} FROM deploys GROUP BY service`;
const err   = (sql, msg) => ({ sql: q(sql), outcome: 'error', error: msg || 'near "x": syntax error' });
const wrong = (sql, rows) => ({ sql: q(sql), outcome: 'wrong', rows: rows || [[1]] });
const right = (sql) => ({ sql: q(sql), outcome: 'correct', rows: [[1]] });
const raw   = (sql) => ({ sql, outcome: 'error', error: 'near "x": syntax error' });
const hintAt = n => ({ action: ACTION.HINT, afterCountedAttempts: n });
const revealAt = n => ({ action: ACTION.REVEAL, afterCountedAttempts: n });

console.log('\nARM B — the answer-giving baseline, no gate');
check('reveals with zero attempts',
  decide({ arm: 'B', attempts: [] }).action, ACTION.REVEAL);
check('reveals after a wrong attempt',
  decide({ arm: 'B', attempts: [wrong('select 1')] }).action, ACTION.REVEAL);

console.log('\nARM A — the gate');
check('no attempts at all is refused',
  decide({ arm: 'A', attempts: [] }).action, ACTION.REFUSE_GATE);
check('a syntax error satisfies the gate (open decision 3, answered by round 2)',
  decide({ arm: 'A', attempts: [err('GROUPBY service')] }).action, ACTION.HINT);
check('one wrong but executing attempt satisfies the gate',
  decide({ arm: 'A', attempts: [wrong('select * from deploys')] }).action, ACTION.HINT);

console.log('\nARM A — the text-changed clause (rishabh)');
const samePress = [err('GroupBy service'), err('GroupBy service'), err('groupby  SERVICE ')];
check('five identical presses are one attempt, not five',
  countableAttempts(samePress).length, 1);
check('identical re-presses alone do not open the gate... ',
  decide({ arm: 'A', attempts: [err('GroupBy c'), err('GroupBy c')] }).counted, 1);
check('...but they do not block it either, the first one counts',
  decide({ arm: 'A', attempts: [err('GroupBy c'), err('GroupBy c')] }).action, ACTION.HINT);
check('changing the text makes a second attempt count',
  countableAttempts([err('GroupBy c'), err('GroupBy c'), err('GROUP BY c')]).length, 2);

console.log('\nARM A — an executing attempt needs a new result set (PRD §4)');
check('same result set twice counts once',
  countableAttempts([wrong('select a from t', [[1]]), wrong('select a from  t2', [[1]])]).length, 1);
check('a different result set counts again',
  countableAttempts([wrong('select a from t', [[1]]), wrong('select b from t', [[2]])]).length, 2);

console.log('\nARM A — the ladder');
const oneAttempt = [wrong('select 1', [[1]])];
check('first help on an item is a hint, never the answer',
  decide({ arm: 'A', attempts: oneAttempt }).action, ACTION.HINT);
check('one counted attempt after the hint is refused (N=2)',
  decide({ arm: 'A', attempts: [wrong('a', [[1]]), wrong('b', [[2]])], helpServed: [hintAt(1)] }).action,
  ACTION.REFUSE_RETRY);
check('two counted attempts after the hint escalates to reveal',
  decide({ arm: 'A', attempts: [wrong('a', [[1]]), wrong('b', [[2]]), wrong('c', [[3]])], helpServed: [hintAt(1)] }).action,
  ACTION.REVEAL);
check('N is configurable',
  decide({ arm: 'A', attempts: [wrong('a', [[1]]), wrong('b', [[2]])], helpServed: [hintAt(1)], N: 1 }).action,
  ACTION.REVEAL);
check('repeat presses after the hint do not earn the answer',
  decide({ arm: 'A', attempts: [wrong('a', [[1]]), err('b'), err('b'), err('b')], helpServed: [hintAt(1)] }).action,
  ACTION.REFUSE_RETRY);
check('once revealed, always revealed',
  decide({ arm: 'A', attempts: oneAttempt, helpServed: [hintAt(1), revealAt(3)] }).action, ACTION.REVEAL);

console.log('\nBOTH ARMS — a solved item needs nothing');
check('arm A',
  decide({ arm: 'A', attempts: [wrong('a'), right('b')] }).action, ACTION.NONE);
check('arm B',
  decide({ arm: 'B', attempts: [right('b')] }).action, ACTION.NONE);

console.log('\nTHE SUBSTANCE BAR — added 14 Sep, validated on all 128 round-2 attempts');
const { isSubstantive, setSchemaIdentifiers } = require('./policy.js');
const IDS = ['deploys', 'tickets', 'rides', 'deploy_id', 'service', 'env', 'status',
             'duration_sec', 'ticket_id', 'team', 'priority', 'hours_to_close',
             'ride_id', 'city', 'driver', 'fare', 'distance_km', 'rating'];

check('rishabh: mangled spelling carrying a real mental model still counts',
  isSubstantive('Select service,count As deploycount from deploys GroupBy service havingcount>=6', IDS), true);
check('a syntax error that is a real S3 mistake counts',
  isSubstantive('SELECT service, COUNT(*) FROM deploys WHERE COUNT(*) > 6', IDS), true);
check('keystroke mashing does not count',
  isSubstantive('asdf', IDS), false);
check('a bare keyword does not count',
  isSubstantive('SELECT', IDS), false);
check('an empty submission does not count',
  isSubstantive('', IDS), false);
check('SQL against some other schema does not count',
  isSubstantive('SELECT * FROM employees', IDS), false);
check('a short identifier needs a word boundary, so video does not match id',
  isSubstantive('SELECT video FROM somewhere', ['id']), false);
check('no configured schema falls open to the keyword half',
  isSubstantive('SELECT * FROM anything', []), true);

check('three different pieces of junk never open the gate',
  decide({ arm: 'A', identifiers: IDS,
           attempts: [raw('asdf'), raw('qwer'), raw('zxcv')] }).action,
  ACTION.REFUSE_GATE);
check('and the learner is told to write a query, not to change one',
  decide({ arm: 'A', identifiers: IDS,
           attempts: [raw('asdf'), raw('qwer')] }).reason,
  'write a query against the tables above and run it');
check('one real attempt after the junk opens the gate',
  decide({ arm: 'A', identifiers: IDS,
           attempts: [raw('asdf'), raw('SELECT service FROM deploys GROUP BY service')] }).action,
  ACTION.HINT);
check('junk is not counted toward escalation either',
  decide({ arm: 'A', identifiers: IDS,
           attempts: [wrong('a', [[1]]), raw('asdf'), raw('qwer')],
           helpServed: [hintAt(1)] }).action,
  ACTION.REFUSE_RETRY);
check('arm B is untouched by the bar',
  decide({ arm: 'B', identifiers: IDS, attempts: [raw('asdf')] }).action, ACTION.REVEAL);

setSchemaIdentifiers(IDS);
check('setSchemaIdentifiers applies when the item does not carry its own',
  decide({ arm: 'A', attempts: [raw('asdf')] }).action, ACTION.REFUSE_GATE);
setSchemaIdentifiers([]);

console.log('\nGUARDS');
throws('an unknown arm is a crash, not a default', () => decide({ arm: 'C', attempts: [] }));

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
