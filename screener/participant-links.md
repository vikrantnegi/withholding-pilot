# Participant links — DO NOT SEND THIS FILE TO ANYONE

This is the only place code, name and arm sit together. The app holds codes and arms with no
names, so a tester who opens the page source learns nothing. That only stays true if this file
stays here.

Generated 19 Sep 2026 from seed `capstone-participant-codes-2026-09-19`, so the codes are
reproducible and were not chosen to mean anything. Arms come from `ARM-ASSIGNMENT.md` section 7.

## The links

Send each person **only their own line**. The links need nothing added to them — the hint
function's URL goes in `app/transport.js` (`DEFAULT_URL`), once, for everybody.

That matters. An earlier version of this file said to append `&hint=<url>` to each link. Seven
links is seven chances to mistype or forget one, and a participant whose link lost the URL runs
on hand-written fallback hints while everyone else gets real ones. If that person is in Arm A,
the arms now differ in something beyond the help policy and nothing on screen says so.

Each person opens `<your hosted url>/index.html?p=<their code>`. Build what you host with
`bash app/make-dist.sh` — see `supabase/README.md`, and do not publish this repository.

| person | code | arm | link |
|---|---|---|---|
| gaurav | `geu2z` | **A** | `index.html?p=geu2z` |
| nabin | `4cwkq` | **A** | `index.html?p=4cwkq` |
| ritesh | `efkxn` | **A** | `index.html?p=efkxn` |
| anuj | `gnas5` | **B** | `index.html?p=gnas5` |
| manish | `rqkkx` | **B** | `index.html?p=rqkkx` |
| rishabh | `3b3xe` | **B** | `index.html?p=3b3xe` |
| vikash | `s6nqb` | **B** | `index.html?p=s6nqb` |

## Rules for sending these

- **One link per person, sent privately.** Not in the group chat. Two people comparing links is
  how they find out the versions differ.
- **Never say "arm", or that there are two versions.** They are testing a SQL practice tool.
  `RECRUITMENT.md` section 3 — never let one arm read as "his".
- **If someone loses their link, resend the same one.** A second code for the same person makes
  two logs that look like two people.
- **A mistyped link stops the app** and tells them to ask for a new one. It does not fall back to
  a working session in the wrong arm, which is what the old `?arm=` links did.

## What comes back

Each log carries `participant`, so a returned log identifies itself. The download is named after
the code — `learning-os-log-<code>.json` — rather than after the arm, which the old name
(`learning-os-log-arm<A or B>.json`) would have shown the sender every time they saved a file.

**Keep every returned log.** The removal test is scored against the practice session per person,
so a log that cannot be matched to a person is a lost participant.

## Attendance, to fill in

`RECRUITMENT.md` section 4: dropout that differs between arms breaks the comparison outright, and
it cannot be reconstructed afterwards.

| person | arm | practice 23 Sep | removal test 28 Sep |
|---|---|---|---|
| gaurav | A | yes, 15:18-15:36 IST, stopped after 7 of 16 | yes, 30 Sep 18:03-18:24 IST, 12 of 12, gap 7d 2h (over 7 days) |
| nabin | A | yes, 10:58-11:58 IST | yes, 30 Sep 14:05-14:52 IST, 12 of 12, gap 7d 2h (over 7 days) |
| ritesh | A | yes, 25 Sep 21:36-22:35 IST, 16 of 16 (practised a day late) | yes, 2 Oct 10:57-11:38 IST, 12 of 12 |
| anuj | B | yes, 20:00-20:29 IST | yes, 30 Sep 19:38-19:57 IST, 4 of 12, stopped after H08 |
| manish | B | yes, 17:46-22:43 IST (4h20m gap), flagged | yes, 30 Sep 19:25-19:31 IST, 9 of 12, stopped after H09, flagged again. **Excluded 30 Sep** (ANALYSIS-PLAN §5) |
| rishabh | B | yes, 22:12-23:01 IST | yes, 30 Sep 17:29-17:56 IST, 9 of 12, stopped after H09, H10-H12 unattempted |
| vikash | B | yes, 24 Sep 21:17-21:42 IST, 16 of 16 | yes, 30 Sep 11:48-12:03 IST, 12 of 12 |
