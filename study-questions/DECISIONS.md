# Frozen decisions — 19 Sep 2026

Written before the practice session and before any outcome data exists. Do not edit after
21 Sep; append a dated correction instead.

## 1. The question set is 16 practice + 12 held-out

Practice: S1 x3, S2 x6, S3 x7. Held-out: S1-S4 x3 each.

Cut from the 19 candidates: **P01, P03, P06** — all S1, all a single GROUP BY with one
aggregate and no filter. Reason: round 2 showed that an item solved on the first attempt
produces no ladder decisions, so it feeds neither arm and cannot separate them. S1 had the
highest concentration of that shape.

The three surviving S1 items each carry something extra: P02 rounds an average, P04 sorts on
the aggregate itself, P05 groups by two columns.

**Pairs were re-pointed, because the cut broke three of them.** H01 now pairs with P05 (both
count per group), H03 with P04 (both one aggregate per group). Noted here because a pair
re-pointed *after* seeing results would be indefensible; this one was re-pointed before.

Known weakness, stated now rather than discovered later: the practice set is deliberately
skewed away from the easiest sub-skill, so S1 gets 3 items against S3's 7. Transfer on S1 is
therefore measured on thinner practice than transfer on S3.

## 2. Triage check 4b — replaces the singular wording

The old wording said "at least 2 of 6 solve the S4 held-out item". There are three S4 items
(H10, H11, H12), so the old wording has no single referent.

**New wording:** check 4b passes if **at least 2 of the 6 testers grade CORRECT on at least
one of H10, H11, H12** in the removal test, under the scoring rule in section 3, with no help
available.

Why "at least one of three" and not "all three" or "a specific one": S4 is the hardest
sub-skill and has no dedicated practice items — it is the composition of S2 and S3. The check
exists to confirm the ceiling was not set impossibly high. One solve out of three attempts is
enough to show the item set is reachable.

## 3. The scoring rule

A submission is CORRECT only if all three hold:

1. it runs;
2. every non-aggregated column it selects, or filters on in HAVING, also appears in GROUP BY;
3. its rows equal the reference's rows, in the order the prompt asked for, with numbers
   compared to 1 decimal place.

Implemented in `grade_rule.py`. Verdicts: `correct`, `invalid` (fails clause 2), `error`
(does not run), `wrong` (runs, valid, different rows).

**Why clause 2 exists.** SQLite accepts queries Postgres rejects: given a bare column it picks
one arbitrary row per group. anuj's round-1 `HAVING price > 10000` did exactly this, and
result matching alone scored it correct. The rows were right; the query was not. Clause 2 is
a property of the submitted SQL, not of the data, so it cannot be gamed by a lucky dataset.

Checked against the 28 items: all 28 references grade `correct`, and of the 47 wrong models
listed in `items.py`, 13 are caught by clause 2, 7 error, and 27 return different rows. None
scores `correct`.

**Order matters** because every prompt states the order to return rows in. A submission with
the right rows in the wrong order grades `wrong` with the reason "right rows, wrong order",
so the log can distinguish it from a genuine misunderstanding at analysis time.

## 4. The rounding tie-break — pinned 19 Sep, before any session ran

Section 3 says numbers are compared "to 1 decimal place". It never said which way a
tie goes, and the two implementations had picked differently.

`round(194.45, 1)` in Python is **194.4**. `ROUND(194.45, 1)` in SQLite is **194.5**.
Python rounds the raw double, whose exact value is just under 194.45. SQLite rounds the
number's shortest decimal form, so it sees "194.45" and rounds away from zero.

**Pinned to SQLite's behaviour: 1 decimal place, ties away from zero, applied to the
shortest decimal form.** Both `grade_rule.py` (`_round1`) and `app/grade-rule.js`
(`round1`) now do exactly that, and `evals/grader-conformance.mjs` fails if they diverge.

Why SQLite's and not Python's: every reference query rounds with SQLite's `ROUND(...,1)`,
so the reference rows are already rounded that way. A grader that rounded the other way
would mark a learner wrong for a tie-break rather than for their SQL — the same
construct problem as marking someone down for forgetting `ROUND` when the concept under
test is `GROUP BY`.

This changes no verdict on the current seed data: no value in any of the 28 references
lands on a halfway digit, checked the same day. It is pinned so that stays true by
test rather than by luck, because editing one seed row could otherwise flip a verdict
silently.

Recorded as a clarification, not a change of rule: section 3's three clauses are
untouched, and this was decided before the 21 Sep practice session produced any data.

## 5. The app and the scoring rule now use one grader — 19 Sep

Until today the app judged a submission by comparing result rows at **2** decimal
places and did not look at the SQL at all. The scoring rule compared at **1** and also
applied clause 2. So the two disagreed in both directions on the shapes this study is
about:

- A learner who grouped correctly but omitted `ROUND(...,1)` was told "Not right yet"
  by the app, while the scoring rule counted the same submission correct. Eleven of the
  16 practice items ask for rounding, so this was not a corner case.
- The anuj-shaped query was told "Correct. That's the one.", which disabled Help and
  produced no ladder decision, while the scoring rule graded it `invalid`.

Both now run the one rule. `app/grade-rule.js` is a port of `grade_rule.py`, and
`evals/grader-conformance.mjs` runs the 28 references and the 47 listed wrong models
through both, comparing verdict *and* reason.

**The learner is shown no more than before.** A failing submission still reads "Not
right yet"; clause 2's reason is written to the log for analysis and never rendered.
Showing it would hand both arms a diagnostic hint that sits outside the help policy and
would change what Arm B's control condition is — open decision 5.

`policy.js` is untouched. The event's `outcome` field keeps its existing vocabulary, so
the gate and the escalation behave exactly as their 34 tests say; the frozen verdict
rides alongside it as `grade`.
