# Status — as of 19 Sep 2026

**The only source of truth for the present.** If another file disagrees with this one about today,
this one wins. **Update the date above whenever you touch it.**

**18 days to submission on 7 Oct 2026.** Teaching ended 14 Sep. About half the remaining time is
reserved for testing, freeze and packaging by design.

---

## Where the project is

**The instrument exists and the app serves it. What is missing is no longer code — it is three
things that need people and one that needs a deploy.**

The question set was the binding constraint for a week. It is frozen: `study-questions/`, 28 items
over one concept, 16 practice and 12 held-out. All three verifiers report `problems: 0`. The app
serves the 16 practice items and was driven end to end in a headless browser on both arms.

The blocker has moved to the hint edge function, which is **written and not deployed**. Until it
is, every hint Arm A receives is the item's hand-written fallback rather than a hint grounded on
that learner's query. The app degrades to fallbacks by design and never breaks, so this will not
be visible on the day — which is exactly why it is written here.

**So what:** nothing stops the 21 Sep practice session from running. But if it runs undeployed,
Arm A's treatment on the day is the static fallback, not the treatment `PRD-v1.md` §4 specifies.

### What exists

| thing | where | state |
|---|---|---|
| Scope lock and spec | `PRD-v1.md` | Done 10 Sep, four days late |
| Architecture diagram | `PRD-v1.md` §3 | Done. The LLM is not in the control path |
| The policy, written out | `PRD-v1.md` §4 | Specified, and built in `app/policy.js` |
| The level selector | `app/policy.js` | Done 13 Sep. 34 tests, re-pointed at the study schema 19 Sep |
| Leak guard + rejection policy | `app/hint-guard.js` | Done 13 Sep. 32 tests |
| Hint writer, prompt + pinned model | `app/hint-writer.js` | Done 13 Sep. 14 tests. **Needs a Groq key and the function deployed** |
| Key out of the page | `supabase/functions/hint/` | Written 13 Sep. **Not deployed** |
| Hint-quality eval | `evals/replay.js` | Run 13 Sep. 20/20 from the model, 0 fallbacks, 1 leak caught. `EXPERIMENT-LOG.md` Run 3 |
| Help-press orchestration + log shape | `app/help-session.js` | Done 13 Sep. 20 tests. Wired to the UI |
| **The question set** | `study-questions/` | **Frozen 19 Sep.** 28 items, scoring rule, 3 verifiers at `problems: 0` |
| **The scoring rule, in the app** | `app/grade-rule.js` | **Done 19 Sep.** 23 tests. One rule for the learner and the score |
| **Grader agreement** | `evals/grader-conformance.mjs` | **Done 19 Sep.** 75 of 75 queries agree across both implementations |
| **The app on the real question set** | `app/index.html` | **Done 19 Sep.** 16 practice items; held-out absent from the source |
| **Browser verification** | `evals/verify-app.mjs` | **Done 19 Sep.** 42 checks, both arms, 0 failed |
| Log storage | — | **Not built, parked.** The copy-log button is the fallback |
| Screening data, 2 rounds, 7 people | `screener/` | Done. See `EXPERIMENT-LOG.md` |
| Participant pool | `RECRUITMENT.md` | 8 named, 7 active. Need 6 alive at the removal test |
| Hypothesis log | `HYPOTHESIS-LOG.md` | **v1 appended 19 Sep.** The claim is now falsifiable |
| Pre-committed limitations | `ANALYSIS-PLAN.md` | **Done 19 Sep.** Both written before any session ran |

Test totals: **123 unit tests** across five modules, plus 42 browser checks, plus the grader
conformance run. All green as of 19 Sep.

### What is not built — `PRD-v1.md` §6

1. ~~**Help button and the policy.**~~ Done 13 Sep.
2. **Hint writer — deployed.** The code, the prompt, the pinned model and the guard are all done
   and tested. The edge function is not deployed and there is no Groq key in place. **This is the
   top technical item.**
3. **Log storage.** A Supabase table. Parked; the copy-log button is the fallback. Before Monday,
   confirm the copied log carries `started` and `finished`.
4. ~~**The question set.**~~ Done 19 Sep. `study-questions/`, frozen.

---

## The four things standing between here and the removal test

Ordered by what breaks if it is skipped. Only the first is code.

1. **Deploy the hint function and put a Groq key in place.** Otherwise Arm A is measured on static
   fallbacks. Silent failure, so nothing on the day will tell you.
2. **Arm assignment, and it has a prerequisite.** manish's round-1 grade is corrupted by the
   grader bug and must be recomputed before matched pairs can be formed. Then coin flips, then
   split the four former teammates across arms. **Doing any of this after Arm A data exists is
   indefensible** — the same objection as re-pointing a question pair after seeing results.
3. **A pilot tester from outside the seven, before 21 Sep.** Anyone in the pool who sees an item
   burns it. One outsider cannot establish difficulty but can catch an item that is broken,
   ambiguous or impossible — the failure mode that costs a whole cell. Named as the only available
   mitigation in `ANALYSIS-PLAN.md`, and **not yet done.**
4. **Book both sessions.** The practice session on 21 Sep with six testers, and the removal test on
   **26 Sep at the earliest** — the 5-day gap rule. Neither is booked.

**So what:** three of the four need other people's time, and the practice session is in two days.
They are the schedule risk now, not the build.

---

## Open decisions

### 1–4, 6 — CLOSED

Closed 13–14 Sep. Moments arithmetic, the four cut-off numbers, the second topic, the syntax-error
gate, and N = 2. The reasoning is in `HYPOTHESIS-LOG.md` v0.1 and v0.2 and in `ANALYSIS-PLAN.md`.

### 5. Error message quality — CLOSED 19 Sep, as a stated limitation

Arm B's condition is the bare error message, and its quality is not matched to Arm A's. Round 2
showed SQLite pointing at the wrong word and one participant sustaining 63 attempts on a single
item without the message helping.

**Resolved by writing it up rather than by building a fix.** Matched-quality error messages would
be a second treatment built two days before the app freezes, and would turn Arm B from a realistic
baseline into a designed condition. Pre-committed in `ANALYSIS-PLAN.md` under "Stated limitations",
with the way it will be bounded after the fact. Evidence: `LEARNING-LOG.md` L7.

### 7. New, 19 Sep — does clause 2 collapse the solve rate?

The scoring rule now requires valid grouped SQL, not only matching rows. Nothing has tested that
against a real learner; only the 28 references and 47 listed wrong models. If the practice session
comes in far below round 2's solve rates, clause 2 is the first suspect.

**Decided by data, not by argument.** First evidence is 21 Sep. Assumption 8 in
`HYPOTHESIS-LOG.md`.

---

## Live risks on the participant pool

- **Dropout is the main threat, not ability.** 8 named, 7 active, 6 needed alive at the removal
  test. Dropout that differs *between the arms* breaks the comparison outright. Over-recruit, and
  track who completed the removal test by arm.
- **One named dropout risk already exists.** See manish in `screener/TESTER-PROFILES.md` — who is
  also the person whose round-1 grade needs recomputing before arm assignment.
- **Former reports.** Nobody reports to Vikrant now, but he was senior to most and 4 were on his
  team. Split those 4 across both arms, never say which arm is "his", and say plainly that
  dropping out is free.
- **Both screening rounds' questions are burned**, and so is their schema. The study uses neither.

---

## Remaining checkpoints

| date | checkpoint | state |
|---|---|---|
| 6 Sep | Scope lock | Done 10 Sep, late |
| 13 Sep | Thin working slice end to end | Done, on the day |
| 18 Sep | Testing and guards | Done 13 Sep. Guard built, eval run, Run 3 logged |
| 20 Sep | First version on real data | **Question set and app ready. Hint function not deployed** |
| 21 Sep | **Practice session** | **Not booked.** App frozen from here |
| 26 Sep+ | **REMOVAL TEST** | **Not booked.** 26 Sep is the earliest the 5-day gap allows |
| 28–29 Sep | Analysis | `ANALYSIS-PLAN.md` is read on 28 Sep |
| 30 Sep | **FEATURE FREEZE** | |
| 3 Oct | Video, README, deploy | |
| 5 Oct | Dry run | |
| 7 Oct | **SUBMIT** | 9 Oct is a backstop, not the plan |

Demo Day: 11 Oct 2026, 100x HQ.

---

## Next actions

1. **Deploy `supabase/functions/hint/` and set the Groq key.** Then re-run `evals/replay.js`
   against the deployed function, so the 21 Sep session runs on real hints.
2. **Recompute manish's round-1 grade, then assign arms.** Matched pairs, coin flips, four former
   teammates split. Before any Arm A data exists.
3. **Find one pilot tester outside the seven** and run them through the 16 practice items.
4. **Book 21 Sep and the removal test.**
5. Confirm the copy-log button captures `started` and `finished`.

**Why it matters:** items 1 and 2 are the two that cannot be repaired after the fact. A missing
deploy silently changes the treatment; late arm assignment invalidates the comparison.
