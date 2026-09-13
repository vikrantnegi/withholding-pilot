# Koedinger & Aleven (2007): when should a tutor give help, and when should it hold back

Educational Psychology Review 19(3), 239-264. DOI 10.1007/s10648-007-9049-0
Read 7 Sep 2026. Rewritten in plain English the same day.

## The short version

Your problem has a name. It is called the assistance dilemma, and this 2007 review is the paper
that named it. It also reaches a conclusion that runs against your hypothesis.

Read this one differently from the other two in this folder. Bastani and Soderstrom & Bjork
support you. This is the paper someone will use against you. Sections 2 and 3 are the attack and
the defence. The rest is build material, and there is a lot of it.

---

## 1. The dilemma, in their words

The question, p. 242:

> "To what degree should an interactive learning environment provide students with information
> relevant to their learning processes and what are the most opportune moments for doing so? And
> when is student learning supported more effectively by withholding information, either
> temporarily, until the student has had an opportunity to generate or synthesize the information
> for him or herself, or even permanently?"

Their trade-off table, p. 242. Worth putting in the PRD as it is:

| | Benefit | Cost |
|---|---|---|
| **Giving** help | Accuracy. Efficient communication. The thrill of succeeding with support. | Shallow processing. Loss of attention. May not engage long-term memory. Stealing the chance to shine. |
| **Withholding** help | The generation effect. Forces attention. Engages long-term memory. The thrill of independent success. | Errors. Floundering, confusion, wasted time. The frustration of failing. |

"Stealing the chance to shine" is doing real work in that table. It is a motivational cost of
giving help, sitting on the same side as shallow processing.

Your design currently treats motivation only as a cost of withholding. Wu and Kestin already
suggested that was aimed at the wrong arm. This is a third source saying the same thing from a
different direction.

Their closing statement of the problem, p. 260:

> "The crux of the assistance dilemma is prescribing decision criteria (e.g., conditions and
> cut-off parameters) for when it is best to switch between information giving (more assistance)
> and information withholding (less assistance). This dilemma may be the fundamental open problem
> in learning and instructional science."

**That sentence is your project.** A per-learner, per-concept estimate that picks a response
level is exactly a decision criterion with cut-off parameters.

Open with this. It reframes your capstone from "I built a SQL tutor" to "I ran an experiment on
what this field calls its fundamental open problem", and it costs you nothing because it is true.

---

## 2. The objection you have to answer

Their conclusion after reviewing all their experiments, p. 255:

> "Generalizing beyond the specifics of the studies, it seems implied that within a context of
> tutored problem solving, information should be withheld very sparingly and that subsequent
> research on improving tutored problem solving may be more successful if it focuses on methods
> to give more information rather than methods to withhold it."

Read that again. The most cited review of the assistance dilemma concludes that the promising
direction is giving more, not withholding more. You are building a withholding policy.

Every experiment they review lands the same way. Withholding correctness feedback lost.
Withholding explanations lost. Leaving the decision to the student lost. Across their own
studies the score is roughly giving 3, withholding 0.

If you walk into a defence without an answer to this, and the evaluator knows this literature,
that is where the project falls apart. So write the answer down first.

---

## 3. The answer, and it is a good one

They say it themselves, earlier in the same paragraph, p. 255:

> "This conclusion should not be interpreted as sweeping support for information giving in
> general, because it is important to recall that these strategies were evaluated in a context in
> which students were engaged in active problem solving, which is an important kind of
> information/assistance withholding."

Their whole "give more" conclusion is measured from a starting point that already withholds the
solution. In every study they review, the student is solving the problem. Nobody is being handed
the answer, because in 2007 no machine could hand it to them.

**Your Arm B sits below that starting point.** An answer-giving LLM with the schema pasted in is
not tutored problem solving. It is the condition their literature never tested, because it did
not exist.

So the two claims do not collide. Theirs is: given the learner is already solving the problem,
add information rather than remove it. Yours is: the learner has stopped solving the problem
entirely, and the question is how to get them back to it.

Say it in the PRD roughly like this:

> Koedinger & Aleven conclude that within tutored problem solving, assistance should be withheld
> sparingly. That conclusion is anchored to a baseline where the learner still generates the
> solution. A general-purpose LLM assistant removes that baseline, because it produces the
> artefact on request. This project therefore does not argue against their finding. It asks the
> prior question their baseline assumed away, which is how to restore problem solving as the
> learner's activity when a system capable of finishing the task is present.

That is a stronger position than "withholding is good", and it is the honest reading.

---

## 4. The number that turns your policy into a rule

The most directly useful thing in the paper, from the conclusion, p. 260:

> "Given that a key downside of information withholding is errors and floundering (if not
> complete failure), a rough criterion for deciding to give rather than withhold is when the task
> gets too difficult and thus the probability of error or unproductive thinking is high. What is
> the probability of error that is the ideal threshold point? That is a great question for future
> research."

They then cite the only concrete estimate available. Pavlik (2007) proposed an ideal error rate of
about **5 to 25%**, worked out from cognitive-architecture simulations and supported by
experiments on practice scheduling. They add that whether it holds for anything more complex than
simple fact learning is wide open.

**What this gives you.** Your PRD currently says a competence estimate picks a level, without
saying what the estimate is compared against. Now you have an answer:

> Give more help when the learner's predicted chance of getting the next step wrong is above
> roughly 25%. Withhold below that. The 5 to 25% target band comes from Pavlik (2007) via
> Koedinger & Aleven (2007), who name this threshold as the open question in the field.

Two levels plus one threshold is a policy you can put on a slide, write in ten lines, and defend.
Compare that with four levels chosen by an estimator you have not specified. This is the single
biggest upgrade to your cut list.

It also gives you an honest framing. They say the threshold is an open research question. You are
putting a number on it with six people. Your result will not settle it. Saying that out loud turns
a weakness into a strength.

---

## 5. The definition of "unaided", taken from a working system

The brief refuses to define this. Cognitive Tutors have had to define it in code since 1995, and
the definition is in their description of knowledge tracing, p. 248. The estimate for each step is
updated based on

> "whether the student performed the step correctly on her first attempt or whether she made an
> error or requested a hint."

Three states, decided by a script, no judgement needed:

1. Correct on the first attempt with no help requested. **This is unaided.**
2. Wrong on the first attempt.
3. Help requested before getting it right.

States 2 and 3 both count as not unaided. Note that **asking for a hint counts against you even
if the final answer is correct.** Getting there with help is a different event from getting there
alone, and their system has treated it that way for thirty years.

Translated to SQL:

> **Unaided** means the learner's first submitted query for a question returns a result set
> matching the reference query, with no help of any level served for that question. Any help
> served, at any level, marks the question as assisted regardless of the eventual result. On the
> removal test no help exists, so every question is unaided by definition and the measure is just
> result-set match.

That is precise enough for the scoring script, it comes from a deployed system rather than from
you inventing it, and it takes Q1 off your open list. Put it in the PRD word for word.

One related point, pp. 248-249. Their learning curves only came out smooth when they grouped
actions by knowledge component. Grouped generically, error rates showed no systematic decline at
all. That independently supports the per-question unit of analysis you already took from Bastani.
Two different literatures giving the same instruction: analyse at the concept level, not the
learner level.

---

## 6. What you must not withhold

**Corbett & Anderson (1995)**, p. 252. The Lisp Tutor with four feedback conditions: immediate
feedback, flag feedback (errors marked but no message until asked), on-demand feedback (errors not
even marked until asked), and no feedback until the end of the exercise.

Results:

- All three feedback conditions beat no feedback, both better and faster.
- **No difference in learning between the three feedback conditions.**
- Big difference in time. The immediate feedback group finished a fixed set of problems about
  **three times faster** than the no-feedback group.
- Given the choice, students mostly did not use it. In **90% of exercises**, the on-demand group
  did not ask for feedback until they already had a preliminary solution.

**The build consequence, and it is real.** Correctness feedback is not the thing to withhold. Both
of your arms should get immediate, identical, automatic yes or no on whether the result set
matched.

Your manipulation is about how much of the solution is revealed, not about whether the learner is
told they are wrong. If you withhold correctness in Arm A only, you have run two manipulations at
once and the removal test cannot tell you which one produced the gap. At three people per arm you
cannot spend your single comparison on an ambiguous contrast. Write this into the PRD as a design
constraint.

**McKendree (1990)**, p. 252-253. The Geometry Proof Tutor, testing two kinds of feedback content
crossed against each other: goal information (which sub-goal to pursue) and condition-violation
information (what was wrong about how a theorem was applied).

Explanatory feedback beat plain yes or no. The difference was statistically solid on the post-test
error rate and borderline during training. Students getting explanatory feedback were also more
likely to fix their errors on the next attempt. **The strongest single component was goal
information.**

So your lowest level of help matters. "Not quite, try again" is the weak version and this study
tested it. "You need to restrict the rows before you group them" is the version with evidence
behind it. Build goal information into the level 1 template.

---

## 7. The result that says your effect might not appear where you are looking

**Anderson, Conrad & Corbett (1989)**, p. 253. They compared the normal Lisp Tutor, which gives
explanatory hints and error messages, against a stripped version that just said "wrong" and handed
over the correct answer when asked for a hint.

> "They found that explanatory messages help students learn **faster, but not better.**"

Their reading: the students who saw answers generated their own explanations, and that simply took
longer.

Sit with this one. If it holds for you, Arm A and Arm B could land on the same removal-test score,
with Arm A having got there in less time. Your main measure would show nothing while a real effect
sat in a variable you were not recording.

**Cheap insurance:** log time-to-correct per question and total practice time per learner. It costs
nothing, you already have the timestamps for the harness, and it gives you a second measure that
can carry a result if the score gap comes out flat.

Note this cuts both ways with Kestin, where time on task showed no relationship with score. Log it,
but do not assume which way it will point.

---

## 8. Learners are bad at knowing when to ask for help, which defends your main design choice

The evidence, pp. 253-254, from log data across the Geometry tutor and several studies:

- Students **frequently click straight to the last hint to get the answer, without reading the
  hints that explain why.**
- Students **often do not ask for help even after several errors on the same step.**
- Baker et al. (2004) named this class of behaviour **"gaming the system"**: fast repeated
  guessing, or asking for hints faster than could possibly be useful.
- Their verdict, p. 254: "These results contradict the notion that students may be better able than
  the system to decide when they can benefit from the tutor's help messages."

Cognitive Tutors were originally built on the assumption that the student is the better judge of
when they need help. Two decades of logs said no.

**This defends your central design choice.** Your system picks the level rather than letting the
learner pick. That is the conclusion this field reached the hard way. Say so in the PRD, because
from outside "the system decides" can look like paternalism, and here it is an evidence-backed
correction to a documented failure.

Their attempts to fix it by teaching help-seeking did not work well. Roll et al. (2006) built a
help-seeking tutor that reduced bad help-seeking behaviour and produced **no improvement in
geometry learning.** Baker et al. (2006) added a gaming detector to a Data Analysis tutor, which
reduced gaming, but the learning difference was **not statistically reliable**, probably because
harmful gaming showed up in only about **10% of students**.

Two things follow. First, do not spend build time on teaching learners to seek help better. It has
been tried and does not pay at your scale. Put it in the cut list. Second, that 10% figure is a
recruitment risk. At three learners per arm, one gamer is a third of an arm. Watch for fast
repeated submissions in the logs and decide how you will handle such a participant before 28 Sep,
not after.

There is a generous reading of gaming worth keeping, p. 259. Some students may be sensibly grabbing
a correct step **to use as a worked example**, because they cannot yet produce it themselves.
Crowley & Medvedeva (2006) found medical students doing this early in a curriculum who then showed
greater independent success later. So escalating to a full answer is not automatically failure. It
may be the learner correctly deciding they need an example first. That is also the generous reading
of your 11pm learner.

---

## 9. Mastery learning, and the mechanism that makes escalation cost something

Three studies, p. 254. Anderson et al. (1989) and Corbett & Anderson (1995) both found that picking
problems based on individual mastery beat giving everyone the same fixed set. Corbett (2001) added
the time analysis: the mastery approach produced large learning gains **at almost no extra time
cost**, with students solving many more problems in roughly the same time.

Then the detail that solves a problem you actually have, p. 255:

> "the mastery-level criterion discourages a 'gaming' strategy by which students repeatedly ask for
> hints until the next problem-solving step is revealed to them. Under the mastery-level criterion,
> this strategy yields short-term success only. It helps in getting through the problem at hand,
> but it will lead the tutor to assign more problems later on."

**This is your answer to Q2.** The learner who wants the answer at 11pm is not refused and not
lectured. They escalate, they get the full answer, and the concept stays unmastered, so it comes
back later.

Combined with the Kornell finding from Soderstrom & Bjork, that a failed attempt before help still
teaches, your Q2 answer is now complete and never requires saying no:

1. An attempt must be logged before any help is served. The failed attempt is the treatment.
2. Escalation to a full answer is always available after that attempt.
3. Escalating means the concept is not counted as mastered, so it reappears.

Nobody is blocked. The mechanism survives. That is a far better answer than "the system decides
what is good for you."

**Also worth knowing what powers their estimator**, p. 249. Knowledge tracing is a Bayesian update
with three fixed numbers: the chance of learning a component from one encounter, the chance of
guessing right without knowing, and the chance of slipping up despite knowing. This is Bayesian
Knowledge Tracing, which item 8 in your reading list already told you to avoid at your sample size.
This paper is the citation for what your simpler two-level rule is approximating. Cite it as a
deliberate simplification with a named reason rather than a gap.

---

## 10. Faded examples: a cheaper alternative to a competence estimator

**Schwonke et al. (2007)**, p. 257. They added worked examples to the Geometry Cognitive Tutor with
a twist. Instead of alternating examples and problems, they **faded** them. The first item shows
every step worked out. Across later items the answers to steps are progressively removed, until the
example has quietly become a problem. Every step stays interactive, and on example steps students
explain the worked step and get feedback on their explanation.

Result: the faded group **learned more efficiently, taking significantly less time to reach better
post-test results on factual knowledge and equal results on procedural knowledge.**

Two things follow, and the second might change your build.

**First, an ordering claim that inverts your instinct**, p. 257:

> "it may be better for beginning learners to have information-giving examples come before
> information-withholding problems. And then transition to tutoring, where examples follow problems
> in the form of as-needed hints, as learners begin to develop greater independent competence."

You screened your participants for a floor, meaning they genuinely cannot write SQL. For the very
first question on a new concept, the evidence says give first and withhold after. If your policy
starts every learner at level 1 on question 1 of a concept, you are running the schedule backwards
for exactly the people you recruited. Fix that before the baseline round.

**Second, and this one deserves real thought.** A fading schedule is a giving policy that needs no
competence estimator at all. Help decreases by position in the sequence rather than by inference
from performance.

At three learners per arm your estimator runs on a handful of observations per concept, which your
own reading list already called noise dressed up as a model. A fixed fading schedule would be
simpler to build, simpler to explain, impossible to accuse of overfitting, and it has a positive
result behind it.

I am not saying take it. Adapting to the learner is the interesting claim and it is what makes this
a policy rather than a curriculum. But decide it deliberately and record the decision, because "I
considered a fixed fading schedule and chose adaptation because X" is the kind of defended choice
that earns credit, while never having considered it is a hole. If the estimator turns out to be
what makes you miss 20 Sep, fading is your fallback, and you should know that now rather than on
19 Sep.

**A contrast case, McLaren et al. (2006)**, p. 256. Putting worked examples between problems in a
chemistry Cognitive Tutor produced **no benefit at all**, replicated with both college and high
school students, so it was not simply that the examples became useless as students improved.

Their explanation is a sentence worth stealing, p. 257:

> "the tutor dynamically converts a problem-solving experience into an annotated worked example when
> the student is having enough trouble such that they request the final 'bottom-out' level of hint."

Your level 4 is not a failure state. It is a worked example, delivered exactly when the learner
needed one. That reframing is worth a line in the PRD and makes the top of your ladder defensible
instead of embarrassing.

---

## 11. The intelligent novice, and why your result-set check is also teaching

**Mathan & Koedinger (2005)**, p. 259. The quietly most useful study in the paper.

They reframed the argument about immediate versus delayed feedback as a question about **what model
of good performance you are grading against.**

An expert model flags every error the instant it appears. An **intelligent novice** model allows
certain initial errors, as long as the learner catches them right away, and only steps in if they
do not.

Students learned more from the intelligent novice tutor, and it was better on **every measure**:
the immediate post-test and the delayed retention and transfer tests.

Their analysis rules out the obvious explanation. The benefit was already present from the
student's **first exposure** to the manipulation, which is far too fast to be a newly acquired
skill at monitoring yourself. Their preferred reading is that seeing the downstream consequence of
an error lets the learner work out why their approach failed. Siegler (2002) points the same way:
explaining incorrect solutions to yourself helps, because learners need to weaken wrong knowledge
and not only strengthen right knowledge.

**Why this matters more for you than for them.** SQL has unusually visible consequences. A wrong
query returns a wrong result set and the learner can look at it: wrong row count, wrong columns,
duplicate rows from a bad join, an empty result from a filter that killed everything. The error
shows up in the output in a way a wrong algebra step does not.

So run the learner's query, show them their result next to the expected shape, and give them a beat
to catch it themselves before any help is served. Your scoring harness already produces that
comparison. You built it as a grader. This paper says it is also the instruction, and using it that
way costs nothing extra.

Fold that into the attempt rule from Soderstrom & Bjork: attempt, run, see the result, chance to
self-correct, and only then does the policy decide what to give.

---

## 12. Effect sizes for context, and one recruitment detail

Useful for working out what a good result even looks like, pp. 250-251:

- Expert human one-to-one tutoring: about **2 standard deviations** better than classroom teaching
  (Bloom 1984). This is the ceiling everyone in this field is chasing.
- Geometry Proof Tutor: about **1 standard deviation** better than the same teacher's non-tutor
  students.
- Lisp Tutor: **30 to 43%** higher learning gains and **30 to 64%** more efficient learning than a
  standard programming environment.
- Cognitive Tutor Algebra: **15 to 25%** higher on standardised test items and **50 to 100%** higher
  on problem-solving items.

Your study cannot detect anything subtle. If your effect is real and anywhere near these, it should
be visible by eye. If you need statistics to find it at three people per arm, it is not there.

**One recruitment detail worth acting on**, p. 251. The Geometry Proof Tutor's benefit "was not
observed for students working with the tutor in pairs, indicating that the tutors support individual
learning more effectively than collaborative learning."

Run your sessions one to one. If two colleagues want to do it together to make it less awkward, that
is a contaminated data point, and it is much easier to say so when booking than to discover on
21 Sep.

---

## 13. A warning about the cheap second measure

Your reading list has a Tier 2 suggestion from Fan et al.: add a self-assessment prompt per question
and score how well-calibrated people are. It is described as a second measure for almost no build
cost. This paper is a caution on that.

**Aleven & Koedinger (2000b)**, p. 258. A version of the Geometry Cognitive Tutor asked students to
type explanations of the principle they were using, with **no feedback** on those explanations. In a
high school pilot, students made a reasonable attempt **less than 10% of the time.** The rest were
inadequate or plainly off-task, including responses like "because I said so."

Their conclusion: self-explanation without feedback works in the lab because an experimenter is
sitting there. Remove the adult and compliance collapses.

Your 21 Sep session is unsupervised or lightly supervised, three weeks into a volunteer commitment.
A free-text prompt with no feedback will produce garbage. If you want a second measure, use a
**forced-choice confidence rating** instead. Cheap, hard to ignore, and it still gives you
calibration. Save free-text self-explanation for a version of this project with a supervisor in the
room.

---

## 14. The sentence to build the PRD around

Their conclusion opens with it, p. 259:

> "Instructional interaction should optimize student involvement, not maximize or minimize it."

Your current framing is "assisted independence" and "withholding". Both are minimising words, and
they invite the objection in section 2.

This sentence gives you a better frame. **Your policy is an allocator, not a withholder.** It
decides how much of the solution the learner produces versus receives, and both extremes are
failures. Answer-giving maximises. Pure discovery minimises. The thing being graded is the
allocation rule in between, which is exactly what you are building and measuring.

Rewriting the one-line description in those terms costs you an afternoon of nothing and makes the
whole project harder to attack.

---

## 15. What to actually do, in rough order of value

1. **Write the section 3 rebuttal into the PRD.** The "give more, not less" conclusion is the
   strongest objection to your project and the answer is short. Do not leave it to be discovered
   live.
2. **Adopt the error-rate threshold from section 4.** Give when the predicted chance of error is
   above about 25%, citing Pavlik (2007). Two levels, one number, one citation. This is your policy
   spec.
3. **Adopt the Q1 definition from section 5 word for word.** Correct on the first attempt with no
   help served. A hint request marks the question assisted even if the answer is right.
4. **Make correctness feedback identical across both arms** (section 6). Your manipulation is
   solution content, not correctness. Do not run two manipulations at once.
5. **Put goal information in the level 1 template** (section 6). "Try again" is the weak version and
   McKendree tested it.
6. **Log time-to-correct and total practice time** (section 7). Insurance against a flat score gap
   with a real effect sitting in efficiency.
7. **Use mastery non-completion as the cost of escalation** (section 9). This completes your Q2
   answer without ever refusing anyone.
8. **Show the learner their result set before serving help** (section 11). Your harness already
   computes it. Free instruction.
9. **Give first on the first item of a new concept, withhold after** (section 10). You screened for
   a floor, so item 1 of a concept is where a beginner needs an example.
10. **Decide the fading question deliberately and write down why** (section 10). Adaptation over
    fixed fading is defensible. Not having considered it is not.
11. **Cut help-seeking scaffolding** (section 8). Tried in two studies, no reliable learning
    benefit. Straight to the cut list.
12. **Use forced-choice confidence, not free-text self-explanation** (section 13).
13. **Run sessions one to one, no pairs** (section 12).
14. **Reframe the project as allocation rather than withholding** (section 14).
