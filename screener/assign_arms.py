#!/usr/bin/env python3
"""Assign the seven testers to Arm A and Arm B — matched pairs, then a seeded flip.

RECRUITMENT.md section 3 is the rule this implements. Six learners split two ways
is three per arm, and at that size ordinary variation in SQL ability is larger
than any effect the help policy could produce. If two capable people land in the
same arm the study measures who was recruited. Pairing removes between-arm
ability difference by construction; randomness at n=3 will not.

WHY THIS IS A SCRIPT AND NOT A JUDGEMENT CALL
An arm assignment decided after any Arm A data exists cannot be defended, because
nobody can show it was not influenced by what had already been seen. The same
objection applies to a measure chosen after seeing which pairing it produces. So
the measure below is declared in the docstring, the tie-breaks are fixed, the
randomness is seeded, and the whole thing runs once and is committed.

THE MEASURE, DECLARED BEFORE IT WAS COMPUTED
Rank on round 2, not round 1. Round 1 measured the wrong thing: of 35 attempted
answers across seven people, almost every failure was a punctuation or spacing
fault rather than a wrong idea — ORDERBY without the space, "ASC" in quotes, a
missing comma. screener/README.md says nobody should be excluded on it, and the
19 Sep regrade of manish confirmed why.

Within round 2, count only M1 and M2. Both are GROUP BY + HAVING, which is the
concept the study teaches and tests. M3 is a two-table join, off-concept, and
nobody solved it.

  1. Items solved of the two on-concept items. Descending.
  2. Attempts to FIRST solve, summed over the items solved. Ascending.
     First solve, not total attempts: re-running an answer that already worked
     is not a failed attempt, and counting it would rank manish below people he
     matched.
  3. Attempted M3, the hardest item. Yes before no. Reaching for the hard one is
     weak evidence of more headroom.
  4. Alphabetical. Deterministic, and deliberately independent of the seed, so
     the ranking cannot move when the seed does.

Rule 1 counts an unattempted item as unsolved. That is on purpose: the removal
test scores per person-question, and an item nobody attempts scores as unsolved
there too. The ranking should measure the same quantity as the outcome.

  The cost of that choice, stated because it is the largest uncertainty here:
  manish attempted one item and solved it first try, then stopped after 55
  seconds. On "solved of two" he ranks 6th of 7. On attempts-per-attempted-item
  he would rank 2nd. The data cannot say which is right — quitting early is a
  motivation signal, not an ability one. Rule 1 was chosen because it mirrors the
  outcome measure, and the alternative is recorded here so the choice is visible.

THE FLIP
One coin per pair, from a seed fixed in SEED below. Four of the seven were on
Vikrant's team before and must not clump into one arm (RECRUITMENT.md section 3
— never let one arm read as "his"). That is a constraint on the randomisation,
not a correction applied afterwards: the script walks a deterministic sequence of
seeds and takes the FIRST one whose flips satisfy the constraint. Which attempt
was used is printed, so the draw can be replayed and checked.

Usage
  python3 assign_arms.py                      # ranking and pairs only
  python3 assign_arms.py --ex-team a,b,c,d    # the full assignment
"""
import argparse, hashlib, os, random, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "round-2-runbutton"))

# Re-derived from the logs on every run rather than transcribed, so these numbers
# cannot drift from screener/round-2-runbutton/logs/.
import importlib.util
_spec = importlib.util.spec_from_file_location(
    "gradelogs", os.path.join(HERE, "round-2-runbutton", "grade-logs.py"))
_gl = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_gl)

ON_CONCEPT = ["M1", "M2"]     # GROUP BY + HAVING. M3 is a join, off-concept.
HARD_ITEM = "M3"
SEED = "capstone-arm-assignment-2026-09-19"


def measure():
    """One row per person, from the round-2 logs."""
    rows = []
    for who, log in _gl.load():
        events = log["events"] if isinstance(log, dict) else log
        per = {q: _gl.per_question(events, q) for q in ON_CONCEPT + [HARD_ITEM]}
        solved = [q for q in ON_CONCEPT if per[q]["solved_at"]]
        rows.append({
            "who": who,
            "solved": len(solved),
            "to_solve": sum(per[q]["solved_at"] for q in solved),
            "tried_hard": per[HARD_ITEM]["attempts"] > 0,
            "detail": {q: per[q]["solved_at"] for q in ON_CONCEPT},
        })
    return rows


def rank(rows):
    """The four declared tie-breaks, in order."""
    return sorted(rows, key=lambda r: (-r["solved"], r["to_solve"],
                                       not r["tried_hard"], r["who"]))


def pairs_of(ranked):
    """Adjacent scorers. An odd pool leaves the last person unpaired; they still
    get a flip of their own, so one arm ends with four."""
    out, i = [], 0
    while i + 1 < len(ranked):
        out.append((ranked[i]["who"], ranked[i+1]["who"])); i += 2
    return out, ([ranked[-1]["who"]] if len(ranked) % 2 else [])


def flip(pairs, singles, seed_text):
    rng = random.Random(hashlib.sha256(seed_text.encode()).hexdigest())
    arm = {}
    for a, b in pairs:
        if rng.random() < 0.5: arm[a], arm[b] = "A", "B"
        else:                  arm[a], arm[b] = "B", "A"
    for s in singles:
        arm[s] = "A" if rng.random() < 0.5 else "B"
    return arm


def split_ok(arm, ex_team):
    """Never let one arm read as his old team — RECRUITMENT.md section 3.

    As even as the count allows: 2 and 2 for four people, 2 and 1 for three. An
    earlier version only required at least one in each arm, which a dry run
    showed was far too weak — it accepted three of four in the same arm, and
    three of the four old team in one arm of three IS that arm reading as his
    team. "Not all of them" is not the same rule as "split".
    """
    if not ex_team: return True
    a = sum(1 for p in ex_team if arm.get(p) == "A")
    return abs(a - (len(ex_team) - a)) <= 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ex-team", default="",
                    help="comma-separated names of the former team members")
    args = ap.parse_args()
    ex_team = [x.strip() for x in args.ex_team.split(",") if x.strip()]

    rows = measure()
    ranked = rank(rows)

    print(f"\nMeasure: items solved of {'/'.join(ON_CONCEPT)}, then attempts to first")
    print("solve, then attempted M3, then alphabetical. Declared before computing.\n")
    print(f"  {'#':<3}{'person':<12}{'solved':>7}{'to solve':>10}{'tried M3':>10}   per item")
    print("  " + "-" * 62)
    for i, r in enumerate(ranked, 1):
        per = " ".join(f"{q}:{v if v else '-'}" for q, v in r["detail"].items())
        print(f"  {i:<3}{r['who']:<12}{r['solved']:>7}{r['to_solve']:>10}"
              f"{'yes' if r['tried_hard'] else 'no':>10}   {per}")

    pairs, singles = pairs_of(ranked)
    print("\nMatched pairs, adjacent in the ranking:")
    for a, b in pairs: print(f"  {a} + {b}")
    for s in singles: print(f"  {s} — unpaired, odd pool, flipped on their own")

    if not ex_team:
        print("\nSTOPPING HERE. The flip needs --ex-team.")
        print("Four of the seven were on Vikrant's team before and must not clump into")
        print("one arm. Which four is recorded nowhere in this repo — TESTER-PROFILES.md")
        print("says so explicitly. Supply them and the assignment runs in one shot.\n")
        return 0

    unknown = [p for p in ex_team if p not in {r["who"] for r in rows}]
    if unknown: sys.exit(f"not in the pool: {', '.join(unknown)}")

    for attempt in range(1000):
        arm = flip(pairs, singles, f"{SEED}#{attempt}")
        if split_ok(arm, ex_team): break
    else:
        sys.exit("no seed in 1000 satisfied the split — check --ex-team")

    print(f"\nSeed: {SEED!r}, draw #{attempt} "
          f"({'first draw' if attempt == 0 else f'{attempt} rejected for clumping the old team'})")
    print("\n  arm  person       was on his team")
    print("  " + "-" * 40)
    for r in ranked:
        w = r["who"]
        print(f"  {arm[w]:<5}{w:<13}{'yes' if w in ex_team else '-'}")
    for a in ("A", "B"):
        members = [r["who"] for r in ranked if arm[r["who"]] == a]
        old = sum(1 for m in members if m in ex_team)
        print(f"\n  Arm {a}: {len(members)} — {', '.join(members)}   ({old} from his old team)")
    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
