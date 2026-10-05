# Learning OS — 100x Cohort 7 final capstone

**Vikrant Negi. Solo. Demo Day track. Submission 7 Oct 2026.**

An SQL tutor that makes you try before it helps, and a 6-person pilot testing whether that
changes what you can do a week later, with the tutor gone.

For where things stand **today**, read `STATUS.md`. That is the only file that claims to be current.

---

## Try it

**Live app:** https://tranquil-starlight-f0129e.netlify.app/

- Withholding tutor: https://tranquil-starlight-f0129e.netlify.app/index.html?arm=A
- Answer-giving baseline: https://tranquil-starlight-f0129e.netlify.app/index.html?arm=B

What each one does:

- `?arm=A` opens the withholding tutor. Press Help before trying, and it refuses. Try once, and
  Help gives a hint. Two more tries, and it gives the answer.
- `?arm=B` opens the baseline. Help gives the full answer at once.

Same page, same 16 practice questions, same grader. One config flag is the only difference.

---

## The result

**Arm A scored 36 of 36 person-questions (3 learners x 12 held-out questions). Arm B scored 25
of 36.** The direction favours withholding.

**But on a cold first try, the arms were identical: 17 of 36 each.** The gap came after the
first try:

| | Arm A, withholding | Arm B, answer-giving |
|---|---|---|
| correct on any attempt | 36 of 36 | 25 of 36 |
| correct on the first attempt | 17 of 36 | 17 of 36 |
| questions opened | 36 of 36 | 29 of 36 |
| wrong first tries later fixed | 19 of 19 | 8 of 12 |

**Two of the study's own pre-registered checks failed.** Arm B also tried before asking for help
(check 1c), and Arm A hit a 100% ceiling (check 3). So the gap is not credited to withholding.

`RESULTS.md` has every number, in the order the plan fixed before any data existed.
`evals/analyse-removal.py` reproduces them from the raw logs.

**So what:** withholding seems to change what a learner does *after* a wrong answer. It did not
change what they could produce on a first try.

## How the hypothesis moved

The diff is the deliverable. `HYPOTHESIS-LOG.md` keeps every version.

| version | claim |
|---|---|
| v0, 30 Aug | help sized to what the learner can already do, chosen by a competence estimate |
| v1, 19 Sep | require an attempt, hint before answer; better recall on practised sub-skills, not on the unpractised one |
| **v2, 4 Oct** | **the same policy changes persistence and error recovery, not first-try recall** |

v2 is what this pilot proposes. It is not what the pilot proves. Three learners per arm cannot
prove either version.

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

## The hypothesis the study was built to test (v1)

Withhold the answer until the learner has tried. Give a hint before giving the answer. Then unaided
performance improves, measured 5 to 7 days after the app is taken away.

The mechanism: making someone retrieve an answer builds durable memory faster than letting them read
one. The result above says the mechanism, if any, is different.

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
| The whole story, for a judge | `CASE-STUDY.md` |
| What came out? | `RESULTS.md` |
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

- **Ten minutes, judging:** `CASE-STUDY.md`, then `RESULTS.md`, then `HYPOTHESIS-LOG.md` v2.
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
| `RESULTS.md` | the removal-test analysis: every check in `ANALYSIS-PLAN.md` §4, per person and per sub-skill |
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
| `research-papers/` | the four papers the design rests on, plus `research-papers/RESEARCH-READING.md` |

### Superseded — kept on purpose, because the diff is the deliverable

| file | what |
|---|---|
| `PRD-SEED.md` | first-pass spec. Had a four-level ladder and a skill estimator. Both cut. Replaced by `PRD-v1.md` |
| `100x-CURRICULUM.md` | read 30 Aug to find a participant pool, and it found one: the cohort's low-code path. 100x ruled cohort members out on 1 Sep, so three of its four sections describe a plan that was replaced. The module map and the "why this question is worth asking" framing are still live |
| `ANALYSIS-PLAN.md` | the measurement decisions fixed before data existed: unit of analysis, question pairing, budget arithmetic, the checklist `RESULTS.md` runs, and the dated scoring decisions of 30 Sep. Was TODO-HYPOTHESIS-v1.md |

### Working folders

| folder | what |
|---|---|
| `screener/` | both screening rounds. Start at `screener/README.md` |
| `study-questions/` | **the instrument. Frozen 19 Sep**: 28 items (16 practice, 12 held-out), the study schema, the scoring rule, and the three verifiers that must report `problems: 0` before any freeze. Start at `study-questions/README.md`; the decisions and their reasons are in `study-questions/DECISIONS.md` |
| `app/` | the study app. Participants open `index.html?p=<their code>`, which sets the arm and identifies the log; `?arm=` is the test path. `policy.js`, `hint-guard.js`, `hint-writer.js`, `help-session.js` and `grade-rule.js` hold everything that decides anything, and are covered by 123 unit tests |
| `diagrams/` | the architecture, drawn in Excalidraw: `architecture-arm-a.png` and `architecture-arm-b.png`, three zones each, Arm B being the same drawing with its unused half greyed out. Both are embedded in `PRD-v1.md` §3. `.excalidraw` sources alongside |
| `evals/` | `replay.js` hint quality, replayed from stored attempts (the 18 Sep checkpoint). `verify-app.mjs` drives the real page in a headless browser. `grader-conformance.mjs` proves the app's grader and the scoring rule agree. `link-check.mjs` fails if the docs name a file that is not on disk. `check-hint-function.mjs` proves a deployed hint function actually answers; `check-hosted.mjs` proves the hosted files are the build you made. Both run from your own terminal. `analyse-removal.py` produces every number in `RESULTS.md`. Start at `evals/README.md` |
| `supabase/` | `supabase/functions/hint/` — the edge function that holds the Groq key, so it is never in the page. Deployed 19 Sep; deploy and verification steps: `supabase/README.md` |

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

| date | what |
|---|---|
| 23 to 25 Sep | practice session, both arms |
| 30 Sep to 2 Oct | removal test, 5 to 7 days later |
| 4 Oct | analysis and hypothesis v2 |
| **7 Oct** | **submission.** 9 Oct is a backstop, not the plan |
| 11 Oct | Demo Day, 100x HQ |
