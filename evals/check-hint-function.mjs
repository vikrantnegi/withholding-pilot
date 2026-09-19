/*
 * check-hint-function.mjs — prove the deployed hint function actually works.
 *
 *   node evals/check-hint-function.mjs https://<ref>.supabase.co/functions/v1/hint
 *
 * Run this in your own terminal, after deploying. A Cowork shell cannot reach
 * Supabase or Groq.
 *
 * WHY THIS EXISTS. The app degrades rather than breaks: if the function is
 * missing, unauthorised, out of quota, or pinned to a model Groq no longer
 * serves, every learner gets the item's hand-written fallback and a session
 * that looks completely normal. Arm A would then be measured on a fixed hint
 * instead of a grounded one, and nothing on screen would say so. Silence is the
 * failure mode, so it needs its own check.
 *
 * It uses the REAL prompt builder from app/hint-writer.js rather than a
 * hand-written request, so what is tested is what the app will send.
 */
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const require = createRequire(import.meta.url);
const WRITER = require(join(ROOT, 'app', 'hint-writer.js'));
const GUARD  = require(join(ROOT, 'app', 'hint-guard.js'));

const url = process.argv[2];
if (!url) {
  console.error('\nusage: node evals/check-hint-function.mjs <function url>\n');
  process.exit(2);
}

let pass = 0, fail = 0;
const ok  = n => { pass++; console.log(`  ok    ${n}`); };
const bad = (n, d) => { fail++; console.log(`  FAIL  ${n}\n          ${d}`); };

const post = async (body, ms = 30000) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    let data = null;
    try { data = await r.json(); } catch { /* not json */ }
    return { status: r.status, data };
  } catch (e) {
    return { status: 0, error: String(e.message || e) };
  } finally { clearTimeout(t); }
};

/* Exactly what makeWriter() posts, built from the real prompt, so this checks the
 * request the app will actually send rather than a hand-written approximation. */
const request = ctx => ({
  model: WRITER.MODEL,
  system: WRITER.SYSTEM,
  user: WRITER.buildUser(ctx, []),
  temperature: WRITER.TEMPERATURE,
  maxTokens: WRITER.MAX_TOKENS,
  reasoningEffort: WRITER.REASONING_EFFORT,
});

/* A real item, and a wrong answer a learner actually produced in round 2:
 * the row filter in HAVING. If the function is working, what comes back is a
 * hint about that mistake. */
const CTX = {
  referenceQuery: "SELECT service, COUNT(*) AS failed_count FROM deploys " +
                  "WHERE status = 'failed' GROUP BY service ORDER BY service",
  learnerQuery:   "SELECT service, COUNT(*) FROM deploys GROUP BY service " +
                  "HAVING status = 'failed' ORDER BY service",
  fallbackHint:   "A deploy either failed or it did not — that is a fact about one row.",
};

console.log(`\nchecking ${url}\n`);
console.log('REACHABLE');
const probe = await post(request(CTX));
if (probe.status === 0) {
  bad('the function answers', probe.error +
      '  — wrong URL, or no network from this machine');
} else if (probe.status === 401 || probe.status === 403) {
  bad('the function answers', `HTTP ${probe.status} — deployed WITHOUT --no-verify-jwt. ` +
      'The page sends no auth header, so every call fails and every learner gets a fallback. ' +
      'Redeploy: supabase functions deploy hint --no-verify-jwt');
} else if (probe.status !== 200) {
  bad('the function answers', `HTTP ${probe.status} ${JSON.stringify(probe.data)}`);
} else if (probe.data?.error) {
  const e = String(probe.data.error);
  bad('the function answers without an error', e +
      (/GROQ_API_KEY/.test(e) ? '  — run: supabase secrets set GROQ_API_KEY=gsk_...' : ''));
} else {
  ok('the function answers');
}

if (probe.status === 200 && !probe.data?.error) {
  console.log('\nIT RETURNS A REAL HINT');
  const text = probe.data.text;
  text && String(text).trim()
    ? ok('text came back, so the learner gets a generated hint, not the fallback')
    : bad('text came back', 'null or empty — every learner would silently get the fallback');

  if (text) {
    const verdict = GUARD.inspect(text, CTX);
    verdict.ok
      ? ok('and the guard accepts it, so it reaches the learner')
      : bad('the guard accepts it', `rejected: ${verdict.reason} — the model is leaking ` +
            'the answer, and the fallback would be served in its place');
    console.log(`\n        ${String(text).replace(/\s+/g, ' ').slice(0, 160)}\n`);
  }

  console.log('THE MODEL IS PINNED, SERVER SIDE');
  probe.data.model === WRITER.MODEL
    ? ok(`served ${probe.data.model}, matching app/hint-writer.js`)
    : bad('the served model matches hint-writer.js',
          `served ${probe.data.model}, app expects ${WRITER.MODEL} — ` +
          'the study cannot claim the model was fixed');

  const tampered = await post({ ...request(CTX), model: 'some/other-model' });
  tampered.data?.error
    ? ok('a request for a different model is refused')
    : bad('a request for a different model is refused',
          'it was served — a tampered page could change the model mid-study');
}

console.log(`\n${pass} passed, ${fail} failed\n`);
if (fail) {
  console.log('Do not run the session on this. An unconfigured function is invisible from');
  console.log('inside the app: every learner gets a hand-written fallback and the session');
  console.log('looks normal. supabase/README.md has the fix for each failure above.\n');
}
process.exit(fail ? 1 : 0);
