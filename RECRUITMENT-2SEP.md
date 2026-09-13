# Participant recruitment: 2 Sep networking session
**Goal: 8-10 named NON-CLASSMATE people, screened and calendar-booked, by 6 Sep.**
Not "interested." Booked.

⚠️ **The 2 Sep session is a referral and mentor slot, not a recruiting slot.** Cohort members
are ineligible as participants (`CAPSTONE-RULES.md` A1). Your primary pool is your workplace.

✅ **Confirmed by 100x on Discord, 1 Sep 2026:** classmates are not allowed; participants must
come from outside the cohort. This document was already written to the strict reading, so
nothing in it changes.

---

## 1. Read the room correctly

2 Sep is billed as capstone group formation. Everyone there is looking for a team. You are
looking for test subjects. That mismatch is the whole problem with the session. Say what you
want in the first sentence, or you burn ten minutes each on people who wanted a co-founder.

### Cohort members are not eligible, including the low-code path

The C7 Capstone FAQ is explicit: the user must be *"a real person who is not you and **not a
classmate**"*, and *"the exclusion is load-bearing."* See `CAPSTONE-RULES.md` A1.

That kills three ideas at once: recruiting low-code path members, reciprocal participant swaps
with other builders, and the earlier plan to source testers from the C7 Discord. All classmates.

The reasoning is worth internalising rather than just obeying. A classmate already knows what
the system is for, so they cannot generate the misunderstandings that count as evidence. And a
low-code classmate has sat through "Intro to Database" beside you with Supabase in their own
stack. That contaminates them on the precise skill you are measuring. The rule and the
experiment design point the same way.

### Where the participants actually come from

**1. Your workplace, the primary pool.** You are an ATL at a company full of non-engineers:
PMs, designers, QA, business analysts, marketing, ops, HR. They are not classmates, not on your
team, genuinely unable to write SQL, and reachable in a day. This is your strongest source by a
distance, and it needs no networking session at all.

Two consent conditions apply, because consent is a fixed rule (A3) and you have positional
power:
- Do not recruit anyone who reports to you, directly or indirectly. The power dynamic makes
  "yes" unreliable and the consent worthless.
- Make it explicitly voluntary, outside work hours or with manager sign-off. Say plainly that
  dropping out costs them nothing.

**2. Referrals sourced through the cohort.** A cohort member is not eligible. Their non-coder
friend, spouse, or colleague is. This is what the 2 Sep session is now for. Ask for the
referral, never the person.

**3. Outside communities.** Local product/design meetups, LinkedIn, learner communities. These
are slower and have higher attrition. Treat them as a fallback, not a plan.

---

## 2. The screening bar, and why it decides your result

Screening decides whether your capstone produces a number or noise.

Six learners split two ways is three per arm. Your headline result is the difference between
two means computed from n=3. At that size, ordinary between-person variation in SQL ability is
larger than any effect your giving policy could produce. If two people who already write joins
land in one arm, your experiment is over before it starts. You would be measuring who you
happened to recruit.

Two fixes, both free:

(a) Screen for a real floor. If a candidate can already write a two-table join with a date
filter, they have nowhere to improve. Both arms hit the ceiling on the removal test and the gap
collapses to zero. Reject them. You want people who genuinely cannot start.

(b) Matched-pair randomisation, not coin flips. At recruitment, give everyone the same
5-question SQL screener. Rank by score. Pair adjacent scorers (1st+2nd, 3rd+4th, …). Then flip
a coin *within each pair* to assign arms. This removes between-arm ability difference by
construction, instead of hoping randomness handles it. With n=3 per arm, randomness will not
handle it.

(c) Screen anyway. Low-code does not mean SQL-naive. Both paths take "Intro to Database" in the
Full Stack Foundations module, and Supabase is named in the low-code path's own stack. C7 is
well past that point, so they have *seen* Supabase. That gives two effects with opposite signs.
Familiarity lowers onboarding friction, which helps the retention problem the brief warns
about. But some will have written a SELECT, which erodes the floor you need. You don't have to
guess which. The screener decides it per person in a minute.

**Screener (10 min, on the spot or a Google Form link):**
1. Have you written SQL in the last 6 months? (yes/no)
2. Given `customers` and `orders`, write a query returning customers who ordered last month.
3. What does `GROUP BY` do, in your own words?
4. Rate your SQL confidence 1-5.
5. Comfortable being recorded / having your queries logged? (yes/no)

Accept: Q1 no or rare, Q2 blank or wrong, Q4 ≤ 2.
Reject: fluent Q2. Do it politely, and offer them the swap instead.

---

## 3. Over-recruit, hard

Recruitment is 2 Sep. The study runs late Sep. That leaves three and a half weeks of decay
between "yes I'm in" and the session that matters. Standard attrition on unpaid volunteer
studies over that gap is brutal.

Losing one person from an arm of three is a 33% hit to that arm.

Target 10 accepted to land 6-8 completions. If you leave 2 Sep with 6, you will finish with 4
and no experiment.

---

## 4. Book the dates in the room

"I'll ping you when it's ready" is how you get ghosted. Before they walk away:

- Calendar invite sent, both sessions, from your phone, while standing there.
- WhatsApp group created, everyone added.
- Their reply to a test message in that group before they leave.

State the commitment honestly and upfront. Hiding it costs you at the back end.
> Two sessions, about a week apart. First is ~60 min of practice. Second is ~30 min,
> no tools, no assistant, just you and a blank editor. That second one is the whole point.

---

## 5. The gap between sessions is a design decision

Testing retention ten minutes after practice measures working memory, not retained skill. You
need days between practice and the removal test for "did the skill arrive" to mean anything.
Five to seven days is the minimum that isn't self-deception.

This pulls your build schedule forward. Working backwards:

| Date | What | Change from CAPSTONE-PLAN.md |
|---|---|---|
| 20 Sep | v0 usable by a stranger on real data | was 23 Sep, 3 days earlier |
| 21 Sep | Practice session, both arms | new |
| 27 Sep | Removal test, both arms | was "real-user test round" |
| 28-29 Sep | Score, analyse, write up the gap | new |
| 30 Sep | FEATURE FREEZE | unchanged. Results land *just* before it |

That 3-day pull on v0 is the real cost of running a proper study, and it is non-negotiable. If
the removal test slips past 27 Sep, the results arrive after feature freeze and cannot change
anything. At that point you ran the experiment for the write-up, not for the build.

---

## 6. The 30-second pitch

To a colleague (primary):
> I'm building a SQL tutor for my capstone and I need people who *can't* write SQL yet. That's
> the qualification, not a disqualifier. Two short sessions in late September, about a week
> apart, roughly 90 minutes total. You come out able to write real queries against a real
> database. Completely voluntary, and pulling out costs you nothing.

To a cohort member on 2 Sep (referral only):
> Can't use cohort people as participants. The FAQ rules them out as classmates. But do you
> know anyone non-technical who'd want to actually learn SQL? Two short sessions, they come out
> able to write real queries. Happy to return the favour for whoever you need.

Lead with "can't write SQL yet" as the qualification. It reframes the gap as the reason they
were picked. The ask then lands as an offer rather than a favour. That is what carries people
through a three-week gap to the second session.

---

## 7. Capture sheet fields

Name · contact · SQL screener score · last used SQL · confidence 1-5 ·
path (code/low-code) · availability week of 21 Sep · availability week of 27 Sep ·
referred by · arm (assign later)
