# Round 3 — the practice session, 22 Sep 2026

**This is the study, not a screening round.** Rounds 1 and 2 were the calibration pilot. This
folder holds the first data that counts.

> Read `../README.md` for how the screening rounds relate to each other, and `../../STATUS.md`
> for where the project stands today.

## What this round is

Seven participants, one session each, ~45-60 minutes. Each opens a personal link into the hosted
app and works through the 16 practice items in `../../study-questions/`. Three people get the
gate-and-hint version, four get answer-on-demand. Nobody is told versions exist.

The measurement that matters is not here. It is the **removal test on 27 Sep**, scored against
this session per person. This round exists to produce the practice exposure and the help-use
record that the removal test is read against.

**So what:** a log from this round that cannot be matched to a person is a lost participant, not
a lost file. The removal test has nothing to compare against for them.

## This round owns exactly one directory

`../../CLAUDE.md`: one directory per data round, owned by that round's grader. A second copy of
these logs anywhere else caused a silent n=6 grading run on 13 Sep — `../../LEARNING-LOG.md` L8.
Logs live in `logs/` here and nowhere else.

## Files

| file | what |
|---|---|
| `SEND-SHEET-22SEP.md` | The seven messages to send, one per person, links inlined. **Never sent to a participant** |
| `logs/` | One returned log per person, named `learning-os-log-<code>.json`. Code, not name |
| — | No grader yet. The app's own `grade-rule.js` already graded every attempt at the time it was made; this round's logs carry the verdicts |

The instrument itself is not in this folder. The app is `../../app/`, the questions are
`../../study-questions/`, and both are frozen from 22 Sep.

## Naming: codes, not names

A log filed under a person's name puts the name next to the version they ran. Codes keep that
mapping in one place — `../participant-links.md` — which is the only file that must never be
shared. `../participant-links.md` maps code to person to version.

## What to check the moment the logs are in

1. **Every log has `finished`.** Missing means they closed the tab before pressing the button, and
   the session end time is gone.
2. **Seven logs, seven distinct codes.** A duplicate code means one person ran twice, or two
   people shared a link.
3. **`function_edge_logs` in Supabase for the session window.** Any status other than 200 means
   some of the gate-and-hint presses silently fell back to hand-written hints. Check this on the
   day, while it is still possible to ask the person what they saw — not on the 28th.
4. **Solve rates against round 2's.** If they come in far below, the scoring rule's clause 2 is
   the first suspect. Assumption 8 in `../../HYPOTHESIS-LOG.md`.

**So what:** items 1 to 3 are unrecoverable after the session; item 4 is the one open design
question this round can answer.

## After the session

- Tick attendance in `../participant-links.md`. Differential dropout between versions breaks the
  comparison outright and cannot be reconstructed later.
- Append a run entry to `../../EXPERIMENT-LOG.md`. Append-only — never edit an entry.
- If anything broke an assumption, append to `../../LEARNING-LOG.md` and, if it changed the
  design, `../../HYPOTHESIS-LOG.md`.
