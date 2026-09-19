# Analysis plan

**What this is.** The measurement decisions that must be fixed before any study data exists.
Four came from the Bastani appendix, read 2 Sep 2026. The rest were added 14 Sep 2026.

**Status: LIVE.** This is not a task. The 28 Sep write-up reads this file and follows it.

**Renamed 14 Sep.** It was TODO-HYPOTHESIS-v1.md, now deleted. That name said "task" when the content is a
plan. The "v1" suggested a hypothesis version. It is neither.

**The rule this file exists to enforce.** Pick every number below now. Pick it while you still do
not know which way it will fall. On 28 Sep any threshold you invent is contaminated, because by
then you know what each one lets you conclude.

**FINAL as of 14 Sep 2026.** Vikrant reviewed every threshold against the arithmetic below and
accepted all of them. No study data exists yet. Any change made after data exists goes in as a
dated entry below, with its reason. Never edit one in silently.

**Why it matters:** without these numbers fixed in advance, a null result on 28 Sep cannot be
read. You will not be able to tell "my policy is wrong" from "my logger was broken". You will be
blamed for the second.

---

## Glossary

Every term and number used below.

| term | what it means |
|---|---|
| Arm A | The withholding arm. 3 learners. Must attempt before any help. Gets a hint before an answer. |
| Arm B | The answer-giving baseline. 3 learners. Same app, one config flag. Help returns the full answer, no attempt needed. |
| the gate | The rule that refuses all help until one attempt is logged for that item. Arm A only. |
| HINT, REVEAL | The two help levels. HINT is served first. REVEAL follows after N more attempts. |
| N | Attempts required after a hint before REVEAL. Fixed at 2. Identical for every learner. |
| person-question | One learner working on one question. Arm A's practice budget is 48 person-questions (3 learners x 16 practice items). |
| moment to act on | A person-question where the learner tried, the query ran or errored, and the result was wrong. Only these produce a policy decision. |
| S1-S4 | The four sub-skills of GROUP BY/HAVING. S1, S2 and S3 are practised. S4 is held back as the control. See `PRD-v1.md` section 6 item 4. |
| held-out item | A question never shown during practice. Each is hand-paired to the practice item teaching its sub-skill. |
| removal test | 27 Sep. No assistant of any kind, for either arm. |
| unaided | First executing attempt correct, with no help served on that item. |
| `help_decided` | The log entry written the instant the policy decides. Carries `action`, `counted`, `sinceHelp`. |

**Two numbers to hold on to.** The measured rate of moments to act on is 0.14 per
person-question. It rises to about 0.48 once a syntax error satisfies the gate, which was
decided on 13 Sep. Across Arm A's 48 person-questions that is about 23 moments.

**Why it matters:** the whole study runs on about 23 events. Every threshold below is sized
against that number, not against 48.

---

## The arithmetic every threshold is sized against

The held-out set is planned at **12 questions** — four sub-skills, three items each. Three
learners per arm. So each arm produces **36 person-questions** on the removal test.

That gives one conversion. Every threshold below is that conversion in disguise.

```
1 question  =  1/36  =  2.8 percentage points of arm average
```

**The effect being looked for is under two questions.** Bastani's guardrailed tutor beat his
answer-giving arm by about 0.05 on a 0 to 1 scale. That is 5 percentage points. On 36
person-questions that is **1.8 questions**. He needed 839 students to see it.

**Convert any threshold into questions before arguing with it.** A percentage hides how small
these counts are.

**If the held-out set is not 12**, re-derive check 3 and the gap clause in check 2. Both are
sized against headroom, and headroom depends on the count. Record the final count here at
question-set freeze.

**Why it matters:** every threshold below exists to protect 1.8 questions of signal. A floor, a
ceiling, or a single dropout each cost more than that.

---

## 1. Count questions, not people

Bastani analysed one dataset two ways. One row per student gave 2,848 rows. One row per
student-per-question gave 11,392 rows. Four times the data, from the same study.

Each of your arms holds 3 learners. An average over 3 people is mostly a fact about who you
recruited, not about the policy.

**Decided.** The primary analysis is item-level, with standard errors clustered by learner. The
arm-average gap is secondary. Report its direction only. Never report a p-value at 3 per arm.

"Clustered by learner" means the maths knows that 16 rows from one person are not 16 independent
facts.

**Why it matters:** at 3 per arm, an arm-average comparison would report "no effect" about a
third of the time. That holds even for a policy that works perfectly. It is a coin flip about who
you recruited, dressed up as a finding.

---

## 2. Pair every held-out item to the practice item that taught it

Bastani hand-wrote this map for every exam question in his study.

Without the map, a failure has three possible causes. The learner never practised it. The
question was harder. The assistant gave bad help. You cannot tell them apart.

**Decided, and already built into the design.** See `PRD-v1.md` section 6 item 4. The pairing is
at sub-skill grain, not concept grain. Each held-out item names the sub-skill it tests and the
practice item that taught that sub-skill.

**Why it matters:** this is what lets the write-up say the gain was skill-specific. Without it,
"Arm A scored higher" cannot be told apart from "Arm A got comfortable with the editor".

---

## 3. Levels and concepts multiply, they do not add

Every extra help level and every extra concept splits the same fixed budget of moments.

| design | cells | moments per cell, against 23 |
|---|---|---|
| 4 levels x 8 concepts | 32 | under 1 |
| 4 levels x 2 concepts | 8 | about 3 |
| 2 levels x 1 concept | 2 | about 11 |

Cutting levels alone buys nothing if the concept count stays high. They multiply.

**Decided.** One concept, two levels. This drove both scope cuts. See `HYPOTHESIS-LOG.md` v0.2
and v0.1.

**Correction to the 2 Sep version of this section.** It budgeted 48, not 23. It counted questions
asked rather than moments to act on. A question solved first try produces nothing. So does one
never run. See `LEARNING-LOG.md` L5.

**Why it matters:** the original arithmetic was optimistic by about seven times. It is also the
arithmetic that justified both scope cuts. The cuts were still right. The number behind them was
not.

---

## 4. The checklist for a null result

On 28 Sep you will have one number. Suppose it says the two arms did not differ. That has two
meanings, and they look identical:

- **The policy does not work.** A real finding. Publishable.
- **The study did not run properly.** Not a finding at all. Broken machinery.

**Think of a red CI build.** Red does not mean the feature is broken. First you check whether it
compiled. Then whether the test suite loaded. Then whether the right tests were selected. Only
when all that is clean do you blame the code.

This is that checklist, for the experiment. Run the checks in order. Stop at the first failure.

Checks 0a through 4 are **measurement** failures. Only check 5 is a **hypothesis** failure. They
produce the same final number and they mean opposite things.

**Why it matters:** a measurement failure reported as a hypothesis failure is a false finding
published under your name. The order of these checks is what stops that.

### 0a. Attrition — is the surviving sample still comparable?

Report `completed_removal_test` per person, by arm, next to every score. Always.

| what happened | verdict |
|---|---|
| Both arms complete 3 of 3 | Pass |
| One arm loses 1 person | Pass **only** with a published worst-case bound |
| Any arm loses 2 or more | **Fail.** That arm is now 1 person. No comparison exists |

The worst-case bound: put every no-show back in, scored at zero, and recompute. If the direction
flips under the bound, the bound is the result you report.

**Why it matters:** attrition is caused by the treatment, and it removes the frustrated and the
weak. Those are exactly the people who would have lowered Arm A's average. The bias always points
toward the hypothesis, so it is the one error a reader will assume you made.

### 0b. Elapsed gap — was the delay long enough for the effect to exist?

Log the actual practice-to-test gap per participant, in days. Not the planned gap.

- Any participant under 5 days: that person's data is a measurement failure. Exclude it and
  report the exclusion.
- If exclusions leave either arm below 2 people: **fail**, same as 0a.

**Why it matters:** under about 5 days you are in the region where the *wrong* arm can win. Shea
& Morgan still had the wrong condition ahead at 10 minutes. Thompson et al. had barely crossed
over at 2 days. A short gap does not weaken the result. It can reverse it.

### 1. Manipulation — did the arms actually differ?

**This check replaces the 2 Sep version**, which asked what percentage of interactions Arm A
served at level 4. That percentage has a denominator of about 23 events across the whole arm. It
cannot be computed.

**1a. Volume.** Arm A must log at least **8** `help_decided` events with action HINT or REVEAL,
across the arm.

Below 8 is under 3 per person. That means most items produced no policy decision at all, and Arm
A's session was close to having no assistant. **Fail below 8.**

**1b. Ladder. This one does not stop the study.** REVEAL should follow HINT in no more than
**70%** of Arm A help sequences.

Above 70%, Arm A got the full answer nearly every time, and the only difference from Arm B was a
few minutes of delay. But that is the **hint** half of the treatment failing. The **gate** half
still ran.

So above 70%, report the result as **gate-only**. Arm A's treatment reduces to "an attempt was
required, then the answer came two attempts later". The comparison against Arm B stays valid. It
tests a smaller claim than the hypothesis makes, and the write-up must say which claim.

**Round 2 cannot validate this number, and the best proxy fails it.** Round 2 had no help path, so
no learner ever saw a hint. Replaying it with N=2, only 2 of 9 moment-bearing person-questions
were solved by attempt 3. The other 7 would have escalated. That is 78%.

That 78% assumes the hint does nothing, so it is an upper bound. 70% asks the hint to move
escalation by at least 8 points. That is a fair thing to ask and a real risk, which is why 1b
reports rather than fails.

**1c. Behaviour.** Measure mean attempts before the first help request, per item, by arm. Arm B's
figure must be below **0.5**.

If Arm B also attempts before asking, they were generating anyway and the gate changed nothing.
**Fail if Arm B is 0.5 or above.**

This is Bastani's superficial-versus-non-superficial check, adapted. Both arms run the same app,
so there is no free-text chat to classify. Attempts-before-help is the equivalent signal, and it
comes free from the existing log.

**1d. Per sub-skill — was the treatment delivered *there*?** A reporting rule, not a pass/fail.

1a, 1b and 1c are computed across the whole arm. That is right for "did the study happen", and
wrong for "did it happen on S1". A sub-skill can produce no help decisions at all while the arm
total clears 8 comfortably.

**Count Arm A's `help_decided` events per sub-skill. Below 3 — fewer than one per learner — a
null on that sub-skill is reported as NOT TESTED, never as "no effect".**

The reason is mechanical. Arm A and Arm B run the same page, the same questions and the same
runner. **They differ at exactly one moment: when Help is pressed.** An item solved on the first
attempt produces no help press, so for that item Arm A *was* Arm B — same app, same experience.
A zero gap across a sub-skill where nobody pressed Help is not a finding about learning. It is
arithmetic, and reporting it as "the policy did not work for S1" claims something the data
cannot support.

**S1 is where this is most likely, and it is predictable now.** S1 has 3 practice items against
S2's 6 and S3's 7; it is the easiest sub-skill; and the three S1 candidates that were cut were
cut precisely *because* round 2 showed that shape gets solved on the first try
(`study-questions/DECISIONS.md` section 1). The sub-skill with the fewest items is also the one
most likely to generate no moments. If S1 comes back flat on 28 Sep, check this before concluding
anything.

The same logic applies to check 3 read per sub-skill: a ceiling on S1 alone is invisible in an
arm-wide mean of 12 held-out items.

**Why it matters:** 1a and 1b check the system. 1c checks the learner. 1d checks that the two
are true *where the conclusion is being drawn*. A policy that fired correctly and changed nobody's
behaviour has still not run the experiment — and a policy that never fired on a sub-skill has not
been tested on it.

### 2. Floor — did anyone learn anything?

**Fails if two things are both true.** Arm B's removal-test mean is below **15%**, and the gap
between the arms is under **15 points**.

In questions, on a 12-item set:

- 15% of 36 person-questions = 5.4 questions. That is **under 2 correct out of 12 per person**.
- A 15-point gap = 5.4 questions across the arm.

| Arm B | Arm A | gap | verdict |
|---|---|---|---|
| 2, 2, 1 = 13.9% | 3, 2, 2 = 19.4% | 5.5 points, 2 questions | **Fail** |
| 2, 2, 2 = 16.7% | anything | any | Pass, the floor is cleared |
| 1, 1, 0 = 5.6% | 9, 8, 8 = 69.4% | 63.8 points, 23 questions | Pass, a real effect |

**Why the gap clause is there.** Without it, a crushed baseline beside a strong Arm A would fail
on the floor. That combination is the finding, not a broken instrument.

**Why 15% and not 10%.** At 2 of 12 per person the arm total is 6 questions. One lucky guess
moves that total by 17%. At 1 of 12 the total is 3, and one guess moves it by 33%. Below 15% a
single guess starts to outweigh the policy.

**Why the risk is real here.** The testers were screened *for* a floor. They were chosen because
they cannot write SQL. Everyone scoring near zero is this group's natural failure mode.

**Why it matters:** below the floor you cannot tell a real effect from one person having a good
morning. Two questions, across three people, over a week, is not a result.

### 3. Ceiling — was there room for a gap to appear?

**Fails if either arm's mean is above 80%.**

80% of 36 person-questions = 28.8 questions. That is **9.6 correct out of 12 per person**.

Either arm, not only the higher one. The gap needs room above whichever arm is on top.

**The derivation.** The maximum is 12. What matters is what is left above the leading arm.

| leading arm at | per person | headroom | fits a 1.8-question effect? |
|---|---|---|---|
| 80% | 9.6 of 12 | 2.4 questions | yes, just |
| 90% | 10.8 of 12 | 1.2 questions | no |
| 95% | 11.4 of 12 | 0.6 questions | no |

80% is the point where the headroom left is still larger than the effect being looked for.

**The same learners show a bigger gap on harder questions.** Hold the skill difference fixed:

| question set | Arm A | Arm B | visible gap |
|---|---|---|---|
| too easy | 9.7 of 12 | 8.0 of 12 | 1.7 questions |
| well pitched | 6.0 of 12 | 3.0 of 12 | 3.0 questions |

Same people, same policy. The gap nearly doubles because the second set left room for it.

**Why it matters:** `LEARNING-LOG.md` L6 found a question inside the 20 to 85% solve-rate band
that was still useless. It was solved on the first attempt. Solve rate says where people ended
up. The mechanism lives on the path they took. Consider checking attempts-to-first-correct here
as well.

### 4. Mapping — did the held-out items test what was practised?

**4a.** Take each of S1, S2 and S3 in turn. The held-out pass rate must sit no more than
**30 percentage points** below that sub-skill's practice pass rate.

A larger drop means the paired item tests something the practice item did not teach. **Fail.**

**4b. The S4 precondition.** At least **2 of 6** learners must grade `correct` on **at least one
of H10, H11 and H12**, with no help available.

*Reworded 19 Sep. It said "the S4 held-out item", singular, and there are three.*
`study-questions/DECISIONS.md` section 2 has the reasoning: S4 is the hardest sub-skill and has
no dedicated practice, so one solve out of three attempts is enough to show the set is reachable.

If nobody solves any of the three, "flat on S4" proves nothing. The within-person control is lost.
Assumption 5 in `HYPOTHESIS-LOG.md` v0.1 was wrong. The attribution clause in the hypothesis is
dead. **Fail.**

**Why it matters:** S4 is the whole attribution argument. Improvement on S1 to S3 with S4 flat is
what rules out "they just got comfortable with the editor". That only works if S4 was reachable
in the first place.

### 4c. "Flat on S4" means no gap between the arms, not a low score

Stated because it is the objection the S4 contrast exists to answer, and the wrong reading of
"flat" concedes it.

**"S4 was simply harder" predicts both arms score lower on S4. It does not predict that the gap
between them closes.** Difficulty moves the levels; it does not move the difference. Both arms sit
the same items, on the same day, in the same app, so whatever S4's difficulty is, **Arm B
measures it.** That is what the control arm absorbs.

| | Arm A | Arm B | gap |
|---|---|---|---|
| a practised sub-skill | higher | lower | positive |
| S4, if it is only harder | lower | lower | **the same positive gap** |
| S4, if transfer stopped there | lower | lower | **≈ zero** |

So the S4 finding is a statement about the **arm difference on S4**, compared against the arm
difference on S1 to S3. It is never a statement about S4's raw solve rate. Report it that way on
28 Sep, and do not write the sentence "they did badly on S4" — that sentence is true in every one
of the three rows above and distinguishes none of them.

**Where 4b fits.** There is one case where a zero gap means nothing: both arms at zero. Zero minus
zero is zero, and it looks identical to transfer stopping. 4b is the guard — if at least two
learners reach at least one S4 item, a zero gap is a real zero rather than a floor.

### 5. Only if every check above passes

The hypothesis is falsified. Withholding does not produce retrieval.

A null that survives checks 0a to 4 is the deliverable, not the failure. Bastani's own GPT Tutor
arm produced a null and was published in PNAS.

---

## 5. Secondary measures, predicted now so they are predictions

Both are recorded here before any data exists. That is the only thing that separates a prediction
from a rationalisation written on 28 Sep.

**Attempt rate.** Predicted direction: Arm A attempts more of the held-out items than Arm B.

Report it next to the score, never instead of it. It is **not** evidence for the main hypothesis.
That hypothesis claims nothing about willingness to try.

**Scoring denominator.** Every removal-test score uses the full held-out set as its denominator,
fixed at question-set freeze. Blanks score zero. Never use "questions attempted". The gate trains
Arm A to always type something. That denominator would shrink less for Arm A than for Arm B.

**Satisfaction.** Predicted direction: Arm A reports lower satisfaction and lower perceived
learning than Arm B.

A satisfaction gap favouring Arm B alongside a retention gap favouring Arm A is the mechanism
working. It is not evidence against the hypothesis. Sources: Baddeley & Longman 1978, Kornell &
Bjork 2008.

**Why it matters:** on 28 Sep you will be tempted to reach for whichever secondary number happens
to support you. Writing both directions down today is what makes that reach legitimate.

---

## Stated limitations — pre-committed 19 Sep, before any session ran

Two limits on what this study can conclude. Both are written here, in the document read on
28 Sep, rather than discovered while writing up. Neither is a reason not to run; both are
reasons not to over-claim.

### 1. The two arms' error messages are not of matched quality

Arm B's condition is the bare error message plus the answer on demand. Arm A gets the same error
message plus the hint ladder. So the error message is held constant and the help differs, which
is the design.

What is *not* held constant is how good that error message is. Round 2 showed SQLite pointing at
the wrong word and a participant sustaining 63 attempts on one item without the message helping
(`LEARNING-LOG.md` L7). If Arm A's hints happen to repair a confusion that a better error message
would also have repaired, then part of any measured gap is the hint doing the error message's job
rather than teaching anything.

**The choice made, and why.** The alternative was to write matched-quality error messages for
both arms. That is a second treatment built one day before a frozen app, and it would have made
Arm B a designed condition rather than the realistic baseline it is meant to be. So the bare
message stays and this is reported as a limit.

**How it is bounded, not just admitted.** Arm B's attempt logs record how many attempts followed
each error message without a change in the learner's mental model. If Arm B shows the round-2
pattern of repeated near-identical attempts against an unhelpful message, that is evidence the
confound is live and the gap is partly attributable to error-message quality. It is a
post-hoc description, not a test, and is reported as such.

**A control condition is a design choice, not the absence of one.** `LEARNING-LOG.md` L7.

### 2. The items were piloted, not screened

The 28 items were verified mechanically, not on people. `verify.py` confirms every reference runs
and returns 2 to 10 rows with no tie on the sort key, and that each of the 47 listed wrong queries
either errors or returns rows different from the reference. `test_grade_rule.py` confirms all 28
references grade `correct` and none of the 47 wrong models does.

None of that says an item sits at a usable difficulty for these six people. It cannot, because of
a constraint that has no way around it: **the pool is seven people and anyone who sees an item
burns it.** An item shown to a participant during screening cannot be used to measure that
participant later. Screening the items properly would consume the sample the study needs.

**What follows.** Difficulty is calibrated from the two round-2 screening rounds, which used
different questions and a different schema. So the difficulty estimate is transferred, not
measured. Assumption 4 in `HYPOTHESIS-LOG.md` stays open for this reason, and checks 2 and 3
below exist to catch a floor or a ceiling after the fact rather than before.

**The single mitigation available, and it is not yet done.** One pilot tester from outside the
seven, run before 21 Sep. One person cannot establish difficulty, but one person can catch an
item that is broken, ambiguous, or impossible — which is the failure mode that would cost a whole
cell. If no pilot tester is found, say so here and treat every practice-session item result as
first contact.

### 3. Two participants are closer to Vikrant than the recruitment rule allows

`RECRUITMENT.md` section 1 defines the pool as workplace non-engineering colleagues — not
classmates, not on his team. Section 2 adds the consent rule: nobody who reports to him, and
participation explicitly voluntary.

The actual pool, recorded 19 Sep in `screener/ARM-ASSIGNMENT.md` section 6:

| person | relationship | arm |
|---|---|---|
| gaurav, ritesh | on his team before | A |
| anuj, manish | on his team before | B |
| nabin | current teammate | A |
| rishabh | current teammate | B |
| vikash | **his brother** | B |

The consent rule is satisfied — nobody reports to him. What is not satisfied is the pool
definition, in two places.

**vikash is his brother.** A sibling has his own reason to try hard, to stay to the end, and to
under-report frustration. That is demand characteristics, and it acts on effort, which is one of
the two secondary measures section 5 pre-commits. He is in Arm B, the answer-on-demand arm, so if
the effect runs the way it usually does it inflates Arm B's engagement — which works *against*
the hypothesis rather than for it. Worth saying, because a limitation that happens to favour the
prediction deserves more suspicion than one that does not.

**nabin and rishabh are current teammates**, an ongoing working relationship rather than a former
one. Milder, and split one per arm.

**Why it was not fixed.** The pool is seven. Dropping vikash leaves six, and one dropout after
that puts a cell at two. At that point the study has no comparison left to make. Running with him
and saying so is the honest trade; quietly dropping him after seeing his result would not be.

**How it is bounded.** Report `completed_removal_test` and attempt counts per person, not only
per arm. If vikash is an outlier on effort in the direction above, it is visible in his own row
rather than hidden in Arm B's mean.

---

## Still open

- **The held-out set size is planned at 12, not yet frozen.** Every threshold is a percentage and
  survives a change. The *derivations* do not — check 3 and check 2's gap clause are sized
  against headroom on a 12-item set. Confirm the count at question-set freeze and record it here.
  If it moves, re-derive both.
  **Closed 19 Sep: frozen at 12** (`study-questions/DECISIONS.md` section 1). S1 to S4, three
  items each. The derivations stand as written; no re-derivation needed.
- **Check 3 may be measuring the wrong thing.** Solve rate sits on where learners ended up.
  `LEARNING-LOG.md` L6 argues the mechanism lives on the path they took.

---

## What changed from the 2 Sep draft

| change | why |
|---|---|
| Renamed from TODO-HYPOTHESIS-v1.md | The name said task; the content is a plan |
| Status changed from DRAFT to LIVE | It is read on 28 Sep, not deleted after use |
| Check 1 replaced entirely | The old percentage could not be computed at this volume |
| Checks 0a and 0b added | Attrition and elapsed gap were threats with no gate |
| Check 4b added | Assumption 5 had no test |
| Section 5 added | Attempt rate and satisfaction had no pre-committed direction |
| Sizing arithmetic added; all numbers marked FINAL 14 Sep | The thresholds were percentages with no stated basis. They are now derived from 36 person-questions and a 1.8-question expected effect |
| Check 2 gained an AND clause | The floor alone would have failed a crushed baseline next to a strong Arm A, which is the finding |
| Old "new untested assumptions" 5 and 6 deleted | Both stale. One assumed 2 concepts, the other assumed the competence estimator, and both are cut |
| Section 3 budget corrected, 48 to about 23 | `LEARNING-LOG.md` L5 |

**Why it matters:** the four blanks sat unfilled for twelve days. Three of the things they
depended on changed underneath them. The numbers above are sized against the design as it stands
on 14 Sep. They are not sized against 2 Sep.
