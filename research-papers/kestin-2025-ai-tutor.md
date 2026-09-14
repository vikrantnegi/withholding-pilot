# Kestin et al. (2025): an AI tutor beat a Harvard physics class

Scientific Reports 15:17458, 3 June 2025.
https://www.nature.com/articles/s41598-025-97652-6
Read 3 Sep 2026. Rewritten in plain English 7 Sep 2026.

## The short version

A carefully built AI tutor beat a Harvard physics classroom on a test given right after the
lesson. The students still had the tutor available during the lesson, and the test came in the
same sitting.

Nobody checked what those students could do a week later without it.

That missing check is your capstone.

---

## 1. What they did

194 undergraduates in Harvard's Physical Sciences 2 course.

Every student did both conditions, one per lesson. One lesson covered surface tension, the
other covered fluid flow. Students were split into two groups so that half got the AI first
and half got the classroom first. Students who normally worked together in class were kept
together.

- Condition 1: normal in-class active learning, about 60 minutes.
- Condition 2: "PS2 Pal", a GPT-4 tutor on a platform they built. Same content, same handout.

The sequence was quiz, lesson, quiz, all in one session.

The test questions were spread across difficulty levels: 33% asked students to analyse, 41% to
apply, 21% to understand, 4% to remember. (This is Bloom's taxonomy, a standard way of sorting
questions from "recall a fact" up to "work something out".)

They deliberately had a different person write the tests from the person who built the tutor,
so the test could not be quietly tuned to the tutor.

## 2. What they found

Median score after the lesson was 4.5 for the AI group and 3.5 for the classroom group, both
starting from a shared pre-test score of 2.75.

The difference was very unlikely to be chance (p below 1 in 100 million).

The size of the difference was 0.63 standard deviations by one method, and between 0.73 and
1.3 by another method that corrects for the test being too easy. In plain terms, that is a
large effect. For comparison, one standard deviation is roughly the gap between an average
student and one in the top 16%.

Other results:

- The AI group finished in about 49 minutes against the class's 60.
- Time spent did not predict score. Working longer did not mean scoring higher.
- Engagement was higher with the AI (4.1 vs 3.6) and so was motivation (3.4 vs 3.1).
- Enjoyment and growth mindset showed no difference.
- 83% of students said the AI's explanations were as good as or better than a human
  instructor's.

## 3. The real lesson, which is not the headline

The headline is a result about performance while the help is still there. The test came
immediately, in the same sitting, with nothing taken away.

Soderstrom & Bjork, the other paper in this folder, is the one that shows performance during a
lesson and learning measured later often move in opposite directions. So Kestin's result is
silent about retention. Not because they were careless, but because the design cannot answer
that question.

Put the three studies side by side:

| Study | When measured | Was the assistant there? | Result |
|---|---|---|---|
| Kestin 2025 | right after the lesson | yes | AI tutor much better than classroom |
| Bastani 2025 | later exam | no | AI tutor about the same as no AI. Answer-giving AI worse than no AI. |
| Yours, 27 Sep | 5 to 7 days later | no | this cell is empty |

Same kind of intervention, opposite-looking conclusions, and the only thing that changed is
when you measured. That table is your opening page and probably your Demo Day slide.

### The question this paper sets up against you

Someone who has read Kestin will ask: AI tutoring already works, so what are you adding?

The answer: Kestin shows an AI tutor raises performance while you are holding it. Bastani shows
that raise does not survive having it taken away. Nobody has tested whether how much the
assistant gives is the variable that decides which of those two you get. That is the project.

Practise saying that out loud. It is your problem-understanding score.

---

## 4. Four things worth copying from their build

### 4.1 Base the help on a pre-written correct answer, not on the model making one up

In their words: they avoided relying only on GPT-4 to produce solutions, and instead fed the
prompts detailed step-by-step answers they had written themselves.

The 83% instructor-parity rating came from that, not from the model being clever.

You already write a reference query for every question, because the scoring harness needs one.
Write a step-by-step derivation next to it and feed both into the help prompt as ground truth.
Then every level of help, from a nudge to the full answer, is a view onto a solution you know
is correct rather than something the model invented on the spot.

This kills your worst failure mode. If a hint points at the wrong join, your treatment arm is
contaminated, and on 28 Sep you cannot tell whether your policy failed or the model did. Cheap
to build, and it is the guardrail you owe by 18 Sep.

### 4.2 They could not make the prompt enforce structure, so they put it in code

They tried to get the system prompt to work through multi-part problems in order. It would not
hold. So they built the sequencing into the platform instead.

That settles an architecture question you have not written down yet:

> The level selection is code. The model only writes up the level it is handed.

Do not ask the model how much to give. A probabilistic system deciding its own guardrail is
exactly the pattern you are supposed to know better than. The flow is: competence estimate,
then a fixed rule, then a level, then a prompt template for that level.

Doing it this way logs the decision, makes your manipulation check countable, makes the policy
explainable on Demo Day, and removes a chunk of build work.

### 4.3 The test was written by someone who did not build the tutor

You are solo, so you cannot copy that directly. The substitute is time rather than people.

Write and freeze the held-out questions and their reference solutions, and commit them to git,
before you write a line of the giving policy. The commit timestamp is your evidence.

That costs an hour and answers "how do we know you did not tune the policy to the test."

### 4.4 Their question mix is a spec for your question set

Their 33% analyse, 41% apply, 21% understand, 4% remember, translated to SQL:

- about 4% single table SELECT
- about 21% WHERE plus ORDER BY
- about 41% one JOIN or a GROUP BY
- about 33% multi-table aggregate with a filter on the aggregate

This gives you a real answer to "how did you pick the questions", and more importantly it gives
you a deliberate spread rather than an accidental one. You need some questions people fail and
some they pass, otherwise the test cannot show a difference either way.

---

## 5. Numbers that help fill your null-result checklist

`../ANALYSIS-PLAN.md` section 4 holds the null-result checklist. Its numbers were filled on
14 Sep. This paper did not set them, but it anchors two.

**Ceiling.** Kestin hit the ceiling. Their own words: the real gains are expected to be larger
than the numbers reported, because of a ceiling effect. They had to use a different statistical
method to recover the true size. That happened with a carefully built test at Harvard.

Your scoring is result-set match, which is pass or fail per question with no partial credit. So
a ceiling hurts you more, and you have no clever method to rescue it.

Suggested threshold: the ceiling check fails if either arm scores above 80% on the removal test.

**Floor.** Their pre-test sat at about 61% of the eventual AI post-test score, so the material
was hard but not alien. Your baseline arm gets a real answer-giving chatbot for a week, so if
they still score near zero, the questions were wrong rather than the arms.

Suggested threshold: the floor check fails if the baseline arm scores below 20% on the removal
test.

Both of these are suggestions from one paper, not derivations. Pick your own numbers and commit
them before 27 Sep. Use your own rule: choose the number that would make you say the study did
not run, not the number you expect to beat.

**Do not borrow their statistical power.** An effect of 0.63 between two separate groups needs
roughly 40 people per group to detect reliably. You have 3 to 5. Kestin managed it with 194
students and a design where every student did both conditions, which removes person-to-person
differences entirely. This is another reason to analyse at the level of individual questions
rather than learner averages.

---

## 6. What does not carry over

**Their comparison is not your comparison.** Kestin is AI tutor against a classroom. Yours is
AI-with-a-giving-policy against AI-that-just-answers. So do not cite Kestin as support for your
giving policy. Cite it for the narrower claim that structured AI tutoring produces real
performance gains, which your baseline arm also benefits from.

**You cannot use their crossover design, and it is worth saying why.** Having every person do
both conditions only works when the first condition washes out before the second. Learning does
not wash out. Your Arm A learner is permanently changed, and worse, has learned how your tool
behaves. So separate groups with matched-pair randomisation is forced on you rather than chosen.
Explaining a choice you did not have is still worth credit.

**Their test could measure degrees of understanding. Yours cannot.** Physics conceptual
questions carry partial credit. A query either returns the right rows or it does not. Another
reason the per-question analysis is doing the work.

**Time on task is not a measurement instrument.** They logged it and found no relationship with
score. Log it to check your manipulation worked, never as a stand-in for effort or learning.

---

## 7. A small thing that helps one of your assumptions

Your assumption 3 says withholding help might cost so much motivation that learners quit.

Kestin's tutor scaffolded, sequenced and made students work through parts themselves, and
engagement and motivation both came out higher than the classroom, with enjoyment unchanged.

This is weak evidence: different comparison, no withholding manipulation, and self-report taken
immediately. But it points the same way as the Wu re-reading in `RESEARCH-READING.md`. The
motivational cliff is probably a withdrawal effect, and your baseline arm is the one that gets
used to full answers and then loses them.

Two papers now say assumption 3 is aimed at the wrong arm. Reword it next time you add to
`../HYPOTHESIS-LOG.md`.

---

## 8. Still to do

Their full system prompt is in Supplementary Material 1, which blocks automated downloads. Get
it by hand from the article page. It is the closest published example of a pedagogical guardrail
prompt that actually worked, and it is worth 20 minutes before you write your level templates.
Read it alongside the CodeAid paper when you build the thin slice.
