# Research: reading list and paper notes

`RESEARCH-READING.md` is the reading list. It covers everything worth reading, sorted by when it
becomes useful, and says what each paper would change. Start there.

Everything else in this folder is a note on a paper that has been read. One file per paper. Each
one answers the same question: what does this paper change in the build? None of them are
summaries for their own sake.

All written in plain English. Numbers, quotes and page references come straight from the papers.

## Papers read

**`bastani-2025-generative-ai-harms-learning.md`** (appendix 2 Sep, full paper 7 Sep 2026)
The study this project exists because of. A thousand Turkish students, GPT-4 during maths
practice, then an unassisted exam. Answer-giving AI left students 17% worse than students who
never had AI. A guardrailed tutor removed the harm but produced no gain. Also contains the
guardrail prompt worth copying, evidence that students were copying rather than reading, and the
uncomfortable arithmetic about how small the effect being chased actually is.

**`koedinger-aleven-2007-assistance-dilemma.md`** (read 7 Sep 2026)
The paper that named the problem. Contains the strongest objection to the whole project, and the
rebuttal. Also supplies the operational definition of "unaided", a concrete threshold for when to
give help (predicted error rate above about 25%), the finding that correctness feedback must not
be withheld, and mastery non-completion as the cost that makes escalation non-free. Read before
defending the PRD.

**`soderstrom-bjork-2015-learning-vs-performance.md`** (read 5 Sep 2026)
Why the removal test is the measurement and practice completion is not. A century of evidence
that doing well in practice and learning something are different variables that often move in
opposite directions. Gives the mechanism (storage strength versus retrieval strength), the rule
that an attempt must be logged before help is served, and the prediction that Arm A will report
lower satisfaction while scoring higher.

**`kestin-2025-ai-tutor.md`** (read 3 Sep 2026)
An AI tutor beat a Harvard physics class on a test taken in the same session. It never measured
what survives once the tutor is removed. Also four build decisions worth copying, including
grounding every level of help in a pre-written reference solution.

## The table this all comes down to

| Study | When measured | Delay after practice | Assistant present? | Result |
|---|---|---|---|---|
| Kestin 2025 | after the lesson | none | yes | AI tutor much better than classroom |
| Bastani 2025 | end of same session | none | no | Answer-giving 17% worse than no AI. Guardrailed tutor level with no AI. |
| Yours, 27 Sep | separate session | 5 to 7 days | no | empty |

Same kind of intervention, opposite-looking conclusions, and the only things that changed are
when the measurement happened and whether the help was still there.

## Where the rules keep converging

Three papers, three fields, one rule: **serve no help until the learner has shown an attempt.**

- Bastani's guardrail prompt: "Do not provide them with help until they have provided this."
- Soderstrom & Bjork via Kornell (2009): a failed attempt before seeing the answer still teaches.
- Koedinger & Aleven: students who can request help freely click straight to the answer.

Two papers, one rule: **ground every level of help in a pre-written correct solution rather than
letting the model generate one.** Both Bastani's tutor and Kestin's tutor did this, and both
credit it for the quality of the help.

## Not yet read

Tier 2 in `RESEARCH-READING.md`: Fan et al. on metacognitive laziness, Aleven et al. on hint
abuse, Kalyuga on expertise reversal, CodeAid, and Bayesian Knowledge Tracing as background.
All deliberately deferred to the build phase, each tied to the problem it solves.
