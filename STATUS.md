# Status — as of 14 Sep 2026

**The only source of truth for the present.** If another file disagrees with this one about today,
this one wins. **Update the date above whenever you touch it.**

**24 days to submission on 7 Oct 2026.** Teaching ends 14 Sep. That leaves 23 days of build time.
About half is reserved for testing, freeze and packaging by design.

---

## Where the project is

**The slice runs, the guard is measured, the scope is settled. The question set does not exist.**

The 13 Sep checkpoint was a thin working slice end to end. **It runs**, one day late in effect
and on the day in fact. Open `app/index.html`; `?arm=B` flips the arm. Verified in a headless
browser — gate, hint, refusal, escalation, and Arm B's unconditional reveal. 59 unit tests plus
the smoke run.

Two caveats, both stated in `app/README.md`: the questions in it are the **burned** round-2
screener questions, and `callModel` is a stub. It is a dev harness, not the study app.

The binding constraint has moved. It is no longer code — it is the question set, which is blocked
behind decisions 1 and 3.

### What exists

| thing | where | state |
|---|---|---|
| Scope lock and spec | `PRD-v1.md` | Done 10 Sep, four days late |
| Architecture diagram | `PRD-v1.md` §3 | Done. The LLM is not in the control path |
| The policy, written out | `PRD-v1.md` §4 | Specified, and **built** in `app/policy.js` |
| The level selector | `app/policy.js` | Done 13 Sep. 20 tests green |
| Leak guard + rejection policy | `app/hint-guard.js` | Done 13 Sep. 22 tests |
| Hint writer, prompt + pinned model | `app/hint-writer.js` | Done 13 Sep. 14 tests. Needs a Groq key and the function deployed |
| Key out of the page | `supabase/functions/hint/` | Written 13 Sep. **Not deployed** |
| Hint-quality eval | `evals/replay.js` | Done and **run** 13 Sep. 20/20 from the model, 0 fallbacks, 1 leak caught. `EXPERIMENT-LOG.md` Run 3 |
| Help-press orchestration + log shape | `app/help-session.js` | Done 13 Sep. 20 tests. Not yet wired to a UI |
| Browser SQL environment | `screener/round-2-runbutton/sql-mini-screen.html` | Working. Editor, Run, result comparison, error display, per-attempt logging |
| Screening data, 2 rounds, 7 people | `screener/` | Done. See `EXPERIMENT-LOG.md` |
| Participant pool | `RECRUITMENT.md` | 8 named, 7 active. Need 6 alive on 27 Sep |
| Hypothesis log | `HYPOTHESIS-LOG.md` | **v0 only.** The v1 entry is owed and blocked. See decision 2 |

The browser environment already covers most of the deterministic half of the architecture. What it
lacks is the help path.

### What is not built — `PRD-v1.md` §6

1. ~~**Help button and the policy.**~~ Done 13 Sep. `app/policy.js` + `app/help-session.js` +
   `app/index.html`. A learner can reach it.
2. **Hint writer.** One LLM call, grounded on the answer key, the learner's query and the result
   difference. Plus a guard that rejects any hint containing the answer. The guard is the 18 Sep
   deliverable.
3. **Log storage.** A Supabase table. The existing copy-log button is the fallback.
4. **The question set.** Practice questions plus a held-out set, frozen before the policy is
   written. Blocked on decision 3.

**Why it matters:** item 1 is what you are marked on, and it is the smallest of the four.

---

## The miss cascades. Read this before planning the week

The 13 Sep slice is not a self-contained slip. Three later checkpoints depend on it.

- **18 Sep, testing and guards.** The deliverable guards the hint writer. The hint writer needs the
  policy. So items 1 and 2 must both exist first.
- **20 Sep, first version on real data.** Already pulled forward from 23 Sep, because the removal
  test needs 5 to 7 days before 27 Sep. There is no slack left here.
- **21 Sep, practice session.** Real people touch the real app. After this, changing the app
  invalidates the comparison.

So the build window for items 1 to 3 is **now to 20 Sep. Seven days.** And item 4 is blocked behind
an unresolved decision.

**Why it matters:** this is a bigger risk than the 30 Sep freeze date flagged in `CAPSTONE-PLAN.md`.

---

## Open decisions

Only decision 2 is still open. It blocks nothing today, and everything on 27 Sep.

### 1. ~~Not enough moments to act on~~ — CLOSED 14 Sep

Round 2 measured 0.14 moments per person-question, which over 48 person-questions is ~7 against
a budgeted 48. Two fixes were available and only one of them left the treatment intact.

Closed by the combination: a syntax error satisfies the gate (§9.3, raising the rate to ~0.48,
so ~23 moments), and the scope drops to one concept (halving the cells to 2, so ~11 each against
a budget of 12). It was always the same decision as 3.

Numbers in `EXPERIMENT-LOG.md` Run 2. The reasoning error that hid it is `LEARNING-LOG.md` L5.

### 2. ~~The four cut-off numbers~~ — CLOSED 14 Sep

Filled. TODO-HYPOTHESIS-v1.md was rewritten and renamed `ANALYSIS-PLAN.md`. It is now a live
document, read on 28 Sep, not a task to delete.

Section 4 holds the checklist. Two checks were added in front of the original four: attrition
(0a) and actual elapsed gap per participant (0b). The original check 1 was replaced — it asked
for a percentage of about 23 events across Arm A, which cannot be computed.

Section 5 is new. It pre-commits the direction of two secondary measures, attempt rate and
satisfaction, so neither can be reached for on 28 Sep after the fact.

Still owed: the v1 entry in `HYPOTHESIS-LOG.md`, which this unblocks.

### 3. ~~The second topic~~ — CLOSED 14 Sep

**One concept: GROUP BY/HAVING. Four sub-skills, three practised, S4 held back as the control.**

Held-out items are hand-paired to practice items by sub-skill, which keeps the attribution
argument without a second concept. Cells drop from 4 to 2, so ~23 moments become ~11 per cell
against a budget of 12.

`HYPOTHESIS-LOG.md` v0.1 records the evidence and what it changed. `PRD-v1.md` §6 item 4 has the
authoring spec. **Decision 1 closes with it** — the moments arithmetic was the same problem.

### 4. ~~Does a syntax error satisfy the gate?~~ — CLOSED 13 Sep

**Yes.** Five of 21 tries produced no working query at all. Built in `app/policy.js`, with a
text-changed clause so identical re-presses do not count (`LEARNING-LOG.md` L11). `PRD-v1.md`
§9.3.

### 5. Error message quality

Arm B's condition is the bare error message. Round 2 showed SQLite can point at the wrong word and
sustain 63 useless attempts.

Two options. Give both groups error messages of matched quality. Or write this up as a stated limit
before Arm B runs. Evidence: `LEARNING-LOG.md` L7.

### 6. ~~How many tries with the hint before showing the answer~~ — CLOSED 13 Sep

**N = 2.** Fixed, never adaptive. A constant in `app/policy.js`; `PRD-v1.md` §9.1.

---

## Live risks on the participant pool

- **Former reports.** Nobody reports to Vikrant now. But he was senior to most, and 4 were on his
  team before.
- Mitigations already agreed. Split those 4 across both groups. Never say which group is "his".
  Say plainly that dropping out is free.
- **Dropout is the main threat, not ability.** 8 named, 7 active, 6 needed alive on 27 Sep.
- Dropout that differs *between the groups* would break the comparison outright. Over-recruit to
  10 or 12. Track who completed the removal test, by group.
- **Both rounds' questions are burned.** The study must not reuse them, and it needs a different
  schema too.

**Why it matters:** one named dropout risk already exists. See manish in `screener/TESTER-PROFILES.md`.

---

## Remaining checkpoints

| date | checkpoint | state |
|---|---|---|
| 6 Sep | Scope lock | Done 10 Sep, late |
| 13 Sep | Thin working slice end to end | **Done**, on the day |
| 18 Sep | Testing and guards | **Done 13 Sep.** Guard built, eval run, Run 3 logged |
| 20 Sep | First version on real data | 7 days out, nothing built |
| 21 Sep | Practice session | App frozen from here |
| 27 Sep | **REMOVAL TEST** | The measurement. Cannot move |
| 28–29 Sep | Analysis | |
| 30 Sep | **FEATURE FREEZE** | |
| 3 Oct | Video, README, deploy | |
| 5 Oct | Dry run | |
| 7 Oct | **SUBMIT** | 9 Oct is a backstop, not the plan |

Demo Day: 11 Oct 2026, 100x HQ.

---

## Next actions

1. **Author the question set** — `PRD-v1.md` §6 item 4. One concept, ~16 practice items over
   S1/S2/S3, a held-out set covering all four sub-skills, the pairing table, and a fallback hint
   per question. This is now the only thing between here and 20 Sep.
2. ~~Fill the four numbers~~ Done 14 Sep; see section 2 above. Still owed: append v1 to
   `HYPOTHESIS-LOG.md`.
3. ~~**`git init`.**~~ Done 13 Sep, commit `7439b80`. Commit small and often from here.
4. Build items 1 to 3 from `PRD-v1.md` §6 against a 20 Sep wall.

**Why it matters:** item 1 is a decision, not work. It costs an hour and unblocks seven days.
