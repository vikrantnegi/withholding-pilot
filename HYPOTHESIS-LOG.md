# Hypothesis & evidence log

> **In plain English, added 5 Oct 2026.** The hypothesis changed four times, each time because of
> evidence. It started as the Learning OS brief's own hypothesis, "size the help to the learner's
> skill" (30 Aug). It became "make them
> try first, then hint before answering, and they remember more" (19 Sep). The test on 30 Sep to
> 2 Oct showed both arms got 17 of 36 right on the first try, so it became v2: "making them try
> first changes what they do after a wrong answer, not what they recall" (4 Oct). The table under
> "The versions" has each step. The entries below it are as written on the day, never edited.

---
Per FAQ rule B4: "Keep the before and after; the diff is the deliverable."
You are expected to change the hypothesis. Append new entries. Never edit history.

**The entries below are append-only. This index is not** — it is navigation, kept current so a
reader does not have to reconstruct the story from three entries written out of order.

---

## Where the hypothesis stands today

> **v2, 4 Oct.** If the assistant **requires an attempt** before giving anything, and gives a
> **hint before the answer**, then learners **keep going after a wrong answer and fix it** more
> often than with an answer-giving baseline. It does **not** change what they get right on a
> first try.
>
> Proposed by the 30 Sep removal test, not supported by it: 3 learners per arm, and checks 1c and
> 3 failed. `RESULTS.md` has the numbers.

**The v1 claim, superseded 4 Oct.** Unaided performance 5–7 days after removal improves on the
practised sub-skills, and not on the one that was not.

Two things to notice in v1 against the 30 Aug statement. The independent variable is **withholding**,
not *adaptive* withholding: the competence estimator is cut, so nothing adapts per learner. And
the final clause is new — it is what makes a positive result attributable rather than merely
positive.

## The versions

In the order each change was **decided**. v0.2 comes before v0.1 because it was written down a
week late; the numbers follow the order they were logged.

| version | decided | the claim, in one line | what moved it |
|---|---|---|---|
| **v0** | 30 Aug | help sized to each learner's skill, picked by a skill estimate from four levels | given by the Learning OS brief, and submitted as the statement |
| **v0.2** | 7–10 Sep | one fixed rule for everyone: try first, then hint, then answer | a skill estimate cannot settle on 6 people; research showed "try first" does the work |
| **v0.1** | 13–14 Sep | one SQL topic, four sub-skills, one held back as a control | joins: 0 of 3 solved; only about 23 help decisions in the whole study |
| **v1** | 19 Sep | same claim, now with pass/fail thresholds so it can be proven wrong | the questions and the scoring rule were frozen |
| **v2** | 4 Oct | trying first changes what learners do after a mistake, not what they recall | first try: 17 of 36 in both arms; Arm A fixed 19 of 19 misses, Arm B 8 of 12 |

**The detail behind each row:**

- **v0.2:** four help levels became two, hint and answer. The skill estimator was cut. The gate
  was added. So the thing being tested moved from *adaptive* withholding to plain withholding.
  Evidence: Koedinger and Aleven on the assistance dilemma; the "don't help until they try" rule
  in Bastani's tutor prompt.
- **v0.1:** two topics became one, `GROUP BY` and `HAVING`. Each test question is paired with
  the practice question that taught its sub-skill. Evidence: `EXPERIMENT-LOG.md` Run 2;
  `LEARNING-LOG.md` L3, L4, L5.
- **v1:** no new mechanism. "Correct" narrowed from *right rows* to *right rows from correct
  grouping*. Practice is uneven, S1 x3, S2 x6, S3 x7, so a null result on S1 counts for less.
  Evidence: `ANALYSIS-PLAN.md` §4; `study-questions/DECISIONS.md`; `LEARNING-LOG.md` L15, L16.
- **v2:** v1 predicted no gap on the held-back skill, S4. The S4 gap came out largest, and all
  of it was questions Arm B never opened. Two pre-set checks failed, 1c and 3. Evidence:
  `RESULTS.md`; `evals/analyse-removal.py`.

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
| 4 | v0 | the question set sits at a difficulty where a floor and a ceiling both exist | **narrowed, still open** (v1). The three plain group-and-aggregate S1 items were cut, which removes the shape that produced the round-2 ceiling — M2, solved by 5 of 6 at a median of one attempt (`LEARNING-LOG.md` L6). Reduced by design, not measured. Check 3 on 28 Sep |
| 5 | v0.1 | S4 is not at the floor for everyone | **open.** If nobody can do it before or after, "flat on S4" proves nothing and the control is lost |
| 6 | v0.1 | ~5 practice items per sub-skill is enough repetition to move anything | **false as stated for S1** (v1). The frozen set is S1 x3, S2 x6, S3 x7. Holds as written for S2 and S3; S1 transfer is measured on thinner practice |
| 7 | v0.1 | sub-skills within one concept are separable enough to improve on S3 and not S4 | **open.** If they rise together, the design measures nothing new |
| 8 | v1 | scoring-rule clause 2 does not reclassify so many submissions that both arms hit the floor | **open.** Only the 28 references and 47 listed wrong models have been graded, no real learners. First evidence 21 Sep; if practice solve rates fall far below round 2's, clause 2 is the first suspect |

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

---

## v1: 19 Sep 2026 — the instrument exists, so the hypothesis becomes falsifiable

This is the entry owed since 14 Sep. v0.1 and v0.2 settled *what* is being claimed. Nothing
until now settled what result would count as the claim failing, because neither the thresholds
nor the question set existed. Both do now, so v1 states the hypothesis with the numbers that
can refute it.

**What arrived.** Two things, in this order.

`ANALYSIS-PLAN.md`, 14 Sep: the four cut-off numbers, derived from the moments arithmetic rather
than asserted, plus two checks in front of the original four — attrition (0a) and actual elapsed
gap per participant (0b). The original check 1 was replaced; it asked for a percentage of about
23 events across Arm A, which cannot be computed.

`study-questions/`, frozen 19 Sep: 28 items — 16 practice and 12 held-out — with a reference
query each, a hand-written fallback hint each, a pairing table, and a scoring rule that runs.

**The hypothesis, stated so it can fail.**

> If the assistant **requires an attempt** before giving anything, and gives a **hint before the
> answer**, then on the 26 Sep removal test Arm A outperforms Arm B on held-out items paired to
> **practised** sub-skills (S1, S2, S3), and the two arms do **not** differ on held-out items
> for the **unpractised** sub-skill (S4) — measured per person-question, graded by the frozen
> rule in `study-questions/grade_rule.py`, against the thresholds in `ANALYSIS-PLAN.md` §4.

The final clause is what makes a positive result attributable. A gap on S1–S3 *and* on S4 is not
support for the hypothesis; it is evidence of something acting on SQL performance generally.

**What the frozen instrument changed about the claim.**

1. **"Correct" is now a property of the query, not only of the rows.** Clause 2 of the scoring
   rule requires every non-aggregated column selected, or filtered on in `HAVING`, to appear in
   `GROUP BY`. A submission that returns the reference's rows through a wrong mental model grades
   `invalid`. This narrows "unaided performance" from *produced the right output* to *produced
   the right output by grouping correctly*, which is the construct the study is actually about.
   `LEARNING-LOG.md` L15 is why: without it, the seed data was doing half the grading.

2. **Practice is not evenly spread across the practised sub-skills.** The set is S1 x3, S2 x6,
   S3 x7. Three candidate S1 items (P01, P03, P06) were cut because round 2 showed that an item
   solved on the first attempt produces no ladder decision and therefore feeds neither arm. The
   cut was right for the moments budget and it skews the practice. **Transfer on S1 is measured
   against 3 practice items; transfer on S3 against 7.** A null result on S1 is therefore weaker
   evidence than a null result on S3, and must not be read as equally strong.

3. **Two pairs were re-pointed, before any result existed.** The cut orphaned pairs, so H01 now
   pairs with P05 (both count per group) and H03 with P04 (both one aggregate per group). Looser
   than the originals. Recorded here and in `DECISIONS.md` section 1 because a pair re-pointed
   *after* seeing results would be indefensible.

4. **Triage check 4b has a referent.** It said "the S4 held-out item", singular, where there are
   three (H10, H11, H12). It now reads: at least 2 of the 6 testers grade `correct` on at least
   one of the three, with no help available.

5. **One grader decides in-session and at analysis.** Until 19 Sep the app judged submissions by
   its own rule and disagreed with the scoring rule on the two shapes this study turns on.
   `LEARNING-LOG.md` L16. The arms are comparable by policy only if the thing that tells a
   learner "correct" is the thing that later counts them correct.

**Hypothesis after this change.** Unchanged in substance from the box above the versions table.
v1 adds no new mechanism. What it adds is a set of numbers that can refute it and an instrument
that produces them — which is the difference between a claim and a hypothesis.

**Which assumptions this moves:**

- **Assumption 4** (the set has both a floor and a ceiling) — **narrowed, still open.** Cutting
  the three plain group-and-aggregate S1 items removes the shape that produced the round-2
  ceiling (M2, solved by 5 of 6 at a median of one attempt). The ceiling risk is reduced by
  design rather than measured away. It is confirmed or refuted by check 3 on 28 Sep.
- **Assumption 6** (~5 practice items per sub-skill is enough repetition) — **now false as
  stated for S1.** S1 has 3. The assumption holds as written for S2 (6) and S3 (7).
- **Assumption 8, new:** clause 2 does not reclassify so many submissions that solve rates
  collapse and both arms hit the floor. Evidence so far is only that the 28 references pass and
  none of the 47 listed wrong models grades correct. Real learners were not part of that check.
  **First evidence arrives 21 Sep,** and if practice-session solve rates come in far below round
  2's, clause 2 is the first suspect.

**What is still not pre-committed, and is owed before 26 Sep.** Arm assignment. manish's round-1
grade is corrupted by the grader bug and has to be recomputed before matched pairs can be
formed, and the four former teammates must be split across arms. Doing this after any Arm A
data exists would be indefensible in the same way a re-pointed pair would be.

---

## Correction to v1, 19 Sep 2026 — the sub-skill definitions

v1 above, and every entry before it, referred to S1 to S4 as if one definition were in force.
Two were. `PRD-v1.md` §6 defined them on 10 Sep; `study-questions/items.py` was frozen on 19 Sep
against different ones, and S2 and S4 differ materially between the two. `LEARNING-LOG.md` L20
has the table.

**The instrument's definitions are the ones in force**, because they are what the items were
written to and what will be scored:

| | sub-skill | practised |
|---|---|---|
| S1 | group, and one aggregate per group | yes, 3 items |
| S2 | filter rows before grouping — `WHERE` with `GROUP BY` | yes, 6 items |
| S3 | filter groups after aggregating — `HAVING` | yes, 7 items |
| S4 | compose all three, with `ORDER BY` | no — the control, 3 held-out items |

**This does not change the hypothesis, and it does change what it claims.** The shape is
unaltered: improvement on practised sub-skills, flat on the unpractised one. What moved is what
S4 is. Under the old definition it was a fourth, separate skill. Under the frozen one it is the
composition of S2 and S3 — so "flat on S4" now means *they did not combine what they practised*,
which is a stronger and more interesting claim than *they did not learn a skill nobody taught*.

Assumption 7 in the index — that the sub-skills are separable enough to improve on S3 and not
S4 — is the assumption this bears on, and it is unchanged in substance. It is worth re-reading
under the new definition before 28 Sep: separability between S3 and a composition containing S3
is a different question from separability between two unrelated skills.

`PRD-v1.md` §6 item 4 was corrected the same day and quotes the superseded wording.

---

## v2: 4 Oct 2026 — the removal test ran, and the evidence moved the claim

**What arrived.** Seven removal logs, 30 Sep to 2 Oct. manish excluded (`ANALYSIS-PLAN.md` §5).
Full numbers in `RESULTS.md`, reproducible with `evals/analyse-removal.py`.

**What v1 predicted.** A gap between the arms on the practised sub-skills S1 to S3, and no gap on
S4, the unpractised composition.

**What came back.** Arm A 36 of 36 person-questions (3 learners x 12 questions), Arm B 25 of 36.
By sub-skill the gaps are S1 1, S2 1, S3 3, S4 6. The largest gap is on S4, the reverse of v1.

**Why the S4 gap does not mean transfer.** All 6 S4 points are blanks. rishabh and anuj never
opened H10 to H12, and S4 items sit last on the page. Item order and sub-skill are the same
variable, so stopping early lands on S4 first.

**The number that moved the claim.** First-attempt correct is 17 of 36 in both arms. The
difference is downstream of the first try:

| | Arm A | Arm B |
|---|---|---|
| questions opened | 36 of 36 | 29 of 36 |
| first-attempt misses recovered | 19 of 19 | 8 of 12 |

**Two pre-registered checks failed.** Check 1c: Arm B tried 0.83 times before pressing Help,
above the 0.5 limit, so the gate did not create a behaviour Arm B lacked. Check 3: Arm A scored
100%, above the 80% ceiling.

**What changes.**

> **v1:** withholding improves unaided performance on practised sub-skills, not on the
> unpractised one.
>
> **v2:** withholding may change what a learner does *after* a wrong answer — they keep going
> and fix it — rather than what they recall on a first try. In this pilot it did not change
> first-try recall at all.

v2 is a narrower and different mechanism. v1 was about retrieval strength. v2 is about
persistence and error recovery. The 14 Sep plan predicted the attempt-rate half of it
(`ANALYSIS-PLAN.md` §5: "Arm A attempts more of the held-out items than Arm B") and said it is
not evidence for v1. It is evidence for v2.

**What v2 is not.** It is not supported either. Three learners per arm, a failed manipulation
check, a failed ceiling check, and one Arm A learner (gaurav) who never pressed Help in practice
yet scored 12. v2 is the hypothesis this pilot hands to the next study.

**The assumptions, updated.**

| # | assumption | state after the removal test |
|---|---|---|
| 3 | withholding does not cost motivation | **no sign of cost.** Every survey answer given was 4 or 5, in both arms; gaurav and rishabh skipped it. anuj answered 5, 5, 5 at 4 of 12 correct |
| 4 | a floor and a ceiling both exist | **false at the top.** Arm A hit 100% |
| 5 | S4 is not at the floor for everyone | **true.** 4 of 6 solved at least one S4 item |
| 7 | the sub-skills are separable | **untested.** The order confound hides it |

**What the next study changes, in order of value.**

1. **Randomise item order per learner.** Otherwise stopping early always looks like an S4 effect.
2. **Harder held-out items, or more of them.** Arm A needs headroom above 80%.
3. **Make first-attempt correct the primary score.** It is the measure v2 says the policy does
   not move, so it is the one that can falsify v2.
4. **Log every Help press as treatment received.** Report per-protocol beside intention-to-treat.
