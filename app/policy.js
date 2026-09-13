(function(){
/*
 * policy.js — the level selector. PRD-v1.md §4.
 *
 * This is the graded artefact. It decides what Help returns.
 *
 * Two rules govern this file:
 *   1. No DOM. No network. No LLM. It is a pure function of the item's log.
 *      That is what makes the manipulation auditable from the log alone,
 *      which is the only way triage check 1 can be answered.
 *   2. The LLM never decides whether to help. It only renders the text
 *      afterwards, and only when this file has already said HINT.
 *
 * Everything here is deterministic and testable. See policy.test.js.
 */

// ---------------------------------------------------------------------------
// What Help can return
// ---------------------------------------------------------------------------

const ACTION = {
  NONE:         'none',          // item already solved; nothing to serve
  REFUSE_GATE:  'refuse_gate',   // Arm A, no countable attempt yet
  REFUSE_RETRY: 'refuse_retry',  // Arm A, hint already given, N not reached
  HINT:         'hint',          // first help in Arm A. LLM renders the text
  REVEAL:       'reveal',        // the reference query itself
};

// Default attempts-with-the-hint before Arm A escalates to REVEAL.
// PRD-v1 §9 decision 1. Fixed, never adaptive — a varying N would test two
// variables at once, and n=3 per arm cannot resolve that.
const DEFAULT_N = 2;

// ---------------------------------------------------------------------------
// Attempt counting
// ---------------------------------------------------------------------------

/*
 * Normalise SQL for the repeat-press check.
 * Case and whitespace only. We are asking "did the learner change anything",
 * not "are these queries equivalent".
 */
function normSql(sql) {
  return String(sql == null ? '' : sql).replace(/\s+/g, ' ').trim().toLowerCase();
}

/*
 * A stable key for what the database returned, so two attempts can be compared.
 * An attempt that errored has no result set, so it gets its error string instead.
 */
function resultKey(a) {
  if (a.outcome === 'error') return 'error:' + String(a.error || '');
  return JSON.stringify(a.rows == null ? null : a.rows);
}

/*
 * Does this attempt count?
 *
 * Example first. Rishabh pressed Run on the same query five times, then wrote
 * `GroupBy` a different way and pressed it again. The first four presses count
 * for nothing. The fifth is a real attempt.
 *
 * The rule, in order:
 *   - the query text must have changed since the last counted attempt
 *   - an attempt that errored then counts (a syntax error satisfies the gate)
 *   - an attempt that executed counts only if its result set is new
 *
 * Why the text clause exists: PRD-v1 §4 originally counted an attempt by
 * whether its result set differed. A query that never executes has no result
 * set, so that rule never fired for a learner who could not produce one.
 * Evidence: LEARNING-LOG.md L11.
 */
function attemptCounts(attempt, previousCounted) {
  if (!previousCounted) return true;
  if (normSql(attempt.sql) === normSql(previousCounted.sql)) return false;
  if (attempt.outcome === 'error') return true;
  return resultKey(attempt) !== resultKey(previousCounted);
}

/*
 * Walk the item's attempts oldest-first and return only the ones that count.
 * Each attempt is compared against the last attempt that counted, not against
 * its immediate predecessor — otherwise a repeat press resets the comparison.
 */
function countableAttempts(attempts) {
  const kept = [];
  for (const a of attempts || []) {
    if (attemptCounts(a, kept[kept.length - 1])) kept.push(a);
  }
  return kept;
}

// ---------------------------------------------------------------------------
// The policy
// ---------------------------------------------------------------------------

/*
 * decide(item) -> { action, reason, counted, sinceHelp }
 *
 * item.arm       'A' | 'B'
 * item.attempts  attempts for THIS item, oldest first.
 *                { sql, outcome, rows?, error? }
 *                outcome: 'correct' | 'wrong' | 'right_rows_wrong_order'
 *                       | 'wrong_columns' | 'error'
 * item.helpServed  help already served for THIS item, oldest first.
 *                  { action, afterCountedAttempts }
 * item.N         optional; defaults to 2
 *
 * `reason` is a short string for the log and, for the two refusals, the line
 * the learner is shown. `counted` and `sinceHelp` are returned so the log can
 * prove why the decision went the way it did.
 */
function decide(item) {
  const arm = item.arm;
  const N = item.N == null ? DEFAULT_N : item.N;
  const attempts = item.attempts || [];
  const helpServed = item.helpServed || [];

  const counted = countableAttempts(attempts);
  const solved = attempts.some(a => a.outcome === 'correct');

  const out = (action, reason, sinceHelp) => ({
    action,
    reason,
    counted: counted.length,
    sinceHelp: sinceHelp == null ? null : sinceHelp,
  });

  // Solved items need nothing. The Help button is hidden, but the policy must
  // not depend on the UI hiding it.
  if (solved) return out(ACTION.NONE, 'item already solved');

  // Arm B is the answer-giving baseline. No gate, no ladder, no conditions.
  // This branch is the entire difference between the two groups.
  if (arm === 'B') return out(ACTION.REVEAL, 'arm B serves the answer on demand');

  if (arm !== 'A') throw new Error(`unknown arm: ${JSON.stringify(arm)}`);

  // --- Arm A ---

  // THE GATE. No help of any kind until one attempt has counted.
  if (counted.length === 0) {
    const pressedSomething = attempts.length > 0;
    return out(
      ACTION.REFUSE_GATE,
      pressedSomething
        ? 'change something in the query and run it once more'
        : 'give it one run first'
    );
  }

  // Once REVEAL has been served it stays served. Pressing Help again re-shows it.
  if (helpServed.some(h => h.action === ACTION.REVEAL)) {
    return out(ACTION.REVEAL, 'answer already revealed for this item');
  }

  const hint = helpServed.find(h => h.action === ACTION.HINT);

  // First help in Arm A is a hint, never the answer.
  if (!hint) return out(ACTION.HINT, 'first help on this item is a hint');

  // Attempts that counted since the hint was served.
  const sinceHint = counted.length - hint.afterCountedAttempts;

  if (sinceHint >= N) {
    return out(ACTION.REVEAL, `escalated after ${sinceHint} counted attempts with the hint`, sinceHint);
  }
  return out(ACTION.REFUSE_RETRY, 'try once more with the hint', sinceHint);
}

// ---------------------------------------------------------------------------

const POLICY = { ACTION, DEFAULT_N, decide, countableAttempts, attemptCounts, normSql, resultKey };

if (typeof module !== 'undefined' && module.exports) module.exports = POLICY;
if (typeof window !== 'undefined') window.POLICY = POLICY;
})();
