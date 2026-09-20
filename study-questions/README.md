# study-questions/

The instrument for the 22 Sep practice session and the 27 Sep removal test.
Self-contained: `verify.py` resolves paths via `HERE`, so this folder moves whole.

| file | what |
|---|---|
| `QUESTIONS.md` | the readable set — prompts, reference queries, wrong models, pairing table |
| `items.py` | the same 28 items as data; the single source everything else is generated from |
| `schema.sql` | study schema + seed data. Must stay identical to `SCHEMA` in `app/index.html` |
| `hints.py` | fallback hint per item, used when the hint writer's output fails the guard |
| `grade_rule.py` | the frozen scoring rule — runs, valid grouped SQL, rows match |
| `test_grade_rule.py` | proves all references pass and no listed wrong model scores correct |
| `DECISIONS.md` | the cut list, check 4b wording, and scoring rule, with reasons |
| `verify.py` | run before every freeze: `python3 verify.py` |
| `verify_hints.py` | checks every item has a hint, and that no hint names a clause or writes SQL |
| `validate-substance-bar.js` | re-runs the real `isSubstantive()` over the round-2 logs after a schema change |
| `app-schema-snippet.js` | the seed data wrapped as `SCHEMA`, to paste into `app/index.html` |
| `mkappquestions.py` | generates the app's `QUESTIONS` array and `EXPECTED` map from `items.py` and `hints.py`. `--splice` writes them into `app/index.html` |
| `emit_verdicts.py` | grades all 75 queries here with `grade_rule.py` and emits JSON, so `evals/grader-conformance.mjs` can check the app's grader agrees |

Status: FROZEN 19 Sep 2026. 16 practice + 12 held-out. Decisions and their reasons: `DECISIONS.md`.

`verify.py` checks, for all 28 items: the reference runs and returns 2-10 rows; no ties on the
sort key; every listed wrong query either errors or returns rows different from the reference,
compared both in order and unordered. Exit line reads `problems: 0` when clean.

Why the wrong-query check matters: result-set matching marks a query correct when its rows match.
If the seed data does not separate the right model from the common wrong one, a wrong query scores
as correct (see `screener/round-1-cold/` — anuj's `HAVING price > 10000`). The data is what makes
the grading honest, not the grader.

Rules for edits
- Edit `items.py`, never QUESTIONS.md or the app's question array by hand; regenerate.
- Re-run `verify.py` after any edit to a query, a threshold, or the seed data.
- After editing an item, re-run `python3 mkappquestions.py --splice` so the app matches.
- Change `schema.sql` and `app/index.html` together, then re-run
  `node validate-substance-bar.js` and `node ../evals/verify-app.mjs`.
- Changing `grade_rule.py` means changing `app/grade-rule.js` too. Prove it with
  `node ../evals/grader-conformance.mjs`, which compares verdict and reason across all 75
  queries. Two implementations of one rule is how they drift; that test is what stops it.
- Questions used in the practice session are burned for the removal test. The held-out 12 are
  never shown before the removal test — and they are kept out of `app/index.html` entirely,
  including as pair labels, because the page source is readable.

**So what:** `items.py` is the only file to edit by hand. Everything else is generated from it or
checks it.
