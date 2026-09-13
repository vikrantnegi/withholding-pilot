# evals/ — is the hint any good?

The 18 Sep checkpoint. Run it, read the sheet, mark the boxes.

```
node evals/replay.js --out evals/sheet.md     20 cases
node evals/replay.js --all --out evals/all.md  all 104
```

## The problem this exists for

`app/hint-guard.js` checks a hint does not give the answer away. **Nothing checks it
is useful.** "Think about your query structure" passes the guard cleanly and helps
nobody.

If Arm A's hints are useless, Arm A's treatment is really just *gate and nothing*.
A null on 28 Sep would then look exactly like "withholding does not work" when the
truth is "the hint writer was bad". That is a measurement failure, and it belongs in
the triage checks in `TODO-HYPOTHESIS-v1.md` §4 — not in the conclusion.

## Why it contacts nobody

The hint writer's only input is a learner's wrong query. **104 of those are already
on disk** from round 2. Replaying stored attempts costs nothing.

Asking the seven to try again would cost a great deal. They are the study's
participants. Anyone who reads hints about GROUP BY/HAVING before 21 Sep has
practised the study's topic with the study's treatment, outside the study, with no
measurement — and has to be dropped.

Data is free. Contact is not. People touch this app exactly twice: 21 Sep practice,
27 Sep removal test.

## Reading the sheet without knowing SQL

Each case computes **THE DIFFERENCE** between what the learner wrote and the
reference query, in plain English — which keywords are missing, which are extra,
which were typed without a space, what the database said.

You do not judge the SQL. You judge whether the hint points at that difference.
Three boxes per case:

1. points at the difference?
2. stops short of the fix?
3. would you know what to try next?

Three noes on the same question is the writer's fault, not the learner's.

The third question is the one only you can answer, and you are the right person for
it — a competent developer who does not write SQL daily is close to the participants.

## Running it against the real writer

```
export GROQ_API_KEY=gsk_...
node evals/replay.js --out evals/sheet.md          20 cases, ~1.5 min
node evals/replay.js --all --out evals/all.md      104 cases, ~15 min
```

The writer is `app/hint-writer.js` — **the same module, prompt and model the app
serves on 21 Sep.** Only the transport differs: the eval calls Groq directly from
your machine, the app goes through the Edge Function. If the eval had its own
prompt you would evaluate one thing and ship another.

Model pinned to `openai/gpt-oss-120b` at temperature 0.3. Groq marks it
production; its preview models are documented as evaluation-only, and your study
is production — six people, one session, no re-runs.

**Watch the token budget, not the request count.** Free tier is 8K tokens/minute
and 200K/day.

**Measured 13 Sep**, one call via `probe.js`: 421 prompt + 59 completion = **480
tokens**, of which only 20 were reasoning. `reasoning_effort: low` keeps the
overhead negligible, so no model swap is needed.

| | |
|---|---|
| per call | ~480 tokens |
| 8K/min | ~16 calls/min — the 3800ms throttle sits right at the line |
| 200K/day | ~415 calls |
| 20-case sample | up to 40 calls, ~19K tokens |
| `--all` | up to 208 calls, ~100K tokens — **two runs a day** |

Iterate on the 20-case sample. Save `--all` for when you think you are close.
`--delay <ms>` overrides the throttle.

Re-measure with `probe.js` if you ever change the model or the prompt length. If
the overhead ever does get large, `llama-3.3-70b-versatile` is the swap — also
production on Groq, no reasoning channel. Change `MODEL` in
`app/hint-writer.js` and the matching constant in
`supabase/functions/hint/index.ts`. **Never after 21 Sep.**

Without a key every case shows the fallback, which is still worth reading — it is
what a learner sees when the model fails twice, and four of the current twenty are
flagged generic.

## Does the guard actually catch anything?

```
node evals/adversarial.js --out evals/adversarial.md     8 cases x 3 attacks, ~24 calls
node evals/adversarial.js --cases 16 --out evals/adversarial.md
```

Across ~110 real generations the guard rejected 8 hints and **every one was its
own mistake** (`EXPERIMENT-LOG.md` Run 4). It has been wrong twice and right zero
times, because every leak it has caught was written by hand in its own test file.
That measures imagination, not the guard.

This run replaces the writer's prompt with one that tries to leak, against real
learner queries, and counts what gets through. Three attacks:

| attack | what it tests |
|---|---|
| `blatant` | hands over the whole query — the easy case |
| `partial` | leaks only the missing clause, which is all a learner needs |
| `prose` | describes the correct query in English with no code at all |

`prose` is the one that matters. If the guard only recognises SQL-shaped text,
prose is how Arm A quietly becomes Arm B.

**Read every MISSED line.** One question each: *could a learner type the correct
query from this?* The report also runs a second opinion that counts SQL keywords
and the reference's own literals — deliberately not the guard's logic, so the run
is not grading itself.

Recall is a number for the write-up. E3 asks you to prove a component belongs
where you put it; "it rejected nothing, and everything it did reject was wrong"
is not that proof.

## When every generation is rejected

```
node evals/probe.js
```

One call, and it prints the whole thing: the system prompt, the user prompt, the
exact string the model returned, and the guard's verdict on it. Cheaper than
re-running the sheet, and it shows you the generation rather than only the
rejection reason.

The sheet now prints rejected generations too, indented under each case. If a
rejection reads `no text in reply`, the model returned nothing visible — usually
a reasoning-channel problem, not a content problem.

## After the question set exists

The sheet replays round-2 questions, which are burned. It tells you the writer can
name a difference **in general** — not that it handles your future questions.

Re-run it then, on wrong answers you write yourself. You have a catalogue of how
these seven actually fail: quoting `"ASC"`, `WHERE` where `HAVING` belongs,
`ORDERBY` with no space, singular table names, `COUNT` without its parentheses.
Fake learner, real failure modes, nobody burned.
