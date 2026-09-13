# CLAUDE.md — working agreements for this folder

Read `README.md` first for what this project is, and `STATUS.md` for where it stands.
**Do not duplicate status information here.** This file used to carry its own "current status"
section and it went stale within days; `STATUS.md` is now the only place the present is recorded.

Project: 100x Engineers Cohort 7 final capstone. Learning OS, assisted independence. Solo.
Statement submitted 30 Aug 2026 and binding. Hard submission 7 Oct 2026.

---

## How to work with Vikrant

- Senior peer. React Native dev, ~10 years, Associate Technical Lead. Direct, no cheerleading.
- First principles: explain the mechanism before the recipe. Name the tradeoffs.
- Push back on weak assumptions. Offer the simpler path when he is overcomplicating.
- When he sketches an answer, affirm what is right, then challenge the weak part.

## Scope discipline

- Check every new idea against `PRD-v1.md` §7 (the cut list) and the current checkpoint window.
  If it threatens 7 Oct, say so.
- Prefer boring and shippable over interesting. Solo, with weeks not months, means ruthless scope.
- **Check `CAPSTONE-RULES.md` before every checkpoint.** If a plan conflicts with a rule there,
  the rule wins. §E is the graded rubric.

## Non-negotiables

- **Append to `HYPOTHESIS-LOG.md` whenever evidence changes the design.** FAQ rule B4: keep the
  before and the after, the diff is the deliverable. Changing the hypothesis is expected, not a
  failure.
- **Append to `EXPERIMENT-LOG.md` after every run** and to `LEARNING-LOG.md` whenever an
  assumption breaks. Both are append-only — never edit an entry, add a new one that supersedes it.
- **One directory per data round, owned by that round's grader.** Never keep a second copy of the
  same logs; it caused a silent n=6 grading run on 13 Sep (`LEARNING-LOG.md` L8).
- **Arm B must stay clean.** The 8–14 Sep screening rounds were the calibration pilot, not Arm B.
- Once code exists: `git init`, commit small and often. There is no repository yet.
- Both screening rounds' questions are burned. The study must not reuse them, and needs a
  different schema as well.

## Two traps this project has already fallen into

- **Wrong unit of analysis.** Four of the nine entries in `LEARNING-LOG.md` are the same mistake:
  a real quantity measured at the wrong grain. Rates here belong per _person-question_, not per
  person and not per question. Check the grain of any number before acting on it.
- **A control condition is a design choice, not an absence of one.** Arm B's "bare error message"
  has its own quality, and if it is bad in a way Arm A happens to fix, part of the measured effect
  is that fix (`LEARNING-LOG.md` L7).

## Readability contract

Applies to every response, artifact, file, and code comment.

- One idea per sentence. Max ~20 words. No sentence with two
  subordinate clauses.
- Concrete example FIRST, then the general rule. Never the reverse.
- Define any term the first time it appears, in the same sentence.
- Lead with the answer. Reasoning after, not before.
- Bullets max 2 lines each. If longer, it's a paragraph, write it as one.
- Plain words over precise-but-rare ones. "Use" not "leverage",
  "so" not "consequently".
- No sentence that needs re-reading. Before sending, re-read your
  own output and rewrite anything you'd have to read twice.
- End any section over 5 lines with a one-line "so what".

Self-check before responding: count sentences over 20 words.
If any exist, rewrite them.
