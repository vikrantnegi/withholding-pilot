# Capstone rules guard
Source: C7 Capstone FAQ: "The Brief Is Not a Spec" (Module 3), read 30 Aug 2026.
https://docs.google.com/document/d/16SIqITTCK4QzeJbUjJWKeS3n1wQWM6h8mPLMDyrgCsw

**Read this before any checkpoint. If a plan conflicts with a rule below, the rule wins.**

---

## A. Hard rules: non-negotiable per the FAQ

| # | Rule | Verbatim |
|---|---|---|
| A1 | User cannot be you or a classmate | "Every brief needs a real person who is not you and not a classmate"; "the exclusion is load-bearing". **Confirmed by 100x on Discord, 1 Sep 2026: classmates not allowed, recruit from outside the cohort.** Supersedes the Learning OS brief's narrower "none from your team" |
| A2 | Recruiting is graded work | "Recruiting is part of the work being assessed" |
| A3 | Consent and safety lines are fixed | "Nothing about who or whether: the real user, the honest measurement, consent, the safety lines" |
| A4 | No persona substitution | "If you cannot recruit, switch briefs early rather than substituting a persona" |
| A5 | Run the comparison, report it either way | "Skipping the comparison is not [a finding], and evaluators score a negative result and an unrun one very differently" |
| A6 | Negotiable: **how** only | models, agent count, retrieval, memory, interface |

## B. Process rules: the four steps, in order

1. **Rewrite the hypothesis in your own words. Get it checked in your first mentor conversation.** "Teams that build the wrong thing misread the hypothesis, not the challenge."
2. **Run the baseline BEFORE you build.** "It takes a day, it is the arm every team skips, and it is the one that decides whether your system caused anything."
3. **One thin slice end to end**, on real input you did not hand-pick, before widening.
4. **Keep a record of what the evidence changed.** "Keep the before and after; the diff is the deliverable."

## C. Definitions that are stricter than they look

- **End-to-end slice** = "One complete path from real input to real output, **run by someone not on your team**, **including what happens when things fail**." Not every feature working. But no step faked or hand-fed.
- **Hypothesis change is expected**, not tolerated: "Do I have to keep my original hypothesis? **You are expected not to.**"
- **Size**: "As small as you can defend. Three findings you can defend beat fifty you cannot. Choosing *not* to use a technique, and defending the choice, counts as a decision."
- **COMPLEXITY IS NOT CREDIT**: "the failure we see most."

## D. What the evaluation does NOT reward
Component count. Model choice. Polish.

---

## E. THE GRADED RUBRIC (Learning OS brief, "How We Will Evaluate It")
Source: the statement doc itself, read 1 Sep 2026. Notion hub:
https://app.notion.com/p/Cohort-7-Final-Capstone-Problem-Statements-3c47d3dc689280d0a88be524ff15ed1e
Learning OS doc: https://docs.google.com/document/d/1PsfmN3ip6Hj7nwFNO-vbK27Bpk5506-6JgsHUxnqA3w/edit

Five criteria. Nothing in this folder captured these before 1 Sep. Check the build against all five.

| # | Criterion | Key phrase | What it means for this build |
|---|---|---|---|
| E1 | Problem understanding | "how a learner gets stuck, not how a tool answers" | You are graded on modelling learner difficulty. This is a *modelling* claim, not a UX one |
| E2 | The removal test | "Real learners, held-out questions, scored against a baseline" | Already designed. Protects the 21/27 Sep dates |
| E3 | Architecture | "Deterministic, probabilistic and human parts sit correctly" | Straight out of the three-system-types framework. The 6 Sep diagram must show which part is which and why |
| E4 | Product quality | "works for someone not on your team" | **Product quality IS graded.** See correction in `PRD-SEED.md` |
| E5 | Learning | "Evidence changed your hypothesis, and you show where" | `HYPOTHESIS-LOG.md` is a graded artefact. Note the verb: evidence *changed* it. A hypothesis that never moved scores badly here |

### What the brief deliberately does NOT specify
Verified against the source doc, 1 Sep. These are yours to choose and defend:
- **The gap between practice and removal test.** Not stated. 5-7 days is our choice.
- **Whether held-out questions are same-schema or transfer to a new schema.** Not stated.
- **How many help levels.** Not stated. The four-level ladder is entirely ours. The brief only
  contrasts "answers" vs "structured hints" when describing prior work.
- **Mentors, office hours or a hypothesis review step.** Not in the brief at all — that is
  rule B1, and B1 comes from the FAQ, a different document. This is why the two read differently.

The brief poses the first gap back at you as its own open question:
*"What counts as writing a query unaided, precisely enough for a script to decide?"*

---

# LIVE AUDIT: 30 Aug 2026

## ✅ CLOSED 1 Sep 2026: recruiting cohort members (rule A1)

**100x answered on Discord: classmates are not allowed. Participants must come from outside the
cohort.** The strict reading assumed on 30 Aug was correct, so no plan below changes — the
ambiguity is simply gone. Original finding kept for the record:

The 2 Sep plan was to recruit low-code path cohort members as study participants.
**They are classmates. This is explicitly excluded.** The Learning OS brief says "none from
your team". The FAQ is stricter and later: "not you and **not a classmate**."

Reciprocal participant swaps with other C7 builders are excluded by the same rule.

Here is why the FAQ's reasoning bites hardest for Learning OS. A classmate already knows what
the system is for, so they cannot produce the misunderstandings that count as evidence. A
low-code classmate is worse. They have taken "Intro to Database" alongside you and have
Supabase in their own stack. They are contaminated on the exact skill you are measuring.

Fixed in `RECRUITMENT.md`. New pool: workplace non-engineering colleagues, plus
referrals sourced *through* cohort members. The 2 Sep session stays on the calendar as a
referral-gathering and mentor-question slot, not a recruiting slot.

## 🔴 GAP: no baseline before build (rule B2)

The plan runs practice 21 Sep and the removal test 27 Sep, after v0. The FAQ says the baseline
is the arm every team skips, and it comes first.

The baseline arm needs zero product. It is a chatbot with the schema pasted in. So it can run
in the first week of September. Running it then de-risks everything downstream. It proves the
questions are the right difficulty. It exposes the real attrition rate. It tests the
removal-test protocol. It produces the comparison number you need even if the build slips.

**Action: run a baseline round the week of 8-14 Sep.** Treat it as a checkpoint, not a nice-to-have.

## 🟠 GAP: no mentor conversation scheduled (rule B1)

This is step 1 of the FAQ's own sequence. Nothing in the plan books it. 2 Sep is the obvious
slot. Take the rewritten hypothesis from `PRD-SEED.md` and get it checked.

~~**Ask this at the same time:** does "classmate" exclude all C7 members?~~ **Answered on
Discord 1 Sep 2026: yes, all of them. Recruit from outside the cohort.** The 2 Sep mentor slot
is now purely for the rewritten hypothesis (rule B1), which is still unchecked.

## 🟠 GAP: no hypothesis/evidence log (rule B4)

"The diff is the deliverable" and there is nothing to diff against. Started: `HYPOTHESIS-LOG.md`,
seeded with the 30 Aug version. Every time evidence moves the design, append an entry. Date it,
and say what changed it.

## 🟠 WEAK: thin-slice definition too loose (rule C)

`CAPSTONE-PLAN.md` 13 Sep says "Input → LLM/agent → output runs end-to-end once. Ugly is fine."
The FAQ requires it be **run by someone not on the team** and **include failure paths**.
Tighten the checkpoint definition to match.

## ⚠️ STANDING RISK: statement is binding, recruitment is not solved

A4 says that if you cannot recruit, you switch briefs early. **You submitted 30 Aug and the
choice is binding**, so that escape hatch is closed. Recruitment is now the single point of
failure for the whole capstone.

**Resolve the participant pool by 6 Sep, the same date as scope lock.** If you cannot name 8+
non-classmate candidates by then, raise it with 100x that week. Not in October.

Updated 1 Sep 2026: the eligibility question is answered, so nothing external is blocking
recruitment any more. The pool is workplace non-engineers first. 5 days to 6 Sep.

## ✅ ALREADY COMPLIANT
- Statement chosen by access, not affinity (Genome dropped on 1-tester access). Matches "choose by access, not affinity"
- Negative-result reporting already written into `PRD-SEED.md` (A5)
- "Boring, shippable over interesting" working agreement matches COMPLEXITY IS NOT CREDIT
- Automatic result-set scoring keeps the measurement honest and unarguable (A5)
