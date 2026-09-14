# Hypothesis & evidence log
Per FAQ rule B4: "Keep the before and after; the diff is the deliverable."
You are expected to change the hypothesis. Append new entries. Never edit history.

**The entries below are append-only. This index is not** — it is navigation, kept current so a
reader does not have to reconstruct the story from three entries written out of order.

---

## Where the hypothesis stands today

> If the assistant **requires an attempt** before giving anything, and gives a **hint before the
> answer**, then unaided performance 5–7 days after removal improves against an answer-giving
> baseline — **on the sub-skills that were practised, and not on the one that was not.**

Two things to notice against the 30 Aug statement. The independent variable is **withholding**,
not *adaptive* withholding: the competence estimator is cut, so nothing adapts per learner. And
the final clause is new — it is what makes a positive result attributable rather than merely
positive.

## The versions

Ordered by **when the change was decided**, which is not the order the entries were written.
v0.2 describes an earlier change than v0.1 because it was logged a week late.

| version | decided | logged | what changed | why | evidence |
|---|---|---|---|---|---|
| **v0** | 30 Aug | 30 Aug | the submitted statement: adaptive help, four levels chosen by a competence estimate | — | Bastani et al. (PNAS 2025), Kestin et al., Wu et al. |
| **v0.2** | 7–10 Sep | **14 Sep, late** | four levels → two (hint, reveal); competence estimator cut; **the gate added**. The independent variable moves from adaptive withholding to withholding | an estimator cannot converge at n=6 over a short set; with a gate in front, the nudge is redundant; the gate is what actually implements retrieval | Koedinger & Aleven on the assistance dilemma; Bastani's GPT Tutor prompt in the SI appendix |
| **v0.1** | 13–14 Sep | 13–14 Sep | two concepts → **one** (GROUP BY/HAVING), with four sub-skills: three practised, one held back as a within-person control. Held-out items hand-paired to practice items by sub-skill | T3 is dead (3 of 7 tried with an editor, 0 solved); the moments arithmetic does not close at four cells; questions cannot be screened without burning participants | `EXPERIMENT-LOG.md` Run 2; `LEARNING-LOG.md` L3, L4, L5 |

**Why v0.2 is late and says so:** three design changes went into `PRD-v1.md` and none reached
this file for a week. Caught by a reader, not by the process. `LEARNING-LOG.md` L14 has the
lesson and the fix — a rule with no trigger is a hope, so `EXPERIMENT-LOG.md`'s append template
now ends by asking whether the hypothesis moved.

## The untested assumptions, and where each stands

| # | from | assumption | state |
|---|---|---|---|
| 1 | v0 | a competence estimate can be inferred fast enough from a few queries to be useful | **abandoned, not tested** — the estimator was cut before it could be (v0.2). Stays as a roadmap claim |
| 2 | v0 | four levels is the right granularity; two might do | **resolved: two** (v0.2) |
| 3 | v0 | withholding does not cost so much motivation that learners quit mid-study | **open.** Counter-metrics on 27 Sep, `PRD-v1.md` §10. Wu's motivation cost lands on Arm B at removal, not Arm A |
| 4 | v0 | the question set sits at a difficulty where a floor and a ceiling both exist | **open, and now the top risk.** Round 2 found a ceiling — M2 was solved by 5 of 6 at a median of one attempt (`LEARNING-LOG.md` L6) |
| 5 | v0.1 | S4 is not at the floor for everyone | **open.** If nobody can do it before or after, "flat on S4" proves nothing and the control is lost |
| 6 | v0.1 | ~5 practice items per sub-skill is enough repetition to move anything | **open** |
| 7 | v0.1 | sub-skills within one concept are separable enough to improve on S3 and not S4 | **open.** If they rise together, the design measures nothing new |

---

## v0: 30 Aug 2026 (statement submitted)

**Hypothesis.** If the assistant sets how much it gives from what the learner can already do
without it, then unaided performance after removal improves against an answer-giving baseline,
without today's task completion collapsing.

**Mechanism assumed.** Help withheld at the edge of current ability forces retrieval instead of
reading. Retrieval is what makes a skill available later.

**Design implied.** A per-learner, per-concept competence estimate selects one of four response
levels: nudge → structured hint → partial scaffold → full answer.

**Evidence behind it.** Bastani et al. (PNAS 2025); Kestin et al. (Sci Rep 2025); Wu et al.
(Sci Rep 2025) on motivation cost.

**Untested assumptions, in the order they are likely to break:**
1. That a competence estimate can be inferred fast enough from a few queries to be useful.
2. That four levels is the right granularity. Two might do.
3. That withholding does not cost so much motivation that learners quit mid-study.
4. That the question set sits at a difficulty where a floor and a ceiling both exist.

---

## v0.1: 13–14 Sep 2026 — scope cut to one concept, with paired sub-skills

**What arrived.** Round 2 (`EXPERIMENT-LOG.md` Run 2), and the counting error it exposed
(`LEARNING-LOG.md` L3, L4, L5).

Three findings, in the order they bite:

1. **T3 is dead.** Two-table joins: three of seven tried it with a Run button in front of
   them, none solved it. It was chosen on round 1's pass-rate table, from an instrument L1
   had already retired. T1 was out earlier — on a one-line query a hint and the answer are
   the same string. **T2, GROUP BY/HAVING, is the only surviving concept.**
2. **The moments arithmetic does not close at four cells.** A "moment to act on" needs the
   learner to try, the query to run, and the answer to be wrong. Measured rate: 0.14 per
   person-question, rising to ~0.48 once a syntax error satisfies the gate. Over 48
   person-questions that is ~23 moments. Across 2 concepts × 2 levels = 4 cells, that is ~6
   each against a budget of 12. Across 2 cells it is ~11.
3. **Questions cannot be screened.** Yield is about 1 usable in 3 written, and screening
   needs people — the same seven who are the study's participants. Authoring a second
   concept would mean inventing it blind, which is exactly how T3 died.

**What changed.**

**Scope: one concept, not two.** `PRD-v1.md` §6 item 4 and `TODO-HYPOTHESIS-v1.md` §3 both
said two. They now say one: GROUP BY/HAVING.

**But the attribution argument is kept, by pairing sub-skills instead of concepts.** Two
concepts were never wanted for their own sake; they were wanted so that a rival explanation
could be ruled out. Without a contrast, "Arm A scored higher" is indistinguishable from "Arm
A got more comfortable with the editor and with being tested".

GROUP BY/HAVING contains separable sub-skills:

| | sub-skill | how it fails in the 104 logged attempts |
|---|---|---|
| S1 | group by the right column | grouped by the wrong thing, or not at all |
| S2 | choose the right aggregate | `COUNT` where `MAX` was needed |
| S3 | filter groups, not rows | `WHERE` instead of `HAVING` — the modal failure |
| S4 | order by an aggregate | sorted by something not in the output |

**Practice covers S1, S2, S3. S4 is deliberately never practised.** The held-out set on
27 Sep tests all four. Each held-out item is hand-paired to the practice item teaching its
sub-skill — the σ(p) mapping from Bastani's SI appendix, at sub-skill grain instead of
concept grain.

**Hypothesis, restated in its testable form.** If the assistant requires an attempt and then
gives a hint before the answer, then 5–7 days after removal the learner performs better on
held-out items testing the sub-skills they practised — **and not on the sub-skill they did
not** — against an answer-giving baseline.

The second clause is the new part. It is what makes the result attributable rather than
merely positive.

**What this costs.** Transfer across a conceptual boundary — "practised grouping, improved at
joins" — is no longer claimable. At three per arm it never was; `PRD-v1.md` §2 had already
narrowed the claim for the same reason.

**New untested assumptions:**
5. That S4 is not at the floor for everyone. If nobody can do it before or after, "flat on
   S4" proves nothing and the contrast is lost. Round 1 and round 2 data should inform which
   sub-skill is held back.
6. That ~5 practice items per sub-skill is enough repetition to move anything.
7. That sub-skills within one concept are separable enough for a learner to improve on S3 and
   not on S4. If they rise together, the design measures nothing it did not already measure.

**Assumption 2 from v0 is now settled**: two levels, hint and reveal. Assumption 1 is moot —
the competence estimator is cut (`PRD-v1.md` §7).

**Still owed.** This is *not* the v1 entry `TODO-HYPOTHESIS-v1.md` describes. That one is
blocked on the four null-result thresholds in its §4, which remain blank and must be filled
before any Arm B data exists.

---

## v0.2: written 14 Sep 2026, recording a change made 7–10 Sep that was never logged

**This entry is late.** The change it describes was decided around 7 Sep while reading the
research papers, and built into `PRD-v1.md` on 10 Sep. It should have been written then.
Caught on 14 Sep by Vikrant, reading v0 against the code and noticing the hypothesis no
longer described the system. It is appended here rather than slotted in, because this file
is append-only and a late entry that pretends to be on time is worse than one that admits
the delay.

**What evidence arrived.** Koedinger & Aleven on the assistance dilemma; Bastani et al.'s
GPT Tutor system prompt in the SI appendix; the arithmetic in `TODO-HYPOTHESIS-v1.md` §3.

**What changed — the independent variable itself.**

v0 said: *"If the assistant sets how much it gives from what the learner can already do
without it…"* That sentence is about **adaptivity**. The competence estimator was the thing
being tested.

The competence estimator is cut (`PRD-v1.md` §7). It needs many observations per skill to
converge, and at n=6 over a short question set it is noise dressed as a model. With it goes
every per-learner adaptation: N is fixed, the ladder is identical for everyone.

**So the independent variable moved from *adaptive* withholding to *withholding*.** That is
not a refinement of v0. It is a different claim, and v0's sentence no longer describes the
system that was built.

**Three specific changes:**

1. **Four levels → two.** Nudge and partial scaffold cut. With a gate in front, the nudge is
   redundant — the gate already forces the unaided attempt. Partial scaffold gives away too
   much for the storage strength it buys.
2. **The gate was added. It is not in v0 at all.** No help of any kind until one countable
   attempt exists for that item. Taken from Bastani's GPT Tutor prompt: *"Do not provide them
   with help until they have provided this."* It is the rule that actually implements
   retrieval, and by `PRD-v1.md` §4 it is half the treatment.
3. **N is fixed, not adaptive.** At three per arm, a varying N tests two variables at once
   and neither can be attributed.

**Hypothesis after this change.** If the assistant requires an attempt before giving anything,
and gives a hint before the answer, then unaided performance 5–7 days after removal improves
against an answer-giving baseline.

**The treatment is a package, not a variable.** Arm A differs from Arm B in two ways at once:
the gate, and the content of first help. Three per arm cannot separate them; a third arm
(gate + full answers) would be needed and is not affordable. Both changes serve one mechanism
— forcing generation rather than reading — so this is one construct implemented two ways, not
two variables carelessly mixed. A positive result supports the policy as a whole and does not
establish that the gate specifically, or the hint specifically, is what worked.

**Which v0 assumptions this settles:**
- Assumption 1 (a competence estimate can be inferred fast enough to be useful) — **abandoned,
  not tested.** The estimator was cut before it could be. It stays as a roadmap claim.
- Assumption 2 (four levels is the right granularity; two might do) — **resolved: two.**

**The process failure worth naming.** Three design changes of this size went into `PRD-v1.md`
and none reached this file for a week. A hypothesis log that is updated only when someone
happens to re-read it is not a log. The rule in `CLAUDE.md` — append whenever evidence changes
the design — was in place and was not followed; what was missing is that nothing forces the
check. Every future entry in `EXPERIMENT-LOG.md` should end by asking whether the hypothesis
moved.

---

## Append below: date, what evidence arrived, what it changed
