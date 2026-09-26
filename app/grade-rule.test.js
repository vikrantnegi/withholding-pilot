/*
 * grade-rule.test.js — tests for the JS half of the frozen scoring rule.
 *
 * Plain node, no dependencies:  node grade-rule.test.js
 *
 * These test the rule's INTENT. That the port matches grade_rule.py line for
 * line is a different question, and evals/grader-conformance.mjs answers it by
 * running both over all 75 queries in items.py. Both are needed: agreeing with
 * each other would mean nothing if both were wrong.
 */
const GRADE = require('./grade-rule.js');

let pass = 0, fail = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log(`  ok    ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}\n          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`); }
}

console.log('\nCLAUSE 2 — valid grouped SQL');
check('a plain group and aggregate is valid',
  GRADE.validity('SELECT service, COUNT(*) FROM deploys GROUP BY service'), null);
check('filtering groups on an aggregate is valid',
  GRADE.validity('SELECT service, COUNT(*) FROM deploys GROUP BY service HAVING COUNT(*) > 6'), null);
check('grouping by two columns and selecting both is valid',
  GRADE.validity('SELECT service, env, COUNT(*) FROM deploys GROUP BY service, env'), null);
check('no GROUP BY at all means this rule has nothing to say',
  GRADE.validity('SELECT * FROM deploys WHERE status = \'failed\''), null);

console.log('\nCLAUSE 2 — the anuj hole, which result matching cannot see');
check('filtering groups on a row value is invalid',
  GRADE.validity('SELECT service, COUNT(*) FROM deploys GROUP BY service HAVING env = \'prod\''),
  'filters groups on env, which is a row value, not a group value');
check('selecting a bare column that is not grouped is invalid',
  GRADE.validity('SELECT service, env, COUNT(*) FROM deploys GROUP BY service'),
  'selects env without grouping by it');
check('the column inside an aggregate does not need grouping',
  GRADE.validity('SELECT service, MAX(duration_sec) FROM deploys GROUP BY service'), null);
check('a string literal cannot smuggle in an identifier',
  GRADE.validity('SELECT service, COUNT(*) FROM deploys GROUP BY service HAVING COUNT(*) > 6 AND service <> \'env\''), null);

console.log('\nCLAUSE 2 — aliases in HAVING, amended 24 Sep (LEARNING-LOG.md L21)');
check('vikash, P14: HAVING on an alias of COUNT(*) is valid',
  GRADE.validity('select service,count(*) deploy_count from deploys group by service having deploy_count>6 order by service ASC'), null);
check('nabin, P16: HAVING on an AS alias of SUM is valid',
  GRADE.validity('SELECT team, SUM(hours_to_close) as total_hours FROM tickets GROUP BY team HAVING total_hours > 300 ORDER BY team ASC'), null);
check('an alias that shadows its own column is still a row value',
  GRADE.validity('SELECT city, SUM(fare) AS fare FROM rides GROUP BY city HAVING fare > 500'),
  'filters groups on fare, which is a row value, not a group value');
check('an alias named after the aggregate is not a shadow',
  GRADE.validity('SELECT service, COUNT(*) AS count FROM deploys GROUP BY service HAVING count > 6'), null);
check('an alias does not excuse a real row value beside it',
  GRADE.validity('SELECT service, COUNT(*) AS n FROM deploys GROUP BY service HAVING n > 6 AND env = \'prod\''),
  'filters groups on env, which is a row value, not a group value');
check('an alias of a grouped column is valid in SELECT',
  GRADE.validity('SELECT service AS s, COUNT(*) FROM deploys GROUP BY service'), null);
check('DISTINCT is not an alias',
  GRADE.validity('SELECT DISTINCT env, COUNT(*) FROM deploys GROUP BY service'),
  'selects env without grouping by it');

console.log('\nONE DECIMAL PLACE, TIES AWAY FROM ZERO — DECISIONS.md section 4');
check('194.45 rounds up, the way SQLite does it', GRADE.round1(194.45), 194.5);
check('194.4666 rounds up', GRADE.round1(194.4666), 194.5);
check('194.44 rounds down', GRADE.round1(194.44), 194.4);
check('a value already at one decimal is untouched', GRADE.round1(194.5), 194.5);
check('an integer is untouched', GRADE.round1(5), 5);
check('negatives round away from zero too', GRADE.round1(-194.45), -194.5);
check('text is left alone', GRADE.round1('Delhi'), 'Delhi');
check('null is left alone', GRADE.round1(null), null);

console.log('\nTHE WHOLE RULE');
const REF = 'SELECT city, ROUND(AVG(fare),1) FROM rides GROUP BY city ORDER BY city';
const want = [['Delhi', 194.5], ['Indore', 251.9]];

check('the reference grades correct',
  GRADE.grade({ sql: REF, got: [['Delhi', 194.5], ['Indore', 251.9]], want }),
  { verdict: 'correct', reason: '' });

check('forgetting ROUND still grades correct — the concept is grouping, not rounding',
  GRADE.grade({ sql: 'SELECT city, AVG(fare) FROM rides GROUP BY city ORDER BY city',
                got: [['Delhi', 194.4666], ['Indore', 251.85]], want }),
  { verdict: 'correct', reason: '' });

check('right rows in the wrong order is wrong, and says so for the log',
  GRADE.grade({ sql: REF, got: [['Indore', 251.9], ['Delhi', 194.5]], want }),
  { verdict: 'wrong', reason: 'right rows, wrong order' });

check('different rows are wrong, with the counts',
  GRADE.grade({ sql: REF, got: [['Delhi', 194.5]], want }),
  { verdict: 'wrong', reason: '1 rows returned, 2 expected' });

check('a query that did not run grades error',
  GRADE.grade({ sql: 'SELECT FROM rides', error: 'near "FROM": syntax error', want }),
  { verdict: 'error', reason: 'near "FROM": syntax error' });

console.log('\nORDER OF THE CLAUSES — invalid beats both error and matching rows');
check('rows that match do not rescue an invalid query',
  GRADE.grade({ sql: 'SELECT city, ROUND(AVG(fare),1) FROM rides GROUP BY city HAVING rating > 3',
                got: [['Delhi', 194.5], ['Indore', 251.9]], want }),
  { verdict: 'invalid', reason: 'filters groups on rating, which is a row value, not a group value' });
check('an invalid query that also fails to run grades invalid, not error',
  GRADE.grade({ sql: 'SELECT city, env FROM rides GROUP BY city HAVING',
                error: 'incomplete input', want }).verdict, 'invalid');

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
