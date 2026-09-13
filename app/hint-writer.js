(function(){
/*
 * hint-writer.js — the hint writer. PRD-v1.md §6 item 2.
 *
 * ONE module, used by BOTH the app and the eval:
 *
 *     app/index.html   ──┐
 *                        ├──> hint-writer.js ──> transport ──> the model
 *     evals/replay.js  ──┘
 *
 * If the eval had its own prompt you would evaluate one thing and ship
 * another, and the drift would be invisible. So there is only one prompt,
 * one model id, one temperature, and they live here.
 *
 * The transport is injected. In the browser it posts to a Supabase Edge
 * Function that holds the API key; in node the eval calls Groq directly.
 * Neither the prompt nor the model changes between them.
 */

// ---------------------------------------------------------------------------
// PINNED. Do not change between the eval and 21 Sep.
// ---------------------------------------------------------------------------
// Groq marks this a *production* model; its preview models are documented as
// "evaluation only, not for production". The study is production — six people,
// one session, no re-runs.
//
// Both values are written into the help_delivered log entry so 28 Sep can
// prove the writer did not move underneath the study.
const MODEL = 'openai/gpt-oss-120b';
const TEMPERATURE = 0.3;
// gpt-oss reasons before it answers, and those reasoning tokens count against
// max_tokens even when reasoning_format hides them from the reply. At 120 the
// budget was spent thinking and the visible content came back empty
// (finish_reason=length). The hint itself is ~50 tokens; the rest is headroom.
const MAX_TOKENS = 900;
// Keep the thinking short — this is one sentence about one mistake, not a proof.
const REASONING_EFFORT = 'low';

// ---------------------------------------------------------------------------
// The prompt
// ---------------------------------------------------------------------------
/*
 * Two constraints do all the work, and they pull in opposite directions.
 *
 *   "never write SQL"        — or the leak guard rejects it and the learner
 *                              gets boilerplate instead. Arm A degrades
 *                              towards "gate and nothing".
 *   "quote something they    — or the hint is generic and helps nobody, which
 *    actually wrote"           degrades Arm A the same way from the other side.
 *
 * A hint that satisfies both has to name their specific mistake in words.
 * That is exactly the treatment the study is testing.
 */
const SYSTEM = [
  'You help someone learn SQL by pointing at their own mistake. You never solve it for them.',
  '',
  'You are given the question, the learner\'s query, the correct query, and what went wrong.',
  'The correct query is for YOUR understanding only. The learner must never see any part of it.',
  '',
  'Write ONE sentence, under 35 words, that does all of this:',
  '  - quotes or names something the learner actually wrote',
  '  - says what that does to the rows, in plain words',
  '  - leaves them something to work out',
  '',
  'Absolute rules:',
  '  - Never write SQL. No SELECT. No clause with its argument attached.',
  '  - Never name the clause that would fix it. Describe what is needed, do not name it.',
  '  - Never mention the correct query, or that you have seen one.',
  '  - No preamble, no "Here is a hint". Just the sentence.',
  '',
  'Good: "You used WHERE, which runs on single rows before they are grouped — you need a filter that runs after the grouping."',
  'Bad:  "Use HAVING MAX(price) > 10000."            (writes the fix)',
  'Bad:  "Think carefully about your query structure." (says nothing about their query)',
].join('\n');

function buildUser(ctx, rejections) {
  const parts = [
    `QUESTION: ${ctx.ask || '(not given)'}`,
    '',
    'THE LEARNER WROTE:',
    String(ctx.learnerQuery || '').trim() || '(nothing)',
    '',
    'THE CORRECT QUERY (never reveal any part of this):',
    String(ctx.referenceQuery || '').trim(),
  ];
  if (ctx.difference && ctx.difference.length) {
    parts.push('', 'WHAT WENT WRONG:', ...ctx.difference.map(d => `- ${d}`));
  }
  if (rejections && rejections.length) {
    parts.push('', 'YOUR PREVIOUS ATTEMPT WAS REJECTED:',
      ...rejections.map(r => `- ${r.reason}`),
      'Write a different sentence that does not do that.');
  }
  return parts.join('\n');
}

/*
 * writeHint(ctx, attempt, rejections, transport) -> string
 *
 * transport({ model, system, user, temperature, maxTokens }) -> text
 *
 * Returns null on any transport failure. serveHint() treats null as a
 * rejection and falls through to the question's hand-written fallback, so a
 * dead model degrades to a worse hint, never to a blank screen.
 */
function makeWriter(transport) {
  return async function writeHint(ctx, attempt, rejections) {
    const text = await transport({
      model: MODEL,
      system: SYSTEM,
      user: buildUser(ctx, rejections),
      temperature: TEMPERATURE,
      maxTokens: MAX_TOKENS,
      reasoningEffort: REASONING_EFFORT,
    });
    return typeof text === 'string' ? text.trim() : null;
  };
}

const WRITER = { MODEL, TEMPERATURE, MAX_TOKENS, REASONING_EFFORT, SYSTEM, buildUser, makeWriter };
if (typeof module !== 'undefined' && module.exports) module.exports = WRITER;
if (typeof window !== 'undefined') window.WRITER = WRITER;
})();
