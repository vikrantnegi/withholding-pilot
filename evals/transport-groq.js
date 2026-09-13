/*
 * transport-groq.js — how the EVAL reaches the model.
 *
 *   export GROQ_API_KEY=gsk_...
 *
 * The app goes through the Supabase Edge Function because the key cannot ship
 * in a page. The eval runs on your own machine, so it calls Groq directly —
 * fewer moving parts, and the function is not on the critical path for a
 * script only you run.
 *
 * The PROMPT and the MODEL are identical either way: both come from
 * app/hint-writer.js. Only the pipe differs.
 */
const GROQ = 'https://api.groq.com/openai/v1/chat/completions';

module.exports = async function ({ model, system, user, temperature, maxTokens }) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const r = await fetch(GROQ, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model, temperature, max_tokens: maxTokens,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  });
  if (!r.ok) throw new Error(`groq ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const data = await r.json();
  return data?.choices?.[0]?.message?.content ?? null;
};
