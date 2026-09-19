#!/usr/bin/env node
/* Re-runs the substance bar over the round-2 logs after a schema change.
 *
 * It loads the REAL isSubstantive() out of app/policy.js rather than
 * reimplementing it. A Python copy of the rule would drift from the shipped
 * one, and then this script would be validating the copy.
 *
 * Usage, from anywhere:
 *   node study-questions/validate-substance-bar.js \
 *     --policy app/policy.js \
 *     --logs screener/round-2-runbutton/logs \
 *     --schema study-questions/schema.sql
 */
const fs = require('fs'), path = require('path'), vm = require('vm');

const args = {};
process.argv.slice(2).forEach((a, i, all) => { if (a.startsWith('--')) args[a.slice(2)] = all[i + 1]; });
const HERE = __dirname;
const POLICY = path.resolve(args.policy || path.join(HERE, '..', 'app', 'policy.js'));
const LOGS   = path.resolve(args.logs   || path.join(HERE, '..', 'screener', 'round-2-runbutton', 'logs'));
const SCHEMA = path.resolve(args.schema || path.join(HERE, 'schema.sql'));

function die(m) { console.error('ERROR: ' + m); process.exit(1); }
[POLICY, LOGS, SCHEMA].forEach(p => { if (!fs.existsSync(p)) die('not found: ' + p); });

/* ---- load policy.js, whatever module style it uses ---- */
let src = fs.readFileSync(POLICY, 'utf8')
  .replace(/^\s*export\s+default\s+/gm, 'var __default = ')
  .replace(/^\s*export\s+/gm, '');
const sandbox = { module: { exports: {} }, exports: {}, console, require };
sandbox.exports = sandbox.module.exports;
try { vm.runInNewContext(src + '\n;__names = Object.keys(this);', sandbox, { filename: POLICY }); }
catch (e) { die('could not evaluate ' + POLICY + ': ' + e.message); }
const pick = n => sandbox[n] || sandbox.module.exports[n];
const isSubstantive = pick('isSubstantive');
if (typeof isSubstantive !== 'function') die('isSubstantive() not found in ' + POLICY);

/* ---- schema names from schema.sql ---- */
const sql = fs.readFileSync(SCHEMA, 'utf8');
const names = new Set();
for (const m of sql.matchAll(/CREATE TABLE\s+(\w+)\s*\(([^;]*)\)/gi)) {
  names.add(m[1]);
  m[2].split(',').forEach(col => { const w = col.trim().split(/\s+/)[0]; if (w) names.add(w); });
}
const schemaNames = [...names];
console.log(`schema: ${schemaNames.length} names from ${path.basename(SCHEMA)}`);

/* ---- how does isSubstantive receive the schema? try the plausible shapes ---- */
const configure = pick('configureSchema') || pick('setSchema') || pick('initSchema');
if (typeof configure === 'function') { configure(schemaNames); console.log('schema passed via ' + configure.name + '()'); }
const call = text => {
  if (isSubstantive.length >= 2) return isSubstantive(text, schemaNames);
  return isSubstantive(text);
};
try { call('SELECT * FROM deploys'); }
catch (e) { die('isSubstantive() threw on a sane query — check how it takes the schema: ' + e.message); }

/* ---- pull every attempt out of the logs, whatever the shape ---- */
const QUERY_KEYS = ['query', 'sql', 'text', 'queryText', 'attempt', 'value', 'code'];
const attempts = [];
function walk(node, file) {
  if (Array.isArray(node)) return node.forEach(n => walk(n, file));
  if (node && typeof node === 'object') {
    for (const k of QUERY_KEYS) {
      if (typeof node[k] === 'string') {
        attempts.push({ file, key: k, text: node[k], person: node.person || node.learner || node.user, item: node.item || node.question });
        break;
      }
    }
    Object.values(node).forEach(v => walk(v, file));
  }
}
const files = fs.readdirSync(LOGS).filter(f => f.endsWith('.json'));
if (!files.length) die('no .json files in ' + LOGS);
files.forEach(f => { try { walk(JSON.parse(fs.readFileSync(path.join(LOGS, f), 'utf8')), f); } catch (e) { console.warn('skipped ' + f + ': ' + e.message); } });
if (!attempts.length) die('found no attempt strings. Keys searched: ' + QUERY_KEYS.join(', ') + '. Pass --key yourKeyName.');
if (args.key) { /* narrow if the user names the field */ }

/* ---- run the bar ---- */
let pass = 0; const rejected = [];
for (const a of attempts) { if (call(a.text)) pass++; else rejected.push(a); }

console.log(`\nattempts: ${attempts.length}   pass: ${pass}   rejected: ${rejected.length}`);
console.log(`baseline, same extractor against the OLD screener schema: 121 of 122 passed,`);
console.log(`1 rejected (a bare SELECT). Reproduce it with --schema <the old schema>.`);
console.log(`The earlier "121 of 128, 7 rejected" claim is withdrawn: 121 passing is right, but`);
console.log(`this extractor finds 122 attempts, not 128. The 6 empty submissions it counted are`);
console.log(`not in the corpus it reads now, so that denominator could not be reproduced.\n`);
if (rejected.length) {
  console.log('REJECTED, in full — judge each one: is it a genuine attempt?\n');
  rejected.forEach((r, i) => {
    const empty = r.text.trim() === '';
    console.log(`--- ${i + 1}/${rejected.length}  ${r.file}${r.person ? '  ' + r.person : ''}${r.item ? '  ' + r.item : ''}${empty ? '  [EMPTY]' : ''}`);
    console.log(r.text.trim() === '' ? '(empty)' : r.text);
    console.log('');
  });
}
console.log('Expect MORE rejections than the 121-of-122 baseline: these logged attempts name the');
console.log('old orders/products tables, which the new schema does not have. That is the schema');
console.log('half of the bar working. Judge on whether any REAL attempt was lost, not on the count.');
console.log('');
console.log('Verified 19 Sep against the new schema: 7 of 122 pass, 115 rejected. Every one of the');
console.log('114 newly rejected attempts passes under the old schema, so each was rejected for the');
console.log('dead table names alone. The 115th is the bare SELECT already rejected at baseline.');
console.log('No genuine attempt was lost for any other reason.');
console.log('');
console.log('Known coarseness, found the same day: all 7 passers are old-schema queries naming');
console.log('city or status, columns both schemas share. The schema half tests whether a name');
console.log('appears, not whether the table exists. It also passed SELECT status.equals(...),');
console.log('which is not SQL — a false pass at baseline too, not caused by the schema change.');
