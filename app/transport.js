(function(){
/*
 * transport.js — how the browser reaches the model.
 *
 * It posts to the Supabase Edge Function, which holds the key and pins the
 * model. The page never sees either.
 *
 * SET THE URL IN DEFAULT_URL BELOW. One place, once, for everybody.
 *
 * ?hint=<url> also works and overrides it, but that is for a quick local test,
 * never for the study. Putting the URL in the participant links means seven
 * chances to mistype or forget one — and a participant whose link lost the URL
 * runs on fallback hints while everyone else gets real ones. If that person is
 * in Arm A, the two arms now differ in something other than the help policy,
 * and nothing on screen says so. PRD-v1 §1 does not survive that.
 *
 * With no URL configured, every generation fails and every learner gets the
 * question's hand-written fallback — degraded, never broken, and silent. Run
 * evals/check-hint-function.mjs after deploying; silence is the failure mode
 * this whole file has to be checked against.
 */
const DEFAULT_URL = 'https://yzmunjbhhtuerxoinxsd.supabase.co/functions/v1/hint';

function edgeTransport(url) {
  return async function ({ model, system, user, temperature, maxTokens, reasoningEffort }) {
    if (!url) return null;                       // not configured -> fallback
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model, system, user, temperature, maxTokens, reasoningEffort }),
    });
    if (!r.ok) throw new Error(`hint function ${r.status}`);
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  };
}

const url = (typeof location !== 'undefined' &&
             new URLSearchParams(location.search).get('hint')) || DEFAULT_URL;

const TRANSPORT = { edgeTransport, url, configured: Boolean(url) };
if (typeof module !== 'undefined' && module.exports) module.exports = TRANSPORT;
if (typeof window !== 'undefined') window.TRANSPORT = TRANSPORT;
})();
