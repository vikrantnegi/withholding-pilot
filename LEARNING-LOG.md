# Learning log — assumptions that broke

**Ten assumptions have broken so far.** Each entry says what was believed, what proved it wrong,
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

## L3 — The gate survives this pool, because only 1 of 7 was locked out

**Believed for about ten minutes on 13 Sep.** The round-2 grader prints it plainly:
`1 of 7 would be LOCKED OUT by the gate: rishabh`.

**What broke it.** That check asks whether a person ever ran a working query on any question. The
study does not depend on that. It depends on single questions producing a moment where help is
needed.

Counted that way, the numbers are worse. Five of 21 locked out. Seven of 21 solved on the first
try, so no help was ever needed. Only 3 of 21 produced a moment where the app would have to choose.

**What changed.** The top risk moved. It is no longer "the gate locks people out". It is "the design
produces almost no moments to act on". The planned fix covers 5 of the 18 missing moments, and 3 of
those 5 are one person.

**The lesson.** A summary number can be counted at the wrong level and still look meaningful. The
level must match whatever produces the data. Here that is one person on one question.

**Why it matters:** every rate in the 28 Sep analysis has this risk. Audit them before you collect
data.

---

## L4 — Round 1's pass rates can pick the study's two topics

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

## Append below: number, what you believed, what broke it, what changed, the lesson
