# Prior art & prep: Learning OS
Compiled 2 Sep 2026. Read the top three before the 6 Sep scope lock. The rest during the build.

**Read this file for what each paper CHANGES in the build.** It is not a bibliography.
Nothing here is worth reading for its own sake. 35 days to 7 Oct.

---

## TIER 1 — before 6 Sep scope lock. These change the PRD.

### 1. Bastani et al. (2025), "Generative AI without guardrails can harm learning" — PNAS
https://www.pnas.org/doi/10.1073/pnas.2422633122
~1,000 Turkish high-school students. Three arms: control, **GPT Base** (plain answer-giving),
**GPT Tutor** (same model, pedagogical guardrails — withholds answers, gives hints).
Read the methods section and the exam results table. Skip the rest.

**Why it matters more than you think.** This is your experiment, already run, at 100x your n.
Two findings that hit your design directly:

- **GPT Base students did WORSE than control on the unaided exam.** Answer-giving didn't
  just fail to help; it actively damaged unaided ability.
- **GPT Tutor students were roughly INDISTINGUISHABLE from control on the unaided exam.**
  Guardrails removed the harm. They did not produce a gain over no-AI.

**What this changes.** Your falsification condition is "my arm ≤ baseline arm." Your baseline
arm is an answer-giving chatbot — i.e. the GPT Base arm, the one that got *hurt*. So you are
measuring against a damaged comparison, not against no-help. If your result comes in positive,
the honest reading is "withholding avoids the damage answer-giving causes," which is a weaker
and more defensible claim than "withholding builds skill." Decide now which claim you are
making, because it determines whether you need a third no-assistant arm.

At n=8-10 total you almost certainly cannot afford a third arm. **Say so explicitly in the
6 Sep PRD and defend it.** Rule C: "Choosing *not* to use a technique, and defending the
choice, counts as a decision." An evaluator who knows this paper will ask. Have the answer
written before they do.

**READ 2 Sep 2026 (SI appendix) and 7 Sep 2026 (full paper) → `bastani-2025-generative-ai-harms-learning.md`.**
Full extraction. Three things in it change the plan beyond what the appendix read produced.
First, the guardrailed GPT Tutor arm beat the answer-giving arm on PRACTICE performance too
(127% vs 48% over control), so the assumption that withholding costs today's completion is
wrong and needs rewording in the hypothesis. Second, their unassisted exam ran at the END OF
THE SAME SESSION, so the real gap between their design and ours is the 5-to-7-day delay, not
the removal itself. That is a sharper positioning claim than the one currently in the PRD seed.
Third, the exam effect they detected was about one sixth of a standard deviation with ~1,000
students; the Arm A vs Arm B gap we are chasing is about one fifth of an SD at n=6, which is
invisible. Say that in the PRD and lean on the interaction-classification manipulation check
(<20% non-superficial for answer-giving, >40% for a guardrailed tutor) as the measure the
sample size can actually support.

**Candidate HYPOTHESIS-LOG entry.** This is evidence that arrived and narrows the claim.
Log it if you agree with the reading.

### 2. Koedinger & Aleven (2007), "Exploring the Assistance Dilemma in Experiments with Cognitive Tutors"
https://pact.cs.cmu.edu/pubs/Koedinger%20Aleven%2007.pdf (free PDF)
Read the framing section, pp. 1-10. The rest is a study catalogue you can skim.

Your problem has a name, and it is 19 years old. The assistance dilemma: *when should
instruction give information and when should it withhold it, so the learner generates it?*
Your hypothesis is one specific answer to it. Reading this stops you from re-deriving
vocabulary the evaluators already have, and it gives you the "assistance giving vs assistance
withholding" framing to hang the whole PRD on.

Also: it is the best source of raw material for the brief's Q1 (*what counts as unaided,
precisely enough for a script to decide*), because the literature has fought over exactly
that operational boundary for two decades.

**READ 7 Sep 2026 → `koedinger-aleven-2007-assistance-dilemma.md`.** Full extraction, and the most
consequential of the three. It contains the strongest OBJECTION to this project ("within a
context of tutored problem solving, information should be withheld very sparingly... focus on
methods to give more information rather than methods to withhold it", p. 255) along with the
rebuttal, which is that their baseline already withholds the solution and an answer-giving LLM
sits below it. It also supplies: the Q1 definition, taken from knowledge tracing (correct on
first attempt with no help served; a hint request marks the item assisted even if correct); a
concrete policy threshold (Pavlik's 5-25% ideal error rate, which turns the level selector into
one rule with one number); evidence that correctness feedback must NOT be withheld, so both arms
get identical yes/no; mastery non-completion as the cost that makes escalation non-free, which
answers Q2 without refusing anyone; and faded worked examples as a simpler fallback if the
competence estimator threatens the 20 Sep date.

### 3. Soderstrom & Bjork (2015), "Learning Versus Performance: An Integrative Review"
https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/11/soderstorm_ra_learningvsperformance.pdf
Read the abstract and the "performance is not learning" section. ~30 min.

The mechanism paper under your entire design. Performance during practice and learning
measured later routinely **dissociate** — conditions that speed up practice often slow
down retention, and vice versa. This is the precise justification for:

- why the removal test, not practice completion, is your dependent variable (criterion E2)
- why "completion during practice drops" is an *expected* signature of a working mechanism,
  not a failure (the brief's Q4)

If you can only read one thing, read this one. It is the sentence-level defence of your
whole measurement choice.

**READ 5 Sep 2026 → `soderstrom-bjork-2015-learning-vs-performance.md`.** Full extraction. Six changes come out
of it: the storage-strength/retrieval-strength mechanism replaces the current hypothesis
wording; "log an attempt before serving any help" becomes a policy rule (failed generation
still teaches, Kornell 2009); Baker (1968) is the 1968 motor-learning twin of Bastani and
should be cited beside it; a short practice-to-removal gap can flip the result's SIGN, not
just shrink it, so per-learner elapsed gap joins the null-result triage; Arm A is PREDICTED to
report lower satisfaction than Arm B, so pre-commit that before 27 Sep; and concept-paired
held-out questions are supported by three transfer studies.

---

## TIER 2 — during the build. Read when you hit the problem each one solves.

### 4. Fan et al. (2025), "Beware of metacognitive laziness" — BJET
https://bera-journals.onlinelibrary.wiley.com/doi/10.1111/bjet.13544
**Read before you finalise your counter-metric.** Your PRD tracks *abandonment* as the
counter-metric to retention. This paper argues the real harm channel of answer-giving is
that learners offload **monitoring and evaluation**, not just effort — they stop checking
whether they understand. Abandonment may be the wrong instrument: a learner can stay
engaged, complete everything, and still have offloaded the part that matters.
Cheap fix: add one self-assessment prompt per question ("how confident are you this is
right?") and score calibration. That is a second dependent variable for ~zero build cost.
Pair it with the Wu motivation items (caveat section below) — same instrument, same
session, two dependent variables for one build cost.

### 5. Aleven et al. (2016), "Help Helps, But Only So Much" — IJAIED
https://link.springer.com/article/10.1007/s40593-015-0089-1
Plus the 2026 follow-up on unproductive hint use:
https://dl.acm.org/doi/10.1145/3785022.3785040
**Read before you build the ladder.** Two decades of evidence that learners click straight
to the bottom-out hint. Your nudge → hint → scaffold → answer ladder will be gamed unless
the escalation path costs something. This is the brief's Q2 (*learner wants the answer at
11pm; who decides?*) as an empirical finding rather than a philosophical one. The answer
is usually: let them escalate, but instrument it, and treat escalation rate as data.

### 6. Kalyuga (2007), "Expertise reversal effect and its instructional implications"
https://www.uky.edu/~gmswan3/EDC608/Kalyuga2007_Article_ExpertiseReversalEffectAndItsI.pdf
The theory your competence estimate implements: guidance that helps a novice actively
*harms* a more competent learner. Your per-learner-per-concept estimate is the expertise
reversal effect operationalised. One paragraph of the PRD, cited, buys you criterion E3.

### 7. Kazemitabaar et al. (2024), "CodeAid" — CHI
https://arxiv.org/html/2401.11314v1
**The closest engineering analogue and the most useful for the BUILD.** An LLM programming
assistant with pedagogical guardrails, deployed to 700 students for a semester. Contains
what students actually asked for, where the guardrails leaked, and a design-space taxonomy
of help types. Steal the interaction design; do not re-derive it. Read this the week you
build the thin slice.

### 8. Bayesian Knowledge Tracing — background, not a paper
https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing (20 min is enough)
**Read this to talk yourself OUT of building it.** BKT infers a per-skill mastery
probability from a sequence of correct/incorrect attempts. It needs many observations per
skill to converge. With 8-10 learners and a short question set, you have a handful of
observations per concept. A BKT posterior will not resolve four levels — it will be noise
dressed as a model.

This is untested assumption #2 in your HYPOTHESIS-LOG, and the literature settles it before
you spend a day on it. **Two levels, selected by a transparent rule** (e.g. "did they get
the last question touching this concept right without escalating?") is the defensible scope.
It is also easier to explain on Demo Day, which is criterion E3.

---

## Two you already cite that need a caveat

**Kestin et al. (2025), Sci Rep** — https://www.nature.com/articles/s41598-025-97652-6
Harvard physics, AI tutor beat in-class active learning. You cite it as support. Note the
limit: it measured a post-test **close in time to the tutored session**, not unaided
performance after the assistant is removed and a delay has passed. So it evidences "AI
tutoring improves performance," not "AI tutoring improves later unaided ability."

That gap is not a weakness in your citation — **it is your contribution.** Say so out loud
in the PRD. It is the cleanest one-sentence answer to "why does this project need to exist."

**READ 3 Sep 2026 → `kestin-2025-ai-tutor.md`.** Full extraction. The caveat above is right but
understates it: Kestin's design *cannot* measure unaided-after-removal, and the paper admits a
ceiling effect. Four build decisions come out of it (reference-solution grounding, level
selection in code not prompt, freeze the test set before the policy, Bloom's mix as the
question-set spec) plus suggested floor/ceiling thresholds for `../TODO-HYPOTHESIS-v1.md` §4.

**Wu et al. (2025), Sci Rep** — https://www.nature.com/articles/s41598-025-98385-2
"Human-generative AI collaboration enhances task performance but undermines human's
intrinsic motivation." Four experiments, 3,562 participants, two consecutive text tasks.
Conditions include **Collab -> Solo** (AI on task 1, alone on task 2) vs **Solo -> Solo**.

You cite it in `../HYPOTHESIS-LOG.md` v0 and paraphrase it in `c7-capstone-decoded.md:333` as
*"learners sent back to work things out alone report lower motivation."* **Check the direction
before you rely on it.** The motivation drop and boredom increase land on the group that *had*
the AI and then lost it. That is a **withdrawal** cost, not a **withholding** cost. Wu also
found performance gains from collaboration did not persist into the independent task — the
same non-persistence Bastani reports, in adults, on text.

**What this changes.** Untested assumption #3 currently reads as "withholding costs so much
motivation that learners quit." Wu is not evidence for that. If anything it points the other
way at the 27 Sep removal test:

- **Arm B** (answer-giving chatbot) is Wu's Collab -> Solo condition almost exactly — a week
  of full answers, then a blank editor. That is where the cliff should land.
- **Arm A** never habituates to full answers, so there is less to withdraw.

So the abandonment counter-metric may be aimed at the wrong arm. Reword assumption #3 to name
withdrawal rather than withholding, and consider that your baseline — not your treatment — is
the arm at motivational risk on removal day.

Caveat on the caveat: Wu is adults, short text tasks, within a single session. "Less
habituation in Arm A" is inference, not their finding. Do not overclaim it in the PRD.

**Cheap action, and the reason this is worth 20 minutes.** Wu measures intrinsic motivation,
boredom and sense of control *at the transition point* — which is exactly your removal test.
Three Likert items on 27 Sep buys a second dependent variable for near-zero build cost, and it
is the only instrument that can distinguish "withholding built skill" from "withholding built
skill and cost us the user" (the risk already named in `../PRD-SEED.md`).

**Not Tier 1.** It changes a counter-metric and an assumption's wording, not the 6 Sep scope
lock. Read it when you write the removal-test instrument, not before the cut list. The Tier 1
budget stays at three.

---

# HOW TO PREPARE: reading is not the bottleneck

Blunt version, and it is your own file saying it (`../TEAM-DECISION.md`, standing note):
as of 1 Sep, **zero code, zero named participants.** Papers move criterion E1 (problem
understanding) and a little of E3 (architecture). They move **nothing** on E2 (the removal
test) or E4 (product quality) — and those two are the ones that need calendar time with
other humans in it. Reading is the comfortable move. Budget it and cap it.

**Reading budget: 3 papers, ~3 hours, this week.** Tier 1 only. Skim for design, not prose.
Anything more is meta-work.

## What actually prepares you, in binding order

**1. Recruitment. Today. (Due 6 Sep — 4 days.)**
The only thing with lead time you do not control. Every day of delay is a day of someone
else's calendar. 8-10 non-cohort people. Not a list of channels to try — named humans,
messaged. This is the single point of failure for the whole capstone and it is graded work
in its own right (rule A2).

**2. Pilot the question set on ONE person this week.**
Highest-value non-reading action available. Untested assumption #4 says your questions need
a floor and a ceiling — some learners fail, some succeed — and you cannot know that from a
desk. A 30-minute session with one colleague, schema pasted into ChatGPT, five questions,
tells you whether the 8-14 Sep baseline round is measuring anything at all. If the questions
are all too easy or all too hard, you find out with 33 days left instead of 20.

**3. Write the operational definition of "unaided" (brief's Q1).**
The brief refuses to give it to you, which means it is graded. It is a definition you *write*,
not one you read. Draft it before 6 Sep; it determines what your scoring script does.

**4. First commit: the scoring harness.**
Run learner query + reference query against Supabase, compare result sets, return match/no-match.
~100 lines. **Both arms need it.** The baseline arm needs no product at all — chatbot with the
schema pasted in — so the harness is the only code standing between you and running the
baseline on 8 Sep. It is also the thing that makes your measurement unarguable (rule A5).

## The order that matters

Recruit → pilot one person → define "unaided" → scoring harness → baseline round.
Tier 1 reading rides alongside, in the gaps. It does not go first.
