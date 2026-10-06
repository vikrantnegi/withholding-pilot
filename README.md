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
| v0, 30 Aug | the brief's hypothesis: help sized to what the learner can already do |
| v1, 19 Sep | require an attempt, hint before answer; better recall on practised sub-skills, not on the unpractised one |
| **v2, 4 Oct** | **the same policy changes persistence and error recovery, not first-try recall** |

v2 is what this pilot proposes. It is not what the pilot proves. Three learners per arm cannot
prove either version.

---

## What this is

A controlled experiment about how much help an AI tutor should give.

One web page. A learner reads a question in English, writes SQL, and presses Run. The page says
right or wrong. When stuck, they press **Help**. What Help returns is the whole experiment.

Everything else is identical between the arms: the editor, the questions, the feedback, the look.
One setting in a config file is the only difference.

**The design rule that matters most: the LLM never decides whether to help.** Plain code makes
that decision. The LLM only writes the hint's wording afterwards. So the log can prove exactly
what each arm received. Diagrams: `diagrams/architecture-arm-a.png` and `diagrams/architecture-arm-b.png`.

**The claim is deliberately weak.** A large study (Bastani and colleagues, PNAS 2025) found that
students given AI answers scored *below* students with no AI at all. Arm B here is that
answer-giving group. So a good result means "withholding avoids the harm answer-giving does", not
"withholding builds skill". The stronger claim needs a third group with no AI, and six people
cannot fill three groups.

---

## Reading order

| you are | read |
|---|---|
| a judge, with ten minutes | `CASE-STUDY.md`, then `RESULTS.md`, then `HYPOTHESIS-LOG.md` v2 |
| reviewing the research design | `PRD-v1.md`, then `ANALYSIS-PLAN.md`, then `research-papers/RESEARCH-READING.md` |
| taking the project over | `STATUS.md`, `PRD-v1.md`, then `LEARNING-LOG.md` |

---

## The files

Grouped by how they change over time, because that tells you how far to trust each one.

### Current: one copy, kept up to date

| file | what |
|---|---|
| `README.md` | this file |
| `STATUS.md` | where things stand today. Wins any disagreement about the present |
| `CASE-STUDY.md` | the whole project, in the order the rubric marks it |
| `RESULTS.md` | every number from the test, and every check, in the order fixed in advance |
| `PRD-v1.md` | the spec: the hypothesis, the architecture, the help policy, what was cut |

### Records: added to, never rewritten

| file | what |
|---|---|
| `HYPOTHESIS-LOG.md` | every version of the hypothesis, and the evidence that moved it. The diff is the deliverable |
| `EXPERIMENT-LOG.md` | every run, what came out, what it changed |
| `LEARNING-LOG.md` | every assumption that broke, and the lesson |
| `ANALYSIS-PLAN.md` | how the result would be read, fixed before any data existed. Its value is that it was not edited after |

Each record opens with a plain-English summary. The entries below it are as written on the day.

### Background

| file | what |
|---|---|
| `CAPSTONE-RULES.md` | the capstone rules and the five-part marking rubric |
| `c7-capstone-decoded.md` | the Learning OS brief, in plain language |
| `research-papers/` | notes on the four papers the design rests on |
| `RECRUITMENT.md` | how participants were chosen, consent, and arm assignment |
| `TEAM-DECISION.md`, `CAPSTONE-PLAN.md` | solo or team, and the original schedule. Written once, not updated |
| `PRD-SEED.md`, `100x-CURRICULUM.md` | early plans, replaced. Kept because the diff is part of the record |
| `CLAUDE.md` | working rules for the AI assistant used on this project |

### Code and data

| folder | what |
|---|---|
| `app/` | the tutor. `policy.js`, `hint-guard.js`, `hint-writer.js`, `help-session.js` and `grade-rule.js` make every decision, covered by 123 unit tests. Open `index.html?arm=A` or `?arm=B` |
| `study-questions/` | the 28 questions (16 practice, 12 held back), the database, and the scoring rule. Frozen 19 Sep |
| `screener/` | the screening rounds, the practice session and the test, one folder each, with every returned log |
| `evals/` | the checks: hint quality, leak catching, both graders agreeing, the page in a real browser, the hint function being live. `analyse-removal.py` produces every number in `RESULTS.md` |
| `supabase/` | the edge function that holds the LLM key, so it never reaches the page |
| `diagrams/` | the architecture, drawn in Excalidraw, one picture per arm |

---

## Primary sources

When a rule is in question, read these, not my summaries.

- Problem statements hub: https://app.notion.com/p/Cohort-7-Final-Capstone-Problem-Statements-3c47d3dc689280d0a88be524ff15ed1e
- **The Learning OS brief:** https://docs.google.com/document/d/1PsfmN3ip6Hj7nwFNO-vbK27Bpk5506-6JgsHUxnqA3w/edit
- Capstone FAQ, "The Brief Is Not a Spec": https://docs.google.com/document/d/16SIqITTCK4QzeJbUjJWKeS3n1wQWM6h8mPLMDyrgCsw
- The removal-test instrument, kept live deliberately as evidence: https://teal-marzipan-e1b49a.netlify.app/ — the 12 held-out questions, now burned for any future study.

The brief gives the hypothesis and the rubric. The FAQ gives the process rules. They are
different documents.

---

## Key dates

| date | what |
|---|---|
| 23 to 25 Sep | practice session, both arms |
| 30 Sep to 2 Oct | removal test, 5 to 7 days later |
| 4 Oct | analysis and hypothesis v2 |
| **7 Oct** | **submission** |
| 11 Oct | Demo Day, 100x HQ |
