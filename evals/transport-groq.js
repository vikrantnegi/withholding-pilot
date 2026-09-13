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
      // gpt-oss models emit a separate reasoning channel. Without this the
      // visible content can come back empty and the hint reads as "empty hint".
      reasoning_format: 'hidden',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  });
  if (!r.ok) throw new Error(`groq ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const data = await r.json();
  const m = data?.choices?.[0]?.message ?? {};
  const raw = m.content || m.reasoning || m.reasoning_content || null;
  if (!raw) {
    // Say why, instead of letting it surface as a blank "empty hint".
    throw new Error(`no text in reply (finish_reason=${data?.choices?.[0]?.finish_reason}, keys=${Object.keys(m)})`);
  }
  // strip any leaked chain-of-thought wrapper
  return String(raw).replace(/<think>[\s\S]*?<\/think>/gi, '').trim() || null;
};
