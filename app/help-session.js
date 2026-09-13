(function(){
/*
 * help-session.js — what happens when a learner presses Help.
 *
 * This is the seam between the two halves of the architecture (PRD-v1.md §3).
 * It calls the deterministic policy, writes what the policy chose, then — only
 * if the policy said hint — calls the probabilistic half and writes what the
 * learner actually saw.
 *
 * TWO LOG ENTRIES, NOT ONE. That is the point of this file.
 *
 *   help_decided    what the policy chose. Written immediately. Never waits
 *                   on a model, so the control path stays deterministic.
 *   help_delivered  what reached the learner. Written after the guard has run.
 *
 * Why: a hint about this learner's own mistake and a canned fallback are not
 * the same treatment. With one entry they are indistinguishable in the data,
 * and on 28 Sep you cannot say how much of Arm A's help was real.
 */

// Loads in node (require) and in the browser (globals set by the two <script> tags).
const _POLICY = (typeof require === 'function') ? require('./policy.js')     : window.POLICY;
const _GUARD  = (typeof require === 'function') ? require('./hint-guard.js') : window.GUARD;
const { decide, ACTION } = _POLICY;
const { serveHint, SOURCE } = _GUARD;

/*
 * Rebuild what the policy needs to see, from the log alone.
 *
 * Note which entries count as "help already served": only `help_decided`,
 * and only hint or reveal. A fallback is NOT excluded, and a refusal is.
 *
 * That is a design choice and it is deliberate. A learner whose hint came back
 * as boilerplate still climbs the ladder on the normal schedule. The two arms
 * have to be comparable by policy, not by whether the model behaved that day.
 */
function itemView(log, qid, arm, N) {
  return {
    arm, N,
    attempts: log.filter(e => e.type === 'attempt' && e.q === qid),
    helpServed: log
      .filter(e => e.type === 'help_decided' && e.q === qid &&
                   (e.action === ACTION.HINT || e.action === ACTION.REVEAL))
      .map(e => ({ action: e.action, afterCountedAttempts: e.counted })),
  };
}

/*
 * pressHelp — mutates `log` and returns what to show.
 *
 * callModel is injected, so this whole path is testable with no network.
 */
async function pressHelp({ log, qid, arm, N, hintCtx, callModel, now = () => new Date().toISOString() }) {
  const d = decide(itemView(log, qid, arm, N));

  // ---- entry 1: the decision. Deterministic, instant. ----
  log.push({
    type: 'help_decided', q: qid, arm,
    action: d.action, counted: d.counted, sinceHelp: d.sinceHelp, at: now(),
  });

  if (d.action !== ACTION.HINT) {
    return { action: d.action, text: d.reason, source: null };
  }

  // ---- the probabilistic half runs here, downstream of the decision ----
  const r = await serveHint(hintCtx, callModel);

  // ---- entry 2: what the learner actually saw. ----
  log.push({
    type: 'help_delivered', q: qid, arm, action: ACTION.HINT,
    source: r.source, modelAttempts: r.modelAttempts, rejections: r.rejections, at: now(),
  });

  return { action: d.action, text: r.text, source: r.source };
}

/*
 * The two numbers this split buys, read straight off the log.
 *
 *   byAction   triage check 1 — did the arms actually differ?
 *   hintQuality  how much of Arm A's help was a real hint rather than boilerplate
 */
function summarise(log) {
  const byAction = {};
  for (const e of log.filter(e => e.type === 'help_decided')) {
    const k = `${e.arm}:${e.action}`;
    byAction[k] = (byAction[k] || 0) + 1;
  }
  const delivered = log.filter(e => e.type === 'help_delivered');
  const fallbacks = delivered.filter(e => e.source === SOURCE.FALLBACK).length;
  return {
    byAction,
    hintsDelivered: delivered.length,
    fallbacks,
    fallbackRate: delivered.length ? fallbacks / delivered.length : null,
  };
}

const SESSION = { pressHelp, itemView, summarise };
if (typeof module !== 'undefined' && module.exports) module.exports = SESSION;
if (typeof window !== 'undefined') window.SESSION = SESSION;
})();
