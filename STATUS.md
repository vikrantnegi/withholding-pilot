# Status, as of 5 Oct 2026

**This is the only file that says where the project stands today.** If another file disagrees
about the present, this one wins. Older daily notes are in git history.

---

## Where it stands

**The study is finished and analysed.** Seven people practised on 23 to 25 Sep and sat the test
on 30 Sep to 2 Oct. One was excluded. Arm A scored 36 of 36 person-questions (3 learners x 12
questions); Arm B scored 25 of 36. Both arms scored 17 of 36 on the first try. Two of the
pre-registered checks failed, so the gap is not credited to withholding. `RESULTS.md` has the
numbers; `HYPOTHESIS-LOG.md` v2 has the changed claim.

**Submission is 7 Oct.** Four items are due:

| item | state |
|---|---|
| live link | **done.** https://tranquil-starlight-f0129e.netlify.app/ |
| GitHub repo | **done.** github.com/vikrantnegi/withholding-pilot |
| written case study | **done.** `CASE-STUDY.md` |
| demo video | **not started** |

Also left: a dry run of the whole package, opening every link as a judge would.

---

## Watch these

- **The hint function pauses itself.** Supabase stops a free project after about a week without
  traffic. It happened once, found and fixed on 5 Oct. When paused, Arm A silently shows backup
  hints. **Re-run the check on 10 Oct, before Demo Day:**
  `node evals/check-hint-function.mjs https://yzmunjbhhtuerxoinxsd.supabase.co/functions/v1/hint`
- **The removal-test site** (`teal-marzipan-e1b49a.netlify.app`) may still be up. It shows the 12
  held-back questions. Take it down once the submission is in, or leave it as evidence. Your call.

---

## Key dates

| date | what |
|---|---|
| 23 to 25 Sep | practice session |
| 30 Sep to 2 Oct | removal test |
| 4 Oct | analysis, hypothesis v2 |
| 5 Oct | live link back up, case study, repo public |
| **7 Oct** | **submit** |
| 10 Oct | re-check the hint function |
| 11 Oct | Demo Day, 100x HQ |
