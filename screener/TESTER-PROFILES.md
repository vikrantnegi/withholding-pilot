# Testers — both rounds, per person

**The short version.** Two of the seven are useful for the study. One is a dropout risk nobody
had flagged. Four solve the questions too fast to be useful. One tried for 47 minutes and
produced nothing.

The same 7 people took both rounds. This file covers each one on their own.

## Words used below

- **Round 1** (R1) was written SQL with no database and no Run button.
- **Round 2** (R2) gave them a real database in the page, plus a Run button.
- **Arm A** is the tested group. It must try first, and its first help is a hint.
- **Arm B** is the comparison group. It gets the full answer whenever it asks.
- A **policy decision** is one moment where the app must pick "hint" or "answer".
- A policy decision happens only when a learner runs a query and gets it wrong.
- The **gate** is the rule that no help is served until one query actually runs.
- **T1 to T5** were round 1's five difficulty tiers. T1 easiest, T5 hardest.
- The **removal test** is on 27 Sep. The app is taken away and people work unaided.

Read `README.md` in this folder before you use any round-1 score. Round 1 measured the wrong
thing. Nobody should be excluded on it.

**Why it matters:** round 2 is the trustworthy round. Round 1 only tells you who tried what.

## The three round-2 questions

**M1, M2 and M3 are the three questions in round 2.** They are named all through this file.

M1 and M2 were both T2 questions. M3 was T3, the only harder one.

Round 1 was different. It had ten questions, Q1 to Q10, spread across all five tiers.

**Why it matters:** M3 was the round's only test of T3. That is why T3 ended up with so little
data.

Sources, all verbatim: `round-1-cold/RESULTS-10SEP.txt`, `round-1-cold/submissions/`,
`round-2-runbutton/RESULTS-13SEP.txt`, `round-2-runbutton/logs/`.
Both rounds analysed together: `../EXPERIMENT-LOG.md`.

---

## At a glance

Both rounds counted the same two things. How many questions each person tried, and how many they
solved.

| person | R1 tried | R1 solved | R2 tried | R2 solved | R2 attempts | R2 time |
|---|---|---|---|---|---|---|
| nabin | 6 of 10 | **3** | 3 of 3 | **2** | 11 | 45 min |
| ritesh | 6 of 10 | **0** | 2 of 3 | **2** | 11 | 15 min |
| vikash | 7 of 10 | **1** | 3 of 3 | **2** | 6 | 9 min |
| anuj | 5 of 10 | **0** | 2 of 3 | **2** | 6 | 4 min |
| gaurav | 4 of 10 | **0** | 2 of 3 | **2** | 4 | 2 min |
| manish | 2 of 10 | **0** | 1 of 3 | **1** | 4 | 55 sec |
| rishabh | 5 of 10 | **0** | 3 of 3 | **0** | 80 | 47 min |

Pool totals: round 1 solved **4 of 35 tried**. Round 2 solved **11 of 16**.

Round 1 gave one attempt per question. Round 2 let them try as often as they liked. So "attempts"
and "time" exist for round 2 only.

"Time" is the gap between `started` and `finished` in each log file. Neither grader reports it.

**Why it matters:** the same seven people went from 4 solved to 11. A Run button is the only thing
that changed.

## Round 2, question by question

| person | M1 (T2) | M2 (T2) | M3 (T3) |
|---|---|---|---|
| nabin | solved in 3 | solved in 1 | 5 tries, no |
| ritesh | solved in 1 | solved in 8 | not tried |
| vikash | solved in 4 | solved in 1 | 1 try, no |
| anuj | solved in 1 | solved in 1 | not tried |
| gaurav | solved in 3 | solved in 1 | not tried |
| manish | solved in 4 | quit | quit |
| rishabh | 16 tries, no | 63 tries, no | 1 try, no |

**Why it matters:** four people solved M2 on the first try. Nobody solved M3 at all.

---

## nabin

**Verdict: your strongest participant.**

Round 1: 3/10, and the only tester round 1 marked as usable. He got the first three right.
He tried three more and failed all three. Two of those were wrong column names. That is
forgetting the schema, not bad syntax.

Round 2: 11 attempts over 45 minutes. He solved M1 and M2. He failed M3 five times, then skipped
it.

His M3 failures are worth reading. He gave the ORDERS table the short name `or`. But SQL already
uses `or` for something else. SQLite replied `near "or": syntax error`. That message reads like the
short name is just misspelled. So he rewrote the join five times and never changed the name.

His two rounds agree. Nobody else's do. That means his round-1 score was a real measurement.

**Why it matters:** he is your best source of wrong-but-running attempts. The study runs on those.

---

## ritesh

**Verdict: the reason to relax the gate.**

Round 1: 0/10. But he attempted six questions and picked the right operation each time. Two
failures were `near "ORDERBY"`. He writes the keyword without a space.

Round 2: 11 attempts over 15 minutes. M1 in one try. M2 took eight.

His M2 path is the best learning trail in the set. He opened with three faults at once:
`SELECT MAX() FROM products GROUPBY category HAVING MAX()>10000 ORDERBY category ASC`. Then five
tries stuck on `ORDERBY`. Then a wrong-argument error on `MAX()`. Then correct.

Here is the catch. All seven of his failed tries were errors, not wrong answers. A query with an
error never runs. So the gate would have served him no help at all through that whole sequence.

**Why it matters:** he is the concrete case for letting a syntax error satisfy the gate.

---

## vikash

**Verdict: capable but careless. His round-1 score is noise.**

Round 1: 1/10. He tried seven questions and solved one. That one was Q5, a two-table join.
He failed Q1 and Q2, the two easiest questions. Both came back with too many rows. He forgot to
filter.

Round 2: 6 attempts over 9 minutes. M1 in four tries, M2 in one.

He solved M1 with a subquery. Nobody else reached for one.

Someone who writes subqueries is not a 1/10. Someone who forgets a `WHERE` is not strong either.
Both are true of him.

**Why it matters:** likely to solve T2 questions instantly, so he will generate few decisions.

---

## anuj

**Verdict: an instant solver. He is the volume problem, not an exception to it.**

Round 1: 0/10. He attempted five questions. Two failed on `no such column: ASC` and
`no such column: DESC`. The sort keyword ended up treated as a column.

Round 2: both first attempts correct. Four minutes total. M3 not tried.

Then he kept editing answers that were already right. He broke M2 doing it. His last try was
`ORDER BY ASC;` — the same fault as round 1.

**Why it matters:** he generates zero decisions at this difficulty. Harder questions are the only fix.

---

## gaurav

**Verdict: include him. He also produced one of only three real decisions.**

Round 1: 0/10, with all four attempted answers conceptually right. Every one died the same way:
`near ""ASC"": syntax error`. He put the sort direction in double quotes.

Four questions. One habit. Zero marks.

Round 2: 4 attempts over 2 minutes. M1 in three tries, M2 in one.

His first M1 try returned the right rows in the wrong order. That is the cleanest hint-able moment
in the whole dataset. The query ran. The answer was wrong. A hint about sort order was exactly the
right reply.

**Why it matters:** excluding him on that 0/10 would have dropped a competent tester.

---

## manish

**Verdict: your dropout risk. Nobody had flagged him.**

Round 2 first, because it is the clearer signal. He spent 55 seconds on a 15–20 minute task. He
solved M1 correctly four times over, just retyping it. Then he never touched M2 or M3.

Round 1: 0/10, but his score is broken in a way nobody else's is. He attempted two questions. The
grader said `WRONG got 3 rows, expected 3` and `WRONG got 6 rows, expected 6`.

Read those again. The row counts match.

That is the known `round-1-cold/grade.py` bug. On a column or ordering mismatch it prints a
row-count line that names no fault. So his answers were close. And the output does not say what
was actually wrong.

Across both rounds he has never failed a question he attempted. He has also never attempted more
than two.

**Why it matters:** dropout that differs by arm would break the comparison. Watch him before 27 Sep.

---

## rishabh

**Verdict: the proof that Arm B is not a fair baseline.**

Round 2: 80 attempts over 47 minutes. Not one query parsed. Sixteen on M1, sixty-three on M2, one
on M3.

One cause throughout. He writes keywords without the space: `GroupBy`, `ORDERBY`, `havingcount`.

SQLite names the word *after* the broken keyword, never the keyword itself. His M2 errors show
what that did to him:

| error message | times |
|---|---|
| `near "highest"` | 37 |
| `near "Highest"` | 15 |
| `near "MAX"` | 7 |
| `near "price"` | 4 |

He was chasing the pointer. Each time the message named a new word, he rewrote that word. He
He changed the capital letters. He swapped `HAVING highest` for `HAVING MAX(price)`, then for
`HAVING price`. Across 63 tries he never touched `GROUPBY`.

Round 1: 0/10, and the same habit is already visible — `near "orderby"`. That was five days
earlier.

So: two rounds, 85-plus attempts, a real error message every single time. The habit was never
corrected. This is not someone failing to try. This is feedback failing to teach.

Three things follow for the study:

- He would be locked out by the gate. He is 3 of the 5 locked-out cases.
- Longest time spent, nothing usable produced. The two are not the same thing.
- Arm B gets only the bare error message. If that message can sustain 63 useless tries, Arm B is
  a broken control, not a neutral one.

**Why it matters:** part of any Arm A win would just be Arm A's message being readable. See
`../LEARNING-LOG.md` L7.

---

# Findings across all seven

## 1. Nothing measures time on task, and it varies 50 times over

manish spent 55 seconds. rishabh spent 47 minutes. Same three questions.

Both graders report attempts and solves. Neither reports how long anyone took. So this never
appeared in either results file.

The logs already store `started` and `finished`. Capturing it costs nothing.

**Why it matters:** if time on task differs by arm in the real study, it breaks the comparison.

## 2. Time spent does not predict useful data

nabin's 45 minutes gave the richest data in the set. rishabh's 47 minutes gave none. gaurav
produced a usable decision in under two minutes.

**Why it matters:** do not estimate how many decisions you will collect from how long sessions run.

## 3. The missing-space habit belongs to the group, not one person

rishabh wrote `GROUPBY`. ritesh wrote `ORDERBY`. Both did it in round 1 *and* round 2.

nabin and vikash hit a close cousin of it. They gave tables short names, `or` and `oi`, that SQL
already uses.

It is the most common fault in the dataset. SQLite points at the wrong word every time.

**Why it matters:** the hint writer should special-case it, and Arm B's bare message will keep failing on
it.

## 4. Five of seven never seriously tried the join

Four never ran a single query against M3. The two who tried both gave a table a short name that
SQL already uses for something else. Neither failed on the join itself.

**Why it matters:** an easier join will not help. This pool does not try joins at all.

## 5. The grader accepts SQL that Postgres would reject

anuj's accepted M2 answer filters on a plain column: `HAVING price > 10000`. nabin's filters on a
nickname he invented earlier in the same query: `HAVING highestPrice > 10000`.

Neither is standard SQL. Both happen to return matching rows in SQLite. Both were scored correct,
because the grader only compares result sets.

**Why it matters:** if the study scores the same way, it can mark something "learned" that was not
learned. Decide the scoring rule before 20 Sep.

## 6. Instant solves are the real volume problem

Four of seven solved M2 on the first try. Three of seven solved M1 on the first try. Those seven
cases produced nothing.

**Why it matters:** swapping out a few testers will not fix it. The difficulty is wrong.

---

# Open items this file raises

- **Re-grade manish's round 1** after fixing the `round-1-cold/grade.py` bug. His is the only
  score it demonstrably broke.
- **Log `finished - started`** in the study, and report it per arm.
- **Flag manish as a dropout risk.** Track his `completed_removal_test` specifically.
- **Decide the scoring rule.** Result-set match, or something stricter. See finding 5.
- **Write down the arm assignment.** Four of the seven were on your team before. They must be
  split across both arms. Which four is recorded nowhere in this folder.

**Why it matters:** items 1 and 5 change your data. Item 5 has to be settled before 20 Sep.
