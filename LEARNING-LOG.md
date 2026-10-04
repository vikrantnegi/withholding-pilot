# Learning log — assumptions that broke

**Fourteen assumptions have broken so far.** Each entry says what was believed, what proved it wrong,
what changed, and the lesson.

The lesson is the point. An entry without one is just a bug report.

**Append only.** Entries are numbered and never edited. If one is later revised, add a new entry
and point back to the old number.

## How this differs from its two neighbours

- `EXPERIMENT-LOG.md` records what was run and what came out.
- This file records what was believed and why it was wrong.
- `HYPOTHESIS-LOG.md` is the formal record of hypothesis versions, required by FAQ rule B4.
- This file is wider. It includes mistakes that never touched the hypothesis.

**Why it matters:** three files, three jobs. Do not merge them.

## Terms used in the entries below

Defined once here. The entries get read weeks after they were written, without the context that
produced them.

- **Person-question.** One learner on one question. Round 2 was 7 people x 3 questions = 21.
- **Moment to act on.** A person-question where the first working attempt is wrong, so the app
  must choose what help to give.
- **The gate.** Arm A's rule: no help until a counted attempt is logged on that question.
  `PRD-v1.md` §4.
- **Locked out.** A person-question that never produces a counted attempt. The gate can never
  release help there.
- **Arm A.** The treatment: the gate, then a hint. **Arm B.** The baseline: the answer on demand,
  a bare error message otherwise.
- **Cell.** One arm on one topic. The plan had four: two arms x two topics.
- **Usable.** A tester the round-1 grader marked fit for the study.
- **The study.** The removal test on 27 Sep. Six learners, three per arm.

Round 1's ten questions sat in five difficulty tiers. Round 2 had three questions, M1 to M3.

| tier | skill | round-2 question |
|---|---|---|
| T1 | single table: filter + sort | — |
| T2 | aggregate on one table | M1, M2 |
| T3 | join two tables | M3 |
| T4 | join + aggregate + negation | — |
| T5 | window or correlated subquery | — |

**Why it matters:** most entries below turn on a grain or a rule defined in another file. This
block is so you never have to open one.

---

## L1 — A written SQL test with no database measures SQL ability

**Believed until 10 Sep 2026.** Round 1 asked people to write SQL with no database and no Run
button. Its scores were read as a measure of whether they could write SQL.

**What broke it.** Gaurav scored 0 out of 10. All four of his answers were conceptually right. He
lost every mark to one habit: putting the sort direction in quotes. Ritesh scored 0 too, having
picked the right operation on six questions.

Nearly every failure in the round was a slip that one run would have caught.

**What changed.** Nobody was excluded on a round-1 score. Cold scores were demoted to ranking
only. A second round with a Run button was ordered.

**The lesson.** A test only predicts performance under the conditions it recreates. The study
gives people an editor and a Run button. Round 1 gave neither. So it measured one-shot recall,
which is a different skill.

**Why it matters:** before trusting any test, ask what conditions it recreates. Then ask whether
those are the conditions you care about.

---

## L2 — The pool's risk is that the questions are too easy

**Believed 7 Sep to 10 Sep.** `CLAUDE.md` named it as the live risk. The worry was that these
people know SQL but do not practise. If the questions sat below their level, both groups would
score high and the study would measure nothing.

**What broke it.** Round 1 came back 1 usable of 7. Pass rates by tier were 14%, 7%, 7%, 0%, 0%.
The opposite of too easy.

**Then it partly un-broke.** Round 2 showed M1 solved by 6 of 7. M2 was solved by 5 of the 6 who
tried, at a median of one attempt. The questions *were* too easy. Just not where anyone was
looking.

**What changed.** "Too easy" is no longer tracked as a property of the pool. It is tracked per
question.

**The lesson.** "Are these people too good or too weak" was the wrong question. It was asked at the
wrong level. The thing that must be neither too easy nor too hard is one person on one question.

**Why it matters:** when a risk keeps flipping sign on new data, check the level you are counting
at. Suspect that before the data.

---

## L3 — The gate survives this pool, because only 1 of 7 people was locked out

**Believed for about ten minutes on 13 Sep.** The round-2 grader prints it plainly:
`1 of 7 would be LOCKED OUT by the gate: rishabh`.

**What broke it.** That check asks whether a person ever ran a working query on any question. The
study does not depend on that. It depends on single questions producing a moment where help is
needed.

Counted that way, the numbers are worse. Five of 21 locked out. Seven of 21 solved on the first
try, so no help was ever needed. Only 3 of 21 produced a moment where the app would have to choose.

**What changed.** The top of the open-decision list in `STATUS.md` moved. It is no longer "the gate
locks people out". It is "the design produces almost no moments to act on". The planned fix is
decision 4 there: let a syntax error satisfy the gate. It recovers 5 of the 18 missing moments, and
3 of those 5 are one person.

**The lesson.** The grader printed `1 of 7 would be LOCKED OUT`. It counts people. The study's data
is produced per person-question. A number counted at the wrong level still looks meaningful. Match
the level to whatever produces the data.

**Why it matters:** every rate in the 28 Sep analysis has this risk. Audit them before you collect
data.

---

## L4 — Round 1's pass rates can pick the two topics the study teaches

**Believed from 7 Sep.** It was the screener's stated second job. Its pass-rate table would name
the two topics the study teaches. It named T2 and T3.

**What broke it.** Round 2. M3 was the T3 question. Three of seven tried it. Nobody solved it. They
had a Run button in front of them.

The table that nominated T3 came from the same instrument L1 had already retired.

**What changed.** T3 is out. T1 was already out, because on a one-line query a hint and the full
answer are the same string. T2 is the only topic left. The locked scope calls for two.

**The lesson.** A conclusion is only as good as the instrument behind it. L1 retired that
instrument on 10 Sep. The topic choice drawn from it stood for three more days.

**Why it matters:** when you retire an instrument, list everything you decided using it. Then redo
those decisions.

---

## L5 — 3 learners x 16 questions gives 48 moments to act on

**Believed from 2 Sep.** It is written into `TODO-HYPOTHESIS-v1.md` §3. The whole scope decision
rests on it: four cells, twelve observations each.

**What broke it.** Round 2 measured the real rate. It is 0.14 moments per person-question. Those
same 48 person-questions would produce about **7**, or under two per cell.

**What changed.** Nothing yet. This is the live open problem as of 13 Sep.

**The lesson.** The count was questions asked. It should have been questions that fail on the first
working attempt. A question solved first try produces nothing. So does one never run, and one never
tried.

**Why it matters:** before trusting any capacity estimate, write down the exact event you are
counting. Then write down what has to be true for one to happen.

---

## L6 — A 20 to 85% solve rate is the usable difficulty band

**Believed from 10 Sep.** It is written into `screener/round-2-runbutton/README.md` as the
screening rule. Below 20% a question floors people. Above 85% there is no room for a hint to differ
from the answer.

**What broke it.** M2 sits inside the band at 71% and is still useless. Median attempts to first
correct: **one**. Solved on the first try means no wrong-but-working attempt. No wrong attempt means
no moment to act on, whatever the solve rate says.

**What changed.** Questions are now screened on attempts-to-first-correct. Solve rate is the
secondary check.

**The lesson.** A number can sit in range and still measure the wrong thing. Solve rate describes
where people ended up. The intervention lives on the path they took.

**Why it matters:** pick the measure that sits on the mechanism. Not the one easiest to compute.

---

## L7 — A bare error message is a fair comparison group

**Believed from the start, without ever being stated.** Arm B gets the answer on demand, and
otherwise just the database's error message. That was treated as neutral.

**What broke it.** Rishabh. Eighty attempts, none of which ran, 63 on one question. His only fault
is writing keywords without the space, as in `GroupBy` and `ORDERBY`.

SQLite names the word *after* the broken keyword. So he rewrote the alias capitals, then the HAVING
line four different ways. Across 63 tries he never touched `GROUPBY`.

**What changed.** Not decided yet. Two options. Give both groups error messages of matched
quality. Or write this up as a stated limit before Arm B runs.

**The lesson.** A comparison group is a design choice, not the absence of one. "No help" still has a
user experience. Suppose that experience is bad, and the treatment happens to fix it. Then part of
the measured effect is just that fix.

**Why it matters:** the same fault showed up in code first. The round-1 grader printed
"WRONG got 3 rows, expected 3" — a correction that corrects nothing. Now it has shown up in a
person.

---

## L8 — Two copies of the same data are harmless

**Believed until 13 Sep.** The round-2 logs were kept in two folders at once:
`screener/mini-screen-submission/` and the grader's own `logs/`.

**What broke it.** Nabin's log arrived, landed in one folder, and never reached the other. The
grader reads only `logs/`. So a grading run would have quietly scored 6 of 7. The one it dropped
was the only person round 1 had marked usable.

**What changed.** The duplicate folder was deleted. One folder per round, owned by that round's
grader, and it is the folder the code reads. The same problem still exists in `hackathon/` and is
deferred, not fixed.

**The lesson.** Two copies is not a backup. It is two sources of truth with nothing reconciling
them. The failure is silent, which is the dangerous kind. The grader does not know a file is
missing. It just reports a smaller number.

**Why it matters:** the canonical copy is wherever the code reads from. Keep a second copy only when
it is frozen on purpose, and label it with the date it was frozen.

---

## L9 — Classmates can be study participants

**Believed briefly, from a conflict between two documents.** The brief says "none from your team".
The FAQ says "not a classmate".

**What broke it.** 100x answered on Discord on 1 Sep 2026. Classmates are not allowed. Participants
must come from outside the cohort. Recorded in `DISCORD-QUERY.md`.

**What changed.** Nothing downstream. `RECRUITMENT-2SEP.md` had already been written to the stricter
reading, so the answer cost nothing.

**The lesson.** When two sources conflict, plan to the stricter one and ask in parallel. Being wrong
in the strict direction cost nothing here. Being wrong the other way would have meant an ineligible
pool, found late.

**Why it matters:** keep straight which document says what. The brief gives the hypothesis and the
rubric. The FAQ gives the process rules.

---

## L10 — Deferring the duplicate in `hackathon/` was harmless

**Believed from 13 Sep 2026.** L8 deleted the duplicate round-2 folder under `screener/`. It noted
the same problem still existed in `hackathon/` and marked it deferred.

**What broke it.** The hackathon copy was already producing a wrong number. `rounds-compare.py`
read `hackathon/evidence/mini-screen-submission/`, which held 6 of the 7 round-2 logs.

The missing file was nabin's. The same person L8 dropped, five hours earlier.

`SUBMISSION.md` then claimed "all 6 round-2 returners scored 1/10 or less on the cold test". Nabin
scored 3/10. The word "all" was true only because his file was absent.

**What changed.** The whole `hackathon/` folder was deleted on 13 Sep. The First Action Hackathon
will be restarted from scratch after the capstone is clear. The folder survives in git history at
commit `7439b80`.

**The lesson.** A deferred duplicate is not a dormant problem. It is a live wrong answer that
nobody has read yet. L8 found the mechanism and then left a second instance of it running.

**Why it matters:** when a class of bug is found, fix every instance or delete them. Deferring one
means the lesson was written down but not applied.

---

## L11 — Counting an attempt by its result set is enough

**Believed from 10 Sep 2026.** `PRD-v1.md` §4 defined it: an attempt counts if it executes and
its result set differs from the previous attempt's.

**What broke it.** Rishabh. Eighty attempts, none of which executed. A query that does not run
returns no result set, so the rule has nothing to compare and never fires. Under it he makes 80
unaided attempts over 47 minutes and earns no help at all.

The obvious fix — let a syntax error count — breaks it the other way. He pressed Run on
byte-identical queries five times in a row. Counting those, he earns the hint on press two
instead of press sixteen. That replaces a learner who gets no help with one never allowed to
think.

**What changed.** The rule now has two clauses, not one. The query text must have changed since
the last counted attempt, **and** the attempt must either have errored or produced a new result
set. `PRD-v1.md` §4 rewritten. Built in `app/policy.js`, covered by four cases in
`app/policy.test.js`.

**The lesson.** The rule was written from the learners who were succeeding. All of them produced
result sets, so the result set looked like the thing to count. It measured the output of the
attempt, and what the gate needs to know is whether effort happened.

**Why it matters:** when a rule reads one field, ask what that field is when things go worst.
Here it is absent, and absent is not a value the rule handled.

---

## L12 — A hint containing SELECT and FROM is a leak

**Believed from 13 Sep 2026.** The leak guard's first rule was: reject any hint where the
word `select` is followed anywhere by the word `from`. It looked like a cheap way to catch
a pasted query.

**What broke it.** The first real rejection the guard ever produced, in `evals/sheet.md`:

> "You started with SELECT, which by itself returns nothing because no source table or
> aggregation is defined — you need to indicate where the data comes **from** and how to
> group it."

That is a good hint. It names what the learner wrote, says what it does to the rows, and
gives away nothing. It was rejected because "from" is an ordinary English word.

Worse, the rejection was *caused by the prompt working*. The hint writer is instructed to
quote what the learner wrote. This learner had written `SELECT`. So the guard punished the
model for following its instructions, and the conflict is systematic: any learner whose
mistake involves SELECT or FROM produces hints the old rule would reject.

**What changed.** The rule now asks whether the text is a query that would RUN. A runnable
query has to name a real table, and the reference query says which tables exist — so the
check is `select` plus one of those table names after `from`/`join`, or a terminated
statement. `tablesIn()` in `app/hint-guard.js`. Both the rejected hint and the retry that
replaced it are now regression tests, using their exact text.

**The lesson.** The deterministic half of the system can be confidently wrong, and it
cannot tell you. Every leak in the guard's test suite was a leak *I* invented; they all
passed, and the first sentence a real model produced broke it. Hand-written tests for a
checker only test the author's imagination of the failure.

**Why it matters:** a rejected good hint is cheap and visible — it shows up as a fallback
in the log. The dangerous direction is the other one, and there is still no measurement of
it. An adversarial run — ask the model to leak on purpose, count what the guard catches —
is the missing number.

---

## L13 — A hint containing the reference query's clause is a leak

**Believed from 13 Sep 2026.** The guard's main rule: reject a hint containing any clause
that distinguishes the reference query — `group by category`, `having max(price) > 10000`,
`max(price)`.

**What broke it.** The 104-case run rejected 9 generations. Seven were this, and all seven
looked like:

> "You placed MAX(price) > 10000 right after GROUPBY, which attempts to filter rows before
> they are aggregated — you need a condition that evaluates after the grouping."

The learner had written `GROUPBY MAX(price) >10000` themselves. The hint is quoting their
own query back at them. They are looking at it in their own editor. Nothing was revealed.

The remaining two were the L12 class and a semicolon rule of mine that fired on ordinary
English — *"nothing is processed; you need to specify where the data comes from"*.

Re-judged with the fixed guard: **8 of 8 were the guard's mistakes. Zero real leaks in
about 110 generations.**

**What changed.** "Distinguishing" now means what the word says: a clause only counts if
the learner does **not** already have it. `inspect()` takes the learner's query and skips
anything present in it. The semicolon rule was deleted rather than patched — the
real-table rule already catches queries that would run. `evals/recheck.js` re-judges a
finished sheet's rejected generations against the current guard for free, so a guard
change no longer costs 100K tokens to evaluate.

**The lesson.** Both guard bugs came from the same root: the prompt instructs the writer to
quote what the learner wrote, and the guard treated quotation as disclosure. Two components
were built from the same spec and given contradictory readings of it. Nothing in either
file was wrong on its own terms.

**Why it matters:** the guard has now been wrong twice and right zero times. Every leak it
has ever caught was one written by hand in its own test file. The false-negative rate —
does it catch a real leak? — is still entirely unmeasured, and an adversarial run is the
only thing that would measure it.

---

## L14 — The hypothesis log is current because the rule says to append to it

**Believed until 14 Sep 2026.** `CLAUDE.md` carries it as a non-negotiable: append to
`HYPOTHESIS-LOG.md` whenever evidence changes the design. The rule was written, understood,
and agreed.

**What broke it.** Vikrant read v0 against the built system and asked why the four-level cut
and the gate were not in it.

Three changes had gone unlogged for a week: four help levels down to two, the competence
estimator cut, and the gate added. The gate is the most load-bearing rule in `app/policy.js`
and by `PRD-v1.md` §4 it is half the treatment — and it appeared nowhere in the hypothesis it
exists to test.

Worse, cutting the estimator moved the independent variable. v0 tested *adaptive* withholding;
the built system tests *withholding*. The file that exists to show that diff did not show it.

**What changed.** `HYPOTHESIS-LOG.md` v0.2 records it, dated as written on 14 Sep and openly
late. Every future `EXPERIMENT-LOG.md` entry ends by asking whether the hypothesis moved.

**The lesson.** A rule with no trigger is a hope. This one had no moment that forced the
check — no checkpoint, no template field, nothing that fails when it is skipped. The three
other append-only rules in this project all fire on an event: a run finishes, an assumption
breaks. "Whenever the design changes" is not an event anyone notices from inside the change.

**Why it matters:** rubric E5 grades exactly this file, and the largest change to the
hypothesis was the one missing from it. Found by a reader, not by the process — which is
the part to fix.

---

## Append below: number, what you believed, what broke it, what changed, the lesson

---

## L15 — The grader is what decides whether an answer is correct

**Believed until 19 Sep 2026.** Grading was result matching: run the submission, run the
reference, compare the rows. The grader was treated as the whole correctness surface, so
making grading stricter meant changing the grader.

**What broke it.** anuj's round-1 query for the "highest price per category above 10000"
item put the threshold in `HAVING price > 10000` — filtering groups on a single row's price
rather than on the group's maximum. It scored **correct**. The rows were right. Nothing was
wrong with the rows; what was wrong was the query.

The reason it passed is that the round-1 seed data could not tell the two queries apart. In
that data, the arbitrary row SQLite picks for a bare `price` happened to be the group's
maximum often enough that both queries returned the same rows. Change one product's price and
the same grader would have caught it. So the *data* was doing half the grading, silently, and
nobody had decided that it should.

**What changed.** Two defences, each independent of the other.

`grade_rule.py` clause 2 checks the submitted SQL: every non-aggregated column selected, or
filtered on in `HAVING`, must also appear in `GROUP BY`. That is a property of the query, so
no dataset can make it pass.

`verify.py` checks the data: it executes all 47 wrong queries listed across the 28 items in
`items.py` and fails if any returns the reference's rows, compared both in order and unordered.
The seed data now has to earn its separating power before a freeze, rather than being assumed
to have it.

**The lesson.** When a check compares outputs, the inputs are part of the check. A
result-matching grader is only ever as strict as the data's ability to separate a right answer
from a wrong one — and that strictness is invisible, because a passing wrong answer looks
exactly like a passing right one.

**Why it matters:** the whole study is a comparison of who gets items correct. A grader whose
strictness depends on undeclared properties of the seed data is not a measuring instrument.

---

## L16 — There is one grader

**Believed until 19 Sep 2026.** `grade_rule.py` was written, tested, and frozen as *the*
scoring rule, with its reasoning dated in `DECISIONS.md` section 3. Freezing it felt like
settling the question of what counts as correct.

**What broke it.** Wiring the frozen question set into `app/index.html`. The app had a rule of
its own, inherited from the round-2 screener: compare result rows at 2 decimal places, and
never look at the SQL. So there were two rules, and they disagreed in both directions.

A learner who grouped correctly but omitted `ROUND(...,1)` returns 194.4666 where the reference
says 194.5. The app compared at 2 decimals, saw 194.47 against 194.5, and said "Not right yet".
The scoring rule compared at 1 decimal and counted the same submission correct. Eleven of the
16 practice items ask for rounding, so this was the common case rather than a corner.

The anuj shape ran the other way. The app said "Correct. That's the one.", disabled Help, and
recorded no ladder decision; the scoring rule graded it `invalid`.

**What changed.** `app/grade-rule.js` ports the frozen rule and the app now uses it.
`evals/grader-conformance.mjs` runs all 75 queries in `items.py` — 28 references and 47 wrong
models — through both implementations and fails unless the verdict *and* the reason match. 75
of 75 agree. `DECISIONS.md` sections 4 and 5 record the decision and the rounding tie-break it
forced, both dated before the practice session.

**The lesson.** A rule is not frozen until every place that applies it has been found.
Freezing the document froze one of the two implementations and left the other running, and the
frozen one was the one nobody was looking at during a session.

**Why it matters:** the disagreement fell on exactly the two query shapes this study is about —
correct grouping with sloppy formatting, and the wrong mental model that returns right rows. In
the results it would have been indistinguishable from an effect of the help policy.

---

## L17 — A number a script prints is a record of that number

**Believed until 19 Sep 2026.** `validate-substance-bar.js` printed its own baseline on every
run: "121 of 128 passed, 7 rejected (6 empty, 1 bare SELECT)". It read like a measurement
carried forward from the run that produced it.

**What broke it.** The new schema pushed the pass count down to 7 of 122, which is expected —
the logged attempts name tables that no longer exist. Judging whether any *genuine* attempt had
been lost meant re-running the same extractor against the old schema. That gave **121 of 122
passed, 1 rejected.** The 121 reproduced exactly. The 128 and the 7 did not.

The 6 empty submissions the baseline counted are not in the corpus the extractor reads now.
Whether the logs changed or the extractor did is no longer recoverable, because the only record
of the original run is the sentence describing it.

**What changed.** The line now states numbers that can be reproduced, and says how: run it with
`--schema` pointing at the old schema. The withdrawn claim is named rather than quietly
replaced.

**The lesson.** A number in a print statement is an assertion, not a measurement. It cannot
fail, because nothing re-derives it. So it outlives the thing it described and keeps being read
as current — and a baseline is the worst place for that, because its whole job is to be the
thing a later judgment is compared against.

**Why it matters:** the judgment resting on this baseline was whether the substance bar had
started rejecting real work. That call was made against a denominator that was wrong by 6
attempts.

---

## L18 — A passing test suite proves the code is exercised against the real thing

**Believed until 19 Sep 2026.** `policy.test.js` had 34 green tests over the level selector and
the substance bar, including named round-2 learners. Green was read as coverage.

**What broke it.** The schema changed from `customers`/`products`/`orders`/`order_items` to
`deploys`/`tickets`/`rides`. The handoff predicted the suite would break, because the substance
bar's schema half matches an attempt against the schema's identifiers and those tests use
queries naming the old tables.

The suite stayed green. It declares its own identifier list — `const IDS = ['customers',
'products', ...]` — and passes it in explicitly. So it kept testing the bar against a schema
that no longer existed anywhere else in the project, and reported success for doing so.

**What changed.** The identifier list and every learner query in it now name the study schema.
Still 34 green, but green about the current system. The bar itself was not touched.

**The lesson.** A fixture that declares its own world cannot notice that the world changed.
Green means "consistent with the fixture", and only means "consistent with the system" when
something forces the fixture and the system to share a source.

**Why it matters:** the prediction that these tests would fail was correct reasoning about the
system. The suite's silence was the defect. A test that cannot fail when the system changes
underneath it is not covering the system — and this one guards the rule that decides which
attempts count toward the gate.

---

## L19 — A zero on the screener means the person could not do it

**Believed until 19 Sep 2026.** Round 1 scored four passes across seven people and 35 attempted
answers. Five of the seven scored 0/10, and `grade.py` labelled each of them `FLOOR — exclude`.
`README.md` in `screener/` already warned that round 1 measured the wrong thing, but the warning
was general. Nobody had looked at what a specific zero was made of.

**What broke it.** Arm assignment needed a ranking, so manish's round 1 had to be regraded — his
was the score the grader bug demonstrably broke. His whole round read:

```
Q1  T1  WRONG got 3 rows, expected 3
Q2  T1  WRONG got 6 rows, expected 6
```

Row counts matching, no fault named. Fixing the report showed `1 column, expected 2` on both. The
cause was one character:

```sql
SELECT name city FROM customers WHERE city = 'Bengaluru' ORDER BY name ASC;
```

A missing comma. SQL reads `name city` as the column `name` aliased to `city`, so one column comes
back instead of two. The table, the filter and the sort are all correct. Same fault on both
questions.

Both of manish's answers were complete, correct queries. He scored 0/10 and was labelled
*exclude*.

**What changed.** `grade.py` gains `diagnose()`, which names the real mismatch — wrong column
count, wrong row count, or right shape with wrong values and the first row that differs.
`compare()` is untouched, so no score moved; the scores were right, the explanation was missing.
The arm-assignment measure in `screener/ARM-ASSIGNMENT.md` uses round 2 alone, and section 5
there records why.

**The lesson.** A grader that reports a summary statistic instead of a diagnosis produces scores
nobody can audit. `got 3 rows, expected 3` is true, and it is useless — it describes the output
without naming the defect, so a reader cannot tell a near miss from a blank page. Worse, the
verdict built on top of it (`FLOOR — exclude`) reads as a judgement about the person.

The same shape as L15: there the seed data was silently doing half the grading, here the message
was silently hiding what the grading found. Both times the grader looked fine from outside.

**Why it matters:** this score was about to rank a participant into an arm. A pool of seven has
no room for a capable tester ranked last because of a comma — and the round-1 FLOOR verdicts
would have excluded five of seven people if anyone had taken them at face value.

---

## L20 — The spec and the instrument agree about what is being measured

**Believed until 19 Sep 2026.** `PRD-v1.md` §6 item 4 names four sub-skills, three practised and
one held back as the control. `study-questions/` was authored to that spec and frozen. Both
documents were current, both were written carefully, and nobody had put them side by side.

**What broke it.** A sweep of every document in the folder for stale claims. The two definitions
are not the same:

| | `PRD-v1.md` §6, written 10 Sep | `study-questions/items.py`, frozen 19 Sep |
|---|---|---|
| S1 | group by the right column | group, and one aggregate per group |
| S2 | **choose the right aggregate** | **filter rows before grouping — `WHERE`** |
| S3 | filter groups, not rows | filter groups after aggregating — `HAVING` |
| S4 | **order by an aggregate** | **compose all three, with `ORDER BY`** |

S2 and S4 are different skills in the two documents, and S4 is the control — the one the whole
attribution argument rests on. "Improvement on the practised sub-skills and flat on S4" means one
thing if S4 is sorting by an aggregate and another if S4 is composing a filter, a grouping and a
group filter in one query.

The handoff that carried the question set even said *"sub-skills, defined fresh (PRD-v1 had
none)"*. PRD-v1 had four. They were not read, so four new ones were written, and the conflict
travelled inside a document whose job was to remove ambiguity.

**What changed.** §6 item 4 now carries the instrument's definitions, marked as a correction with
the superseded wording quoted, because a reader who saw the old table needs to know it moved.
The instrument wins on principle: it is the thing that gets scored, and every item in `items.py`
carries its sub-skill as data. §6's item budget was corrected in the same pass — it said "about 5
each on S1, S2, S3" and the frozen set is S1 x3, S2 x6, S3 x7.

**The lesson.** Two documents that describe the same thing will drift, and the drift is invisible
while both look right on their own. What makes it invisible is that neither is wrong internally —
there is no broken link, no failing test, no contradiction inside either file. It only appears
when something forces them together.

Nothing forced them together here. The question set was generated *from* the spec by a reader who
did not find the spec's own answer, which is the failure L14 named: a rule with no trigger is a
hope. The difference is that L14 was about a rule nobody fired, and this is about a definition
nobody compared.

**Why it matters:** this would have surfaced on 28 Sep, while writing up which sub-skills
improved, with the data already collected and the wording no longer changeable. Found on the
19th it is an edit. Found on the 28th it is a hole in the central claim.

---

## L10 — 20 Sep 2026. A refusal outlived the click that answered it

**What broke.** Vikrant pressed Help before running anything, got "give it one run first",
then wrote a query and ran it. The refusal was still sitting above the new result.

**The assumption.** That `runQ` owned the whole result area. It does not. The question card
has two boxes: `help-out-<id>` above and `out-<id>` below. `runQ` rewrites the lower one on
every path and never touched the upper one, so whatever Help last wrote stayed on screen
through every later submission.

**Why it is not cosmetic.** Both refusals are Arm A only — `policy.js` line 195 serves Arm B
the answer on demand and never refuses. So a stale refusal is something Arm A learners see
and Arm B learners cannot. That is the L7 shape again: a difference between the arms that is
not the help policy. Here it points the wrong way as well — the message contradicts what the
learner just did, which is worse than an unhelpful message, because it is a false one.

**The fix, and what it deliberately does not do.** A refusal is marked transient when it is
written, and the next run clears it. A delivered hint or revealed answer is not marked, so it
survives — the learner is working from it while writing the next query. Clearing the whole box
on every run would have been one line shorter and would have deleted the Arm A treatment from
the screen the moment it was used.

**Caught by.** Nothing. Five unit suites and 84 browser checks all passed with the bug in
place, because every one of them reads the help box straight after pressing Help. The test
helper in `evals/verify-app.mjs` even cleared the box itself before each press — the workaround
was sitting in the harness with a comment explaining it, and nobody read it as a finding.

**So what:** a per-element assertion cannot catch a bug about what is on screen *together*.
The new block in `verify-app.mjs` checks the box after a *different* action, which is the only
way this class of fault shows up. 88 checks now, and the new one fails on the pre-fix page.

## L21 — 24 Sep 2026. Clause 2 of the scoring rule catches the mistake it names

**What broke.** Vikash, on P14, wrote
`SELECT service, COUNT(*) deploy_count FROM deploys GROUP BY service HAVING deploy_count > 6`.
It returns the right rows. The grader called it invalid: "filters groups on deploy_count, which
is a row value, not a group value". That is false. `deploy_count` is his name for `COUNT(*)`,
and a count is a group value.

**How often.** 10 "row value" verdicts across the 6 round-3 logs in so far. All 10 are this
alias case: 9 from nabin on P14 and P16, 1 from Vikash on P14. The mistake the clause exists to
catch, a HAVING on a real column like `HAVING status = 'failed'`, appears 0 times.

**The assumption.** That any word in HAVING that is not in GROUP BY is a column. The rule never
considered that a learner would name an aggregate and then filter on the name.

**Why it is not cosmetic.**
- It teaches the wrong thing. Vikash dropped the alias and wrote `count()` in HAVING. He changed
  his SQL to satisfy the grader, not because his mental model was wrong.
- It hits Arm A harder. nabin is Arm A. A false "invalid" counts as an attempt and moves him up
  the help ladder, so his hints on P14 were partly the grader's doing.
- It would carry into the score. `grade_rule.py` has the same logic, so the removal test would
  mark a correct alias query wrong.

**Caught by.** A person reading one log. Not the conformance run: its 75 queries are 28
references and 47 wrong models I wrote, and none of the 47 uses an alias.

**The fix, on branch `grader-alias-having`, not merged.** An alias of a SELECT item that
passed the SELECT check is a group value. One exception is kept on purpose: an alias that
shadows its own column. In `SUM(fare) AS fare ... HAVING fare > 500`, SQLite reads `fare` as
the row column, checked in sqlite3, so that stays invalid. Tests: 30 of 30 JS, 0 problems in
Python, 75 of 75 conformance. Over all 307 logged attempts from rounds 2 and 3, the two graders
agree on every one, and exactly 9 verdicts change. The 10th alias case puts HAVING inside the
SELECT list and stays invalid.

**When to merge.** After ritesh's practice session, so all 7 practice sessions ran on one
grader. Before the removal test is scored. The practice verdicts already logged stand as the
learners saw them.

**Is this a DURING-box decision?** The evidence came from practice logs. But the change fixes
a grader error that is visible from SQLite's own behaviour, applies to both arms the same way,
and is made before any removal-test data exists. It picks no person, arm or threshold.

**So what:** the wrong models I write test the rule against my imagination. Learner logs test
it against learners. Read the logs for grader verdicts, not only for learner behaviour.

## L22 — 26 Sep 2026. A double-quoted string was read as a column

**What broke.** ritesh, on P16, wrote `HAVING sum(hours_to_close) > 300 and status is "closed"`.
The grader said it "filters groups on closed, status". The verdict was right, because `status`
is a row value. The reason was wrong: `closed` is not a column. SQLite reads `"closed"` as the
string `'closed'`, because no column has that name.

**Why it matters, even though no verdict moved.** The same bug marks a correct query invalid.
`HAVING team = "platform"` is valid grouped SQL, and the old grader called `platform` a row
value. Nobody wrote that shape in practice. Someone could on the removal test, where a false
"invalid" is a lost point.

**The assumption.** That only single quotes make a string. MySQL habits say otherwise, and 42 of
382 round-3 attempts (7 people x their attempts) used double quotes.

**The fix, 26 Sep, in both graders.** SQLite's own rule, copied: a double-quoted word is a column
if a column with that name exists, and a string otherwise. Both graders now carry the 15 column
names from `study-questions/schema.sql`, and both test suites fail if that list drifts from the
schema. No data value in the schema equals a column name, so the rule is unambiguous here.

**Effect on logged data.** Regraded all 382 round-3 attempts: 0 verdicts change, 1 reason
changes (the one above). JS 37 of 37, Python problems 0, conformance 0 drift.

**Is this a DURING-box decision?** No more than L21. It copies SQLite's behaviour, applies to
both arms the same way, and lands before any removal-test data exists.

**So what:** the grader has to resolve names the way the database does. Every gap between the
two is a place where a learner can be right and be marked wrong.

---

## L23 — 4 Oct 2026. Item order was a variable, and nobody counted it

**What happened.** Three of six learners stopped early on the removal test, after H08 or H09.
The held-out items run S1, S2, S3, S4 in page order. So every early stop landed on S4. Arm B's
6 blanks on S4 became a 6-point S4 gap, the largest in the study.

**The assumption.** That every learner reaches every item, so item position does not matter.
The 30-minute guide in the message and a narrow-screen layout both broke it.

**Why it matters.** S4 is the attribution control. The order confound turned "they stopped" into
"S4 shows the biggest effect", which reads as the opposite of the hypothesis's prediction.

**The fix, for a next study.** Randomise item order per learner, logged with the session. Then
stopping early spreads across sub-skills instead of landing on one.

**This is the wrong-unit trap again.** The grain was right, per person-question. The missing
column was position.

**So what:** any variable that changes along with the outcome is a variable, even page order.
