# Results: the removal test, 30 Sep to 2 Oct 2026

**Every number here comes from `evals/analyse-removal.py`.** Run it to reproduce them. It reads
the practice logs (`screener/round-3-practice/logs/`) and the removal logs
(`screener/round-4-removal/logs/`), one file per person.

**The checks follow `ANALYSIS-PLAN.md` §4, in its order.** Every scoring decision was fixed
before the logs it could affect. The dated entries in `ANALYSIS-PLAN.md` §5 record each one.

---

## The answer first

**Arm A scored 36 of 36 person-questions (3 learners x 12 held-out questions). Arm B scored 25
of 36.** The direction favours withholding.

**The hypothesis is still not supported.** It predicted a gap on the practised sub-skills (S1 to
S3) and no gap on the unpractised composition (S4). The data shows the reverse: the largest gap
is on S4, and every point of it comes from questions Arm B never opened.

Three things carry the result, and none of them is recall:

1. **First-attempt correct is 17 of 36 in both arms.** On a cold first try, the arms are identical.
2. **Arm B left 7 of 36 person-questions blank. Arm A left none.** Six of those 7 are S4 items.
3. **Arm A recovered every first-attempt miss: 19 of 19. Arm B recovered 8 of 12.**

**So what:** withholding changed what learners did after a wrong answer. It did not change what
they could produce on a first try.

---

## Per person

Correct on any attempt is the primary score (fixed 26 Sep, `screener/round-4-removal/README.md`).
"First executing" ignores attempts that did not run, such as a typo in a keyword.

| arm | person | correct | first attempt | first executing | opened | minutes | gap since practice |
|---|---|---|---|---|---|---|---|
| A | nabin | 12 | 6 | 9 | 12 | 46 | 7d 2h (deviation) |
| A | gaurav | 12 | 6 | 7 | 12 | 22 | 7d 2h (deviation) |
| A | ritesh | 12 | 5 | 9 | 12 | 40 | 6d 12h |
| B | vikash | 12 | 9 | 11 | 12 | 14 | 5d 14h |
| B | rishabh | 9 | 8 | 8 | 9 | 27 | 6d 18h |
| B | anuj | 4 | 0 | 0 | 8 | 19 | 6d 23h |
| B | manish | 9 | 6 | 9 | 9 | 6 | excluded, see 0a |

**Arm totals, manish excluded:** correct 36 vs 25. First attempt 17 vs 17. First executing 25
vs 19. Opened 36 vs 29.

**The gap is 30.6 points, with a learner-clustered standard error of 15.9 points.** That is
direction only. `ANALYSIS-PLAN.md` §1 forbids a p-value at 3 learners per arm.

---

## Per sub-skill

Each cell is correct on any attempt, then first-attempt correct in brackets, out of 9
person-questions (3 learners x 3 items).

| sub-skill | items | Arm A | Arm B | gap |
|---|---|---|---|---|
| S1 group and count | H01-H03 | 9 (7) | 8 (5) | 1 |
| S2 filter rows, then group | H04-H06 | 9 (6) | 8 (6) | 1 |
| S3 filter groups, `HAVING` | H07-H09 | 9 (2) | 6 (5) | 3 |
| S4 all three composed | H10-H12 | 9 (2) | 3 (1) | **6** |

**Read S3's brackets.** Arm B got more S3 items right on the first try (5 vs 2). Arm A won S3 on
recovery, not on recall.

**Read S4's gap.** Arm B's 3 S4 points are all vikash's. rishabh and anuj never opened H10 to H12.
So the 6-point S4 gap is 6 blanks.

**So what:** the hypothesis's attribution clause, "and not on the one that was not", fails. The
gap is not on the practised skills. It sits on the last three questions, where it is confounded
with stopping early.

---

## The checklist, `ANALYSIS-PLAN.md` §4, in order

| check | rule | result | verdict |
|---|---|---|---|
| 0a attrition | both arms complete 3 of 3 | 3 of 3 each. manish excluded on his record, not his score | pass, with exclusion reported |
| 0b gap | nobody under 5 days | shortest 5d 14h (vikash). Two ran ~2h past 7 days | pass |
| 1a volume | Arm A logs at least 8 HINT or REVEAL | 23 (nabin 14, ritesh 9, gaurav 0) | pass |
| 1b ladder | REVEAL follows HINT in no more than 70% | 6 of 15 hint sequences, 40% | pass, the hint half ran |
| **1c behaviour** | **Arm B attempts before first help below 0.5** | **0.83, over 12 items** | **fail** |
| 1d per sub-skill | at least 3 Arm A help decisions per sub-skill | S1 2, S2 8, S3 13 | **S1 not tested** |
| 2 floor | Arm B mean under 15% and gap under 15 points | Arm B 69% | pass |
| **3 ceiling** | **neither arm above 80%** | **Arm A 100%** | **fail** |
| 4a mapping | held-out no more than 30 points below practice | S1 0, S2 -14, S3 -17 (held-out higher) | pass |
| 4b S4 reachable | at least 2 of 6 solve one of H10-H12 | 4 of 6 | pass |

**Two checks fail, so this is not a clean test of the hypothesis.**

**1c fails.** Arm B tried 0.83 times on average before pressing Help. They were generating
anyway. So the gate, Arm A's defining difference, did not create a behaviour Arm B lacked.

**3 fails.** Arm A sits at 100%. A test with no headroom cannot show how far ahead an arm is.

**So what:** the positive direction is real in the data. The machinery that would attribute it
to withholding did not hold.

---

## Treatment delivery: who actually got which arm

Arm A and Arm B differ only when Help is pressed (`ANALYSIS-PLAN.md` §1d). Three people never
pressed it in practice.

| person | arm | help decisions in practice | what they experienced |
|---|---|---|---|
| gaurav | A | 0, and 7 of 16 items attempted | a session with no help, identical in both arms |
| anuj | B | 0 | a session with no help, identical in both arms |
| manish | B | 0 | the same, and excluded |

**gaurav scored 12 with no treatment.** anuj scored 4 with no baseline treatment either. Their
scores are about them, not about either policy.

Of the four who received their arm as designed, Arm A (nabin, ritesh) scored 24 of 24. Arm B
(vikash, rishabh) scored 21 of 24.

**So what:** intention-to-treat is the reported result. The per-protocol view shrinks the gap
from 11 questions to 3.

---

## Confounds the write-up must name

1. **Item order is sub-skill order.** H01 to H12 run S1, S2, S3, S4. Anyone who stops early loses
   S4 first. That is why the S4 gap and the blanks are the same 6 points.
2. **Three of six stopped early.** rishabh and manish after H09, anuj after H08. Causes: time
   (rishabh, 27 minutes against "about 30"), possibly layout, and giving up (anuj). Under about
   1100 px wide, the question rail shows Questions 1 to 9 and cuts off the rest.
3. **Result-matching grades a lucky sort as correct.** Sorting by name in reverse gave the
   right order 3 times: gaurav H10 and H12, ritesh H10. All three are Arm A points.
4. **One learner drives the gap.** anuj alone accounts for 8 of Arm B's 11 lost points.
5. **manish is excluded.** With him in, Arm B is 34 of 48, 70.8%. The direction does not change.

---

## What the evidence supports, as a sentence

> In a 6-person pilot, learners who had to attempt before getting help, and got a hint before
> the answer, finished more of a held-out SQL test and recovered from every wrong first attempt.
> They did not answer more questions correctly on the first try. The study's manipulation check
> and ceiling check both failed, so the gap cannot be credited to withholding.

`HYPOTHESIS-LOG.md` v2 records how this changes the claim.
