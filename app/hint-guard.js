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

const SOURCE = {
  MODEL: 'model',
  FALLBACK: 'fallback',
  // The fallback itself failed inspection and was withheld. Should never
  // happen — checkFallback() is meant to catch it while authoring — but if it
  // does, a learner gets a neutral line rather than the answer.
  FALLBACK_BLOCKED: 'fallback_blocked',
};

/* Served only if a question's own fallback fails the guard. Says nothing that
 * could leak, because it knows nothing. */
const LAST_RESORT = 'Compare the rows you got against what the question asked for, one column at a time.';
const REJECT = {
  RUNNABLE_QUERY: 'contains a runnable SELECT',
  REFERENCE_CLAUSE: 'contains a distinguishing clause of the reference query',
  TOO_SIMILAR: 'too much of the reference query reproduced verbatim',
  WALKTHROUGH: 'recites the query clause by clause',
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
/*
 * A walkthrough — the query dictated in English, with no SQL in it at all.
 *
 * This is the leak the clause rules cannot see, because it never writes a
 * clause verbatim: "the FROM keyword specifies the table products, after which
 * the GROUP BY keyword groups the rows by the column category". A learner
 * types the answer straight out of that.
 *
 * The signal is shape, not content: a real hint talks about the one or two
 * things the learner got wrong. A dictation recites everything.
 *
 * THE THRESHOLD IS MEASURED, NOT CHOSEN. Across the 101 hints actually served
 * in the 104-case run: 66 named no SQL keyword at all, 29 named one, 5 named
 * two, 1 named three, and none named four. The two prose leaks from the
 * adversarial run named six and seven. Four separates them with room on both
 * sides. EXPERIMENT-LOG Run 5.
 *
 * No learner-query exemption here, unlike the clause rules. Reciting the whole
 * query is a leak whatever the learner happened to write — and the corpus
 * agrees: no real hint tripped it.
 */
const SQL_WORDS = ['select','from','where','group by','having','order by','join',
                   'count','max','min','sum','asc','desc','distinct'];
const WALKTHROUGH_LIMIT = 4;

function keywordsNamed(hint) {
  const h = norm(hint);
  const seen = new Set();
  for (const k of SQL_WORDS) {
    if (new RegExp(`\\b${k.replace(' ', '\\s+')}\\b`).test(h)) seen.add(k);
  }
  return seen;
}

/* The tables this question's data actually lives in. A hint that names one of
 * them right after FROM or JOIN is writing a query, not describing a mistake. */
function tablesIn(referenceQuery) {
  const q = norm(referenceQuery);
  const out = new Set();
  for (const m of q.matchAll(/\b(?:from|join|into|update)\s+([a-z_][a-z0-9_]*)/g)) out.add(m[1]);
  return [...out];
}

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
function inspect(hint, { referenceQuery, learnerQuery }) {
  const h = norm(hint);
  if (!h) return { ok: false, reason: REJECT.EMPTY };

  // 1. a runnable query, whoever wrote it.
  //
  // NOT "the words select and from appear". They are ordinary English —
  // "you started with SELECT ... where the data comes FROM" is a good hint and
  // the first version of this check rejected it (LEARNING-LOG L12). The prompt
  // asks the model to quote what the learner wrote, so naming SELECT is
  // expected, not suspicious.
  //
  // A query that RUNS has to name a real table. The reference tells us which
  // tables exist, so that is what we look for.
  const tables = tablesIn(referenceQuery);
  if (tables.length) {
    const named = new RegExp(`\\b(from|join|into|update)\\s+\`?"?(${tables.join('|')})\\b`, 'i');
    if (/\bselect\b/.test(h) && named.test(h)) {
      return { ok: false, reason: REJECT.RUNNABLE_QUERY, matched: 'select + a real table name' };
    }
  }
  // NB: an earlier version also rejected "select ... ;" on the theory that a
  // semicolon means a terminated statement. English prose uses semicolons —
  // "nothing is processed; you need to specify where the data comes from" was
  // rejected by it. The real-table rule above already catches queries that
  // would run, so the semicolon rule was removed rather than patched.

  // 2. any clause that DISTINGUISHES the reference query.
  //
  // "Distinguishing" means the learner does not already have it. If they wrote
  // MAX(price) themselves, a hint quoting MAX(price) back at them reveals
  // nothing — they are looking at it in their own editor. The prompt asks the
  // writer to quote what they wrote, so this fired constantly: 7 of 8
  // rejections in the 104-case run were exactly this. LEARNING-LOG L13.
  const theirs = norm(learnerQuery);
  for (const c of distinguishingClauses(referenceQuery)) {
    if (theirs && theirs.includes(c)) continue;          // they already wrote it
    if (h.includes(c)) return { ok: false, reason: REJECT.REFERENCE_CLAUSE, matched: c };
  }

  // 3. a walkthrough: the query recited, keyword by keyword, in prose
  const named = keywordsNamed(h);
  if (named.size >= WALKTHROUGH_LIMIT) {
    return { ok: false, reason: REJECT.WALKTHROUGH, matched: `${named.size} keywords: ${[...named].join(', ')}` };
  }

  // 4. backstop — a paraphrase that still reproduces most of the query's tokens
  const refTokens = new Set(
    norm(referenceQuery).split(/[^a-z0-9_().*>=<]+/)
      .filter(t => t.length > 2)
      .filter(t => !(theirs && theirs.includes(t)))     // not new to the learner
  );
  // The denominator here is reference tokens the learner does NOT have. After
  // L13 removed the ones they wrote, that set can be tiny — and a short hint
  // matching 2 of 2 hits 100% while disclosing nothing. Two real hints about
  // an ASC/DSC typo were rejected that way. So require enough novel tokens for
  // the ratio to mean something, and enough absolute matches to be a
  // reproduction rather than a coincidence.
  if (refTokens.size >= 6) {
    const hits = [...refTokens].filter(t => h.includes(t)).length;
    if (hits >= 5 && hits / refTokens.size > 0.8) {
      return { ok: false, reason: REJECT.TOO_SIMILAR, matched: `${hits}/${refTokens.size} tokens` };
    }
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
 * callModel(ctx, attemptNumber, rejectionsSoFar) -> hint text. Injected, so
 *                     this is testable with no network. The third argument lets
 *                     a retry be told why the last generation was thrown away.
 *
 * Returns { text, source, modelAttempts, rejections }. Each rejection carries
 * the generation that was thrown away, so a bad prompt is debuggable from the
 * log rather than by guesswork. All four fields go in
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
      text = await callModel(ctx, n, rejections);
    } catch (err) {
      rejections.push({ attempt: n, reason: 'model call failed: ' + (err.message || err), text: null });
      continue;
    }
    const verdict = inspect(text, ctx);
    if (verdict.ok) {
      return { text, source: SOURCE.MODEL, modelAttempts: n, rejections };
    }
    rejections.push({
      attempt: n, reason: verdict.reason, matched: verdict.matched,
      text: typeof text === 'string' ? text.slice(0, 400) : String(text),
    });
  }
  // The fallback gets the same inspection a generation gets. Authoring is
  // supposed to have caught this (checkFallback), but a leak reaching a
  // learner is the one failure that silently converts Arm A into Arm B.
  const fb = inspect(ctx.fallbackHint, ctx);
  if (!fb.ok) {
    return {
      text: LAST_RESORT,
      source: SOURCE.FALLBACK_BLOCKED,
      modelAttempts: MAX_MODEL_ATTEMPTS,
      rejections: rejections.concat([{ attempt: 'fallback', reason: fb.reason, matched: fb.matched,
                                       text: String(ctx.fallbackHint).slice(0, 400) }]),
    };
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
  for (const t of theirs) {
    if (h.includes(t)) return false;
    // Match on a stem, so "categories" counts as naming "category" and
    // "prices" counts as naming "price". Never shorter than 4 characters.
    const stem = t.slice(0, Math.max(4, t.length - 2));
    if (stem.length >= 4 && h.includes(stem)) return false;
  }
  return true;
}
const STOP = new Set(['select','from','the','and','not','you','your']);

/*
 * checkFallback — verify a hand-written fallback the same way a generation is
 * verified. Run this while authoring, not in front of a learner.
 *
 * A fallback is the one hint you KNOW someone may see, and nothing was
 * checking it. A fallback that leaks turns every model failure into a reveal.
 *
 * It cannot be checked for referencing the learner's own query — it is written
 * before any learner exists. So the generic test is applied against the
 * REFERENCE query instead: the fallback must at least name something concrete
 * from the question, rather than being advice about queries in general.
 *
 * Returns { ok, problems: [...] }.
 */
function checkFallback(text, { referenceQuery }) {
  const problems = [];
  const t = String(text || '').trim();
  if (!t) problems.push('empty');
  const verdict = inspect(t, { referenceQuery });
  if (!verdict.ok) problems.push(verdict.reason + (verdict.matched ? ` (matched: ${verdict.matched})` : ''));
  if (t && isGeneric(t, { learnerQuery: referenceQuery })) {
    problems.push('names nothing concrete from the question — it is advice about queries in general');
  }
  const words = t.split(/\s+/).filter(Boolean).length;
  if (words > 45) problems.push(`${words} words — a hint the learner will not read`);
  return { ok: problems.length === 0, problems };
}

const GUARD = { MAX_MODEL_ATTEMPTS, SOURCE, REJECT, LAST_RESORT, inspect, serveHint,
                distinguishingClauses, tablesIn, keywordsNamed, WALKTHROUGH_LIMIT,
                isGeneric, checkFallback };
if (typeof module !== 'undefined' && module.exports) module.exports = GUARD;
if (typeof window !== 'undefined') window.GUARD = GUARD;
})();
