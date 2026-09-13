#!/usr/bin/env node
/*
 * probe.js — one call, everything printed. For when replay.js says every
 * generation was rejected and you need to see what the model actually said.
 *
 *   export GROQ_API_KEY=gsk_...
 *   node evals/probe.js
 */
const { makeWriter, MODEL, TEMPERATURE, buildUser, SYSTEM } = require('../app/hint-writer.js');
const { inspect, isGeneric } = require('../app/hint-guard.js');
const transport = require('./transport-groq.js');

const ctx = {
  ask: 'highest price per category, only where that price is above 10000, sorted by name',
  referenceQuery: 'SELECT category, MAX(price) FROM products GROUP BY category HAVING MAX(price) > 10000 ORDER BY category ASC',
  learnerQuery: 'SELECT category, MAX(price) FROM products WHERE price > 10000 GROUP BY category',
  fallbackHint: 'Your filter runs before the rows are grouped.',
  difference: ['the learner uses these, the reference does not: WHERE'],
};

(async () => {
  if (!process.env.GROQ_API_KEY) { console.error('GROQ_API_KEY is not set'); process.exit(1); }
  console.log(`model: ${MODEL} @ ${TEMPERATURE}\n`);
  console.log('--- SYSTEM PROMPT ---\n' + SYSTEM + '\n');
  console.log('--- USER PROMPT ---\n' + buildUser(ctx, []) + '\n');

  let text;
  try {
    text = await makeWriter(transport)(ctx, 1, []);
  } catch (e) {
    console.log('--- TRANSPORT FAILED ---\n' + e.message);
    process.exit(1);
  }

  console.log('--- TOKENS USED ---');
  console.log(JSON.stringify(transport.lastUsage));
  console.log('\n--- WHAT THE MODEL RETURNED ---');
  console.log(JSON.stringify(text));
  console.log('\n--- GUARD VERDICT ---');
  const v = inspect(text, ctx);
  console.log(v.ok ? 'PASS' : `REJECT: ${v.reason}${v.matched ? ` (matched: ${v.matched})` : ''}`);
  console.log(`generic: ${isGeneric(text, ctx)}`);
})();
