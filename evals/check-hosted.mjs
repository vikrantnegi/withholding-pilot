/*
 * check-hosted.mjs — is the thing you uploaded the thing you built?
 *
 *   node evals/check-hosted.mjs https://<you>.github.io/sql-practice-session/
 *
 * Run from your own terminal. A Cowork shell has no route to the open internet.
 *
 * WHY. app/dist is a COPY. Edit anything in app/, re-upload without rebuilding,
 * and you have hosted the previous page — which looks completely normal, because
 * the old page also works. The same goes for a half-finished upload where
 * index.html landed and one script did not: the page loads and then throws.
 *
 * So this compares what the server returns against what is on your disk, byte
 * for byte, and checks the things that are invisible from looking at the page.
 */
import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'app', 'dist');

let base = process.argv[2];
if (!base) { console.error('\nusage: node evals/check-hosted.mjs <base url>\n'); process.exit(2); }
if (!base.endsWith('/')) base += '/';

if (!existsSync(join(DIST, 'index.html'))) {
  console.error(`\nno build at ${DIST} — run: bash app/make-dist.sh\n`); process.exit(2);
}

let pass = 0, fail = 0, warn = 0;
const ok   = n => { pass++; console.log(`  ok    ${n}`); };
const bad  = (n, d) => { fail++; console.log(`  FAIL  ${n}\n          ${d}`); };
const note = (n, d) => { warn++; console.log(`  warn  ${n}\n          ${d}`); };
const sha  = b => createHash('sha256').update(b).digest('hex').slice(0, 12);

const get = async path => {
  try {
    const r = await fetch(base + path, { redirect: 'follow' });
    const body = Buffer.from(await r.arrayBuffer());
    return { status: r.status, body, type: r.headers.get('content-type') || '',
             nosniff: (r.headers.get('x-content-type-options') || '').includes('nosniff') };
  } catch (e) { return { error: String(e.message || e) }; }
};

console.log(`\nchecking ${base}\n`);

console.log('THE PAGE IS THERE');
const page = await get('index.html');
if (page.error)            bad('index.html loads', page.error);
else if (page.status !== 200) bad('index.html loads', `HTTP ${page.status} — wrong URL, or Pages has not finished building`);
else                       ok(`index.html loads (${page.body.length} bytes)`);

/* Browsers treat localhost as a secure context, so a local test run is fine.
 * Anything else on plain HTTP is not. */
const localhost = /^https?:\/\/(localhost|127\.0\.0\.1)([:/]|$)/.test(base);
if (base.startsWith('https://'))  ok('served over HTTPS');
else if (localhost)               ok('local test over HTTP — localhost is a secure context');
else bad('served over HTTPS', 'the page fetches sql.js over HTTPS, and a page on plain HTTP ' +
         'will have that blocked as mixed content — the database never loads');

if (page.status === 200) {
  console.log('\nIT IS THE BUILD ON YOUR DISK');
  /* Not a byte comparison, because hosts inject into HTML. Netlify adds an
   * advertising comment in <head> and a HUD <script> after </html>, so a hash
   * check fails on every correct upload — and a check that always fails is one
   * you stop reading. Instead: every line of the local file must appear in the
   * served file, in order. Additions pass, a changed or missing line does not,
   * which is exactly what a stale upload looks like. */
  const local = readFileSync(join(DIST, 'index.html'), 'utf8');
  const servedHtml = page.body.toString('utf8');
  if (sha(Buffer.from(local)) === sha(page.body)) {
    ok(`index.html is byte-identical to app/dist (${sha(Buffer.from(local))})`);
  } else {
    const lines = local.split('\n').map(l => l.trim()).filter(Boolean);
    let at = 0, missing = null;
    for (const line of lines) {
      const i = servedHtml.indexOf(line, at);
      if (i === -1) { missing = line; break; }
      at = i + line.length;
    }
    if (missing) {
      bad('the served page is the build in app/dist',
          `this line of your build is not being served:\n          ${missing.slice(0, 90)}\n` +
          '          You uploaded a different build. Run: bash app/make-dist.sh, then upload again');
    } else {
      const extra = page.body.length - Buffer.byteLength(local);
      ok(`the served page contains your whole build, plus ${extra} bytes the host injected`);
      const inj = [];
      if (/netlify/i.test(servedHtml)) inj.push('Netlify (an ad comment in <head>, and a HUD script)');
      note('the host is injecting into your page',
           `${inj.join('; ') || 'unknown'} — identical for both arms, so it does not bias the ` +
           'comparison, but it is a third-party script running during the session');
    }
  }

  console.log('\nEVERY SCRIPT THE PAGE ASKS FOR');
  const html = page.body.toString('utf8');
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  const localScripts = srcs.filter(s => !/^https?:\/\//.test(s));
  const remote = srcs.filter(s => /^https?:\/\//.test(s));

  for (const s of localScripts) {
    const r = await get(s);
    if (r.error || r.status !== 200) {
      bad(`${s} loads`, r.error || `HTTP ${r.status} — the page will throw on this. ` +
          'A partial upload leaves index.html working and a script missing');
      continue;
    }
    // A classic script served as text/plain WITH nosniff is refused by the browser.
    if (r.nosniff && !/javascript|ecmascript/i.test(r.type)) {
      bad(`${s} will execute`, `served as "${r.type}" with X-Content-Type-Options: nosniff — ` +
          'the browser refuses to run it and the page is blank. Host somewhere that sets ' +
          'a JavaScript content type');
      continue;
    }
    if (!/javascript|ecmascript/i.test(r.type)) {
      note(`${s} content type`, `"${r.type}" — it will still run without nosniff, but this is not right`);
    }
    const lp = join(DIST, s);
    if (existsSync(lp) && sha(readFileSync(lp)) !== sha(r.body)) {
      bad(`${s} matches app/dist`, `served ${sha(r.body)}, local ${sha(readFileSync(lp))} — stale upload`);
    } else ok(`${s} loads and matches`);
  }
  remote.forEach(u => ok(`${u.replace(/^https:\/\//, '')} is loaded from its CDN, not from you`));

  console.log('\nWHAT MUST AND MUST NOT BE PUBLIC');
  const codes = [...html.matchAll(/"([a-z0-9]{5})":\s*"[AB]"/g)].map(m => m[1]);
  codes.length === 7
    ? ok(`all 7 participant codes are in the served page`)
    : bad('all 7 participant codes are served', `found ${codes.length} — links will fail for the rest`);

  const served = [page.body.toString('utf8'),
                  ...(await Promise.all(localScripts.map(async s => (await get(s)).body?.toString('utf8') || '')))].join('\n');
  const names = ['nabin','gaurav','ritesh','anuj','vikash','manish','rishabh']
    .filter(n => new RegExp(n, 'i').test(served));
  names.length
    ? bad('no participant name is public', `found: ${names.join(', ')} — take the site down and rebuild`)
    : ok('no participant name is public');

  /\bH(0[1-9]|1[0-2])\b/.test(served)
    ? bad('no held-out question is public', 'a held-out id is being served — those must survive to the removal test')
    : ok('no held-out question is public');

  const t = await get('transport.js');
  const url = (t.body?.toString('utf8').match(/DEFAULT_URL\s*=\s*['"]([^'"]*)['"]/) || [])[1];
  url ? ok(`the served page points at the hint function\n        ${url}`)
      : bad('the served page points at the hint function',
            'DEFAULT_URL is empty in what is hosted — every hint will be the hand-written ' +
            'fallback, in a session that looks completely normal');
}

console.log(`\n${pass} passed, ${fail} failed${warn ? `, ${warn} warning${warn > 1 ? 's' : ''}` : ''}\n`);
if (!fail) {
  console.log('Still worth doing by hand, because no script can see it:');
  console.log('  1. Open your own link with any code and check a question appears.');
  console.log('  2. Run one wrong-but-valid query, then press Help.');
  console.log('  3. If the hint says "(fallback)", the function is not reachable from the');
  console.log('     hosted page even though it answers from your terminal — usually CORS.\n');
}
process.exit(fail ? 1 : 0);
