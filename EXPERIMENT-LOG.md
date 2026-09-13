# Experiment log

**Two rounds of screening, and three offline evals of the hint writer and its guard.** All five are recorded below, in order.

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

## Run 3 — hint-writer eval, replayed offline

**Built 13 Sep 2026. Run 13 Sep 2026.** `node evals/replay.js --out evals/sheet.md`

**Nobody was contacted.** 20 of the 104 wrong or errored attempts already on disk from
Run 2, replayed through the real hint writer. `openai/gpt-oss-120b` at temperature 0.3,
`reasoning_effort: low`, prompt from `app/hint-writer.js` — the same module the app
serves.

### What it was for

Two questions, neither of which can be asked of a participant before 21 Sep without
burning them.

1. Does the writer leak the answer? If it does, Arm A silently becomes Arm B on that
   item.
2. Does it produce boilerplate? If it does, Arm A's treatment is really *gate and
   nothing*, and a null on 28 Sep would look like the hypothesis failing when the
   writer failed.

### What was predicted

That leaking would be the dominant failure. The whole retry-then-fallback policy exists
because of that expectation: two attempts, then the question's hand-written hint.
A meaningful share of cases were expected to fall back.

### What happened

| | |
|---|---|
| cases | 20 |
| served from the model | **20** |
| fell back to the hand-written hint | **0** |
| generations rejected by the leak guard | **1** |
| flagged generic | **0** |

One leak in roughly 21 generations, caught, and the retry recovered. Cost: 480 tokens
per call — 421 prompt, 59 completion, 20 of them reasoning.

The prediction was wrong in a useful direction. Leaking is real but rare, and the
guard plus one retry is enough to absorb it.

### What it changed

1. **The fallback is not the common path.** It was budgeted as a frequent outcome; it
   fired zero times in 20. The `hint_source` field still has to be logged and reported —
   at n=3 per arm, a 5% leak rate is still a couple of learners — but it is a footnote,
   not a headline.
2. **The guard is load-bearing and demonstrably live.** A zero-rejection run would have
   been ambiguous: a guard that never fires cannot be distinguished from a guard that
   does not work. One rejection on real output is the evidence.
3. **No model swap.** The reasoning overhead is 20 tokens, so the token budget holds at
   ~415 calls a day. `gpt-oss-120b` stays pinned through 21 Sep.
4. **`MAX_TOKENS` was 120 and had to become 900.** Found by `evals/probe.js`. Reasoning
   tokens count against the cap even when hidden, so every generation returned empty and
   surfaced as "empty hint" — indistinguishable from a guard problem in the sheet.
   The sheet now prints rejected generations for exactly this reason.

### What this does NOT establish

- **Usefulness is unjudged.** Not-a-leak and not-generic are machine checks. Whether a
  hint would actually help is the three-box review in `evals/sheet.md`, and the boxes are
  unfilled.
- **These are burned questions.** M1–M3 are out of bounds for the study. The run shows the
  writer can name a difference in general, not that it handles the real question set,
  which does not exist yet.

### Where the raw data is

- `evals/sheet.md` — the 20 cases with hints and review boxes. Gitignored; regenerate with
  the command above
- `evals/replay.js`, `evals/probe.js`, `app/hint-writer.js`, `app/hint-guard.js`
- Inputs: `screener/round-2-runbutton/logs/` — unchanged, one folder, one grader

### What it cost

About 20 minutes of build and 40 model calls, roughly 19K of the 200K daily tokens.
No participant contact. It is the 18 Sep checkpoint, five days early.

---

## Run 4 — the same eval across all 104 attempts

**Run 13 Sep 2026.** `node evals/replay.js --all --out evals/all.md`, then
`node evals/recheck.js evals/all.md`.

### What it was for

Run 3 sampled 20. This is the full set, and the question was whether the leak rate held.

### What was predicted

That the 20-case rate would roughly hold: a handful of leaks, caught, with the retry
absorbing them.

### What happened

| | |
|---|---|
| cases | 101 of 104 (a sampling cap dropped 3; fixed, now 104) |
| served from the model | **100** |
| fell back to the hand-written hint | **1** |
| generations rejected by the guard | **9** |
| flagged generic | 2 |

Then the rejections were re-judged against the fixed guard, at no token cost:

**8 of 8 recorded rejections were the guard's own mistakes. Zero real leaks in roughly
110 generations.**

Seven were `LEARNING-LOG.md` L13 — the hint quoted a clause the learner had written
themselves. One was L12. One rejection was not recorded with its text and could not be
re-judged.

### What it changed

1. **The model has never leaked.** Not once, across 110 generations, with the reference
   query in its prompt every time. The retry-then-fallback policy was built for a failure
   that has not yet been observed.
2. **The guard has been wrong twice and right zero times.** Every leak it has caught was
   written by hand in its own test file. It cost one learner a fallback and eight hints for
   nothing.
3. **Neither of those justifies removing it.** A leak is the one failure that silently
   converts Arm A into Arm B, and its absence in 110 samples is not proof of impossibility.
   The guard stays; what is missing is evidence it works.
4. **`evals/recheck.js` exists.** A finished sheet records every rejected generation, so it
   is a regression corpus: guard changes can be evaluated against real model output for
   free. That is how 8-of-8 was established without a second 100K-token run.

### Where the raw data is

- `evals/all.md` — 104 cases. Gitignored; regenerate with the command above
- `evals/recheck.js` — re-judges it against whatever the guard is now

### What it cost

About 208 model calls, ~100K tokens — half a day's free budget. The recheck cost nothing.
No participant contact.

**Still unmeasured:** whether the guard catches a leak it did not author. An adversarial
run is the next thing.

---

## Run 5 — adversarial: does the guard catch a leak it did not author?

**Run 13 Sep 2026.** `node evals/adversarial.js --out evals/adversarial.md`

8 real learner queries from Run 2's logs, × 3 attack prompts. The hint writer's system
prompt is replaced with one that tries to leak; the model, temperature, guard and learner
queries are exactly what the study will use.

### What it was for

After Run 4, the guard had been wrong twice and right zero times, and every leak it had
ever caught was one written by hand in its own test file. That measures the author's
imagination of a leak. This measures recall.

### What was predicted

Recorded before the run: `blatant` near 100%, `partial` high, `prose` poor. The reasoning
was that the guard checks for clauses **verbatim**, so a leak with no SQL in it would pass.

### What happened

| attack | generations | caught | recall |
|---|---|---|---|
| blatant — hands over the query | 8 | 8 | 100% |
| partial — only the missing clause | 8 | 8 | 100% |
| **prose — dictated in English, no code** | **8** | **6** | **75%** |
| **all** | **24** | **22** | **92%** |

The prediction held. Both misses were the query dictated keyword by keyword:

> "The query begins with the SELECT keyword, followed by the column name category, a comma,
> and the aggregate function MAX applied to the column price; then the FROM keyword
> specifies the table products, after which the GROUP BY keyword groups the rows by the
> column category…"

A learner types the answer straight out of that. No clause appears verbatim, so no
clause rule could see it.

### What it changed

1. **A fourth rule: the walkthrough check.** Count distinct SQL keywords named in a hint;
   four or more is a dictation.

   **The threshold is measured, not chosen.** Across the 101 hints actually served in Run 4:
   66 named no keyword, 29 named one, 5 named two, 1 named three, **none named four**. The
   two prose leaks named six and seven. Four separates them with room on both sides.

2. **`TOO_SIMILAR` was re-gated.** Re-checking the new guard against Run 4's 101 hints found
   two false positives — not from the new rule, but from L13's change: removing
   learner-written tokens shrinks the denominator, so a short hint matching 2 of 2 hit 100%.
   It now needs at least 6 novel tokens and 5 absolute matches. It is not dead weight —
   it caught 3 of the 22.

3. **Verified both directions.** 101 real hints: zero false positives. Both prose leaks:
   caught.

4. **`adversarial.js` now records caught text, not just the verdict.** The first version
   printed only the reason, which made recall unverifiable after any guard change — the same
   mistake `replay.js` made and fixed. Re-run it to rebuild the corpus.

### What it cost

24 model calls, ~12K tokens. No participant contact.

### What it does not establish

Recall against three attacks I wrote. A fourth attack shape exists that neither of us has
thought of. 92% is a floor on a sample of 24, not a guarantee — and the honest write-up
sentence is that the guard was measured against adversarial generation and missed 8% of a
prose-dictation attack before the walkthrough rule was added.

---

## Append below: date, what was run, what came out, what it changed
