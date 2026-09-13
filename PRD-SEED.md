# Learning OS: PRD seed
Not a form. Drafted 30 Aug as answers to a form that turned out to have four fields
(name, email, solo/team, project name) and was already submitted.

The substance below is still the raw material for the 6 Sep scope lock deliverable:
a one-page PRD, an architecture diagram, and a cut list. Treat it as a first pass, not a spec.
Still missing and needed by 6 Sep: the architecture diagram, and an explicit CUT LIST.

---

## Statement chosen
Learning OS: assisted independence.

## Problem in one line
An AI assistant that answers reliably raises today's task completion and lowers tomorrow's
unaided ability. The task gets done. The skill never arrives.

## Hypothesis (falsifiable)
If the assistant sets how much it gives from what the learner can already do without it,
then unaided performance after the assistant is removed improves against an answer-giving
baseline, without today's task completion collapsing.

Mechanism: help withheld at the edge of current ability forces retrieval instead of reading.
Retrieval is what makes a skill available later.

Falsified if: my arm's post-removal score is equal to or below the baseline arm's. Also
falsified if completion during practice drops far enough that learners abandon the tool.

## What I am building
A SQL learning environment over a Supabase Postgres schema. The system sits between
"here is the question in English" and "learner writes the query."

The graded artefact is the giving policy, not the UI. It is a per-learner, per-concept
competence estimate that selects one of four response levels:
nudge → structured hint → partial scaffold → full answer.
Everything else (schema, editor, runner, result-set diff) is scaffolding.

> **CORRECTION, 1 Sep 2026 (read the brief's rubric, `CAPSTONE-RULES.md` §E).**
> "Everything else is scaffolding" is wrong as written. **Product quality is criterion E4** —
> "works for someone not on your team." The editor/runner cannot be an afterthought; a policy
> nobody can use scores zero on E4 and produces no E2 data either. The policy is the *most*
> graded thing, not the *only* graded thing. Factor this into the 6 Sep cut list.
>
> Also unspecified by the brief and therefore ours to defend: the four-level ladder (the brief
> names no number of levels), the 5-7 day gap, and same-schema vs transfer for held-out
> questions. Untested assumption #2 in `HYPOTHESIS-LOG.md` is live: at n=3 per arm the study
> cannot resolve four levels empirically. Two levels is the defensible scope.

## How correctness is decided
Automatically. The learner's query and a reference query both run against Supabase, and the
result sets are compared. No style judgement, no human scoring, no argument about the grade.

## Human testing protocol
- Recruit 8 to 10 people, keep at least 6. None on my team (I am solo, so none are me).
- Short SQL screener at recruitment. Rank by score, then matched-pair randomisation into two arms.
- Arm A uses my system. Arm B uses an ordinary answer-giving chatbot with the schema pasted in.
- Both arms practise on the same question set.
- Held-out test questions are reserved from the start and never shown during practice.
- Removal test: no assistant of any kind for either arm. Blank editor, schema, question.
- Score by result-set match. The reported number is the gap between the arm averages.
- A null or negative result gets published as-is.

## Known risk I am designing against
Withholding help can win the removal test and lose the user. Learners sent to work things out
alone report lower motivation. So the giving policy has to keep them willing to open my tool
tomorrow instead of the chatbot in the next tab. I track abandonment during practice as the
counter-metric to retention.


---

## The brief's own "Questions to Think About"
Verbatim-in-substance from the Learning OS doc. These are what you will be pressed on.
Answer 1 and 3 before 6 Sep; they change the build.

1. What counts as writing a query unaided, precisely enough for a script to decide?
2. A learner wants the answer at 11pm before a deadline. Withholding is right by your measure,
   wrong by theirs. Who decides?
3. Your removal test shows no difference against the baseline. What do you check first?
4. Retention improves and completion drops. Which do you optimise, and how do you defend it?
5. What evidence would convince you that withholding is the wrong mechanism?

Q1 is the operational definition the brief refuses to give you. Q5 is E5 (Learning) in
question form — you need a pre-committed answer before the data arrives, or the log has no
credible diff.
