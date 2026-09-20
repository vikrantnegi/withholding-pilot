# app/ — the study app

Open `index.html` in a browser. It needs internet the first time, to fetch sql.js.

**Participants open `index.html?p=<their code>`.** The code picks the arm and is written into the
log, so a returned log says who produced it. Codes and the name behind each are in
`../screener/participant-links.md`, which is never sent to anyone. `?arm=A` / `?arm=B` still works
when no `?p=` is given — that is the path the tests use, and no participant is sent one.

The arm is the whole difference between the two groups (`PRD-v1.md` §1). Everything else — editor,
runner, question set, correctness feedback, look and feel — is identical by design.

## What is here

| file | what | tests |
|---|---|---|
| `policy.js` | the level selector, `PRD-v1.md` §4. **The graded artefact** | 34 |
| `hint-guard.js` | the leak guard, and the retry/fallback policy | 32 |
| `hint-writer.js` | the prompt and the pinned model | 14 |
| `help-session.js` | what happens on a Help press, and the two log writes | 20 |
| `grade-rule.js` | the frozen scoring rule, in the browser | 23 |
| `transport.js` | how the page reaches the hint function. **`DEFAULT_URL` is the one place the URL is set** | — |
| `index.html` | UI only. Every decision is made by the files above | — |
| `make-dist.sh` | builds `dist/`, the folder that gets hosted | — |

```sh
for t in policy hint-guard hint-writer help-session grade-rule; do node "$t.test.js"; done
```

123 unit tests. Every module is pure: no DOM, no network, no LLM. `callModel` is injected, so the
whole help path tests without a model.

`node ../evals/verify-app.mjs` drives the real page in a headless browser — 84 checks that no unit
test can make. It needs a served copy and a local sql.js; the header explains the setup.

## Two rules that are easy to break

**One grader.** `grade-rule.js` is a port of `../study-questions/grade_rule.py`. The app tells a
learner right or wrong with one, the study is scored with the other, and two implementations of
one rule drift silently. Change either and run `node ../evals/grader-conformance.mjs`, which runs
all 75 queries in `items.py` through both and compares verdict *and* reason.

**The held-out items are not in this page.** Not as questions, not as answers, not as pair labels.
Anything a tester can read on 22 Sep is burned for the removal test. `make-dist.sh` refuses to
build if a held-out id or a participant name appears in what would be hosted.

## Hosting

```sh
bash make-dist.sh          # builds dist/ — the page and the scripts it loads, nothing else
```

`dist/` is a **copy**. Edit anything here and re-upload without rebuilding and you have hosted the
previous page, which works — just not the one you meant. `../evals/check-hosted.mjs` catches
exactly that. `../supabase/README.md` is the deploy-and-host runbook.

## The log

One flat array of events, with `participant`, `arm`, `started` and `finished` around it.

```
attempt         { q, sql, outcome, rows | error, grade, gradeReason }
help_decided    { q, action, counted, sinceHelp }        written instantly
help_delivered  { q, source, modelAttempts, rejections } written after the guard
```

`outcome` and `grade` are not the same field and that is deliberate. `outcome` is what `policy.js`
reads, and its vocabulary has not changed, so the gate and the ladder behave as their tests say.
`grade` is the frozen verdict — `correct`, `invalid`, `error`, `wrong`. A query that runs but
fails clause 2 is `grade: invalid` and `outcome: wrong`.

`gradeReason` names the learner's mistake. It is **never rendered**. On screen it would be a hint,
handed to both arms, from outside the help policy. `verify-app.mjs` fails if it reaches the page.

`SESSION.summarise(log)` gives the two 28 Sep numbers: help decided per arm per action, and the
fallback rate. Why two entries and not one: `PRD-v1.md` §4.

## Verified 19 Sep

84 headless checks on both arms, plus the hosted build checked live in a browser: an Arm A code
lands in Arm A, an Arm B code reveals on the first Help press with no attempt, and a
wrong-but-valid attempt followed by Help returns a model-written hint — `source: "model"`, no
`(fallback)` tag — from the hosted origin. `../supabase/README.md` has the full table.

One thing that looks like a bug and is not: re-running a query that returns the same rows does not
advance the ladder. That is the attempt-counting rule in §4 working — a new result set or changed
text is required.
