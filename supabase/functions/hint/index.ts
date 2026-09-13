/*
 * supabase/functions/hint — holds the API key so the page does not.
 *
 *   supabase functions deploy hint
 *   supabase secrets set GROQ_API_KEY=gsk_...
 *
 * The study app is a static HTML file that runs on a learner's machine.
 * Calling Groq from there would ship the key to six people. This function is
 * the only thing that sees it.
 *
 * It also pins the model SERVER-SIDE. A tampered page cannot ask for a
 * different one, so "the model did not change during the study" is a claim
 * the deployment enforces rather than a claim the client promises.
 */

const MODEL = 'openai/gpt-oss-120b';       // must match app/hint-writer.js
const GROQ = 'https://api.groq.com/openai/v1/chat/completions';

const cors = {
  'Access-Control-Allow-Origin': '*',       // the app runs from file:// and localhost
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const key = Deno.env.get('GROQ_API_KEY');
  if (!key) return json({ error: 'GROQ_API_KEY is not set on this function' }, 500);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'body must be JSON' }, 400); }

  const { system, user, temperature, maxTokens, reasoningEffort } = body ?? {};
  if (typeof system !== 'string' || typeof user !== 'string') {
    return json({ error: 'system and user must be strings' }, 400);
  }
  // The client may ask; it does not decide. The pin lives here.
  if (body.model && body.model !== MODEL) {
    return json({ error: `this function only serves ${MODEL}` }, 400);
  }

  let r: Response;
  try {
    r = await fetch(GROQ, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: typeof temperature === 'number' ? temperature : 0.3,
        // Reasoning tokens count against this even when hidden. 120 was not
        // enough for gpt-oss to reach a visible answer.
        max_tokens: typeof maxTokens === 'number' ? maxTokens : 900,
        reasoning_format: 'hidden',
        reasoning_effort: reasoningEffort ?? 'low',
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    });
  } catch (e) {
    // The app treats any failure as a rejected generation and serves the
    // question's hand-written fallback. Never a blank screen.
    return json({ error: `upstream unreachable: ${e}` }, 502);
  }

  if (!r.ok) return json({ error: `groq ${r.status}: ${(await r.text()).slice(0, 300)}` }, 502);

  const data = await r.json();
  const m = data?.choices?.[0]?.message ?? {};
  const raw = m.content || m.reasoning || m.reasoning_content || null;
  const text = raw ? String(raw).replace(/<think>[\s\S]*?<\/think>/gi, '').trim() : null;
  return json({ text, model: data?.model ?? MODEL, usage: data?.usage ?? null });
});
