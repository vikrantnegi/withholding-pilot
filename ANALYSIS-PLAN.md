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

**Why it matters:** 1a and 1b check the system. 1c checks the learner. A policy that fired
correctly and changed nobody's behaviour has still not run the experiment.

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

**4b. The S4 precondition.** At least **2 of 6** learners must solve the S4 held-out item.

If nobody solves it, "flat on S4" proves nothing. The within-person control is lost. Assumption 5
in `HYPOTHESIS-LOG.md` v0.1 was wrong. The attribution clause in the hypothesis is dead. **Fail.**

**Why it matters:** S4 is the whole attribution argument. Improvement on S1 to S3 with S4 flat is
what rules out "they just got comfortable with the editor". That only works if S4 was reachable
in the first place.

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

## Still open

- **The held-out set size is planned at 12, not yet frozen.** Every threshold is a percentage and
  survives a change. The *derivations* do not — check 3 and check 2's gap clause are sized
  against headroom on a 12-item set. Confirm the count at question-set freeze and record it here.
  If it moves, re-derive both.
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
