# Bastani et al. (2025): AI help raises today's score and lowers tomorrow's

"Generative AI Without Guardrails Can Harm Learning: Evidence from High School Mathematics"
PNAS 122(26), 2025. https://www.pnas.org/doi/10.1073/pnas.2422633122
Working paper version, from which the numbers below are taken:
https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4895486

First read 2 Sep 2026 (supplementary appendix). Full note written 7 Sep 2026.

**Version note.** The detailed numbers here come from the 2024 working paper. The PNAS
published version is the same study with the same findings, but if you quote an exact
coefficient in the PRD, check it against the published version first.

## The short version

About a thousand Turkish high school students got GPT-4 during maths practice. Two versions:
a plain one that answers questions, and a guardrailed tutor that gives hints but never the
solution.

During practice, both helped a lot. The plain one raised scores 48%. The tutor raised them
127%.

Then the laptops were taken away and everyone sat an exam alone. The students who had used the
plain chatbot scored **17% worse than students who had never had AI at all.** The tutor group
came out level with the no-AI group.

This is your experiment, already run, at more than a hundred times your sample size. Read it
as the thing that makes your project necessary and also as the thing that constrains what you
can claim.

---

## 1. What they did

- Nearly 1,000 students, 839 in the main analysis. Grades 9, 10 and 11 at one large Turkish
  high school. Autumn semester of 2023-24.
- Four 90-minute sessions per grade, covering about 15% of a semester's maths curriculum.
- Whole classrooms were assigned to arms, not individual students. Students had been randomly
  assigned to classes already. Honours classes were left out of the main analysis.

Three arms:

1. **Control.** Normal practice with textbooks and notes. No devices.
2. **GPT Base.** A laptop with a ChatGPT-style interface to GPT-4 and a minimal prompt.
3. **GPT Tutor.** The same model with a carefully built prompt containing safeguards.

Each session had three parts:

1. A teacher review or lecture, identical in all three arms.
2. Assisted practice problems. This is where the arms differ.
3. An unassisted exam. Closed book, closed laptop.

**Note part 3 carefully.** The exam came at the end of the same session. Their removal test is
immediate. That matters for you and I come back to it in section 5.

---

## 2. What happened during practice

Scores are out of 1.0. Control averaged 0.284.

| Arm | Effect | In plain terms |
|---|---|---|
| GPT Base | +0.137 | **48% better** than control |
| GPT Tutor | +0.361 | **127% better** than control |

Both results are very strong statistically (p below 0.001). The problem-level analysis gives
nearly identical numbers (+0.138 and +0.366).

**Do not skim past the second row.** The tutor that refuses to give answers did not just beat
the control. It beat the answer-giving chatbot, by a wide margin, on today's performance.

That undercuts an assumption sitting inside your own hypothesis. Your falsification condition
includes "completion during practice drops far enough that learners abandon the tool", and your
counter-metric is built around withholding costing something today. The largest study of this
question found the opposite: the withholding arm did better today too.

Why? Partly because GPT Base was often wrong. See section 4.

---

## 3. What happened on the exam

Control averaged 0.321, with a standard deviation of 0.277.

| Arm | Effect | In plain terms |
|---|---|---|
| GPT Base | -0.054 | **17% worse** than control. Statistically significant. |
| GPT Tutor | -0.004 | No meaningful difference from control. |

Their own summary:

> "access to GPT-4 significantly improves performance (48% improvement for GPT Base and 127%
> for GPT Tutor). However, we additionally find that when access is subsequently taken away,
> students actually perform worse than those who never had access (17% reduction for GPT Base).
> That is, access to GPT-4 can harm educational outcomes."

Their explanation:

> "students attempt to use GPT-4 as a 'crutch' during practice problem sessions, and when
> successful, perform worse on their own."

And on the guardrails:

> "These negative learning effects are largely mitigated by the safeguards included in GPT
> Tutor."

Read that last sentence precisely. **Mitigated, not reversed.** The tutor removed the damage. It
did not produce a gain over having no AI at all.

---

## 4. The mechanism: students were copying, and the proof is clever

GPT Base was frequently wrong. When they queried it with "What is the answer?", only **51% of
responses were correct.** Of the wrong ones, 42% were logic errors and 8% were arithmetic
errors. Across 57 problems the error rate ranged from 0% to 100%.

Then the neat bit. If students were reading and understanding what GPT Base produced, an
arithmetic slip should hurt them less than a logic error, because a person following the
reasoning would catch a bad sum. Instead both kinds of error damaged practice performance by
about the same amount (-0.448 for logic errors, -0.492 for arithmetic).

Their conclusion: students were not reading. They were copying.

Second piece of evidence: the errors did not carry through to the exam. Getting a wrong answer
in practice did not make you worse on the matching exam question. Nothing was being absorbed
either way.

**What this means for your Arm B.** Your baseline chatbot will write wrong SQL some of the time.
That is not a flaw in your baseline, it is part of what you are comparing against, and Bastani
shows it is a substantial part. Log it. Record how often the Arm B chatbot produced a query that
did not match the reference, and report it. If you do not, someone will ask whether your baseline
arm lost because the model was bad rather than because answer-giving is bad, and you will have no
answer.

Also note the asymmetry. Their GPT Tutor prompt included the correct solution, so it could not be
wrong in the same way. That is the same design decision Kestin made independently. Two of the
three AI-tutoring studies in this folder ground their help in a pre-written correct answer. Yours
should too.

---

## 5. Where your study goes beyond theirs, and it is not where you think

Your current positioning is that Bastani measured unaided performance and Kestin did not. True,
but there is a sharper version.

**Bastani's exam happened at the end of the same session.** Same 90 minutes: lecture, practice,
then the laptops close and the exam starts. So their removal test measures unaided performance
immediately after removal.

Soderstrom & Bjork, in this folder, is the paper showing that the gap between conditions is
smallest right after practice and grows over days. At five minutes, the easier condition is often
still winning. The reversal takes time to show.

So your 5 to 7 day gap is not a smaller version of Bastani's design. It is a different
measurement, taken at the point where the effect should be largest and where nobody in the
LLM-education literature has looked yet.

Updated version of the table in this folder's README:

| Study | When measured | Delay after practice | Assistant present? | Result |
|---|---|---|---|---|
| Kestin 2025 | after the lesson | none | yes | AI tutor much better than classroom |
| Bastani 2025 | end of same session | none | no | Answer-giving worse than no AI. Guardrailed tutor level with no AI. |
| Yours, 27 Sep | separate session | 5 to 7 days | no | empty |

That is a better claim than the one currently in the PRD seed, and it costs you nothing because
it is just an accurate reading of their design. Worth verifying against the published PNAS
version before you build a slide on it.

---

## 6. The guardrail prompt, and where you differ from it

Their GPT Tutor prompt is the closest thing to a working specification for what you are building.
Two safeguards, in their words:

> "The prompt includes one or more (correct) solutions to the current practice problem, as well
> as teacher input on common student mistakes and how to provide feedback; this choice ensures
> that GPT-4 does not provide incorrect feedback to the student."

> "The prompt instructs GPT-4 to provide hints to the student without directly giving them the
> answer."

The prompt instructions themselves:

> "you should help them solve their problem if they are stuck on a step, but without providing
> them with the full solution"

> "you should ask them to show the work they have done so far, together with a description of
> what they are stuck on. **Do not provide them with help until they have provided this**"

> "provide the student with as little information as possible to help them solve the problem. If
> they still struggle, then you can provide them with more information"

> "You should in no circumstances provide the student with the full solution"

And if a student produces an answer with no working, the tutor asks them to explain it, to check
they actually understand it.

**The second instruction is the one to notice.** "Do not provide them with help until they have
provided this" is exactly the attempt-before-help rule that Kornell's failed-generation work
justifies from cognitive psychology and that Koedinger & Aleven's help-seeking logs justify from
system data. Three independent sources, three different fields, same rule. Put it in the policy
spec and stop treating it as a design opinion.

**Where you differ, and you must defend it.** Their tutor never gives the full solution, ever.
Your ladder ends in one. That is a real divergence from the only guardrailed arm that has been
tested at this scale, and someone will spot it.

Your defence is already assembled from the other two papers in this folder:

1. Koedinger & Aleven: the bottom-out hint turns a problem into a worked example delivered
   exactly when the learner needed one, which is a legitimate instructional event rather than a
   failure.
2. Koedinger & Aleven again: a hard refusal produces gaming. Students click through to whatever
   the system will give them, and if nothing is available they guess repeatedly.
3. Their mastery mechanism: escalation is allowed but the concept stays unmastered, so it costs
   something without denying anyone.

Write that into the PRD as a deliberate departure with three reasons, not as an unnoticed
difference.

---

## 7. How students actually used the two tools

This gives you a ready-made manipulation check.

**Messages per problem.** GPT Base averaged 2 to 3. GPT Tutor averaged 4 to 5, significantly more
(p below 0.001). The tutor group's message count went up across sessions 1 to 4 as they got used
to it.

**Time.** GPT Tutor students spent about **13% more time** on the platform, roughly 2 extra
minutes per session (15.5 minutes for Base, about 17.5 for Tutor).

**What the messages contained**, which is the most useful part:

GPT Base:
- Session 1 was 38% just pasting the question text and 29% asking for the answer.
- Across sessions 2 to 4, "ask for the answer" stayed at 25 to 36% of all interactions.
- Interactions they classified as **non-superficial** (asking for help, attempting an answer)
  stayed **below 20% in every session.**

GPT Tutor:
- Session 1 was 31% pasting the question and 27% attempting an answer.
- By sessions 2 and 3, asking for help became the dominant pattern.
- Non-superficial interactions were **above 40% from session 2 onward** and stayed there.

**Steal this as your manipulation check.** Your null-result triage in `../TODO-HYPOTHESIS-v1.md`
section 4 currently checks whether the arms differed by counting what level Arm A served. That is
a check on your system. This is a check on the learner's behaviour, which is the thing that
actually has to differ for the mechanism to run.

Concretely: classify each learner interaction as superficial (pasting the question, asking
outright for the query) or non-superficial (describing what they tried, asking about a specific
part). If Arm A does not come out clearly higher on non-superficial interactions, your policy did
not change behaviour and a null result is uninformative. Bastani's numbers give you a reference
band: under 20% for answer-giving, over 40% for a guardrailed tutor.

Also expect Arm A to take longer. Budget the practice session for it.

---

## 8. The number that should worry you most

Their exam effect for GPT Base was -0.054 on a 0 to 1 scale, against a control standard deviation
of 0.277. That is roughly **one sixth of a standard deviation.** They called that harm, and they
were right to, but it took nearly a thousand students to see it.

Now look at what you are measuring. Your comparison is Arm A against Arm B, which in their terms
is GPT Tutor against GPT Base: -0.004 against -0.054. **A gap of about 0.05, or one fifth of a
standard deviation.**

You have three people per arm. A gap that size is invisible at that sample size. Not hard to see,
invisible.

This is not a reason to abandon the design. It is a reason to be precise about what your capstone
delivers, and to say it before an evaluator says it to you:

- The primary comparison is **directional, not conclusive.** Report the gap and its direction.
  Do not report a p-value as though it means something at n=6.
- The **practice-phase gap is where the large effect lives** (0.224 in their study, against 0.05
  on the exam). Consider reporting practice performance as a genuine secondary result rather than
  only as a counter-metric. It is the measurement your sample size can actually support.
- The **deliverable is the instrument, not the finding.** A working giving policy, a frozen
  question set, a scoring harness, a pre-committed triage list, and an honest null. That is what
  you can promise at this n, and it is a real contribution.
- The **manipulation check from section 7 becomes more important than the score gap**, because
  behaviour change is detectable at n=6 and a one-fifth-SD score difference is not.

Say all of this in the PRD rather than discovering it on 28 Sep.

---

## 9. Who it helped and who it did not

They looked for subgroup effects and mostly did not find them.

- **Prior GPA.** Weaker students got more out of GPT Base during practice. On the exam, no
  significant difference by prior ability.
- **Private tutoring.** Students who already had a private tutor got more out of GPT Base in
  practice. Again nothing on the exam.
- **Self-study hours.** No significant interactions on exam performance.
- **Grade level.** "limited to no statistically significant support for heterogeneous treatment
  effects."
- **Gender.** Balanced across arms, no analysis reported.

The relevant part for you: the practice-phase benefit was larger for weaker students, which is
the population you screened for. Your Arm B testers may look impressively productive during
practice precisely because they cannot write SQL. Expect it, and do not read it as your baseline
being poorly chosen.

---

## 10. Their limitations, which are also your defence

Worth knowing, because the same objections will be aimed at you and it helps to be able to say
that the thousand-student PNAS paper carries them too.

- One school, in one country. Generalisability unclear.
- Mathematics only.
- GPT-4 only.
- One semester. No evidence on whether the harm persists.
- Five class sessions failed to run properly for technical reasons. They kept them in the
  analysis to preserve the randomisation.
- The copying mechanism is strongly suggested, not proven.
- Limited statistical power for subgroup analysis, despite pre-registration.

That last one is worth noticing. With 839 students they still could not resolve subgroup effects.
It is a useful calibration for what six people can tell you.

---

## 11. What came out of the appendix on 2 Sep

The earlier close read of the supplementary appendix produced four decisions, which are written
up in `../TODO-HYPOTHESIS-v1.md` and still stand:

1. **Analyse per question, not per learner.** Their student-level regression has 2,848
   observations; the problem-level one on the same data has 11,392. At three people per arm, a gap
   between arm averages is mostly a fact about who you recruited.
2. **Pair held-out questions to practised concepts by hand.** They built an explicit mapping from
   each exam problem to the practice problem that taught its concept. Without it, a failure could
   mean never practised, harder item, or bad assistant, and you cannot tell which.
3. **Concepts and levels multiply.** Four levels across eight concepts is 32 cells and about 1.5
   observations each. Two levels across two concepts is four cells and twelve observations each.
   Cutting levels alone buys nothing.
4. **Write the null-result triage before the data arrives.** Check the manipulation, then the
   floor, then the ceiling, then the concept mapping. Only if all four pass is the hypothesis
   actually falsified.

Nothing in this fuller read changes those. Sections 7 and 8 above strengthen numbers 1 and 4.

---

## 12. What to actually do

1. **Fix the practice-completion assumption** (section 2). Their guardrailed tutor beat the
   answer-giving arm on today's performance by a wide margin. Your hypothesis currently treats a
   completion drop as the expected cost of withholding. Reword it.
2. **Reposition on the delay, not on the measurement** (section 5). Bastani measured unaided
   performance immediately. You are measuring it after 5 to 7 days. Verify this against the
   published version, then make it the headline claim.
3. **Log Arm B's error rate** (section 4). Half of GPT Base's answers were wrong. Yours will
   produce wrong SQL too, and if you do not measure it you cannot answer the obvious objection.
4. **Adopt "no help until they show what they tried"** (section 6). Three independent sources now
   converge on this rule.
5. **Ground every level of help in a pre-written reference solution** (section 4). Bastani and
   Kestin both did this. It is the difference between a hint that helps and a hint that
   contaminates your treatment arm.
6. **Build the interaction classifier as your real manipulation check** (section 7). Superficial
   against non-superficial, with under 20% and over 40% as reference bands.
7. **Write the power problem into the PRD yourself** (section 8). One fifth of a standard
   deviation, three people per arm. Say what the capstone actually delivers before someone else
   defines it for you.
8. **Defend the level-4 full answer explicitly** (section 6). Their tutor never gives one. You do.
   You have three good reasons. Write them down.
