# Arm assignment — the record

**Written 19 Sep 2026, before the 22 Sep practice session and before any Arm A data exists.**
That timing is the point of the file. An assignment settled afterwards cannot be defended,
because nobody can show it was not influenced by what had already been seen.

Mechanism: `assign_arms.py`. Rule it implements: `RECRUITMENT.md` section 3.

**Status: final. Run once, on 19 Sep, and not re-run.** Section 7 has the result.

---

## 1. Why pairs and not coin flips

Six learners split two ways is three per arm. At that size ordinary variation in SQL ability is
larger than any effect the help policy could produce, so two capable people landing in the same
arm would end the study before it started — the result would measure who was recruited.

Pairing adjacent scorers and flipping *within* each pair removes between-arm ability difference
by construction. Randomness alone does not do this at n=3; it only does it on average, over many
studies that will not be run.

## 2. The measure, declared before it was computed

**Rank on round 2, not round 1.**

Round 1 measured the wrong thing. Across seven people and 35 attempted answers it produced four
passes, and the 19 Sep regrade shows almost every failure was a punctuation or spacing fault
rather than a wrong idea: `ORDERBY` without the space, `"ASC"` in double quotes, a missing comma.
`screener/README.md` already said nobody should be excluded on round 1. Section 5 below is the
evidence.

**Within round 2, count only M1 and M2.** Both are GROUP BY + HAVING, which is the concept this
study teaches and tests. M3 is a two-table join, off-concept, and nobody solved it.

The order, fixed in the script:

1. **Items solved of M1 and M2.** Descending.
2. **Attempts to first solve**, summed over the items solved. Ascending.
   First solve, not total attempts. Re-running an answer that already worked is not a failed
   attempt, and counting it would rank manish below people he actually matched.
3. **Attempted M3.** Yes before no. Reaching for the hardest item is weak evidence of headroom.
4. **Alphabetical.** Deterministic, and deliberately independent of the seed, so the ranking
   cannot move when the seed does.

**Rule 1 counts an unattempted item as unsolved, on purpose.** The removal test scores per
person-question, and an item nobody attempts scores as unsolved there too. The ranking should
measure the same quantity the outcome measures.

### The cost of rule 1, stated rather than discovered later

manish attempted one of the two on-concept items, solved it on his first try, and stopped after
55 seconds. On "solved of two" he ranks **6th of 7**. On attempts-per-attempted-item he would
rank **2nd**.

The data cannot settle which is right. Quitting after 55 seconds is a motivation signal, not an
ability one. Rule 1 was chosen because it mirrors the outcome measure, and the alternative is
written here so the choice is visible rather than buried in a sort key.

**This is the largest single uncertainty in the pairing.** If manish is in fact mid-ability, the
pair (ritesh, manish) is mismatched and one arm gets a stronger learner than the pairing intends.

## 3. The ranking

| # | person | solved of M1/M2 | attempts to first solve | attempted M3 | per item |
|---|---|---|---|---|---|
| 1 | anuj | 2 | 2 | no | M1 in 1, M2 in 1 |
| 2 | nabin | 2 | 4 | yes | M1 in 3, M2 in 1 |
| 3 | gaurav | 2 | 4 | no | M1 in 3, M2 in 1 |
| 4 | vikash | 2 | 5 | yes | M1 in 4, M2 in 1 |
| 5 | ritesh | 2 | 9 | no | M1 in 1, M2 in 8 |
| 6 | manish | 1 | 1 | no | M1 in 1, M2 not attempted |
| 7 | rishabh | 0 | 0 | yes | neither solved |

nabin ranks above gaurav on tie-break 3 only: identical solves and identical attempts, and nabin
attempted M3 five times where gaurav did not attempt it.

These numbers are re-derived from `round-2-runbutton/logs/` on every run of the script, not
transcribed, so they cannot drift from the logs.

## 4. The pairs

| pair | members |
|---|---|
| 1 | anuj + nabin |
| 2 | gaurav + vikash |
| 3 | ritesh + manish |
| — | rishabh, unpaired |

Seven is odd, so one person is unpaired. rishabh is last in the ranking and is flipped on his
own, which leaves one arm with four people and the other with three.

**Nobody is excluded.** `RECRUITMENT.md` section 4 says to over-recruit because dropout is the
main threat, and round 1's FLOOR verdicts are an artifact of the grader rather than a finding.
All seven are assigned; six completing is the target, not the plan.

## 5. The round-1 regrade — what the grader bug was hiding

`round-1-cold/grade.py` reported every wrong answer as `got N rows, expected M`. When N equalled
M it named no fault at all. manish's entire round 1 read as:

```
Q1  T1  WRONG got 3 rows, expected 3
Q2  T1  WRONG got 6 rows, expected 6
```

The fix adds `diagnose()`, which reports the actual mismatch. `compare()` is untouched, so **no
score moved** — 0/10 stands. What changed is that the output now says why:

```
Q1  T1  WRONG 1 column, expected 2
Q2  T1  WRONG 1 column, expected 2
```

And the cause is one character. He wrote:

```sql
SELECT name city FROM customers WHERE city = 'Bengaluru' ORDER BY name ASC;
```

**A missing comma.** SQL reads `name city` as the column `name` aliased to `city`, so the query
returns one column instead of two. The table, the filter and the sort are all exactly right. The
same single fault on both questions.

So manish's 0/10 is not a measure of ability. Both his attempts were complete, correct queries
with one piece of punctuation missing — the same class of fault as rishabh's `GROUPBY` and
gaurav's `"ASC"`. `TESTER-PROFILES.md` finding 3 already named that habit as belonging to the
group rather than to one person; this is a fourth instance of it, and it is the one that
produced a misleading score.

**Why it matters:** this is the reason the measure in section 2 uses round 2 alone. A screener
that ranks people by how well they type punctuation would have put a capable tester at the
bottom of the pool.

## 6. How everyone is related to Vikrant

Supplied 19 Sep. It was not written down anywhere before, and `TESTER-PROFILES.md` flagged the
gap in its own open items.

| person | relationship |
|---|---|
| gaurav, anuj, ritesh, manish | on his team before. Nobody reports to him now |
| nabin, rishabh | current teammates |
| vikash | his brother |

**Two of these were not in the plan, and both are recorded as limitations rather than fixed.**

`RECRUITMENT.md` section 1 defines the pool as workplace non-engineering colleagues — not
classmates, not on his team. A brother is not that, and a sibling has his own reason to try hard
and to under-report frustration. Section 2's consent rule covers positional power and is
satisfied, since nobody reports to him; it does not cover family.

Current teammates are a milder version of the same thing: an ongoing working relationship, not a
former one.

**Neither can be corrected now.** Dropping vikash leaves six, and losing one more after that puts
a cell at two. The honest move at this size is to run with them and say so. Written up in
`ANALYSIS-PLAN.md` under "Stated limitations".

## 7. The result

Run 19 Sep 2026 with `python3 assign_arms.py --ex-team gaurav,anuj,ritesh,manish`.
Seed `capstone-arm-assignment-2026-09-19`, **draw #1** — draw #0 was rejected for putting three
of the four former team members in one arm.

| arm | people | from his old team |
|---|---|---|
| **A** — gate, hint before answer | nabin, gaurav, ritesh | 2 of 3 |
| **B** — answer on demand | anuj, vikash, manish, rishabh | 2 of 4 |

Seven is odd, so Arm B carries the extra person.

**Re-running the command reproduces this exactly.** That is the point of the seed: the assignment
is what a written-down procedure produced, not what anyone chose.

### What to watch, given who landed where

- **Arm A has no slack.** Three people, and losing one takes it to two. Arm B can lose one and
  still have three. The flagged dropout risk, manish, is in Arm B — which is the lucky way round,
  but it means Arm A's margin depends on nabin, gaurav and ritesh all completing 27 Sep.
- **Arm A holds the three richest help-path cases.** nabin produced the most wrong-but-running
  attempts; gaurav produced the cleanest hint-able moment in the dataset; ritesh is the reason the
  gate was relaxed. Good for observing the mechanism. It is a chance outcome of the draw, not a
  choice, and it does not bias the outcome comparison — the pairing balanced ability, which is
  what the comparison rests on.
- **Ability across arms.** Arm A holds ranks 2, 3 and 5; Arm B holds 1, 4, 6 and 7. With seven
  people and one unpaired, exact balance is not available. Every pair contributed one person to
  each arm, which is what the rule asks for.

## 8. What is still owed

- **Record `completed_removal_test` per person, by arm.** `RECRUITMENT.md` section 4. Dropout
  that differs between arms breaks the comparison outright, and it cannot be detected afterwards
  if nobody wrote down who finished.
- **Do not tell participants which arm they are in**, or that arms exist. `RECRUITMENT.md`
  section 3 — never let one arm read as "his".
