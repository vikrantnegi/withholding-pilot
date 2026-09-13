(function(){
/*
 * hint-guard.js — the leak guard. PRD-v1.md §6 item 2. The 18 Sep deliverable.
 *
 * The hint writer is an LLM, and to say anything useful about a wrong query it
 * has to be given the right one. So it sits there holding the answer while
 * writing the hint. Sometimes it just prints it.
 *
 * If that reaches the learner, Arm A silently becomes Arm B on that item and
 * the study measures nothing. This file is what stops one bad generation from
 * doing that.
 *
 * Deterministic. No model calls of its own — it inspects text and says yes or no.
 */

// ---------------------------------------------------------------------------
// Policy on rejection — decided 13 Sep
// ---------------------------------------------------------------------------
// Up to 2 model attempts. If both are rejected, serve the question's own
// hand-written fallback. Every attempt and every rejection is logged.
const MAX_MODEL_ATTEMPTS = 2;

const SOURCE = { MODEL: 'model', FALLBACK: 'fallback' };
const REJECT = {
  RUNNABLE_QUERY: 'contains a runnable SELECT',
  REFERENCE_CLAUSE: 'contains a distinguishing clause of the reference query',
  TOO_SIMILAR: 'too much of the reference query reproduced verbatim',
  EMPTY: 'empty hint',
};

const norm = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim().toLowerCase();

/*
 * The clauses that make the reference query the answer.
 *
 * Example. Reference: SELECT category, MAX(price) FROM products
 *          GROUP BY category HAVING MAX(price) > 10000 ORDER BY category
 * Distinguishing clauses: "group by category", "having max(price) > 10000",
 * "order by category", "max(price)".
 *
 * A hint may say "which clause filters after a GROUP BY?". It may not say
 * "HAVING MAX(price) > 10000".
 */
function distinguishingClauses(referenceQuery) {
  const q = norm(referenceQuery);
  const out = [];
  const clause = /\b(group by|having|order by|where|join|on|limit)\b([^]*?)(?=\b(group by|having|order by|where|join|on|limit|select|from)\b|$)/g;
  let m;
  while ((m = clause.exec(q)) !== null) {
    const text = (m[1] + m[2]).trim().replace(/[;,]+$/, '');
    // a bare keyword is a concept, not an answer — only keep it once it has an argument
    if (text.split(' ').length > 2) out.push(text);
  }
  for (const a of q.match(/\b(count|sum|avg|min|max)\s*\([^)]*\)/g) || []) out.push(a);
  return [...new Set(out)];
}

/*
 * Does this hint give the game away?
 * Returns { ok: true } or { ok: false, reason, matched }.
 */
function inspect(hint, { referenceQuery }) {
  const h = norm(hint);
  if (!h) return { ok: false, reason: REJECT.EMPTY };

  // 1. a runnable query, whoever wrote it
  if (/\bselect\b[^]*\bfrom\b/.test(h)) {
    return { ok: false, reason: REJECT.RUNNABLE_QUERY };
  }

  // 2. any clause that distinguishes the reference query
  for (const c of distinguishingClauses(referenceQuery)) {
    if (h.includes(c)) return { ok: false, reason: REJECT.REFERENCE_CLAUSE, matched: c };
  }

  // 3. backstop — a paraphrase that still reproduces most of the query's tokens
  const refTokens = new Set(norm(referenceQuery).split(/[^a-z0-9_().*>=<]+/).filter(t => t.length > 2));
  if (refTokens.size) {
    const hit = [...refTokens].filter(t => h.includes(t)).length / refTokens.size;
    if (hit > 0.8) return { ok: false, reason: REJECT.TOO_SIMILAR, matched: hit.toFixed(2) };
  }

  return { ok: true };
}

/*
 * serveHint(ctx, callModel) -> a hint the learner can safely see, plus the
 * record of how it was obtained.
 *
 * ctx.referenceQuery  the answer. Never leaves this module or the writer.
 * ctx.learnerQuery    what they actually wrote
 * ctx.fallbackHint    hand-written, authored with the question. Required.
 * callModel(ctx, attemptNumber) -> hint text. Injected, so this is testable
 *                     with no network.
 *
 * Returns { text, source, modelAttempts, rejections }. All four fields go in
 * the log — `source` is what tells you on 28 Sep whether Arm A actually
 * received a hint about their own mistake, or boilerplate.
 */
async function serveHint(ctx, callModel) {
  if (!ctx.fallbackHint) {
    throw new Error('every question needs a hand-written fallbackHint; see PRD-v1 §6 item 4');
  }
  const rejections = [];
  for (let n = 1; n <= MAX_MODEL_ATTEMPTS; n++) {
    let text;
    try {
      text = await callModel(ctx, n);
    } catch (err) {
      rejections.push({ attempt: n, reason: 'model call failed: ' + (err.message || err) });
      continue;
    }
    const verdict = inspect(text, ctx);
    if (verdict.ok) {
      return { text, source: SOURCE.MODEL, modelAttempts: n, rejections };
    }
    rejections.push({ attempt: n, reason: verdict.reason, matched: verdict.matched });
  }
  return {
    text: ctx.fallbackHint,
    source: SOURCE.FALLBACK,
    modelAttempts: MAX_MODEL_ATTEMPTS,
    rejections,
  };
}

/*
 * isGeneric — the other half of the problem the leak guard does not cover.
 *
 * The guard checks a hint does not say too much. Nothing checks it says
 * enough. "Think carefully about your query structure" passes cleanly and
 * helps nobody.
 *
 * A hint that mentions nothing from the learner's own query is almost
 * certainly boilerplate. This is a weak signal, not a verdict — it is
 * REPORTED by the replay harness and does NOT auto-reject. Decide whether to
 * enforce it after reading real hints, not before.
 */
function isGeneric(hint, { learnerQuery }) {
  const h = norm(hint);
  const theirs = new Set(
    norm(learnerQuery).split(/[^a-z0-9_]+/).filter(t => t.length > 2 && !STOP.has(t))
  );
  if (!theirs.size) return false;              // nothing to reference
  for (const t of theirs) if (h.includes(t)) return false;
  return true;
}
const STOP = new Set(['select','from','the','and','not','you','your']);

const GUARD = { MAX_MODEL_ATTEMPTS, SOURCE, REJECT, inspect, serveHint, distinguishingClauses, isGeneric };
if (typeof module !== 'undefined' && module.exports) module.exports = GUARD;
if (typeof window !== 'undefined') window.GUARD = GUARD;
})();
