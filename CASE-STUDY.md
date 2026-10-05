# Case study: does a tutor that withholds the answer help you remember?

**Vikrant Negi. 100x Engineers Cohort 7, Learning OS track. October 2026.**

Live app: https://tranquil-starlight-f0129e.netlify.app/ (`?arm=A` withholds, `?arm=B` gives answers)
Repo: https://github.com/vikrantnegi/withholding-pilot

---

## In one paragraph

I built an SQL tutor with one switch. In Arm A, Help refuses until you try, then gives a hint,
and the answer only after two more tries. In Arm B, Help gives the answer at once. Six working
developers practised on it, then sat a held-out test a week later with no help at all. Arm A
scored 36 of 36 person-questions (3 learners x 12 questions); Arm B scored 25 of 36. But on a
cold first try, both arms scored exactly 17 of 36. The gap came from what people did after a
wrong answer: Arm A opened every question and fixed every miss. Two of my own pre-registered
checks failed, so I do not credit the gap to withholding. The finding I can defend is narrower,
and different from the hypothesis the brief started us with.

---

## 1. How a learner gets stuck (rubric E1)

Before building anything, I ran two screening rounds on the same 7 people.

**Round 1, no way to run a query:** they solved 4 of the 35 questions they tried.
**Round 2, five days later, with a Run button added:** they solved 11 of 16.

Same people, one change. So the first finding was about the tool, not the learners. Without
feedback from execution, a beginner cannot tell a typo from a misunderstanding.

The logs then showed where people actually get stuck:

- **Syntax habits, not concepts.** `GROUPBY` and `ORDERBY` without a space appeared in two people
  in both rounds. One learner made 80 attempts in 47 minutes and not one parsed.
- **Filtering rows versus filtering groups.** Putting a condition on a count in `WHERE`, or
  writing `HAVING` before `GROUP BY`, recurs right through to the final test.
- **Avoidance.** 5 of 7 never seriously attempted a join. An easier join would not have helped.
- **Time on task varies 50-fold.** From 55 seconds to 47 minutes on the same three questions.

**What this changed.** I cut the scope to one concept, `GROUP BY` and `HAVING`, split into four
sub-skills. Three are practised. The fourth, composing all three, is held back as a control.

**So what:** stuck is mostly "cannot see why it failed", then "filters at the wrong level". The
tutor's job is to make the learner find that, not to hand it over.

---

## 2. What I built (rubric E3 and E4)

### The architecture

Three kinds of part, each where it belongs:

| part | what | why it sits there |
|---|---|---|
| **human** | the learner writes and runs SQL | the skill being measured is theirs |
| **deterministic** | the gate, the hint/reveal policy, the grader, the leak guard | the experiment's variable must be fixed and auditable |
| **probabilistic** | an LLM writes the hint text, nothing else | prose about *this* mistake is the one thing code cannot write |

**The LLM never decides whether to help, or how much.** Plain code decides; the LLM only words a
hint once that decision is made. If an LLM judged "this learner seems stuck", Arm A's treatment
would vary unpredictably, and I could not say what Arm A received. Diagrams:
`diagrams/architecture-arm-a.png` and `diagrams/architecture-arm-b.png`. Arm B is the same drawing with half greyed out.

### Keeping the LLM honest

A hint that contains the answer turns Arm A into Arm B without anyone noticing. So:

- **A deterministic leak guard** rejects any hint too close to the reference query. On 101 real
  hints it had zero false positives. Against 24 adversarial leaks I wrote, it caught 22.
- **The key and the model live server-side**, in a Supabase edge function. A request for a
  different model is refused.
- **A rejected hint is retried, then replaced by a hand-written fallback.** The learner never
  sees a leak, and the log records which one they got.

### Quality

123 unit tests across the five modules that decide anything. 42 headless-browser checks on both
arms. Two graders, Python and JS, checked against each other on 75 queries with zero
disagreement. Every number in the results is reproduced by one script.

**So what:** the system is small on purpose. The thing being tested is one config flag, and
everything around it exists to keep that flag the only difference.

---

## 3. The removal test (rubric E2)

**Design.** Matched pairs on round-2 skill, then split into Arm A (3) and Arm B (4). A practice
session on 16 items, then 5 to 7 days later, 12 held-out items with no help for anyone. Each
held-out item is hand-paired to the practice item that taught its sub-skill.

**Decided before the data.** The unit of analysis (per person-question), the scoring rule, the
5-to-7-day window, and a ten-step checklist of how a result could be broken
(`ANALYSIS-PLAN.md`), including that a question left blank scores zero. Two decisions came
mid-test, each dated before the logs it could affect. Two people a few hours past 7 days stay
in. One tester is excluded on an outside-help pattern in every round, which works against my
hypothesis, not for it.

**Results.**

| | Arm A, withholding | Arm B, answer-giving |
|---|---|---|
| correct on any attempt | **36 of 36** | **25 of 36** |
| correct on the first attempt | 17 of 36 | 17 of 36 |
| questions opened | 36 of 36 | 29 of 36 |
| wrong first tries later fixed | 19 of 19 | 8 of 12 |

**Two checks failed.**

- **Check 1c:** Arm B tried 0.83 times on average before asking for help. They were attempting
  anyway, so the gate did not create a behaviour Arm B lacked.
- **Check 3:** Arm A scored 100%. A test with no headroom cannot show how far ahead an arm is.

**And two confounds.** Questions ran in sub-skill order, so the three people who stopped early
lost the composition items first; the largest gap, 6 points on composition, is 6 blanks. And
one Arm A learner never pressed Help in practice, yet scored 12; counting only the four who used
help as designed, the gap shrinks from 11 questions to 3.

**So what:** the direction favours withholding. The machinery that would let me attribute it
did not hold, and the case study says so rather than claiming the win.

---

## 4. What the evidence changed (rubric E5)

The hypothesis moved three times. Each move is in `HYPOTHESIS-LOG.md`, with the evidence.

| version | the claim | what moved it |
|---|---|---|
| v0, 30 Aug | the brief's hypothesis: help sized to the learner's skill | given by the Learning OS brief |
| v0.2, 7–10 Sep | the estimator and two of four help levels cut; a gate added | an estimator cannot converge on 6 people |
| v0.1 and v1, 13–19 Sep | one concept, four sub-skills; better recall on practised ones, not the held-back one | the arithmetic: about 23 help decisions in the whole study |
| **v2, 4 Oct** | **withholding changes persistence and recovery, not first-try recall** | **17 of 36 first-try correct in both arms** |

**Three lessons I would teach someone else.**

1. **Check the grain of every number.** Four of my mistakes were real quantities measured per
   person or per question when the effect lives per person-question.
2. **A control condition is a design choice.** Arm B's "bare error message" has its own quality.
   If it is bad in a way Arm A fixes, part of the measured effect is that fix.
3. **Item order is a variable.** Three people stopped early, and the order turned "they stopped"
   into "the biggest gap is on the held-back skill". Randomise order per learner.

**So what:** the strongest result of this project is the diff between v1 and v2, and the record
of why it moved.

---

## 5. Limitations, stated plainly

- **Three learners per arm.** Direction only. No p-value is reported, by design.
- **The testers are colleagues and one family member.** Recorded as a limitation, not fixed.
- **Result-matching grades a lucky sort as correct.** Three Arm A points came from reversing a
  sort by name that happened to match.
- **Possible layout effect.** Under about 1100 px wide, the question list cuts off after
  question 9.

## 6. What I would do next

1. Randomise question order per learner.
2. Use harder held-out items, so neither arm can reach 100%.
3. Make first-attempt correct the primary score. It is the measure v2 says will not move, so it
   is the one that can prove v2 wrong.
4. Record treatment received, every Help press, and report it next to the assigned arm.

---

**Where to look:** `RESULTS.md` for every number, `HYPOTHESIS-LOG.md` for the diff,
`ANALYSIS-PLAN.md` for what was decided in advance, `LEARNING-LOG.md` for what broke.
