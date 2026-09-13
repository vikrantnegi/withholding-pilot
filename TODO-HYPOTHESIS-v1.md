# TODO — append v1 entry to HYPOTHESIS-LOG.md

**Status:** DRAFT, not yet appended. Blocked on filling the four thresholds in §4.
**Created:** 2 Sep 2026, from a close read of the Bastani et al. (PNAS 2025) supplementary appendix.
**Owner action:** read more papers first (Kestin, Wu), fill the blanks, then paste the block
below verbatim under "Append below" in `HYPOTHESIS-LOG.md`. Delete this file after.

**Hard edge:** items 3 and 4 feed the **6 Sep scope lock** (cut list + one-page PRD).
Item 3 changes what gets built. Do not let this slip past 5 Sep.

**How to pick the thresholds in §4:** ask *"what result would make me say the study
didn't run?"* — not *"what number do I think I'll clear?"* Pick them now, while you
still don't know which way they'll fall. On 28 Sep every threshold you invent will be
contaminated by knowing what it lets you conclude.

---

## Block to append (fill ____ first)

```markdown
## v1: 2 Sep 2026 — Bastani et al. SI appendix, close read

**Evidence.** Read the PNAS supplementary appendix, not just the paper.
Four design decisions in it change ours.

**1. Unit of analysis: learner -> learner x question.**
Their student-level regression has 2,848 obs; the problem-level one on the
same data has 11,392 (Tables 1, B.6). At n=3/arm our pre-registered
"gap between arm averages" is a coin flip about who we recruited — it
would fire our falsification condition ~1/3 of the time with a policy that
works perfectly. Item-level with SEs clustered by learner is the primary
analysis. Arm-average gap becomes secondary.

**2. Held-out questions must be concept-paired, not randomly held out.**
They hand-authored a mapping sigma(p): each exam problem paired to the practice
problem teaching its concept. Without it, a failure is unattributable —
never practiced / harder item / assistant was wrong are indistinguishable.
With it, Table C.14 becomes possible. Resolves the "same-schema vs transfer"
question CAPSTONE-RULES.md lists as ours to defend: concept-paired transfer.

**3. Concept count and level count multiply, not add.**
Arm A budget ~ 3 learners x 16 questions = 48 policy decisions.
4 levels x 8 concepts = 32 cells -> 1.5 obs/cell.
2 levels x 2 concepts = 4 cells  -> 12 obs/cell.
Cutting levels 4->2 (untested assumption #2) buys nothing unless concepts
are cut with it. **Scope: 2 concepts, 2 levels.** Goes in the 6 Sep cut list.

**4. Null-result triage, pre-committed before 27 Sep.**
Answers the brief's Q3. Check in this order, stop at the first failure:

  1. MANIPULATION CHECK — did the arms differ? Arm A served level 4 on
     ____% of interactions. Fails if > ____%. Policy never ran; null is
     uninformative.
  2. FLOOR — baseline arm removal-test mean. Fails if < ____%.
     Nobody learned; can't detect a gap between two zeros.
  3. CEILING — either arm mean > ____%. Questions too easy.
  4. MAPPING — did held-out questions test the practiced concepts?
     Fails if practice score on concept X doesn't predict its paired
     held-out item.
  5. Only if 1-4 pass: hypothesis falsified. Withholding does not
     produce retrieval.

Steps 1-4 are measurement failures. Step 5 is a hypothesis failure.
They are identical in the final number and opposite in meaning.

**New untested assumptions:**
5. That 2 concepts x 8 reps is enough practice for either arm to move
   off the floor.
6. That the competence estimator produces enough level-4 *and* non-level-4
   decisions for check 1 to pass.

**Note.** Their GPT Tutor arm result was null and published. A null that
survives checks 1-4 is our deliverable, not our failure.
```

---

## Why this matters (one line, so future-you doesn't skip it)

Without §4 written *before* 27 Sep, a null on 28 Sep is uninterpretable: you cannot
tell "my policy is wrong" from "my logger was broken," and you will take the blame
for the second one.
