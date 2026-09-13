# 15-minute interview script + log sheet

Run this **after** they have read their card. Record it (ask first). You need one
specific quote per person — artefact 8 is scored on whether the reaction is specific
enough to inform design, so a "thanks, that's helpful" is a failed interview.

Every question below is doing double duty: it is a hackathon artefact **and** it closes
one of the three decisions still open in PRD-v1 §Still-open.

---

## Part 1 — how they actually work (4 min) → artefact 6

1. Walk me through what you did when you sat down with that exercise. Where were you,
   what did you have open?
2. When you hit a question you weren't sure about, what did you do next? *(Listen for:
   guessed and moved on / reread the question / would normally have Googled.)*
3. Last time you wrote SQL for real work — what did that look like? Where did you get
   unstuck?
4. When you write SQL normally, do you run it as you go, or write the whole thing then
   run it?

> **Why Q4 matters:** if they normally run-as-they-go, then writing cold was not just
> hard, it removed their entire error-correction loop. That is the difference between
> "can't write SQL" and "can't write SQL blind", and it is the finding this whole
> exercise turns on.

---

## Part 2 — the reaction (5 min) → artefact 8

5. You've read the card. What's your reaction to it? *(Say nothing after this. Let the
   silence run. The first unprompted sentence is your quote.)*
6. Was there anything in there you already knew and just didn't apply on the day?
7. Anything in there you'd argue with?

> Question 7 is the one people skip. A user who disagrees with your diagnosis is giving
> you better information than one who agrees, and "process honesty" is a scored
> dimension.

---

## Part 3 — the three open decisions (6 min)

**On the gate — does a syntax error count as an attempt?** *(PRD-v1, open decision 3)*

8. When you hit Run and got back `near "highest": syntax error` — is that you *having
   attempted*, or you not having started yet? *(Ask this of Rishabh about his own log.
   Ask Gaurav about his missing-comma attempt on M1.)*
9. If a tool refused to help you until you'd made one attempt that actually ran, and
   told you a syntax error didn't count — how would that land after 40 minutes?
9b. **(Rishabh only, and ask it gently.)** There are runs in your log where the query
   didn't change between presses. What were you doing at that point — rereading it,
   hoping, something else? *(This is the one question that decides whether "the text
   must have changed" is a fair rule or a punitive one. Do not lead him.)*

**On N — attempts with a hint before revealing the answer** *(open decision 1)*

10. Say you're stuck and the tool gives you a hint instead of the answer. You try again
    with the hint. Still wrong. Now what do you want to happen — another hint, the
    answer, or is it your turn to try again?
11. How many times would you try again before you'd close the tab?

**On the thresholds** *(open decision 2)*

12. Of the questions you didn't attempt — were those "no idea where to start", or "ran
    out of time"?

---

## Log sheet — fill during, not after

```
Person:
Contact channel + first-contact timestamp:
Interview start / end (IST):
Consent to record: Y / N

WORKING STYLE
  runs-as-they-go / writes-then-runs:
  what they do when stuck (verbatim):
  last real SQL task:

REACTION  (verbatim, their words, no paraphrase)
  first unprompted sentence after reading the card:

  already knew but didn't apply:

  disagreed with:

GATE  (open decision 3)
  does a syntax error feel like an attempt?  Y / N / "depends —"
  reaction to being refused help after a syntax error:

  what an unchanged re-run meant to them (Rishabh):

N  (open decision 1)
  after a hint that didn't work, they want:  another hint / the answer / to retry
  attempts before they'd quit:                ___

BLANKS  (open decision 2)
  no-idea / out-of-time:

ONE LINE I DID NOT EXPECT:
```

---

## Do not do these

- Do not explain your study, your two arms, or your hypothesis. They are future
  participants. Telling them which condition is "yours" is the exact contamination the
  screener README warns about in *After you have the scores*, point 4.
- Do not defend the grader when they criticise it. Write down the criticism.
- Do not ask leading questions on the gate. "You'd want help even after a syntax error,
  right?" hands you your own answer back.
