# Learning OS — 100x Cohort 7 final capstone

**Vikrant Negi. Solo. Demo Day track. Submission 7 Oct 2026.**

Start here. This file says what the project is and what to read next.

For where things stand **today**, read `STATUS.md`. That is the only file that claims to be current.

---

## What this is

A controlled experiment about how much help an AI tutor should give.

One web app. A learner reads a question in English. They write SQL in an editor. They hit Run. The
app tells them right or wrong. When stuck, they press **Help**.

What Help returns is the entire experiment.

- **Arm A** must try first. Its first help is a hint, not the answer.
- **Arm B** gets the answer whenever it asks.

Everything else is identical. Same editor, same runner, same questions, same right-or-wrong
feedback, same look. If the two settings differed, the result could not be pinned on the help
policy.

**Why it matters:** one boolean in a config file is the whole difference between the two groups.

## The hypothesis

Withhold the answer until the learner has tried. Give a hint before giving the answer. Then unaided
performance improves, measured 5 to 7 days after the app is taken away.

The mechanism: making someone retrieve an answer builds durable memory faster than letting them read
one.

## The claim is deliberately weak

Bastani et al. (PNAS 2025) found something specific. Their answer-giving group scored *below* a
group with no AI at all. Their guardrailed group only matched it.

Arm B here is their answer-giving group. So a good result here means **"withholding avoids the harm
that answer-giving does"**. It does not mean "withholding builds skill".

There is no third group working without any assistant. It is not affordable at six people.
`PRD-v1.md` §2 says so openly instead of pretending otherwise.

**Why it matters:** the weaker claim is the honest one at this sample size.

---

## The four questions a new reader asks

| question | file |
|---|---|
| What is being built, and why that design? | `PRD-v1.md` §1 and §3 |
| What has actually been done? | `EXPERIMENT-LOG.md` |
| What was learned, and what turned out wrong? | `LEARNING-LOG.md` |
| Where does it stand, and what is next? | `STATUS.md` |

**The architecture diagram is `PRD-v1.md` §3.** It is a mermaid flowchart.
The presentable version is `diagrams/architecture-arm-a.png` — same graph, with the three zones drawn.

Its one load-bearing claim: **the LLM never decides whether to help.** Plain code makes that
decision. The LLM only writes the hint text afterwards.

**Why it matters:** that split keeps the thing being tested under the experimenter's control. It
also means the log can prove the two groups differed.

## Reading order

- **Ten minutes:** this file, then `STATUS.md`.
- **Taking the project over:** add `PRD-v1.md` in full, then `LEARNING-LOG.md`, then
  `CAPSTONE-RULES.md` §E for how it is marked.
- **Reviewing the research design:** `PRD-v1.md` §2 and §4, then `EXPERIMENT-LOG.md`, then
  `research-papers/RESEARCH-READING.md`.

---

## Files, grouped by how they change

Sorted this way on purpose. How a file behaves over time tells you how much to trust it.

### Living — one copy, always current, edited as things move

| file | what |
|---|---|
| `README.md` | this file |
| `STATUS.md` | **where things stand today.** Wins any disagreement about the present |
| `PRD-v1.md` | the spec: scope, hypothesis, architecture, the policy, cut list, open decisions |
| `HYPOTHESIS-LOG.md` | formal hypothesis versions and what evidence changed them (FAQ rule B4) |
| `EXPERIMENT-LOG.md` | append only: every run, what came out, what it changed |
| `LEARNING-LOG.md` | append only: every assumption that broke, and the lesson |
| `CLAUDE.md` | working agreements for Claude sessions in this folder |
| `RECRUITMENT.md` | participant rules still in force: consent, matched-pair arm assignment, dropout, session dates |

### History — written on a date, never edited again

| file | what |
|---|---|
| `TEAM-DECISION.md` | solo or team, decided 1 Sep. Settled. Reopen triggers are listed inside |
| `CAPSTONE-PLAN.md` | the original milestone table and why the schedule looks like that |

### Reference — came from outside, not ours to change

| file | what |
|---|---|
| `CAPSTONE-RULES.md` | **the rules, from the C7 FAQ, plus §E the marking rubric. Check before every checkpoint. If a plan conflicts with a rule here, the rule wins** |
| `c7-capstone-decoded.md` | plain-language decode of the Learning OS brief (other four tracks cut 13 Sep) |
| `100x-CURRICULUM.md` | the cohort's two paths and their tool stacks |
| `research-papers/` | the four papers the design rests on, plus `research-papers/RESEARCH-READING.md` |

### Superseded — kept on purpose, because the diff is the deliverable

| file | what |
|---|---|
| `PRD-SEED.md` | first-pass spec. Had a four-level ladder and a skill estimator. Both cut. Replaced by `PRD-v1.md` |
| `ANALYSIS-PLAN.md` | the measurement decisions fixed before data exists: unit of analysis, question pairing, budget arithmetic, and the null-result checklist read on 28 Sep. Was TODO-HYPOTHESIS-v1.md |

### Working folders

| folder | what |
|---|---|
| `screener/` | both screening rounds. Start at `screener/README.md` |
| `diagrams/` | `architecture-arm-a.png` — the Arm A control graph, three zones, drawn 13 Sep. Editable sources alongside it |
| `evals/` | `replay.js` — hint quality, replayed from stored attempts. The 18 Sep checkpoint. Start at `evals/README.md` |

**Why it matters:** a new reader can trust the Living files and skip the Superseded ones. That is
the whole point of the grouping.

---

## Primary sources

Read these, not our summaries, when a rule is in question.

- Problem statements hub (Notion): https://app.notion.com/p/Cohort-7-Final-Capstone-Problem-Statements-3c47d3dc689280d0a88be524ff15ed1e
- **Learning OS statement** (Google Doc): https://docs.google.com/document/d/1PsfmN3ip6Hj7nwFNO-vbK27Bpk5506-6JgsHUxnqA3w/edit
- Capstone FAQ, "The Brief Is Not a Spec": https://docs.google.com/document/d/16SIqITTCK4QzeJbUjJWKeS3n1wQWM6h8mPLMDyrgCsw

The **brief** gives the hypothesis and the five-part rubric. The **FAQ** gives the process rules and
the classmate exclusion.

**Why it matters:** they are different documents. Do not attribute one to the other.

## Key dates

**7 Oct 2026, submit.** 9 Oct is a backstop, not the plan.
**27 Sep, the removal test.** This one cannot move.
**30 Sep, feature freeze.** Demo Day **11 Oct**, 100x HQ.

Full checkpoint table with current state: `STATUS.md`.
