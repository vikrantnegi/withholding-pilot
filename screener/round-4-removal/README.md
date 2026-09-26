# Round 4 — the removal test, 28 Sep to 1 Oct 2026

**This is the measurement.** Round 3 was the practice exposure; this round is what it is scored
against. Seven people, one session each, ~30 minutes, the 12 held-out items, no Help for anyone.

> `../../STATUS.md` has the live dates. `SEND-SHEET.md` here has each person's window and message.

## What the page is

`app/removal.html`, generated from `app/index.html` by `study-questions/mkremoval.py`. Same editor,
Run button, verdict wording and grader as practice. Three differences, and only three:

1. the 12 held-out items (H01-H12) instead of the 16 practice items,
2. no Help button, no help modules, and no call to the hint function, for either arm,
3. three optional 1-5 questions about session 1 on the send screen, logged as `survey`.

**Scoring, decided 26 Sep before any removal data existed:** an item is correct if any attempt
grades `correct` under the frozen rule. Denominator 12, blanks score zero (`ANALYSIS-PLAN.md`).
Every attempt is logged, so first-attempt-correct stays available as a secondary.

## Build and host

```sh
bash app/make-removal-dist.sh      # regenerates removal.html, builds app/dist-removal/
```

Host `app/dist-removal/` on its **own** Netlify Drop site. Never on the practice site: the
practice URL must never serve a held-out item.

Verified 26 Sep: `evals/verify-removal.mjs`, 16 of 16 in a headless browser. All 27 held-out
queries (12 references, 15 wrong models) get the same verdict in the page as `grade_rule.py`.

## This round owns exactly one directory

Logs go in `logs/` here and nowhere else, as `learning-os-removal-log-<code>.json`
(`../../CLAUDE.md`, one directory per data round; `../../LEARNING-LOG.md` L8).

**So what:** a removal log that cannot be matched to its practice log is a lost participant.
The code in the file name is what matches them.
