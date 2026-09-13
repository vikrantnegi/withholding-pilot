# app/ — the study app

Open `index.html` in a browser. `?arm=B` switches arms.

That query parameter is the whole difference between the two groups (`PRD-v1.md` §1).

## What is here

| file | what | tests |
|---|---|---|
| `policy.js` | the level selector, `PRD-v1.md` §4. **The graded artefact** | 20 |
| `hint-guard.js` | the leak guard + the retry/fallback policy. The 18 Sep deliverable | 19 |
| `help-session.js` | what happens on a Help press, and the two log writes | 20 |
| `index.html` | UI only. Every decision is made by the three files above | smoke |

```
node policy.test.js && node hint-guard.test.js && node help-session.test.js
```

All three modules are pure: no DOM, no network, no LLM. `callModel` is injected,
so the whole help path tests without a model.

## Two things this is NOT yet

**The questions are burned.** `index.html` uses M1–M3 from the round-2 screener.
Both screening rounds' questions are out of bounds for the study. This is a dev
harness so the Help path can be exercised today. Swap in the real set — `PRD-v1.md`
§6 item 4 — before any participant sees it.

**There is no model.** `callModel` in `index.html` is a stub that deliberately leaks
the answer on its first attempt, so the guard and the fallback are both visible in
the UI. The real call is `PRD-v1.md` §6 item 2.

Also missing: log persistence (§6 item 3). The copy/download buttons are the fallback
and are enough for six people.

## The log

One flat array of events. Three types:

```
attempt         { q, sql, outcome, rows | error }
help_decided    { q, action, counted, sinceHelp }      written instantly
help_delivered  { q, source, modelAttempts, rejections } written after the guard
```

`SESSION.summarise(log)` gives the two 28 Sep numbers: help decided per arm per
action, and the fallback rate. Why two entries and not one: `PRD-v1.md` §4.

## Verified end to end, 13 Sep

Arm A, question M1, headless browser:

```
Help with no attempt  -> "give it one run first"        (the gate)
run a wrong query     -> "Not right yet"
Help                  -> Hint. source: model, after the guard rejected attempt 1
run again             -> wrong
Help                  -> "try once more with the hint"  (N = 2)
run again             -> wrong
Help                  -> the answer                     (escalated)
```

Arm B, same build, first press, no attempt: the answer. No gate, no ladder.

One thing that looked like a bug and is not: re-running a query that returns the
same rows does not advance the ladder. That is the attempt-counting rule in §4
working — a new result set or changed text is required.
