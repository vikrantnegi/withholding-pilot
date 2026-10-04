# Send sheet — removal test (session 2), 30 Sep to 2 Oct 2026

**DO NOT SEND THIS FILE TO ANYONE.** Send each person only their own message block from section 4.

Written 26 Sep 2026. Codes and names come from `../participant-links.md`. Arms are deliberately
absent from this file.

Hosted removal page: `https://teal-marzipan-e1b49a.netlify.app/` — hosted 26 Sep, **verified 27 Sep** from a browser: after
stripping Netlify's two injections (an ad comment and a HUD script), `index.html` is
byte-identical to `app/dist-removal` (SHA-256 `9d0a9534…`), and `grade-rule.js` is identical
(`51993f08…`). H01-H12 load, no Help button, the help modules 404, and a run grades correctly
with sql.js from cdnjs. **If you rebuild, re-upload and re-verify before sending another link.**

---

## 1. Before you send anything — four checks

1. ~~**Build and host.**~~ Done 26 Sep, verified 27 Sep. See the header.
2. ~~**Open it with `?arm=A`, not a participant link.**~~ Done 27 Sep, from the browser. Example: `https://teal-marzipan-e1b49a.netlify.app/index.html?arm=A`.
   It should load 12 questions and no Help button. Loading a participant's link starts their
   session under their code.
3. ~~**Take the practice site down, or replace it, before the first session.**~~
   **Done 27 Sep.** Vikrant disabled `tranquil-starlight-f0129e.netlify.app`. Checked from a browser:
   `policy.js` now returns Netlify's "Site not found". Every practice link is dead.
   The practice links still work. A tester could reopen theirs mid-test, and Arm B's practice
   Help returns full answers to items paired with the held-out ones. The removal test is only
   "no help" if no help is one tab away.
4. **Send ritesh his date change now.** Round 3's send sheet has it drafted and marked "to send".
   If he takes the test on 28 or 29 Sep, check 0b excludes him.

**So what:** check 3 is the one no script can do. It is the difference between a removal test
and an open-book test for one arm only.

---

## 2. The window rule

The gap from practice to test must be **5 to 7 days**, measured to the minute (check 0b in
`../../ANALYSIS-PLAN.md`). So each person's earliest start is their practice finish time plus 5
days, and their latest is finish plus 7 days.

## 3. The send table — tick as you go

Send each message **on the morning of that person's window**, not days ahead: a message sent
early is a message acted on early.

**Changed 27 Sep:** Vikrant sends everyone on **Tue 29 Sep**, one day later than planned, except
ritesh (Wed 30). Every window below still holds: each message opens no earlier than finish + 5
days and closes before finish + 7. The cost is slack at the far end. nabin now has Tuesday and
Wednesday morning only, and he is one of 3 in Arm A. Chase him on Tuesday evening if nothing
has come back.

**Changed 30 Sep:** the Tuesday sends did not go out. Vikrant sends the six on **Wed 30 Sep**,
from about 10:00 IST; ritesh is sent separately. Five of the six windows now **close today**,
so every message below names a same-day cutoff. The cutoff is the latest *start* time, set about
30 minutes (one session) before the hard stop. nabin goes first: at 10:00 IST his window had
under 2 hours left, and he is 1 of 3 in Arm A.

**nabin, decided 30 Sep:** he takes it this afternoon, a few hours past 7 days. `ANALYSIS-PLAN.md`
check 0b excludes only gaps *under* 5 days, so his data stays in. The 7-day ceiling comes from
the hypothesis wording ("5–7 days after removal"), so report his real gap as a deviation.
The extra hours mean more forgetting in Arm A, which biases *against* the hypothesis.

**nabin sent two copies of his log, 30 Sep.** The events, survey and `started` are identical. Only
`finished` differs (14:52:17 vs 14:53:43 IST), because the app stamps `finished` on every copy or
download. The first copy is filed, as the timestamp closest to the real end. The second is not
kept, per the one-copy rule.

**manish also sent two copies, 30 Sep.** Same events and survey; `finished` 19:31:44 vs 19:37:33 IST.
First copy filed. **His log carries an outside-help signature.** On H02 he used `duration_seconds`,
got "no such column", and fixed it to `duration_sec`. On H05 and again on H08 he used
`deployments` and `duration_seconds` again, names that exist nowhere on the page. Someone who
just fixed a name by reading the schema does not regress to it twice. A tool asked each question
fresh, without the schema, does. Add 4-space LLM-style formatting on every query, 20-40 s per
question, and the round-3 flag. Not excluded: no rule for it was written before the data.

**Two of five stopped at exactly H09** (rishabh, manish), each copying the log within 15 s of
solving it. Checked 30 Sep in a headless browser: at widths under about 1100 px the question
rail becomes a horizontal strip that shows Question 1 to 9 and cuts off 10, 11, 12 and "Send your
log" at the right edge. "Question 9 of 12" and "Next question" are still visible. Ask both
whether they saw questions 10 to 12.

| # | person | practice finished (IST) | session 2 window (IST) | sent | log received |
|---|---|---|---|---|---|
| 1 | nabin   | Wed 23 Sep 11:58 | **Wed 30 Sep afternoon.** Past 7 days (11:58); deviation, see note below | Wed 30 Sep 12:06 IST | **Yes.** 30 Sep 14:05-14:52 IST, 12 of 12, gap 7d 2h (deviation) |
| 2 | anuj    | Wed 23 Sep 20:29 | **Wed 30 Sep, start by 20:00**, hard stop 20:29 | Wed 30 Sep 11:13 IST | **Yes.** 30 Sep 19:38-19:57 IST, 4 of 12, stopped after H08 (H09-H12 not attempted), gap 6d 23h |
| 3 | manish  | Wed 23 Sep 22:43 | **Wed 30 Sep, start by 22:00**, hard stop 22:43. Chase ~19:00 | Wed 30 Sep 11:12 IST | **Yes.** 30 Sep 19:25-19:31 IST (6 min), 9 of 12, stopped after H09. **Flag: likely outside help**, see note |
| 4 | gaurav  | Wed 23 Sep 15:36 | **Wed 30 Sep, start by 15:00** (on leave; hard stop 15:36) | Wed 30 Sep 10:09 IST | **Yes.** 30 Sep 18:03-18:24 IST, 12 of 12, gap 7d 2h (deviation, like nabin), survey blank |
| 5 | rishabh | Wed 23 Sep 23:01 | **Wed 30 Sep, start by 22:30** (hard stop 23:01) | Wed 30 Sep 11:19 IST | **Yes.** 30 Sep 17:29-17:56 IST, 9 of 12, **stopped after H09** (H10-H12 not attempted), survey blank, gap 6d 18h |
| 6 | vikash  | Thu 24 Sep 21:42 | **Open now** to Thu 1 Oct 21:42; start by Thu 21:00 | Wed 30 Sep 10:08 IST; will do it after office | **Yes.** 30 Sep 11:48-12:03 IST, 12 of 12, gap 5d 14h |
| 7 | ritesh  | Fri 25 Sep 22:35 | **Wed 30 Sep 22:35** to Fri 2 Oct 22:35 (Thu 1 Oct is easiest). Sent separately | Thu 01 Oct 17:04 IST; says he will send the log Thu 1 Oct | **Yes.** Fri 2 Oct 10:57-11:38 IST, 12 of 12, gap 6d 12h |

manish is the flagged dropout risk (`../TESTER-PROFILES.md`), and his round-3 log carries a
likely-outside-help flag. Send his on time and chase a reply.

File each returned log as `logs/learning-os-removal-log-<code>.json`, and fill in the
"removal test" column of `../participant-links.md`.

---

## 4. The messages — one block per person, sent 1:1 on WhatsApp

Each block is complete. Copy it and send. Do not send two people the same link.

### nabin — send Wed 30 Sep, for the afternoon

> Hey nabin — session 2 of the SQL thing is ready. This is the one that matters.
>
> Sorry for the short notice — could you do it this afternoon (Wed 30)? About 30 minutes, in one sitting, from your laptop.
>
> Your link: https://teal-marzipan-e1b49a.netlify.app/index.html?p=4cwkq
>
> Only open it when you're ready to start — the session starts the moment the page loads.
>
> Same page as last time, new questions, and no Help button (no one gets one this time). No ChatGPT, no Googling, no asking anyone, and please don't open the session 1 link again.
>
> At the end there are three quick optional questions, then "Copy my log" — paste it back to me here.
>
> Still completely voluntary. Thanks for doing both!

### anuj — send Wed 30 Sep

> Hey anuj — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time today (Wed 30), starting by 8 pm at the latest. About 30 minutes, in one sitting, from your laptop.
>
> Your link: https://teal-marzipan-e1b49a.netlify.app/index.html?p=gnas5
>
> Only open it when you're ready to start — the session starts the moment the page loads.
>
> Same page as last time, new questions, and no Help button (no one gets one this time). No ChatGPT, no Googling, no asking anyone, and please don't open the session 1 link again.
>
> At the end there are three quick optional questions, then "Copy my log" — paste it back to me here.
>
> Still completely voluntary. Thanks for doing both!

### manish — send Wed 30 Sep

> Hey manish — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time today (Wed 30), starting by 10 pm at the latest. About 30 minutes, in one sitting, from your laptop.
>
> Your link: https://teal-marzipan-e1b49a.netlify.app/index.html?p=rqkkx
>
> Only open it when you're ready to start — the session starts the moment the page loads.
>
> Same page as last time, new questions, and no Help button (no one gets one this time). No ChatGPT, no Googling, no asking anyone, and please don't open the session 1 link again.
>
> At the end there are three quick optional questions, then "Copy my log" — paste it back to me here.
>
> Still completely voluntary. Thanks for doing both!

### gaurav — send Wed 30 Sep morning

> Hey gaurav — session 2 of the SQL thing is ready, whenever suits you today (Wed 30), starting by 3 pm at the latest. About 30 minutes, in one sitting, from your laptop.
>
> Your link: https://teal-marzipan-e1b49a.netlify.app/index.html?p=geu2z
>
> Only open it when you're ready to start — the session starts the moment the page loads.
>
> Same page as last time, new questions, and no Help button (no one gets one this time). No ChatGPT, no Googling, no asking anyone, and please don't open the session 1 link again.
>
> At the end there are three quick optional questions, then "Copy my log" — paste it back to me here.
>
> Still completely voluntary, and I know you're on leave. Thanks!

### rishabh — send Wed 30 Sep morning

> Hey rishabh — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time today (Wed 30), starting by 10:30 pm at the latest. About 30 minutes, in one sitting, from your laptop.
>
> Your link: https://teal-marzipan-e1b49a.netlify.app/index.html?p=3b3xe
>
> Only open it when you're ready to start — the session starts the moment the page loads.
>
> Same page as last time, new questions, and no Help button (no one gets one this time). No ChatGPT, no Googling, no asking anyone, and please don't open the session 1 link again.
>
> At the end there are three quick optional questions, then "Copy my log" — paste it back to me here.
>
> Still completely voluntary. Thanks for doing both!

### vikash — send Wed 30 Sep

> Hey vikash — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time today (Wed 30) or tomorrow (Thu 1 Oct), starting by 9 pm tomorrow at the latest. About 30 minutes, in one sitting, from your laptop.
>
> Your link: https://teal-marzipan-e1b49a.netlify.app/index.html?p=s6nqb
>
> Only open it when you're ready to start — the session starts the moment the page loads.
>
> Same page as last time, new questions, and no Help button (no one gets one this time). No ChatGPT, no Googling, no asking anyone, and please don't open the session 1 link again.
>
> At the end there are three quick optional questions, then "Copy my log" — paste it back to me here.
>
> Still completely voluntary. Thanks for doing both!

### ritesh — send Wed 30 Sep (or Thu 1 Oct)

If sent on Thu 1 Oct instead, replace the second sentence with: "Any time today (Thu 1 Oct) or tomorrow (Fri 2 Oct), starting by 10 pm tomorrow at the latest."

> Hey ritesh — session 2 of the SQL thing is ready, as promised. Any time after 10:35 pm tonight (Wed 30), or tomorrow (Thu 1 Oct). About 30 minutes, in one sitting, from your laptop.
>
> Your link: https://teal-marzipan-e1b49a.netlify.app/index.html?p=efkxn
>
> Only open it when you're ready to start — the session starts the moment the page loads.
>
> Same page as last time, new questions, and no Help button (no one gets one this time). No ChatGPT, no Googling, no asking anyone, and please don't open the session 1 link again.
>
> At the end there are three quick optional questions, then "Copy my log" — paste it back to me here.
>
> Still completely voluntary. Thanks for doing both!
