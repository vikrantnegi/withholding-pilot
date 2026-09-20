# The hint function — deploy and verify

**Run these in your own macOS Terminal.** Not in a Cowork session: that shell is an isolated VM
with no network, and it cannot reach Supabase or Groq. It also should never hold your API key.

**Why this function exists.** The study app is a static HTML file that runs on a learner's
machine. Calling Groq from there would ship the key to seven people. This function is the only
thing that sees it. It also pins the model server-side, so "the model did not change during the
study" is something the deployment enforces rather than something the page promises.

---

## Deploy

```sh
cd ~/Documents/personal/capstone

brew install supabase/tap/supabase     # or: npx supabase@latest <command>
supabase login                         # opens a browser
supabase link --project-ref yzmunjbhhtuerxoinxsd

supabase secrets set GROQ_API_KEY=gsk_...
supabase functions deploy hint --no-verify-jwt
```

`--no-verify-jwt` matters. Without it the function demands a Supabase auth header, the page does
not send one, every call 401s, and every learner silently gets a fallback hint. The function has
no other auth, so treat its URL as semi-public — it is rate-limited by Groq and pinned to one
model, and it is live for one week.

The deploy prints the URL:

```
https://yzmunjbhhtuerxoinxsd.supabase.co/functions/v1/hint
```

## Wire it in — one place, not seven

**Already done** — `app/transport.js` has it:

```js
const DEFAULT_URL = 'https://yzmunjbhhtuerxoinxsd.supabase.co/functions/v1/hint';
```

The URL is fixed by the project ref, so it could be set before the function existed. Setting it
early is not the same as it working: until `hint` is deployed with a key, that URL 404s, the
app treats the failure as a rejected generation, and every learner gets a fallback. Only the
checker below can tell the difference.

Do **not** append `?hint=` to the participant links. Seven links is seven chances to miss one,
and a participant whose link lost the URL runs on fallback hints while everyone else gets real
ones. If that person is in Arm A, the arms differ in something other than the help policy and
nothing on screen says so.

## Verify — this is the part that is not optional

```sh
node evals/check-hint-function.mjs https://yzmunjbhhtuerxoinxsd.supabase.co/functions/v1/hint
```

**The failure mode here is silence.** The app is built to degrade rather than break: a function
that is missing, unauthorised, out of quota or misconfigured produces a hand-written fallback
hint and a normal-looking session. Monday would run, look fine, and measure the wrong treatment.
Nothing on screen would tell you. The checker is the only thing that will.

It asserts the function answers, returns real text, pins the model, rejects a request for a
different model, and reports a missing key as an error rather than as an empty hint.

## If it is not deployed by Monday

Running the practice session on fallback hints is a defensible study, but it is a **different**
one, and it has to be written down before the session rather than discovered afterwards.

Arm A's treatment becomes *a fixed hint written in advance* instead of *a hint grounded in the
query this learner just wrote*. That is arguably cleaner — no model variance across sessions,
fully reproducible — but it is not what `PRD-v1.md` §4 specifies, and the architecture claim in
§3 rests on the LLM being a component of the system.

The fallbacks themselves are sound: one per item, checked by `study-questions/verify_hints.py`,
which confirms every item has one and that none names a clause or writes SQL.

**Decide it, do not drift into it.** If the session runs unconfigured, say so in
`HYPOTHESIS-LOG.md` on the day, not on the 28th.

---

# Hosting the app

**Do not publish this repository to host it.** GitHub Pages on a free account serves from a
**public** repo, and this one contains the real first names of seven colleagues, an assessment of
each, a note that one is a dropout risk, a note that one is your brother, and which arm every
person is in. Hosting one HTML file is not worth putting that on the open web under their names.

Only the app ships:

```sh
bash app/make-dist.sh
```

That writes `app/dist/` — the page and every local script its own `<script src=>` tags ask for,
and nothing else. No tests, no logs, no screener data, no participant mapping. It refuses to
build if a participant's name or a held-out question id is in any file it would host.

It reads the file list out of `index.html` rather than keeping its own copy. The hand-written
list missed `grade-rule.js` the day it was added, which would have hosted an app that loaded and
then threw on the first Run.

## Where to put it

Anything that serves a folder of static files over HTTPS. `app/dist` has no build step and no
server requirement.

- **Netlify Drop** — netlify.com/drop, drag `app/dist` in, get a URL. No repo, no account needed
  to start. Least setup.
- **Cloudflare Pages** — direct upload, same idea.
- **A new, separate GitHub repo** containing only the contents of `app/dist`, with Pages on. Fine
  because that repo holds nothing but the app. Never this one.

HTTPS matters: the page fetches sql.js over HTTPS, and a page served over plain HTTP will have
that request blocked as mixed content.

## The links, once you have the URL

Each person opens `<your url>/index.html?p=<their code>`. The codes are in
`screener/participant-links.md`. Nothing else goes on the end of the link — the hint function's
URL lives in `app/transport.js`, set once for everybody.

**Rebuild after changing anything in `app/`.** `app/dist` is a copy, so editing `app/index.html`
and re-uploading without re-running `make-dist.sh` hosts the old page. Set the hint URL first,
then build, then upload — in that order, or you host an app that quietly serves fallbacks.

## Before you send the links

```sh
bash app/make-dist.sh                                                  # refuses on a name leak
node evals/check-hint-function.mjs https://yzmunjbhhtuerxoinxsd.supabase.co/functions/v1/hint
node evals/check-hosted.mjs <your hosted url>                          # after uploading
```

`check-hosted.mjs` compares what the server returns against what is in `app/dist`, byte for
byte. `app/dist` is a copy, so editing something in `app/` and re-uploading without rebuilding
hosts the previous page — which looks completely normal, because the old page also works. It
also catches a partial upload where `index.html` landed and one script did not, a host that
serves `.js` as `text/plain` with `nosniff` (the browser then refuses to run it and the page is
blank), a stale or empty hint URL in what is actually hosted, and any participant name or
held-out question id reaching the public page.

Then, by hand, because no script can see it: open your own link with any code, run one
wrong-but-valid query, and press Help. If the hint says **(fallback)**, the function is not
reachable *from the hosted page* even though it answers from your terminal — which usually means
CORS, and the function already sets `Access-Control-Allow-Origin: *`, so check the browser
console before changing anything.

---

# Deployed — 19 Sep 2026

Project `yzmunjbhhtuerxoinxsd`. Verified from `function_edge_logs`, two POSTs 159 ms apart:

| status | time | what it was |
|---|---|---|
| 200 | 1875 ms | the real request — a full Groq round-trip, so the key works and a hint came back |
| 400 | 55 ms | a request for a different model, refused without calling Groq. The pin holds |

**1875 ms is what a learner waits after pressing Help.** The button shows `…` while it runs, so
it reads as working rather than broken, but it is not instant.

## The one silent failure left: Groq's rate limit

Arm A calls the model. Arm B never does. If the three Arm A testers press Help within the same
few minutes and Groq throttles, the function returns 502, the app treats that as a rejected
generation, and those learners silently get hand-written fallbacks.

That would convert part of Arm A's treatment to the fallback, for some participants and not
others, with nothing on screen to show it. It is the same failure shape as an undeployed
function, except it can appear halfway through a session that started fine.

**Watch for it.** During and after the session, in `function_edge_logs`: any status other than
200 on a real request means those presses fell back. Worth checking immediately afterwards
rather than on the 28th, while it is still possible to ask the person what they saw.

## Before the session on the 22nd

```sh
node evals/check-hint-function.mjs https://yzmunjbhhtuerxoinxsd.supabase.co/functions/v1/hint
```

Run it on the morning, not just today. A key or a quota can lapse in two days, and nothing in
the app will tell you.

---

# Hosted and verified — 19 Sep 2026

`https://tranquil-starlight-f0129e.netlify.app/` — checked live in a browser, not inferred.

| checked | result |
|---|---|
| Arm A code `4cwkq` | lands in Arm A, 16 questions, database booted, `LOG.participant` set |
| Arm B code `gnas5` | lands in Arm B; Help with zero attempts reveals the answer immediately |
| a wrong-but-valid attempt, then Help | a **model-written** hint, `source: "model"`, `openai/gpt-oss-120b`, no `(fallback)` tag |
| the hint itself | "…it lacks a condition that limits rows to only the failed ones before grouping" — names the stage, writes no SQL, so the guard passed it |
| all six scripts | 200, `application/javascript`, byte-identical to `app/dist` |
| participant codes | all 7 present |
| held-out questions | none in the served page |

**The hint path works end to end from the hosted origin.** That is the part nothing else could
confirm: the function answering from a terminal does not prove the browser can reach it, because
CORS sits in between.

## Netlify modifies your HTML

The served `index.html` is 720 bytes larger than the file you uploaded. Netlify injects:

1. an advertising comment in `<head>` — "This site is hosted on Netlify…"
2. `<script async src="/.netlify/scripts/hud?variant=public" …>` after `</html>`

Your build is intact; this is added on top. The HUD renders nothing visible to a visitor, checked
in the page.

**It does not threaten the comparison.** Both arms load the identical page from the identical
host, so whatever it does, it does equally. It is a nuisance, not a confound.

**It is still a third-party script running during a measured session**, on a page six colleagues
were asked to use. Worth turning off in the Netlify site settings if the option is there. If not,
it is a limitation to state, not a reason to move hosts two days out.

This is also why `evals/check-hosted.mjs` does not compare the HTML byte for byte. It requires
every line of your build to appear in the served page, in order. Injection passes; a changed or
missing line fails and names the line. A check that failed on every correct upload would be a
check you stopped reading.
