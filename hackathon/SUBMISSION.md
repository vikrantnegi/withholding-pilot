# First Action Hackathon — submission

**Track:** Learning OS · **Entrant:** Vikrant Negi (solo) · **Capstone:** SQL tutor,
withholding vs answer-giving help policy

Artefacts 5, 6, 7 and 8 are produced this weekend and live in `evidence/`. Artefacts
1, 2, 3, 4, 9 and 10 are below, and rest on two rounds of screening run before kickoff —
prior capstone data, not the first action. The first action is the hand-written
correction card in artefact 7.

---

## 1 — Observation

Working developers who can identify the correct SQL operation cannot produce a working
query without an execution loop, and every tool in the path measures them as if they
could not reason at all.

I ran the same 7 non-cohort working developers through two rounds on the same schema.
**Round 1** asked for SQL written cold — no database, no Run button, no error messages.
Six of seven scored 0 or 1 out of 10. **Round 2** gave them a real SQLite engine in the
page, three questions at the same difficulty tier, and a Run button. Five of the six who
returned it solved a question they had been graded 0 on, most of them on the first
attempt.

Nothing about the people changed between the two rounds. What changed was whether the
database was allowed to answer them. The competence was there in round 1 and was
invisible: re-running Gaurav's round-1 answers shows all four were the correct query,
every one lost to the same repeated habit of quoting `ASC`/`DESC`.

The break is not knowledge. It is that the distance between intent and a query that runs
is closed by feedback, and the feedback my tools emit is not usable. Rishabh ran 81
queries in 47 minutes, received 80 error messages, and reached the database zero times —
the same string, `near "highest": syntax error`, 37 times in a row.

## 2 — Impact metric

**All 6 round-2 returners scored ≤1/10 on the cold test. 5 of 6 then solved a same-tier
question with a Run button, at a median of 1 attempt.**

| person | round 1, cold | round 2, M1 | round 2, M2 |
|---|---|---|---|
| anuj | 0/10 | solved in 1 | solved in 1 |
| gaurav | 0/10 | solved in 3 | solved in 1 |
| manish | 0/10 | solved in 1 | not attempted |
| ritesh | 0/10 | solved in 1 | solved in 8 |
| vikash | 1/10 | solved in 4 | solved in 1 |
| **rishabh** | **0/10** | **16 tries, no** | **63 tries, no** |

Supporting number, round 1: **26 of 35 attempts (74.3%) never reached the database**; 3 of
7 learners produced zero executing queries across all ten questions.

- Attempt = a non-blank query submitted. Executed = returns a result set against
  `schema.sql` rather than raising.
- Round 2 attempts counted to *first correct* from the event stream, not total attempts.
- Method and both rounds reproduced by `evidence/rounds-compare.py`, which reads the raw
  `.sql` submissions and the raw browser logs. Output matches the project's own
  `grade-logs.py`.

**Why this pair of numbers.** A score measures the learner. These measure whether the
system ever had anything to respond to — and whether the measurement instrument was
reading the learner or reading the absence of a Run button.

## 3 — Hypothesis

If the assistant withholds the answer until the learner has attempted, and gives a hint
before an answer, then unaided performance 5–7 days after the assistant is removed
improves against an answer-giving baseline.

**Mechanism.** Effortful retrieval builds storage strength faster per unit of help given.
Both conditions raise retrieval strength and storage strength; withholding raises storage
strength more per unit of help.

**Falsification condition.** Dead if, on the held-out removal test 5–7 days after
practice, the withholding arm scores at or below the answer-giving arm. Stated preference
is explicitly **not** a falsifier — the literature predicts the withholding arm will
report the tool was worse while scoring higher. Revealed behaviour (unfinished session,
no-show at the removal test) **is** a falsifier.

**A prior assumption already died this week.** The design assumed a learner who asks for
help has made an attempt the system can see. Rishabh's log falsifies that. See §10.

## 4 — Two named users

Chosen as the two poles of the observation, not as the two best stories.

| | **Gaurav** | **Rishabh** |
|---|---|---|
| who | working developer, non-cohort (TTN) | working developer, non-cohort (TTN) |
| round 1 cold | 0/10 — and all 4 attempted were the correct query | 0/10 |
| round 2 | solved M1 in 3, M2 in 1 | 81 runs, 80 errors, **0 reached the database** |
| time on task, round 2 | ~2 min | **47 min** |
| what he shows | the cold test measured the wrong thing | the help policy locks out the person trying hardest |
| contact | *(fill: number / channel)* | *(fill: number / channel)* |

Both are non-cohort (CAPSTONE-RULES A1) and both submitted real work in both rounds,
which is the input the manual output is built from.

## 9 — Process map

What I did by hand this weekend, marked **D** deterministic · **P** judgment ·
**H** human-dependent.

| # | step | | automatable? |
|---|---|---|---|
| 1 | receive the learner's submitted SQL / event log | **H** | no — this is the learner |
| 2 | execute each query against the schema | **D** | yes — built (mini-screen runner) |
| 3 | compare result set to reference | **D** | yes — built (`grade.py`, `grade-logs.py`) |
| 4 | check the query text actually changed since the last run | **D** | **yes — not yet built, see §10** |
| 5 | classify the failure: form, logic, data literal, or wrong-language | **P** | yes, LLM grounded on the diff |
| 6 | **spot that the same failure repeats across attempts** | **P** | **no — see §10** |
| 7 | decide how much to give: name the habit, or show the fix | **D** | yes — the level selector, the graded artefact |
| 8 | write the correction in prose about *this* learner's error | **P** | yes — the hint writer |
| 9 | check the correction doesn't hand over the answer | **D** | yes — the leak guard |
| 10 | learner reads it and reacts | **H** | no — this is the outcome |

**The claim this map makes:** every D box stays in plain code, and no P box ever decides
*whether* or *how much* to help — step 7 is deterministic on purpose. The LLM renders
step 8 after the decision is made. If judgment sat in step 7, the treatment would vary
unpredictably between learners and I could not state what the withholding arm received,
which is the one thing the experiment depends on.

## 10 — Failure analysis

**The manual process broke at step 6: the finding that matters is a cross-attempt
pattern, and the system I specified is architecturally blind to it.**

The sentence doing the work in Gaurav's card is *"this is the same mistake, four times."*
In Rishabh's it is *"you ran the identical query five times and the message never
changed."* Both required holding the whole attempt history at once. The hint writer in
PRD-v1 §3 is grounded on a **single** attempt — reference query, learner query, result
diff — so it can say "`ASC` shouldn't be quoted" four separate times and can never say
"you have a habit." Step 6 is a step I performed and the product cannot.

**Two consequences, both now decided.**

1. **A syntax error must satisfy the gate.** The gate serves no help until one attempt
   *executes*. Rishabh produced 80 non-executing attempts over 47 minutes and would have
   received nothing, logged as "did not engage." One of six locked out by syntax rather
   than by concept is one too many when the locked-out learner is the one most visibly
   stuck.
2. **And the gate needs a clause the PRD does not have: the query text must have
   changed.** Rishabh pressed Run five times on a byte-identical query. Under fix (1)
   alone, the tool would start talking on his second press instead of his sixteenth —
   which replaces a learner who gets no help with a learner who is never allowed to
   think. Attempt counting in PRD-v1 §4 tests whether the *result set* differs; on a
   query that never executes there is no result set to differ, so the rule does not fire
   at all.

**The honest limit.** Neither failure was found by thinking about the design. Both were
found by reading one user's raw log line by line, which is a thing that does not scale
and which I had not done once in the eight days since building the screener.

---

## Folder to upload

```
Vikrant_FirstAction/
  SUBMISSION.md                     <- this file (artefacts 1,2,3,4,9,10)
  evidence/
    05-contact-gaurav.png           <- WhatsApp screenshot, timestamp visible
    05-contact-rishabh.png
    06-interview-gaurav.md          <- completed log sheet
    06-interview-rishabh.md
    07-card-gaurav.md               <- the manual output, as sent
    07-card-rishabh.md
    07-card-ritesh.md               <- third card, not interviewed
    08-reactions.md                 <- one verbatim quote per user
    rounds-compare.py               <- reproduces every number in §2
    submissions/                    <- round 1, their original .sql, unedited
    mini-screen-submission/         <- round 2, raw browser event logs
    schema.sql
```

Upload to tally.so/r/ZjMdav. Latest upload is the one evaluated — upload an incomplete
version at tonight's 22:00 midpoint check-in and overwrite it tomorrow.
