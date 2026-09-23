# Recruitment and participant handling

**Living file.** Rules that still govern how participants are recruited, assigned to arms, and
kept to the removal test. For the current pool count and the live dates, read `STATUS.md` — this file holds rules, not numbers.

Written 2 Sep 2026 for the networking session. Trimmed 13 Sep to the parts still in force.
The session-specific material was dropped; recruitment is done.

---

## 1. Eligibility

Cohort members cannot be participants. Confirmed by 100x on Discord, 1 Sep 2026. Full ruling
and reasoning: `CAPSTONE-RULES.md` A1.

That rules out three sources: low-code path members, participant swaps with other builders, and
the C7 Discord. All classmates.

**The pool is workplace non-engineering colleagues.** Not classmates, not on his team, genuinely
unable to write SQL.

## 2. Consent — fixed rule A3

Two conditions, because of positional power:

- **Nobody who reports to him**, directly or indirectly. The power dynamic makes "yes"
  unreliable and the consent worthless.
- **Explicitly voluntary.** Outside work hours or with manager sign-off. Say plainly that
  dropping out costs them nothing.

Four of the current pool were on his team before. Nobody reports to him now.

**So what:** say the dropout line out loud at both sessions, not just at recruitment.

## 3. Arm assignment — matched pairs, not coin flips

**This has not happened yet. It is the most important rule left in this file.**

Six learners split two ways is three per arm. The headline result is a difference between two
means from n=3. At that size, ordinary variation in SQL ability is larger than any effect the
help policy could produce.

If two people who already write joins land in the same arm, the experiment is over before it
starts. It would measure who was recruited.

The fix:

1. Rank everyone by screener score. Round 1 and round 2 data both exist for this.
2. Pair adjacent scorers — 1st with 2nd, 3rd with 4th, and so on.
3. Flip a coin *within each pair* to assign the arm.

This removes between-arm ability difference by construction. At n=3 per arm, randomness will
not handle it on its own.

**Also split the four former team members across both arms.** Never let one arm read as "his".

## 4. Over-recruit, hard

Losing one person from an arm of three is a 33% hit to that arm.

Target 10 accepted to land 6-8 completions. Dropout is the main threat to this study, not
ability.

**Differential dropout is worse than dropout.** If one arm loses more people than the other,
the comparison breaks outright. Record `completed_removal_test` per person, by arm.

## 5. Booking the sessions

"I'll ping you when it's ready" is how you get ghosted. Before anyone walks away:

- Calendar invite sent, both sessions, while you are still with them.
- WhatsApp group created, everyone added.
- Their reply to a test message in that group.

State the commitment honestly and upfront:

> Two sessions, about a week apart. First is ~60 min of practice. Second is ~30 min, no tools,
> no assistant, just you and a blank editor. That second one is the whole point.

## 6. Why the gap between sessions is 5-7 days

Testing retention ten minutes after practice measures working memory, not retained skill. Five
to seven days is the minimum that is not self-deception.

That gap is what pulled v0 forward to 20 Sep. The dates it produced:

| Date | What |
|---|---|
| 20 Sep | v0 usable by a stranger, on real data |
| 22 Sep | Practice session, both arms |
| 27 Sep | Removal test, both arms. `STATUS.md` has the live date |
| 28-29 Sep | Score, analyse, write up the gap |
| 30 Sep | Feature freeze — results land just before it |

**So what:** if the removal test slips past 27 Sep, results arrive after freeze and cannot change
the build. At that point the experiment was run for the write-up, not for the product.

**Note, 19 Sep.** The 5-to-7-day gap from a 21 Sep practice session puts the removal test between
26 and 28 Sep, and freeze puts the ceiling at 27. So the window is **26 or 27 Sep**, and it is
still unbooked. This file states the rule; `STATUS.md` states the date, and wins.

**Note, 20 Sep — supersedes the note above.** The practice session moved to **22 Sep**, to buy a
day for the pilot tester and the send sheet. A 5-to-7-day gap from 22 Sep gives 27 to 29 Sep, and
the 28-29 Sep analysis window puts the ceiling at 27. So the removal test is **27 Sep, exactly**.

**There is no slack left.** If the practice session slips to 23 Sep, the gap rule and the analysis
window cannot both be satisfied, and one of them has to be broken and written up as a limitation.

**Note, 23 Sep — supersedes the note above.** The practice session slipped to **23 Sep**, the case
this section warned about. The gap rule was kept and the analysis window was cut instead: the removal
test is **Mon 28 Sep**, and each person's slot must be at or after their 23 Sep clock time, because
check 0b measures the real gap. Analysis is 28 evening and 29 Sep.

## 7. The pitch, if more people are needed

> I'm building a SQL tutor for my capstone and I need people who *can't* write SQL yet. That's
> the qualification, not a disqualifier. Two short sessions in late September, about a week
> apart, roughly 90 minutes total. You come out able to write real queries against a real
> database. Completely voluntary, and pulling out costs you nothing.

Lead with "can't write SQL yet" as the qualification. It reframes the gap as the reason they
were picked, so the ask lands as an offer rather than a favour.

## 8. Capture sheet fields

Name · contact · screener score · last used SQL · confidence 1-5 · availability 22 Sep ·
availability 27 Sep · arm (assigned by §3) · completed_removal_test
