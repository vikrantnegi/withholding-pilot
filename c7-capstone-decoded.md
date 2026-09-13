# Cohort 7 final capstone, decoded

Plain-language walkthrough of all five problem statements, with the research jargon unpacked. Written to be read before choosing, not after.

Source: the five C7 Capstone Module 3 briefs and the Capstone Project Submission Template.

---

## How to read this

Each project below follows the same shape:

1. The problem, in ordinary terms
2. The research behind it, with what the numbers actually mean
3. Terms decoded
4. The loop, step by step, naming who does what
5. What you have to prove
6. What they will press you on
7. What makes it hard

Skip to the comparison table at the end if you only want the decision inputs.

---

## What all five have in common

Every brief has the identical skeleton: an observation, a stated hypothesis you can prove wrong, your challenge, three known mechanisms each ending in a question, a list of questions to think about, and a grading table. All five end with the same banner: complexity is not credit.

Every grading table contains a row about product quality, meaning the thing runs start to finish on input you had not seen or for a person not on your team. Every grading table contains a row about learning, meaning evidence changed your hypothesis and you can show where.

So these are experiment briefs, not build briefs. The software is the instrument. What gets graded is a claim you can defend, backed by a measurement you actually ran on a real human who is not you.

That has one practical consequence. Choosing on "which would be most fun to build" optimises the variable the grading explicitly discounts.

### Submission deliverables

Four items, per the template: a live project link, a GitHub repo or workflow JSON, a demo video, and a written case study.

### Rules

One project per team or individual. Maximum four people per team.

---

## Glossary of recurring terms

These appear across several briefs.

**Arm.** One condition in an experiment. If you run "the person alone", "the agent alone" and "the two together", that is three arms. You run all three on the same task and compare.

**Baseline.** The arm you have to beat. Usually the simple, obvious thing someone would do without your system. If you cannot beat the baseline, you have not built anything, and every brief tells you to report that rather than hide it.

**Held out.** Questions or data you deliberately reserved from the start and never showed during practice. Used at test time so you measure skill rather than memory.

**Result set.** The rows a database query returns. Comparing two result sets is how you check a query is correct without anyone giving an opinion.

**Effect size.** How big a difference something makes, as opposed to whether a difference exists at all.

**Statistical significance and p-values.** A p-value is roughly the chance you would see this result if nothing real was going on. p=0.31 means a 31% chance it is noise, which is high, so the result is treated as not significant. Below 0.05 is the usual bar.

**Ethics review board.** Any study involving human participants has to be approved by a review board before it runs. This constrains what research exists, which is why some obvious questions are permanently unanswered.

**Provenance.** Where a claim came from. Which lab, which study, which year, which population.

---

# 1. Genome intelligence

## The problem

A woman uploads her raw DNA file and asks whether there is anything in it she should know about. A tool scans millions of genetic differences, narrows them to a ranked handful, and shows a source for each. She opens the source behind the top one and finds two laboratories that looked at the same genetic change and reached opposite conclusions, four years apart.

## Terms decoded

**Raw genotype file.** What you get when you download your data from a consumer DNA test. A text file with hundreds of thousands of lines. Each line names one position in your genome and says which version you carry.

**Variant.** One position where your DNA differs from the reference. Most are harmless. A few matter.

**ClinVar.** A public database where laboratories submit their interpretation of what a given variant means. It aggregates submissions. It does not referee between them.

**GWAS Catalog.** A public collection of studies linking genetic variants to traits and diseases, along with who was studied.

**Polygenic score.** A number combining many small genetic effects to estimate someone's risk for a trait. Built from the population that was studied, so it travels badly to other populations.

## The research

ClinVar has over two million variants. About 41% are marked uncertain or have laboratories in conflict. 78% come from a single laboratory, meaning one lab saw it once and filed an opinion. When researchers went back and re-checked 217 variants previously called dangerous, they downgraded 40% of them.

As of January 2024, the GWAS Catalog was roughly 78% European-ancestry participants. Polygenic score accuracy falls by around 37% for people of South Asian ancestry and around 78% for people of African ancestry.

Read plainly: for a large share of people who would use a tool like this, the strongest available evidence was measured on somebody else.

## The point being made

This looks like a search problem. It is not. The records are easy to find. The hard part is deciding who is right when sources disagree, and a clean ranked list quietly asserts that decision has already been made.

## The hypothesis you would be testing

If every finding carries its evidence strength, its source, and the population it was measured in, the user will reject a measurable share of findings rather than accept the ranking. Disagreement is the signal a ranked list destroys.

## The loop, step by step

1. You pick one area of genetics and one real person you can actually reach.
2. That person gives you a full variant file. You did not choose it in advance and have not tuned against it.
3. Your system reduces it to a small number of findings.
4. For each finding, the user can see what supports it, what contradicts it, how old that evidence is, and which population it came from.
5. The user can push back on any finding. Disagreement is an output, not an error you hide.
6. Refusing to report is a valid outcome. Two findings you can defend beat ten you cannot.

This is helping someone make sense of their own data. It is not diagnosis and nothing in it should stand in for a clinician.

## What you have to prove

It works start to finish on a real file you did not hand-pick, tested with one person who is not you and not a classmate.

## What they will press you on

When two sources disagree, which part of your system breaks the tie, and on what grounds?

What does your system do when the best evidence available was not measured on people like your user?

Your user cannot go and run a study to check you. What is the cheapest check they can actually perform, and does your output end there?

What happens to a finding you already showed once its classification changes?

What is left if you remove the model entirely, and is that actually worse?

## What makes it hard

Not the pipeline. You would be designing a policy for handling scientific disagreement while learning genetics vocabulary at the same time. This is the only one of the five with a real domain-knowledge cost attached.

## Human requirement

One person, once.

---

# 2. Collaborative intelligence

## The problem

Researchers ran three terminal coding agents on the same set of real work tasks. Working alone under a carefully tuned prompt, Gemini CLI scored highest of the three. Then they sat a working professional next to each agent. Gemini CLI finished last. Claude Code finished first, even though it scores below Codex on the standard benchmarks.

So the number that predicts how good an agent is on its own does not predict how useful it is next to a person. Nobody publishes the second number.

## Terms decoded

**SWE-bench Verified and GDPval.** Standard benchmarks for scoring coding agents working alone.

**Bayesian rating.** A scoring method that separates how much the human contributed from how much the agent contributed, rather than just scoring the combined output.

**Local optimum.** A decent-looking answer that a search gets stuck on because every small step away from it looks worse, even though a much better answer exists elsewhere.

**Channel.** Whatever information passes between the human and the agent. Could be text, a score, a diff, a rating. Designing this is most of the work.

## The research

CollabSkill (Shao et al., 2026): 93 workers, 5 agents, 386 sessions.

Two of the tools tested run on the same underlying model and still ranked differently, so the interface itself is a variable, separate from the model.

The human side varied more than the model side. The best quarter of workers beat the fully automatic agent 74% of the time. The worst quarter managed it 27% of the time.

An obvious idea is to replace the human with a second model. Li et al. (2026) tested that on a group search task. Human plus AI groups beat both human-only and AI-only groups. Two mixed LLMs paired together recovered almost none of that gain.

Both are 2026 snapshots on frozen versions. Trust the direction, not the exact magnitudes.

## The hypothesis you would be testing

If a human and an agent working on one task share a channel carrying only what each cannot produce alone, the pair beats both halves. The reasoning: they fail differently. The human converges too slowly. The agent cannot tell that it is stuck.

## The loop, step by step

1. Find one repeated task a real person actually does, frequently enough that you can observe at least 30 runs during the capstone window. Not you, not a classmate.
2. Build them a working partner for that task.
3. Run arm one: the person working the way they work today, with no help from you.
4. Run arm two: the agent doing the task alone, with no human, under your best honest prompt.
5. Run arm three: the person plus your system.
6. Score all three on the same task and report all three numbers.

Arm two is the one teams skip and the one that decides whether you have anything. If the pair loses to the agent alone, the human contributed nothing and your channel design did nothing. That is a finding, and reporting it beats never running the comparison.

## The rule you cannot break

You may measure the pair and your own system. You may not measure an individual worker in a way that feeds a consequential decision about that worker.

## What they will press you on

In your loop, who notices the work is heading the wrong way, and what do they see that tells them? In the study, human and hybrid groups widened their search when they stalled and narrowed it as they closed in. AI-only groups showed almost no relationship between how well they were doing and how broadly they searched, and ran a fixed strategy into a local optimum.

What is the smallest thing that must cross between the two sides? Giving agents the full history of previous attempts did not beat passing a single scored best guess, and letting them exchange free-text advice made performance significantly worse. The channel that worked carried a scored result, not an opinion.

More interaction is not more collaboration. Across 386 sessions, the number of user turns predicted nothing. Specific moves did: naming who the output is for, stating the tone, showing an example of good work. Naming the audience alone was worth roughly 16 points out of 100. So what does your design make automatic that a motivated user would otherwise have to remember?

What happens if you swap the model underneath? What if you swap the person?

## What makes it hard

Getting 30 real runs out of a real person's schedule. That is a calendar problem, not an engineering one, and no amount of coding speed compresses it.

## Human requirement

One working professional, sustained access, across at least 30 observed runs.

---

# 3. Creator OS

## The problem

A creator records a forty minute conversation on Friday. By Sunday it has become a thread, three clips, a newsletter section and two carousels, each drafted in under a minute. She still lost Sunday to it. She spent the day rewriting sentences that were fluent and wrong about her, and cutting an angle she had already published in March.

## Terms decoded

**Jagged frontier.** The idea that a model is strong on some tasks and weak on others, and the boundary is invisible. Two tasks can look equally easy and sit on opposite sides of it.

**Pre-registered experiment.** The researchers published what they were going to measure before they ran it, so they could not pick a favourable analysis afterwards.

**Percentage points.** A difference between two percentages. Going from 60% to 41% is a drop of 19 percentage points, not 19 percent.

**Archive as context versus archive as standard.** Context means you feed past posts into the prompt and hope the model imitates them. Standard means you generate a draft, then check it against the archive, asking whether this sounds like the creator and whether they already published this point, and reject drafts that fail. Same input, opposite direction of information flow.

## The research

Boston Consulting Group ran a pre-registered experiment with 758 consultants. On tasks inside the model's capability, work was faster and rated higher. On one task deliberately chosen to sit outside it, consultants using the model were about 19 percentage points less likely to reach the right answer than consultants using nothing at all. The two kinds of task did not look different from the outside. Confident help in the wrong place cost more than no help.

A second study looked at writers given story ideas by a language model. Their stories were rated more creative and better written. Those stories were also more similar to one another than stories written without help. Better individually, flatter collectively.

## The distinction that carries the brief

"Drafting is solved, only taste is left" is too coarse. Some taste work is checkable in seconds by a machine: is this claim in the transcript, has she said this before. Some cannot be checked until after publication. The repetitive work and the delegable work are two different sets, and the boundary runs through the middle of the workflow.

## The hypothesis you would be testing

If the system treats the creator's published archive as a standard that outputs must pass rather than as context they are generated from, the share of drafts accepted without substantive rewriting rises and holds across runs. The reasoning: the judgement that costs the creator the most attention becomes a check the system runs first.

## The loop, step by step

1. Find one real creator or small content team. Not a persona.
2. They must have at least twenty published pieces you can read, you must be able to reach them weekly, and they must personally accept or reject every output. The brief is blunt: if you cannot name them, you do not yet have this capstone.
3. Take their raw material in whatever form it arrives.
4. Carry it through to something publishable on a channel they already use.
5. Run that one workflow many times. One workflow run many times beats four run once.
6. Log every rejection with what happened next. A draft rejected and fixed in two minutes is a different result from one rejected and abandoned.

## What they will press you on

Where does the repetitive-versus-delegable line sit in your creator's workflow, and what did you observe to find it rather than guess?

The model pulls every creator toward the same middle. What would you measure to catch that drift, and against what reference?

Which of your checks can run before the creator's attention is spent, and which cannot run at all?

What did you notice about your creator's week that they did not tell you?

Which part would you still do by hand if the model were twice as good?

Publishing cannot be undone and takes one click. What stands before it?

## What makes it hard

Voice drift is easy to assert and hard to measure. You need acceptance rates across repeated runs and a reference to detect drift against.

## Human requirement

One creator, weekly contact, over the whole window.

---

# 4. Learning OS: assisted independence

## The problem

Someone needs a SQL query joining two tables on a date range. They paste their database structure into a chatbot, get a working query in four seconds, run it, move on. Six weeks later they open a blank editor on the same database and cannot start. The task got done. The skill never arrived.

## Terms decoded

**Schema.** The shape of a database. Which tables exist, what columns each has, how they relate. Say a `customers` table and an `orders` table.

**Supabase.** A hosted Postgres database. The learner can run real queries against real data in it.

**Rows.** What a query returns. Each row is one record from the result. If eleven customers match the question, the query returns eleven rows.

**Result set.** The full set of rows a query returns. Comparing the learner's result set to a known-correct one is how correctness gets decided by a script instead of by a person.

**Removal test.** Testing someone after taking your system away, to see what they retained rather than what they could produce with help.

## The research

Bastani et al. (PNAS 2025) ran a field experiment with nearly a thousand students. With an ordinary GPT assistant, practice performance rose 48%. The researchers then removed the assistant and tested them again. Those students scored 17% worse than students who never had one at all. Worse than nothing.

A second version of the assistant, which gave structured hints instead of answers, removed most of that damage.

The opposite result also exists. A carefully built tutor in a Harvard trial (Kestin et al., Scientific Reports 2025) produced more than twice the median learning gain of an active-learning classroom, in less time.

Same technology, opposite outcomes. The variable is what the assistant does when someone asks it for help.

## The trap in the middle

While your assistant is running, you cannot tell whether the learner is building the skill or borrowing yours. The query gets written either way. The learner feels helped either way. The difference only becomes visible later, when your system is not there.

## The hypothesis you would be testing

If the assistant decides how much to give based on what the learner can already do without it, then their unaided performance after removal improves without today's task completion collapsing. The reasoning: help withheld at the edge of ability forces the learner to retrieve rather than read, and retrieval is what makes a skill available later.

## The loop, step by step

The cohort fixes the skill and the stack for you. That is deliberate, and I will come back to why.

1. You show the learner a question written in English. For example, which customers ordered more than twice last quarter.
2. The learner writes a SQL query themselves.
3. The learner runs their query against the Supabase database.
4. The database returns rows, one per matching record.
5. You compare those rows against the rows a known-correct query returns.
6. If the two sets match, the learner got it right. If not, wrong.

Nobody judges the query for style or approach. A script runs both and compares outputs. That is why they picked SQL: grading is automatic and unarguable, which removes a large source of noise from your experiment and means you never have to defend your scoring.

Your system sits between steps 1 and 2. It decides how much help to give while the learner is writing. That giving policy is the actual thing you are building. Everything else is scaffolding.

## The removal test, step by step

1. Recruit at least six learners. None from your team. Six is the stated minimum.
2. Split them into two groups. One learns using your system. The other learns using an ordinary answer-giving assistant, roughly a chatbot with the schema pasted in. That second group is your baseline.
3. Both groups practise on a set of questions for however long your study runs.
4. Test both groups on held-out questions, reserved from the start and never shown during practice. If a learner had seen the question, you would be measuring memory rather than skill.
5. During the test, nobody gets any assistant. Not yours, not a chatbot. Blank editor, schema, question. This is the moment where borrowed skill and real skill finally look different.
6. Score automatically. Run every learner's query, compare result sets against the reference, count how many each learner got right.
7. Your number is the gap between the two groups' average scores. If your group averages 7 out of 10 and the baseline averages 5, your number is +2. If your group scores the same or worse, your system did not build capability, and the brief tells you to publish that anyway.

## The constraint that will trip you

Learners sent back to work things out alone report lower motivation (Wu et al., Scientific Reports 2025). So whatever you withhold, they still have to be willing to open your tool tomorrow instead of the chatbot in the next tab. Withholding everything wins the removal test and loses every user.

## What they will press you on

The harm in that study came from the interface, not the model. Both arms ran the same model and only the response style differed, so a better model will not rescue a bad giving policy. What is the smallest change to your system's wording that would flip your removal result?

The honest test is slow and you cannot run it daily. What cheaper signal do you steer by in between, and how do you know it is actually related to learning?

Effort does not disappear, it relocates. Across 936 real tasks reported by 319 knowledge workers, confidence in the AI predicted less critical-thinking effort and confidence in one's own expertise predicted more. The effort that remained moved toward verification. So which part of writing a query should your system make harder on purpose, and which should it hand over completely?

A learner wants the answer at 11pm before a deadline. Withholding is right by your measure and wrong by theirs. Who decides?

Retention improves and completion drops. Which do you optimise, and how do you defend it?

## What makes it hard

Recruiting six outside people and keeping them through practice plus a test. And defending your withholding rule to someone under deadline pressure.

## Human requirement

At least six learners, none from your team, through a two-stage protocol.

---

# 5. Verified persuasion

## The problem

In December 2025 a team ran 19 language models across 707 political issues with 77,000 people, then fact-checked 466,769 of the claims those models made during those conversations.

The models that changed the most minds were the ones that packed the most checkable factual claims into a single conversation. Those same models were, on average, the least accurate.

## Terms decoded

**Checkable claim.** A specific factual assertion someone could go and verify. "Term insurance pays out only if you die during the term" is one. "Insurance is worth considering" is not.

**Density.** Checkable claims per conversation. A high-density conversation is stuffed with them. A low-density one is mostly general talk and reassurance.

**Explainable variation.** Of the differences in persuasiveness between the 19 models that the researchers could account for at all, roughly half traced to that one measure. Not model size, not writing style. Claim count.

**Reversal run.** Deliberately pointing your own system at a claim the evidence does not support, and reporting what it does.

**Expression of concern.** A formal note a journal attaches to a published paper when questions have been raised about it, short of retracting it.

## Why more claims persuades

You do not know which specific fact is holding this person's belief in place. Every additional claim is another attempt at it. Make fifty claims and one of them is more likely to hit the thing they are actually defending than if you make five.

## Why more claims also loses accuracy

There is only so much well-supported material available on any topic. A model making five claims can ground all five. A model making fifty runs out of solid ground somewhere along the way and keeps going, producing assertions it cannot support. Fact-check nearly half a million claims and that shows up as a lower accuracy rate for the chattier models.

Both effects come from the same cause. Pushing claim count up raises persuasion and lowers accuracy at the same time.

## Why that is not "lying works"

It is tempting to conclude that being wrong helps persuade. The data does not show that. It shows density causes persuasion, and density causes inaccuracy. It never shows inaccuracy causing persuasion. The two are tangled together in the results, not proven connected to each other.

## Where the ethics board comes in

To untangle them you would have to run the obvious experiment: build a system that deliberately asserts things the evidence does not support, aim it at real people, and see whether they are more persuaded than by a truthful equivalent. That means knowingly feeding false information to real humans in order to change what they believe.

Every study involving human participants needs ethics board approval before it runs. No board would approve that one. So that direction stays untested, permanently, and whether inaccuracy itself contributes to persuasion stays an open question.

That gap is why this capstone exists.

## The hypothesis you would be testing

If a system asserts only claims that answer the reason a person gives for their belief, and refuses any it cannot source, it will move belief as far as an unconstrained persuader while making measurably fewer unsupported claims. The reasoning: density persuades through relevance, not volume, style, or model size.

## The loop, step by step

1. Find one real person holding one belief that is not supported by evidence and is costing them money, time, or health, and who can tell you why they hold it. The brief's example: someone certain that term insurance is money thrown away.
2. Politics and identity beliefs are out of scope. The belief must be something a reviewer can check in under a minute.
3. Get consent, and tell them they are speaking to a machine. That disclosure does not destroy the effect, which has been tested separately (Boissin et al., PNAS Nexus, N=955).
4. Measure what they believe before.
5. Run the conversation. Your system asserts only claims it can trace back to a source it names on screen.
6. Measure immediately after.
7. Measure again a week later. Immediate agreement often evaporates, which is why the delay is there.

## The two comparisons you must run

**The brochure test.** Write one fixed, claim-dense document about that belief and show it to everyone. Then check whether your conversational system beat it. If a static page does as well, the system was not the thing that worked, and you are required to say so.

**The reversal run.** Point your system at a claim the evidence does not support and report what it does. Does it refuse? Does it argue for it anyway? This asks you to deliberately demonstrate your own system's failure mode.

## What they will press you on

What counts as one claim in your domain, and what decides that it is true? How would you check a hundred of them cheaply?

Personalisation changes which facts arrive, not how they sound. Without personal data, GPT-4 beat human debaters but not significantly (p=0.31). With personal data, the odds of shifting someone rose 81.2%, and fell back below significance on strongly held topics. The researchers found no change in style, only in which issues the model raised. So does knowing about the person change your tone, or change which facts arrive?

The best-known result here, a lasting 20% reduction in conspiracy belief through dialogue, carries an editorial expression of concern over screening criteria and spliced dataset rows. The authors have since reported a corrected pipeline that matches. So what must you measure yourself before treating any published effect size as a target?

Why does this person hold this belief? Not why it is wrong. Why they hold it.

What result, six weeks from now, would force you to abandon the hypothesis?

## What makes it hard

The week-long follow-up cannot be compressed and depends on one person showing up twice. And you have to be willing to report that the brochure won.

## Human requirement

One consenting person, twice, a week apart.

## Sources named in the brief

Hackenburg et al., Science, 4 Dec 2025 and PNAS, Mar 2025. Costello, Pennycook and Rand, Science, Sep 2024, with the associated concern notice. Boissin et al., PNAS Nexus, Nov 2025, N=955. Salvi et al., Nature Human Behaviour, Aug 2025.

---

# Comparing the five

Strip out the subject matter and they differ mainly in how many people you need and how long you need them.

| Project | People needed | How long | Mandatory measurement | Domain cost |
|---|---|---|---|---|
| Genome intelligence | 1 tester | Once | Runs on an unseen variant file | High: genetics |
| Collaborative intelligence | 1 professional | 30 observed runs | Three arms, all reported | Medium |
| Creator OS | 1 creator with 20+ published pieces | Weekly, ongoing | Acceptance rate across repeated runs | Low |
| Learning OS | 6 learners minimum | Practice plus a test | Removal test against an answer-giving baseline | Low |
| Verified persuasion | 1 consenting person | Twice, a week apart | Before, after, week later, plus brochure test and reversal run | Low |

Two have a clock you cannot compress with effort. Verified persuasion has the one week gap baked in. Collaborative intelligence needs 30 runs at whatever cadence that real task naturally happens.

Learning OS trades design freedom for certainty. It is the only one where correctness is settled by a machine, which removes an entire category of argument, but it is also the only one needing six recruited strangers.

Every other dimension, your stack, your model, how many agents, is handed to you and explicitly not rewarded.

---

# The decision sequence

Work these in order. Most people run them backwards and get stuck.

**Step 0. Fix the hard facts.** Deadline date. Solo or team, maximum four. What teammates can actually commit.

**Step 1. Audit human access.** This is the binding constraint. Each brief names a specific human you must recruit and keep. Not a role, a person who will answer your messages in week five. Write down, per brief, who you could get a written yes from in the next five days. Any brief with an empty list is out, however interesting it is.

**Step 2. Count backwards from the deadline.** Subtract the measurement time from the comparison table. What remains is your build window. If that goes near zero, that brief is out even if you have the people.

**Step 3. Check your falsifiability stomach.** For each brief still standing, write the sentence you would have to submit if the comparison went against you. Which of those can you live with? A brief whose null result you would want to hide is one you will fudge under deadline pressure.

**Step 4. Price the domain cost.** Only genome intelligence charges a real one. Count it in weeks, not enthusiasm.

**Step 5. Now consider fit.** Your stack, your interest, what you could re-teach afterwards.

**Step 6. Check reversibility.** For each candidate, find the day after which switching costs you the capstone. If two are close, pick the one with the later date.

One trap. Overlap with something you have already built is a legitimate input at step 5 and only there. It saves build time, which is the cheap resource. It saves no measurement time, which is the expensive one. And reusing code can quietly bias you toward a hypothesis you already believe, which is what the learning row in every grading table is looking for.
