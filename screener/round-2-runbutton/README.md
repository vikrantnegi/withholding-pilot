# Round 2 — mini-screen, with a Run button

Built 10 Sep 2026, graded 13 Sep, after round 1 came back 1-usable-of-7.

> **Read `../README.md` first**, and `../../EXPERIMENT-LOG.md` Run 2 for what this round actually
> found — the headline is not the GATE CHECK this folder's grader prints.

## Why round 1 looked like a disaster and wasn't

Round 1 asked people to write SQL **cold** — no database, no run button, no error
message. That measures one-shot recall. The study measures something else: getting to a
correct query by iterating against feedback. Almost every round-1 failure was a syntax
slip an editor catches on the first run (`ORDERBY`, `GROUPBY`, `GRPUP`, quoted `"ASC"`,
HAVING before GROUP BY, a missing `ON`). Gaurav scored 0/10 with four conceptually
correct answers.

So round 1's **attempt** data is trustworthy — nobody tried T4/T5, everybody tried
T1/T2, and that doesn't depend on having an editor. Its **pass/fail** data is not.
Keep the first, bin the second. Do not exclude anyone on a round-1 FLOOR verdict.

## What this round is actually for

Not ranking. Ranking can be done by hand from round 1 and is good enough at n=3 per arm.

This round exists to answer one question: **does the gate rule survive this pool?**
The gate serves no help until one attempt *executes*, and an attempt only counts if it
executes and returns a different result set. Six of seven testers produced zero executing
queries in round 1. If that holds even with a run button in front of them, nobody earns a
hint, Arm A never differs from Arm B, and triage check 1 fails — which on 28 Sep would
look exactly like a null result.

Better to find out now, on seven people, than on 28 September.

It also doubles as the calibration pilot, which settles the open question of whether the
8–14 Sep run is Arm B or a pilot. This is the pilot. **Arm B stays clean.**

## Files

| file | what |
|---|---|
| `sql-mini-screen.html` | **Send this.** Self-contained: SQLite compiled to WASM, the schema, three questions, a run button. Opens by double-click. |
| `reference-mini.sql` | Answer key. **Don't send.** |
| `grade-logs.py` | Aggregates returned logs. Stdlib only. |
| `logs/` | Drop each returned log here as `<firstname>.json`. |

## Sending it

Attach `sql-mini-screen.html` on Slack/WhatsApp. They double-click it; it opens in a
browser. Needs internet the first time only (it pulls the SQLite WASM engine from a CDN).
Nothing is uploaded and no account is needed — the log stays in their browser until they
copy it back.

Suggested message:

> Round 2, and this one's short — three questions, 15–20 min. Last time I asked you to
> write SQL blind with no database, which was a bad test on my part; nobody works that
> way. This version has a real database in the page and a Run button, so you can try
> things and see what breaks. Same deal: on your own, but iterate as much as you like.
> Open the file, answer what you can, hit "Copy my log" at the bottom and paste it back
> to me. Stopping early is fine and still useful.

## Reading the result

`python3 grade-logs.py`

Two things to look at, in this order:

1. **GATE CHECK at the bottom.** Anyone who never produced an executing query would be
   locked out of the ladder by syntax, not by concept. If that's more than one person,
   change the gate: let a logged `attempt_type: syntax_error` satisfy it. The learner
   still attempted unaided, so the mechanism is intact, and the data model already
   records that type.
2. **Per-question solve rate.** 20–85% is the usable band. Below 20% the question floors
   people; above 85% there's no headroom for `hint` to differ from `reveal`.

Attempts-to-first-correct is the number worth keeping — it's the closest thing you have
to a pre-study estimate of how many ladder decisions each learner will generate, which
feeds the "48 policy decisions" arithmetic in `../../TODO-HYPOTHESIS-v1.md`.

## The questions and why these three

Same schema as round 1 (already burned as a study schema either way), **new questions**,
so this measures the editor rather than memory of round 1.

| q | tier | skill |
|---|---|---|
| M1 | T2 | `GROUP BY` + `COUNT` + `HAVING` + two-key `ORDER BY` (has a real tie) |
| M2 | T2 | `GROUP BY` + `MAX` + `HAVING` — aggregate that isn't COUNT |
| M3 | T3 | two-table join + `WHERE` + two-key `ORDER BY`; one customer appears twice |

T1 is left out on purpose: on a one-clause query `hint` and `reveal` collapse into the
same string, so it can't host the intervention. T4/T5 are left out because round 1 got
zero attempts at them, and a blank has no error for the mechanism to correct.

## Feedback the page gives, and what it deliberately withholds

Shows: the error message verbatim, their own result table, and a correct/not-correct
verdict. Also distinguishes "right rows, wrong order" and "wrong number of columns",
because sort order and column list are explicitly part of each question.

Withholds: the expected rows, the expected row count, and anything resembling a hint.
The expected result sets are base64'd in the file — that stops a casual "view source",
not a determined look. Fine for seven colleagues; don't reuse this file for anything
adversarial.

## Known limits

- A query with no `ORDER BY` can pass by luck if SQLite happens to return rows in the
  right order. Round 1's grader ignored row order entirely, so this is already stricter.
- Solving in 1 attempt and solving in 9 both read as "solved" in the tier table. The
  attempt count is in the per-question section and in the raw log; use it.
- These questions are now burned. The removal test must not reuse them, and per the
  round-1 README the study needs a different schema as well.
