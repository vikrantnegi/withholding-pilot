# Cohort 7 final capstone: Learning OS, decoded

Plain-language walkthrough of the Learning OS brief, with the research jargon unpacked.

The other four C7 problem statements were in this file until 13 Sep 2026. They were cut once this track was chosen. Git history has them if a comparison is ever needed again.

Source: the C7 Capstone Module 3 brief for Learning OS, and the Capstone Project Submission Template.

---

## What the brief actually grades

Every C7 brief has the identical skeleton: an observation, a stated hypothesis you can prove wrong, your challenge, three known mechanisms each ending in a question, a list of questions to think about, and a grading table. All of them end with the same banner: complexity is not credit.

The grading table contains a row about product quality, meaning the thing runs start to finish on input you had not seen or for a person not on your team. It contains a row about learning, meaning evidence changed your hypothesis and you can show where.

So this is an experiment brief, not a build brief. The software is the instrument. What gets graded is a claim you can defend, backed by a measurement you actually ran on a real human who is not you.

**Why it matters:** build quality is the variable the grading discounts. Time spent there is time not spent on the measurement.

### Submission deliverables

Four items, per the template: a live project link, a GitHub repo or workflow JSON, a demo video, and a written case study.

### Rules

One project per team or individual. Maximum four people per team.

---

## Glossary of recurring terms

**Arm.** One condition in an experiment. If you run "the person alone", "the agent alone" and "the two together", that is three arms. You run all three on the same task and compare.

**Baseline.** The arm you have to beat. Usually the simple, obvious thing someone would do without your system. If you cannot beat the baseline, you have not built anything, and the brief tells you to report that rather than hide it.

**Held out.** Questions or data you deliberately reserved from the start and never showed during practice. Used at test time so you measure skill rather than memory.

**Result set.** The rows a database query returns. Comparing two result sets is how you check a query is correct without anyone giving an opinion.

**Effect size.** How big a difference something makes, as opposed to whether a difference exists at all.

**Statistical significance and p-values.** A p-value is roughly the chance you would see this result if nothing real was going on. p=0.31 means a 31% chance it is noise, which is high, so the result is treated as not significant. Below 0.05 is the usual bar.

---

# Learning OS: assisted independence

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

# What this track costs

Six learners minimum, none from your team. Practice plus a test. The mandatory measurement is a removal test against an answer-giving baseline. Domain cost is low.

Learning OS trades design freedom for certainty. It is the only brief where correctness is settled by a machine, which removes an entire category of argument. It is also the only one needing six recruited strangers.

Every other dimension, your stack, your model, how many agents, is handed to you and explicitly not rewarded.
