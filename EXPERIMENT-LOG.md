# Experiment log

**Two rounds of screening have been run. Nothing else.** Both are recorded below, in order.

Each entry answers the same five things, in the same order. What it was for. What was predicted.
What happened. What it changed. Where the raw data sits. Plus what it cost.

**Append only.** Never edit an entry after the fact. If a conclusion changes, add a new entry that
says so and link back. This serves FAQ rule B4: keep the before and the after, the diff is the
deliverable.

What was believed and why it was wrong goes in `LEARNING-LOG.md`. This file is the record of events.

## Words used below

- **Arm A** is the tested group. It must try first, and its first help is a hint.
- **Arm B** is the comparison group. It gets the full answer whenever it asks.
- The **gate** is the rule that Arm A gets no help until one query actually runs.
- A **moment to act on** is when a learner runs a query and gets it wrong.
- That is the only point where the app must choose between a hint and the answer.
- **Triage check 1** asks one thing after the study: did the two groups actually differ?
- If Arm A almost never served help, the groups were the same and the result means nothing.
- **T1 to T5** were round 1's five difficulty tiers. T1 easiest, T5 hardest.

**Why it matters:** the study only exists at those moments. Everything below is about how many
there are.

---

## Run 1 — cold SQL screener

**Built 7 Sep 2026. Sent around 8 Sep. Graded 10 Sep 2026.**

Seven people, all colleagues at To The New. None are classmates, so all are eligible.

The test: 10 questions across five difficulty tiers. Written SQL, **no database and no Run
button**. Graded by comparing result sets in SQLite.

### What it was for

Two jobs. Drop anyone too weak or too strong for the study. And use the pass rates by tier to pick
the two topics the study would teach.

### What was predicted

That the questions would be **too easy**. These people know SQL but do not practise it. If the
questions sat below their level, both groups would score high and the study would measure nothing.

### What happened

| person | score | top tier reached | verdict by the screener's own rule |
|---|---|---|---|
| nabin | 3/10 | T2 | usable |
| vikash | 1/10 | T3 | excluded |
| anuj | 0/10 | — | excluded |
| gaurav | 0/10 | — | excluded |
| manish | 0/10 | — | excluded |
| rishabh | 0/10 | — | excluded |
| ritesh | 0/10 | — | excluded |

**Usable by its own rule: 1 of 7.** Pass rate by tier: T1 14%, T2 7%, T3 7%, T4 0%, T5 0%.

The prediction was exactly inverted. But the result was mostly an artefact of the test itself.

### What it changed

1. **"Too easy" was dropped as the live risk.** Round 2 later brought it back in another form.
2. **Nobody was excluded.** Almost every failure was a slip one run would have caught. Examples:
   `ORDERBY`, `GROUPBY`, `GRPUP`, a quoted `"ASC"`, HAVING before GROUP BY, a missing `ON`.
3. Gaurav scored 0 with all four answers conceptually right. He lost everything to a quoting
   habit. Ritesh scored 0 having picked the right operation on six questions.
4. **Attempt data kept, pass or fail data binned.** Who *tried* T4 and T5 does not depend on having
   an editor. Whether they got it right does.
5. **Topics narrowed to T2 and T3.** Chosen on reasoning, not on the pass-rate table. T1 was out
   because on a one-line query a hint and the full answer are the same string. T4 and T5 were out
   because nobody tried them, and a blank answer has no error to correct.
6. **Triage check 1 was predicted to fail.** Six of seven produced no working queries at all. So
   Arm A would serve almost no help, and the two groups would not differ.
7. **A second round was ordered**, with a Run button. It doubled as the practice run. That settled
   an open question. The week of 8 to 14 Sep was a pilot, not Arm B. **Arm B stays clean.**

### Where the raw data is

- `screener/round-1-cold/RESULTS-10SEP.txt` — grader output, verbatim
- `screener/round-1-cold/submissions/` — the 7 submissions, typed up exactly as sent
- `screener/round-1-cold/grade.py`, `screener/round-1-cold/schema.sql`,
  `screener/round-1-cold/reference_queries.sql`
- `screener/round-1-cold/PARTICIPANT-BRIEF.md` — what they were told

### What it cost

About three days. The test was wrong, so half its output was unusable. The other half picked the
topics.

**Why it matters:** the wasted half was the scores. The useful half was who tried what.

---

## Run 2 — mini-screen, with a Run button

**Built 10 Sep 2026. Sent 12 Sep. Graded 13 Sep 2026.** Same seven people.

The test: 3 new questions on the same schema, in one self-contained HTML file. SQLite runs inside
the page. There is an editor, a Run button, the real error message, and a log of every attempt.

Feedback shows the error, their own result table, and correct or not correct. It hides the expected
rows, the expected row count, and anything resembling a hint.

### What it was for

Not ranking. Ranking can be done by hand from round 1, and that is good enough at three per group.

One question: **does the gate survive this pool?** If people still produce no working queries with a
Run button in front of them, nobody earns a hint. Arm A never differs from Arm B. Triage check 1
fails, and on 28 Sep that would look exactly like a real null result.

Second job: find the usable difficulty band.

### What happened

| person | M1 (T2) | M2 (T2) | M3 (T3) |
|---|---|---|---|
| anuj | solved in 1 | solved in 1 | not tried |
| gaurav | solved in 3 | solved in 1 | not tried |
| manish | solved in 4 | quit | quit |
| nabin | solved in 3 | solved in 1 | 5 tries, no |
| rishabh | 16 tries, no | 63 tries, no | 1 try, no |
| ritesh | solved in 1 | solved in 8 | not tried |
| vikash | solved in 4 | solved in 1 | 1 try, no |

M1: tried by 7, solved by 6. That is 86%, above the 85% line where a hint stops differing from the
answer.
M2: tried by 6, solved by 5. That is 71%, the only question in the usable band. Median one attempt.
M3: tried by 3, solved by **0**.

Pool totals across both rounds: round 1 solved 4 of 35 tried. Round 2 solved 11 of 16.

**Why it matters:** the same seven people went from 4 solved to 11. A Run button is the only thing
that changed.

### The number that matters: 3 moments from 21

A moment to act on needs three things at once. The learner tries unaided. The query runs. The
answer is wrong.

Counted across 21 person-questions, from 122 total attempts: **3 moments.**

| what happened instead | person-questions |
|---|---|
| first attempt already correct | 7 |
| no working query at all, so the gate blocks help | 5 |
| never tried | 4 |
| errors, then correct, with no wrong working attempt between | 2 |
| **produced a moment to act on** | **3** |

That is 0.14 moments per person-question. `TODO-HYPOTHESIS-v1.md` §3 budgets 48. The same 48
person-questions would produce about **7**, against four cells in the locked scope.

**Why it matters:** triage check 1 fails on volume. It fails whether or not the gate is relaxed.

### What it changed

1. **Volume is now the top risk, ahead of the gate.** The round-1 fix was to let a syntax error
   satisfy the gate. That recovers at most 5 of the 18 missing moments, and 3 of those 5 are one
   person. Worth doing. Not enough.
2. **T3 is dead, and the scope has no second topic.** M3 was tried by 3 of 7 and solved by none,
   with an editor in front of them. T1 was already out. T2 is all that is left.
3. **"Too easy" is back, at the question level.** M2 was solved by 5 of 6 who tried, at a median of
   one attempt. Screening on solve rate misses this. Screening on attempts-to-first-correct catches
   it.
4. **Question yield is 1 usable in 3 written.** To land the 16 the design needs, budget writing
   about 48 and screening them. That cost is in no plan yet.
5. **Error message quality is a confound.** See the rishabh block below.
6. **Do not quote the grader's "83% of attempts failed to parse."** Rishabh is 80 of the 122
   attempts and all 80 errored. Without him it is 42 attempts and 21 failures, or 50%.

### Rishabh — the most useful single result of the round

Eighty attempts over 47 minutes. **Not one query ran.** Sixteen on M1, 63 on M2, one on M3.

One cause throughout. He writes keywords without the space: `GroupBy`, `ORDERBY`, `havingcount`.

SQLite names the word *after* the broken keyword, never the keyword itself. His M2 errors show what
that did to him:

| error message | times |
|---|---|
| `near "highest"` | 37 |
| `near "Highest"` | 15 |
| `near "MAX"` | 7 |
| `near "price"` | 4 |

He was chasing the pointer. Each time the message named a new word, he rewrote that word. Across 63
tries he never touched `GROUPBY`.

The same habit is visible in round 1, five days earlier. So: two rounds, 85 or more attempts, a real
error message every single time. The habit was never corrected.

This is not someone failing to try. This is feedback failing to teach.

**Why it matters:** Arm B gets only the bare error message. If that message can sustain 63 useless
tries, Arm B is a broken comparison group, not a neutral one. Part of any Arm A win would just be
Arm A's message being readable.

### Where the raw data is

- `screener/round-2-runbutton/RESULTS-13SEP.txt` — grader output, verbatim
- `screener/round-2-runbutton/logs/` — the 7 returned logs. Every attempt, its SQL, its outcome and
  its error. **This is the only copy.** One folder per round, owned by that round's grader.
- `screener/round-2-runbutton/grade-logs.py`, `screener/round-2-runbutton/reference-mini.sql`,
  `screener/round-2-runbutton/sql-mini-screen.html`
- `screener/round-2-runbutton/README.md` — why the test was built this way
- `screener/TESTER-PROFILES.md` — both rounds, one section per person

### What it cost

About a day to build, a day in the field. Cheap.

**Why it matters:** it caught a failure early. Otherwise that failure surfaces on 28 Sep, as a
result nobody can read.

---

## Append below: date, what was run, what came out, what it changed
