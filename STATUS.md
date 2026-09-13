# Status — as of 13 Sep 2026 (late evening)

**The only source of truth for the present.** If another file disagrees with this one about today,
this one wins. **Update the date above whenever you touch it.**

**24 days to submission on 7 Oct 2026.** Teaching ends 14 Sep. That leaves 23 days of build time.
About half is reserved for testing, freeze and packaging by design.

---

## Where the project is

**Scope is locked. The design is sound. The slice runs. The question set does not exist.**

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
| Hint-quality eval | `evals/replay.js` | Done 13 Sep. **The 18 Sep deliverable, 5 days early.** Runs against the same writer the app uses |
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

Ordered by what blocks the most. Decisions 1 and 2 block the build.

### 1. Not enough moments to act on — the one that decides whether 28 Sep produces anything

Round 2 measured 3 usable moments out of 21 tries. Scaled to the plan of 3 learners and 16
questions, that is about 7 moments against a budgeted 48.

Two directions, and they are not equivalent.

- Write questions that fail more often on the first working attempt. This raises the count without
  touching what is being tested.
- Drop the rule that the first attempt must run. That rule is half the treatment. So this raises the
  count by changing what is being tested.

**Undecided.** Numbers in `EXPERIMENT-LOG.md` Run 2. The reasoning error that hid this is
`LEARNING-LOG.md` L5.

### 2. The four cut-off numbers — overdue since 6 Sep

`TODO-HYPOTHESIS-v1.md` §4 has four blanks. They set, in advance, the numbers at which you conclude
the study did not run properly. As opposed to concluding the idea was wrong.

They must be filled before Arm B runs. A number chosen afterwards is chosen knowing what it lets you
claim.

This also unblocks the v1 entry in `HYPOTHESIS-LOG.md`. After that, delete
`TODO-HYPOTHESIS-v1.md` as its own header instructs.

### 3. The second topic

T3, joining two tables, is dead. Round 2: three of seven tried it, none solved it. T1 was already
out, because on a one-line query a hint and the answer are the same string.

So T2 is the only topic left, and the locked scope calls for two. Either write a second topic close
to T2, or drop to one topic and redo the cell arithmetic. Blocks `PRD-v1.md` §6 item 4.

### 4. Does a syntax error satisfy the gate?

Round 2 answers this: **yes, it must.** Five of 21 tries produced no working query at all.

Note this recovers 5 of the 18 missing moments, and 3 of those 5 are one person. It does not solve
decision 1.

### 5. Error message quality

Arm B's condition is the bare error message. Round 2 showed SQLite can point at the wrong word and
sustain 63 useless attempts.

Two options. Give both groups error messages of matched quality. Or write this up as a stated limit
before Arm B runs. Evidence: `LEARNING-LOG.md` L7.

### 6. How many tries with the hint before showing the answer

`PRD-v1.md` §9 recommends 2. Low stakes, but it sits inside the policy code, so fix it before
writing item 1.

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
| 18 Sep | Testing and guards | `app/hint-guard.js` done 13 Sep, 5 days early |
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

1. **Decide decision 1**, and decision 3 with it — they are one decision. Dropping to one topic
   halves the cells and roughly closes the moments arithmetic. Nothing about the question set is
   safe to author until this is settled, and item 4 is now the only thing between here and 20 Sep.
2. Fill the four numbers in `TODO-HYPOTHESIS-v1.md` §4. Append v1 to `HYPOTHESIS-LOG.md`. Delete the
   TODO file.
3. ~~**`git init`.**~~ Done 13 Sep, commit `7439b80`. Commit small and often from here.
4. Build items 1 to 3 from `PRD-v1.md` §6 against a 20 Sep wall.

**Why it matters:** item 1 is a decision, not work. It costs an hour and unblocks seven days.
