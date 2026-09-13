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

## Wiring up a hint writer

`PRD-v1.md` §6 item 2 is not built. When it is, drop a module here:

```js
// evals/model.js
module.exports = async (ctx, attempt) => {
  // ctx = { referenceQuery, learnerQuery, fallbackHint }
  // return a string
};
```

`replay.js` picks it up automatically. Until then every case shows the fallback,
which is still worth reading — it is what a learner sees when the model is
unavailable, and four of the current twenty are flagged generic.

## After the question set exists

The sheet replays round-2 questions, which are burned. It tells you the writer can
name a difference **in general** — not that it handles your future questions.

Re-run it then, on wrong answers you write yourself. You have a catalogue of how
these seven actually fail: quoting `"ASC"`, `WHERE` where `HAVING` belongs,
`ORDERBY` with no space, singular table names, `COUNT` without its parentheses.
Fake learner, real failure modes, nobody burned.
