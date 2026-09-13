# Office hours, 1 Sep 2026

Group call. You get about 4 to 5 minutes. You are committed to Learning OS.

> ⚠️ **UPDATED 1 Sep 2026: the eligibility question is ANSWERED.** 100x confirmed on Discord —
> classmates are not allowed, recruit from outside the cohort. **Do not spend the slot on it.**
> Minute 2 below is now free. Use it on the operational gaps instead — see "Replacement asks"
> at the bottom of this file.

**Aim to walk away with one answer, not a good impression.** Everything else here is optional.

## Your 4 minutes

**Minute 1. Say who you are and what you are testing.**

Say this in your own words, do not read it:

> Vikrant, solo, Learning OS. My hypothesis: if the assistant decides how much to give based
> on what the learner can already do without it, then their score after I take it away beats
> an answer-giving baseline, and task completion does not collapse. The thing I am building
> is the giving policy. It estimates what the learner knows, then picks between a nudge, a
> hint, a scaffold, and the full answer. The rest is scaffolding.

This also covers step 1 of the FAQ, which says to get your hypothesis checked in your first
mentor conversation. If they correct it here, the call already paid for itself.

**Minute 2. Ask the question. Do not leave without it.**

> The Learning OS brief says participants must be "none from your team". The FAQ says "not
> you and not a classmate". I am solo, so those mean very different things. The first
> excludes only me. The second excludes all of C7. Which one is binding? And if it is the
> FAQ, does that cover low-code path people who are not on my project at all?

Ask this one because 100x is the only place you can get the answer, it takes them thirty
seconds, and getting it wrong costs you the project in October.

**Minutes 3 and 4. Answer whatever they push back on.** Answers are below.

**If there is still time, ask one more.** Pick one, not both:

> Six learners means three per arm. Is a null result at that size treated as a finding, or as
> an underpowered study? It changes whether I recruit 10 or 16.

> I want to run the baseline arm in week one, before any product exists. Any reason not to?

**Hard rule:** if you reach 4 minutes and have not asked the eligibility question, stop
talking and ask it.

## What they might ask you

These come from the "Questions to Think About" section of the brief. The FAQ calls that
section "the viva, published in advance", so expect at least one.

*What is the smallest change to your wording that would flip your result?*

> The line between a hint and an answer. In the Bastani study both arms used the same model.
> Only the response style changed. My four levels really collapse to one question: does the
> response contain a query they can run? The moment a hint includes runnable SQL, my arm
> turns into the baseline arm. So the hint templates carry the whole experiment.

*The honest test is slow. What cheaper signal do you use in between?*

> How many times a learner edits their query before asking for help. That is a proxy for
> whether they are retrieving or reading, and retrieval is the mechanism I am claiming. It is
> still a proxy, so I would check it against the one real test I run.

*Which part should be harder on purpose, and which should you hand over?*

> Harder: picking the join key and the filter logic. That is the actual thinking. Hand over:
> syntax, exact date function names, the ceremony. Effort does not disappear, it moves. Across
> 936 real tasks it moved toward verification. I want it landing on "is this the right join",
> not "why will this not parse".

*A learner wants the answer at 11pm before a deadline. Who decides?*

> They do, but it costs something they can see. There is a "just give me it" override, it
> gets logged, and it shows up in their own progress view. Withholding by force loses the
> user. Withholding by default with a visible override keeps both the policy and the person.
> The override rate then becomes data.

*Retention goes up and completion drops. Which do you optimise?*

> Retention. It is the hypothesis and it is what gets graded. Completion is a constraint, not
> a competitor. If completion drops so far that people quit mid-study, I cannot measure
> retention at all. So: maximise retention, keep dropout near zero.

*What have you built so far?*

Answer honestly. You have not started.

> Nothing yet. Scope locks 6 Sep, and the baseline arm runs the week after, before any
> product, because the FAQ says the baseline is the arm everyone skips.

A dated plan beats a vague claim they will probe.

## Do not spend time on

Architecture, model choice, or your stack. Complexity is not credit, and nobody can help with
it in four minutes.

Asking them to validate the idea. It is submitted and binding.

Your schedule. The dates are already back-planned and a group call cannot improve them.

Anything you could answer by rereading the brief.

## One correction to our files

The 25 Aug cohort email gives the real deadline as "Final Team Formation + Project Selection:
2nd September 2026, 11:59 PM IST". Our plan said 31 Aug, which was wrong. I have fixed it.

You submitted on 30 Aug, so nothing is at risk. It does mean the window stays open until
Wednesday night. If 1 Sep confirms cohort members are ineligible, and you then decide you
cannot find 8 people outside the cohort, you can still change the submission before 2 Sep
23:59. You have said you are committed. This is the emergency exit, not a suggestion.


---

## Replacement asks (added 1 Sep, after eligibility was resolved)

The brief states the hypothesis but leaves the operational definitions open (verified against
the source doc; see `CAPSTONE-RULES.md` §E). These are the ones where an answer changes the
6 Sep scope lock. Pick **one**, in this order:

1. **Unaided, defined.** The brief asks "what counts as writing a query unaided, precisely
   enough for a script to decide?" — do held-out questions stay on the same schema, or does a
   strong result have to show transfer to a new one? *(Changes the question set. Highest value.)*

2. **Null result at n=3 per arm.** Is a null treated as a finding under E5, or as an
   underpowered study? *(Changes whether you recruit 10 or 16 — and 16 may not be reachable.)*

3. **Levels.** The brief names no number of help levels. At three per arm the study cannot
   resolve four. Is a defended two-level policy scored the same as an unresolvable four-level one?

Do NOT ask them to validate the hypothesis itself. It is given in the brief. What is yours —
and what E1 and E5 actually grade — is how you operationalise it and what evidence moved it.
