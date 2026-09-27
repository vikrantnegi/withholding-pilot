# Status — as of 27 Sep 2026

> **27 Sep:** removal page hosted at `https://teal-marzipan-e1b49a.netlify.app/` and verified
> from a browser: byte-identical to `app/dist-removal` once Netlify's injections are stripped.
> The send sheet has the real links. The practice site is disabled, checked: "Site not found".
> **Still owed before Mon 28 Sep 11:58 IST:** send ritesh his date change.

> **26 Sep:** the removal test is **built and verified, not hosted.** `app/removal.html` is
> generated from the practice page by `study-questions/mkremoval.py`: the 12 held-out items, no
> Help for either arm, three optional 1-5 questions logged as `survey`. Scored as correct on any
> attempt, denominator 12, decided today before any removal data. `evals/verify-removal.mjs`:
> 16 of 16 headless. Both grader fixes are merged (L21 aliases, L22 double quotes), JS 37 of 37,
> conformance 0 drift. **Still owed before Mon 28 Sep 11:58 IST:** host `app/dist-removal` as a
> new Netlify Drop site, take the practice site down, send ritesh his date change.
> `screener/round-4-removal/SEND-SHEET.md` has every window and message. The body of this file
> below is still as of 20 Sep.

> **25 Sep:** all 7 practice logs are in. ritesh practised on **25 Sep** (not 24), finishing
> 22:35 IST, so his removal test is **Wed 30 Sep after 22:35 IST, or Thu 1 Oct**. 29 Sep would be
> 4 days, and check 0b would exclude him. **The analysis window extends to 1–2 Oct** for his data.
> The other six still run 28–29 Sep. Submission is still 7 Oct. Grader fix (aliases in HAVING)
> is on branch `grader-alias-having`, not merged; a double-quoted-string fix is still owed.

> **23 Sep:** practice session runs **today**, removal test moved to **Mon 28 Sep** (5 days; each
> person's 28 Sep slot at or after their 23 Sep clock time, or check 0b excludes them). Analysis
> is squeezed into 28 evening and 29 Sep. Send sheet updated. Everything below is as of 20 Sep.

**The only source of truth for the present.** If another file disagrees with this one about today,
this one wins. **Update the date above whenever you touch it.**

**17 days to submission on 7 Oct 2026.** Teaching ended 14 Sep. About half the remaining time is
reserved for testing, freeze and packaging by design.

---

## Where the project is

**The instrument exists, the app serves it, and the hint function is live. What is missing is
three things that need other people.**

The question set was the binding constraint for a week. It is frozen: `study-questions/`, 28 items
over one concept, 16 practice and 12 held-out. All three verifiers report `problems: 0`. The app
serves the 16 practice items and was driven end to end in a headless browser on both arms.

The hint function was the blocker and is now deployed and verified, with the URL set in
`app/transport.js` for everybody. A real hint came back in 1875 ms and a request for a different
model was refused in 55 ms, so the key works and the server-side model pin holds.

**The remaining silent failure is Groq's rate limit.** Arm A calls the model; Arm B never does.
If six people press Help inside the same few minutes and Groq throttles, the function returns
502, the app treats it as a rejected generation, and those learners get fallbacks — with nothing
on screen to say so. It would hit Arm A only, and only for part of the session. Watch
`function_edge_logs` during the session; a 502 there is the signal.

**So what:** the 22 Sep session can run as specified. The thing to monitor is not whether it
works, but whether it keeps working for all three Arm A testers at once.

### What exists

| thing | where | state |
|---|---|---|
| Scope lock and spec | `PRD-v1.md` | Done 10 Sep, four days late |
| Architecture diagram | `PRD-v1.md` §3 | Done. The LLM is not in the control path |
| The policy, written out | `PRD-v1.md` §4 | Specified, and built in `app/policy.js` |
| The level selector | `app/policy.js` | Done 13 Sep. 34 tests, re-pointed at the study schema 19 Sep |
| Leak guard + rejection policy | `app/hint-guard.js` | Done 13 Sep. 32 tests |
| Hint writer, prompt + pinned model | `app/hint-writer.js` | Done 13 Sep. 14 tests. **Live 19 Sep** — deployed, key set, verified |
| Key out of the page | `supabase/functions/hint/` | **Deployed 19 Sep** to project `yzmunjbhhtuerxoinxsd`. Verified: real hint in 1875 ms, model pin rejects a tampered request in 55 ms |
| Hint-quality eval | `evals/replay.js` | Run 13 Sep. 20/20 from the model, 0 fallbacks, 1 leak caught. `EXPERIMENT-LOG.md` Run 3 |
| Help-press orchestration + log shape | `app/help-session.js` | Done 13 Sep. 20 tests. Wired to the UI |
| **The question set** | `study-questions/` | **Frozen 19 Sep.** 28 items, scoring rule, 3 verifiers at `problems: 0` |
| **The scoring rule, in the app** | `app/grade-rule.js` | **Done 19 Sep.** 23 tests. One rule for the learner and the score |
| **Grader agreement** | `evals/grader-conformance.mjs` | **Done 19 Sep.** 75 of 75 queries agree across both implementations |
| **The app on the real question set** | `app/index.html` | **Done 19 Sep.** 16 practice items; held-out absent from the source |
| **Hosted, live** | `https://tranquil-starlight-f0129e.netlify.app/` | **Up 19 Sep.** Both arms checked in a browser; the hint path returns a model-written hint from the hosted origin |
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
2. ~~**Hint writer — deployed.**~~ Done 19 Sep. Deployed to `yzmunjbhhtuerxoinxsd`, key set, URL
   in `app/transport.js`, and verified from the hosted page in a browser: a model-written hint,
   no fallback. `supabase/README.md` has the evidence and the Monday-morning re-check.
3. **Log storage.** A Supabase table. Parked; the copy-log button is the fallback.
   **Checked 20 Sep:** `payload()` stamps `LOG.finished` on every copy and download, and
   `LOG.started` is set when the session opens. Both are in the returned log. Nothing to build.
4. ~~**The question set.**~~ Done 19 Sep. `study-questions/`, frozen.

---

## The four things standing between here and the removal test

Ordered by what breaks if it is skipped. Only the first is code.

1. ~~**Deploy the hint function.**~~ Done and verified live 19 Sep, including from the hosted
   page. Re-run `evals/check-hint-function.mjs` on the morning of 22 Sep — a key or quota can
   lapse and the failure is silent.
2. ~~**Arm assignment.**~~ **Done 19 Sep.** manish's round-1 grade was regraded first — the fault
   was a missing comma, and no score moved. Ranked on round 2, paired, flipped within pairs, four
   former teammates split. Arm A: nabin, gaurav, ritesh. Arm B: anuj, vikash, manish, rishabh.
   Reproducible from a seed, and settled before any Arm A data exists. `screener/ARM-ASSIGNMENT.md`.
3. **A pilot tester from outside the seven, before 22 Sep.** Anyone in the pool who sees an item
   burns it. One outsider cannot establish difficulty but can catch an item that is broken,
   ambiguous or impossible — the failure mode that costs a whole cell. Named as the only available
   mitigation in `ANALYSIS-PLAN.md`, and **still not done. 20 Sep is the last day it is possible.**
4. **Send the seven messages.** The practice session moved to **22 Sep** and the removal test is
   **27 Sep, exactly** — see `RECRUITMENT.md` §6, note of 20 Sep. The messages are written, one
   per person with the link inlined: `screener/round-3-practice/SEND-SHEET-22SEP.md`. **Nothing
   has been sent.** Times still need filling in, staggered across the day.

**So what:** two of the four are one evening's work and both are still open. They are the schedule
risk now, not the build.

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

**Decided by data, not by argument.** First evidence is 22 Sep. Assumption 8 in
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

**Hosted copy is current, 20 Sep.** The stale-refusal fix (`LEARNING-LOG.md` L10) is deployed
and `evals/check-hosted.mjs` passes 14 of 14 against the live URL — byte-compared, so the served
page is the build on disk and not an older upload. One warning, already understood: Netlify
injects an ad comment and a HUD script into both arms identically, so it cannot bias the
comparison.

**Still owed by hand, because no script can see it.** Open one link, run a wrong-but-valid query,
press Help, and confirm the hint does *not* say `(fallback)`. A hint function that answers from
the terminal but not from the hosted origin — usually CORS — looks exactly like a working session.

**One deliberate inconsistency.** `HYPOTHESIS-LOG.md` and `EXPERIMENT-LOG.md` still say 26 and
21 Sep. Both are append-only — an entry is never edited, it is superseded. The live dates are in
this file, and this file wins.

---

## Remaining checkpoints

| date | checkpoint | state |
|---|---|---|
| 6 Sep | Scope lock | Done 10 Sep, late |
| 13 Sep | Thin working slice end to end | Done, on the day |
| 18 Sep | Testing and guards | Done 13 Sep. Guard built, eval run, Run 3 logged |
| 20 Sep | First version on real data | **Done 19 Sep**, a day early. Question set frozen, app hosted and verified on both arms, hint function live |
| 22 Sep | **Practice session** | **Not sent.** Moved from 21 Sep on 20 Sep. App frozen from here |
| 27 Sep | **REMOVAL TEST** | **Not sent.** 27 Sep exactly — the only date the gap rule and the analysis window both allow |
| 28–29 Sep | Analysis | `ANALYSIS-PLAN.md` is read on 28 Sep |
| 30 Sep | **FEATURE FREEZE** | |
| 3 Oct | Video, README, deploy | |
| 5 Oct | Dry run | |
| 7 Oct | **SUBMIT** | 9 Oct is a backstop, not the plan |

Demo Day: 11 Oct 2026, 100x HQ.

---

## Next actions

**Today, 20 Sep:**

1. **Fill in the seven times and send the messages.** Staggered across 22 Sep, not clustered.
   `screener/round-3-practice/SEND-SHEET-22SEP.md`. Send manish first — he is the flagged dropout
   risk.
2. **Run one pilot tester from outside the seven** through the 16 practice items. Today is the
   last day this is possible, and it costs nothing: that person's data was never going to count.

**Morning of 22 Sep:**

3. **Re-run the hint checker.**
   `node evals/check-hint-function.mjs https://yzmunjbhhtuerxoinxsd.supabase.co/functions/v1/hint`
   A lapsed key or quota produces a normal-looking session on hand-written fallbacks, and nothing
   on screen says so.

**During and straight after the session:**

4. **Watch `function_edge_logs` in Supabase.** Any status other than 200 means some Arm A help
   presses fell back. Check it on the day, while the person can still be asked what they saw.
5. **File each returned log** as `learning-os-log-<code>.json` in `screener/round-3-practice/logs/`,
   and tick attendance in `screener/participant-links.md`.

**Done since this file last said otherwise:** the hint function is deployed and verified, arm
assignment is final, and the copied log carries `started` and `finished`.

**Why it matters:** items 1 and 2 need other people and cannot be compressed. Item 3 cannot be
repaired after the fact — a missing key silently changes the treatment for one arm only.
