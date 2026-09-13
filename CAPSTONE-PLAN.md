# 100x Cohort 7: Final Capstone Plan

**Track:** Demo Day aspirant → target submission **7 Oct 2026** (9 Oct is the backstop, not the plan)
**Statement deadline:** 31 Aug 2026 (extended from 28 Aug). Leaning Learning OS.
**Mode:** Solo
**Graduation / Demo Day:** 11 Oct 2026, 100x HQ

---

## Official 100x dates

| Date | Day | What |
|---|---|---|
| ~~28 Aug~~ **31 Aug** | Mon | **Deadline: capstone problem statement** (EXTENDED). Binding once chosen |
| 28 Aug | Fri | Lecture: Multi-Agent Systems (Theory) |
| 29 Aug | Sat | Lecture: Multi-Agent (Practical) |
| 1 Sep | Tue | Capstone problem statement review released |
| 2 Sep | Wed | Networking session, capstone group formation |
| 4 Sep | Fri | Lecture: Guardrails, Evals, Agentic Workflows |
| 5 Sep | Sat | Lecture: End-to-end Full-stack LLM & Agentic App (Theory) |
| 11 Sep | Fri | Lecture: Practical + **Capstone Kickstart Hackathon kick-off** |
| 12 Sep | Sat | Hackathon ends |
| 14 Sep | Mon | Hackathon results + **Cohort Wrap** (teaching ends) |
| 7 Oct | Wed | **HARD: Final Capstone Submission, Demo Day aspirants** |
| 9 Oct | Fri | Final Capstone Deadline (backstop) |
| 11 Oct | Sun | Graduation Day / Demo Day / Grad Party |

## Build checkpoints (back-planned from 7 Oct)

| Date | Checkpoint | Deliverable (done means done) |
|---|---|---|
| 6 Sep | **Scope locked** | One-page PRD, architecture diagram, explicit CUT LIST of what you are *not* building |
| 6 Sep | **Participant pool named** | 8+ non-classmate candidates named and contacted. Recruitment is the binding constraint, so the statement can no longer be switched |
| 8-14 Sep | **BASELINE ARM RUN** | Chatbot + schema, no product needed. FAQ: "the arm every team skips, and the one that decides whether your system caused anything" |
| 13 Sep | **Thin vertical slice** | Input → LLM/agent → output end-to-end, **run by someone not on the team**, **including failure paths**. Ugly is fine. Faked or hand-fed steps are not. |
| 18 Sep | **Eval harness + guardrails** | A repeatable way to measure whether it works. Without this you can't tell improvement from noise. |
| 23 Sep | **v0 feature complete** | Core loop works on real data, not fixtures. After this: polish only. |
| 27 Sep | **Real-user test round** | In front of actual testers. Last date feedback can still change the build. |
| 30 Sep | **FEATURE FREEZE** | No new features. Bugs, polish, narrative. 7 days out. |
| 3 Oct | **Demo video + README + deploy** | Judges see the artefact, not your commit history. |
| 5 Oct | **Submission dry run** | Full package assembled and walked through. 2-day buffer for breakage. |

## Why the plan is shaped this way

Teaching ends 14 Sep. That leaves **23 days** of pure build time before 7 Oct. Roughly half of
that is reserved for evaluation, testing, freeze and packaging, not construction. The split is
deliberate. Solo capstones don't usually fail because the build was too small. They fail because
construction ran until the deadline and nothing was left for the parts that get graded.

The two dates that carry the most risk are **6 Sep (scope lock)** and **30 Sep (feature freeze)**.
Miss either and the 7 Oct date goes.

## Rules

`CAPSTONE-RULES.md` holds the C7 Capstone FAQ rules and a live audit of this plan against them.
Check it before every checkpoint. If this plan and that file disagree, that file wins.

Two rules have already changed this plan. Participants cannot be classmates, so cohort members
are out. And the baseline runs before the build, not after.

## Reference

- `c7-capstone-decoded.md`: plain-language walkthrough of the Learning OS brief. The other four tracks were cut on 13 Sep 2026.
  It decodes the jargon, the loop each one asks you to run, what you have to prove, what they'll
  press you on, and a comparison table. Sections 1 (Genome Intelligence) and 4 (Learning OS)
  are your shortlist.

---
*Milestones also live in `100x-capstone-milestones.ics`. Import into Google Calendar.*
*Daily accountability check-in runs at 09:00 IST until Demo Day.*
