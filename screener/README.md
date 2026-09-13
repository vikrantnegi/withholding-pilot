# Screener — two rounds of participant screening

**Two rounds were run with the same 7 people.** They are not a first attempt and a retry. They
measured different things, and only one produced trustworthy pass-or-fail data.

- Per-person profiles, both rounds: `TESTER-PROFILES.md`
- Full write-up of both rounds: `../EXPERIMENT-LOG.md`

---

## The two rounds

| | `round-1-cold/` | `round-2-runbutton/` |
|---|---|---|
| Built | 7 Sep 2026 | 10 Sep 2026 |
| Graded | 10 Sep 2026 | 13 Sep 2026 |
| Questions | 10, across 5 difficulty tiers | 3 |
| Environment | **No database, no Run button.** Write SQL blind | **A real database in the page, plus a Run button** |
| Sent as | a text brief, answers pasted back | one self-contained HTML file |
| Graded by | `round-1-cold/grade.py` | `round-2-runbutton/grade-logs.py` |
| Results | `round-1-cold/RESULTS-10SEP.txt` | `round-2-runbutton/RESULTS-13SEP.txt` |

Both rounds used the same schema, `round-1-cold/schema.sql`. Round 2 has it built into
`round-2-runbutton/sql-mini-screen.html`. So there is deliberately no second copy of the file.

**Why it matters:** the only real difference between the rounds is the Run button. That is what
makes round 1's scores untrustworthy.

---

## Which data to trust, and for what

### Round 1 — trust who tried what, not the scores

It measured writing SQL cold, which is not what the study asks anyone to do. Almost every failure
was a slip that one run would have caught.

Gaurav scored 0 out of 10 with all four answers conceptually right.

**Nobody was excluded on a round-1 score, and nobody should be.**

What is trustworthy: who attempted which tier. That does not depend on having an editor. It is what
ruled out the two hardest tiers as study topics.

### Round 2 — trust it, but count at the right level

The grader reports per person: "1 of 7 locked out". That is not the level that produces study data.

Counted per person-question, it is 3 usable moments out of 21.

**Why it matters:** read `../LEARNING-LOG.md` L3 before quoting any rate from this round.

### Both rounds' questions are now burned

The study must not reuse them. It needs a different schema as well.

---

## Layout, and the one rule that matters

Each round folder holds everything for that round. The test, the answer key, the grader, the
grader's input folder, and the results.

Same shape both times.

**One input folder per round, owned by that round's grader, and it is the only copy.**

- `round-1-cold/submissions/` — one `.sql` per person, read by `round-1-cold/grade.py`
- `round-2-runbutton/logs/` — one `.json` per person, read by `round-2-runbutton/grade-logs.py`

A second copy of the round-2 logs existed until 13 Sep. One returned log landed in it and never
reached `logs/`. So a grading run would quietly have scored 6 of 7. The one it dropped was the only
person round 1 had marked usable.

**Why it matters:** do not make a second copy. Reasoning in `../LEARNING-LOG.md` L8.

## How to run either grader

    python3 round-1-cold/grade.py
    python3 round-2-runbutton/grade-logs.py

Both graders find their files relative to their own location. So a round folder can be moved whole
without editing code.

Each round's own README covers three things. Why that test was built the way it was. What feedback
it gives. How to read its output.
