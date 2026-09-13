# Round 1 — cold SQL screener (no execution environment)

Built 7 Sep 2026, graded 10 Sep. Purpose: pick the 6 participants and set the study's difficulty.

> **Read `../README.md` first.** This round measured writing SQL *cold*, with no database and no
> Run button. Its pass/fail data is not trustworthy and nobody should be excluded on it. Its
> attempt data is. Round 2 (`../round-2-runbutton/`) re-ran the measurement with execution.

## Why this exists

It does two jobs, and the second one is the important one.

1. **Filter.** Drop anyone who can't clear the basics (they'd score ~0 in both
   arms) and anyone already fluent (they'd score high in both arms). Either way
   you measure nothing. This is triage checks 2 and 3 in `../../TODO-HYPOTHESIS-v1.md`,
   done up front instead of discovered on 28 Sep.
2. **Set the question difficulty.** You said your people "know SQL concepts but
   don't use it." That's a ceiling risk. The tier where they pass about half the
   time is where your two study concepts belong. You can't pick that number by
   guessing, and you can't pick it after the baseline runs.

It also ranks people so you can do matched-pair randomisation into the two arms.

## Files

| file | what |
|---|---|
| `PARTICIPANT-BRIEF.md` | Send this. Framing, consent, schema, the 10 questions. No answers in it. |
| `schema.sql` | 4 tables + data. Runs on Supabase/Postgres and SQLite. |
| `reference_queries.sql` | Answer key. **Don't send.** |
| `grade.py` | Grades by result-set match. Stdlib only. |
| `example-submission.txt` | What a returned answer sheet looks like. |
| `submissions/` | Drop one `<name>.sql` per person here. |

## Running it today

1. Send `PARTICIPANT-BRIEF.md` to 10–12 people. Paste it in a doc or a form —
   they don't need database access, they write queries cold.
2. As answers come back, save each as `submissions/firstname.sql`, keeping the
   `-- Q1` labels.
3. `python3 grade.py`

`python3 grade.py --self-test` grades the answer key against itself. It should
print 10/10. Run it once before you trust any real result.

To grade against real Supabase instead of SQLite: `export DATABASE_URL=...` and
have psycopg2 installed. Same output.

## Reading the result

**Per person** — the verdict column:

- **FLOOR** (≤2 correct, or nothing above T1) — exclude. Nothing to measure.
- **CEILING** (≥9, or passes T5) — exclude. Nothing to teach.
- **INCLUDE** — comfortable up to some tier, breaks above it. That break point
  is the whole reason they're useful.

**Across everyone** — the pass-rate-by-tier table at the bottom. That is the
output you actually came for.

- Tier at 80%+ → they already have it. Don't teach it.
- Tier at 15% or under → too hard. They'll floor out and quit.
- Tier at 25–60% → **this is where your two study concepts go.**

My guess before seeing data: T1 and T2 come out near 100%, T4 lands in the
window, T5 near zero. If so, your two concepts are **joins with aggregation**
and **negation (customers with no completed orders)**. But run it — the point is
to stop guessing.

## The tiers

| tier | Q | skill |
|---|---|---|
| T1 | 1, 2 | single table, WHERE + ORDER BY |
| T2 | 3, 4 | GROUP BY, aggregate, HAVING |
| T3 | 5, 6 | join two tables |
| T4 | 7, 8 | join + aggregate + filter; negation |
| T5 | 9, 10 | correlated subquery; window function |

Q8 is the best single discriminator in the set. Customer 7 has two orders and
both are cancelled, so "customers with no rows in orders" gets 2 of 3 right.
Pattern-matchers fail it, people who understand it don't.

## Grading rules

- **Result-set match, row order ignored.** Any query returning the right rows is
  right. No style marks.
- Column count must match — they were told which columns to return.
- Numbers rounded to 2 decimals, so int vs float never matters.
- A query that errors scores the same as a wrong one, but is reported separately.
- Blank ≠ wrong in the report. Blank usually means "ran out of time", and that's
  different information.

## After you have the scores

1. Drop the FLOOR and CEILING people.
2. Sort the rest by score. Pair 1st+2nd, 3rd+4th, and so on. Coin-flip each pair
   into Arm A / Arm B. That's matched-pair randomisation and it protects you at
   n=3 per arm.
3. **Split your 4 ex-teammates across both arms.** All four in one arm is a
   confound you can't undo later.
4. Don't tell anyone which arm is "yours". Both are "two versions I'm testing."
   Arm A is the frustrating one by design; people who know it's your project
   will push through frustration they'd normally quit on, and that inflates your
   own result.

## Two things this screener does NOT do

- It measures writing SQL **cold**, with no execution. The study lets people run
  queries and iterate. So use these scores for ranking and difficulty, not as a
  baseline number.
- It uses **this** schema. The study must use a different one, or the screener
  becomes practice and contaminates the removal test.
