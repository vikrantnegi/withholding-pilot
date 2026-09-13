#!/usr/bin/env python3
"""
Aggregate the mini-screen logs.

  1. Save each returned log as logs/<firstname>.json
  2. python3 grade-logs.py

Answers two questions the cold screener could not:
  A. Do these people converge on a correct query when they can run one?
  B. Does the gate rule survive contact with this pool? (see GATE CHECK at the bottom)
"""
import glob, json, os, sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
QS = ["M1", "M2", "M3"]
LABEL = {"M1": "GROUP BY + HAVING (count)",
         "M2": "GROUP BY + HAVING (max)",
         "M3": "join two tables + filter"}

def load():
    out = []
    for p in sorted(glob.glob(os.path.join(HERE, "logs", "*.json"))):
        who = os.path.splitext(os.path.basename(p))[0]
        try:
            out.append((who, json.load(open(p))))
        except Exception as e:
            print(f"!! {who}: unreadable ({e})", file=sys.stderr)
    return out

def per_question(events, q):
    ev = [e for e in events if e.get("q") == q]
    runs = [e for e in ev if e.get("outcome") != "skipped"]
    outcomes = [e.get("outcome") for e in runs]
    solved_at = next((e["n"] for e in runs if e.get("outcome") == "correct"), None)
    return {
        "attempts": len(runs),
        "errors": outcomes.count("error"),
        "executed": len(runs) - outcomes.count("error"),
        "solved_at": solved_at,
        "skipped": any(e.get("outcome") == "skipped" for e in ev),
    }

def main():
    people = load()
    if not people:
        print("No logs found. Drop the returned files into logs/ as <name>.json")
        return

    rows = []
    for who, log in people:
        ev = log.get("events", [])
        rows.append((who, {q: per_question(ev, q) for q in QS}))

    print("=" * 74)
    print(f"{'person':<14}" + "".join(f"{q:>19}" for q in QS))
    print("-" * 74)
    for who, r in rows:
        cells = []
        for q in QS:
            d = r[q]
            if d["solved_at"]:   cells.append(f"solved in {d['solved_at']}")
            elif d["skipped"]:   cells.append(f"stuck after {d['attempts']}")
            elif d["attempts"]:  cells.append(f"{d['attempts']} tries, no")
            else:                cells.append("not attempted")
        print(f"{who:<14}" + "".join(f"{c:>19}" for c in cells))
    print("=" * 74)

    print("\nPer question")
    for q in QS:
        ds = [r[q] for _, r in rows]
        tried  = [d for d in ds if d["attempts"]]
        solved = [d for d in ds if d["solved_at"]]
        med = sorted(d["solved_at"] for d in solved)[len(solved)//2] if solved else None
        print(f"  {q}  {LABEL[q]:<28} "
              f"attempted {len(tried)}/{len(ds)}, solved {len(solved)}/{len(ds)}"
              + (f", median {med} attempts" if med else ""))
        if solved:
            pct = 100*len(solved)/len(ds)
            flag = ("  <- TOO EASY, no headroom" if pct >= 85 else
                    "  <- TOO HARD, floor risk"  if pct <= 20 else
                    "  <- USABLE: this is where the study concepts go")
            print(" " * 36 + f"{pct:.0f}% solved{flag}")

    all_runs = sum(d["attempts"] for _, r in rows for d in r.values())
    all_err  = sum(d["errors"]   for _, r in rows for d in r.values())
    print(f"\nAttempts overall: {all_runs}, of which {all_err} failed to parse "
          f"({100*all_err/all_runs:.0f}%)" if all_runs else "\nNo attempts logged.")

    print("\n" + "=" * 74)
    print("GATE CHECK — the reason this round exists")
    print("=" * 74)
    print("The gate serves no help until one attempt EXECUTES. Anyone who never produces")
    print("an executing query never earns a hint, and Arm A stops differing from Arm B.\n")
    locked = []
    for who, r in rows:
        got = sum(1 for q in QS if r[q]["executed"] > 0)
        tried_any = any(r[q]["attempts"] for q in QS)
        if tried_any and got == 0:
            locked.append(who)
        print(f"  {who:<14} executed at least one query on {got}/3 questions")
    print()
    if locked:
        print(f"  {len(locked)} of {len(rows)} would be LOCKED OUT by the gate: {', '.join(locked)}")
        print("  -> let attempt_type:syntax_error satisfy the gate, or the study serves no help.")
    else:
        print(f"  All {len(rows)} produced executing queries. The gate is safe as written.")

if __name__ == "__main__":
    main()
