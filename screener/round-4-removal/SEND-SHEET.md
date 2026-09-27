# Send sheet — removal test (session 2), 29 Sep to 1 Oct 2026

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

| # | person | practice finished (IST) | session 2 window (IST) | sent | log received |
|---|---|---|---|---|---|
| 1 | nabin   | Wed 23 Sep 11:58 | **Tue 29 Sep, any time**, hard stop Wed 30 Sep 11:58 | | |
| 2 | anuj    | Wed 23 Sep 20:29 | **Tue 29 Sep, any time**, hard stop Wed 30 Sep 20:29 | | |
| 3 | manish  | Wed 23 Sep 22:43 | **Tue 29 Sep, any time**, hard stop Wed 30 Sep 22:43 | | |
| 4 | gaurav  | Wed 23 Sep 15:36 | **Tue 29 Sep, any time** (on leave; hard stop Wed 30 Sep 15:36) | | |
| 5 | rishabh | Wed 23 Sep 23:01 | **Tue 29 Sep, any time** (hard stop Wed 30 Sep 23:01) | | |
| 6 | vikash  | Thu 24 Sep 21:42 | **Tue 29 Sep 21:42** to Thu 1 Oct 21:42 | | |
| 7 | ritesh  | Fri 25 Sep 22:35 | **Wed 30 Sep 22:35** to Fri 2 Oct 22:35 (Thu 1 Oct is easiest) | | |

manish is the flagged dropout risk (`../TESTER-PROFILES.md`), and his round-3 log carries a
likely-outside-help flag. Send his on time and chase a reply.

File each returned log as `logs/learning-os-removal-log-<code>.json`, and fill in the
"removal test" column of `../participant-links.md`.

---

## 4. The messages — one block per person, sent 1:1 on WhatsApp

Each block is complete. Copy it and send. Do not send two people the same link.

### nabin — send Tue 29 Sep morning

> Hey nabin — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time today (Tue 29), or tomorrow before 11:30 am at the latest. About 30 minutes, in one sitting, from your laptop.
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

### anuj — send Tue 29 Sep

> Hey anuj — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time today (Tue 29), or tomorrow before 8 pm at the latest. About 30 minutes, in one sitting, from your laptop.
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

### manish — send Tue 29 Sep

> Hey manish — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time today (Tue 29), or tomorrow before 10 pm at the latest. About 30 minutes, in one sitting, from your laptop.
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

### gaurav — send Tue 29 Sep morning

> Hey gaurav — session 2 of the SQL thing is ready, whenever suits you today (Tue 29), or tomorrow before 3:30 pm at the latest. About 30 minutes, in one sitting, from your laptop.
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

### rishabh — send Tue 29 Sep morning

> Hey rishabh — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time today (Tue 29). About 30 minutes, in one sitting, from your laptop.
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

### vikash — send Tue 29 Sep

> Hey vikash — session 2 of the SQL thing is ready. This is the one that matters.
>
> Any time after 9:45 pm tonight (Tue 29), or tomorrow (Wed 30). About 30 minutes, in one sitting, from your laptop.
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

### ritesh — send Wed 30 Sep

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
