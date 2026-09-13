(function(){
/*
 * transport.js — how the browser reaches the model.
 *
 * It posts to the Supabase Edge Function, which holds the key and pins the
 * model. The page never sees either.
 *
 * Set the function URL below, or append ?hint=<url> when opening the app.
 * With no URL configured, every generation fails and every learner gets the
 * question's hand-written fallback — degraded, never broken.
 */
const DEFAULT_URL = '';   // e.g. https://<project-ref>.supabase.co/functions/v1/hint

function edgeTransport(url) {
  return async function ({ model, system, user, temperature, maxTokens }) {
    if (!url) return null;                       // not configured -> fallback
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model, system, user, temperature, maxTokens }),
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
