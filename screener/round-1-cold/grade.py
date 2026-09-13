#!/usr/bin/env python3
"""
Screener grader. Result-set match, same idea as the study's scoring harness.

Usage
-----
  python3 grade.py --self-test          # grades the answer key; should be 10/10
  python3 grade.py                      # grades everything in submissions/

Submissions: one file per person, submissions/<name>.sql, questions separated by
a "-- Q1" style comment line. Blank answers are fine, just keep the labels.

Runs on SQLite by default so it needs nothing installed. To run against the real
Supabase Postgres instead, set DATABASE_URL and have psycopg2 available.
"""

import argparse, glob, os, re, sqlite3, sys
from decimal import Decimal

HERE = os.path.dirname(os.path.abspath(__file__))
TIERS = {1:"T1",2:"T1",3:"T2",4:"T2",5:"T3",6:"T3",7:"T4",8:"T4",9:"T5",10:"T5"}
TIER_LABEL = {
    "T1":"single table: filter + sort",
    "T2":"aggregate one table",
    "T3":"join two tables",
    "T4":"join + aggregate + negation",
    "T5":"window / correlated subquery",
}

# ---------- db ----------

def open_db():
    url = os.environ.get("DATABASE_URL")
    if url:
        import psycopg2
        con = psycopg2.connect(url)
        return con, "postgres"
    con = sqlite3.connect(":memory:")
    con.executescript(open(os.path.join(HERE, "schema.sql")).read())
    return con, "sqlite"

def run(con, sql):
    """Returns (rows, error). Rows normalised for comparison."""
    try:
        cur = con.cursor()
        cur.execute(sql)
        rows = cur.fetchall()
        cur.close()
        return [tuple(norm(v) for v in r) for r in rows], None
    except Exception as e:
        try: con.rollback()
        except Exception: pass
        return None, str(e).strip().splitlines()[0][:120]

def norm(v):
    """Make values comparable across sqlite/postgres and int/float/Decimal."""
    if v is None: return None
    if isinstance(v, Decimal): v = float(v)
    if isinstance(v, bool): return v
    if isinstance(v, (int, float)): return round(float(v), 2)
    s = str(v).strip()
    try: return round(float(s), 2)
    except ValueError: return s

# ---------- parsing ----------

SPLIT = re.compile(r"^\s*--+\s*Q\s*(\d+)\b.*$", re.IGNORECASE | re.MULTILINE)

def parse(text):
    """'-- Q1\\nSELECT...' -> {1: 'SELECT...'}"""
    out, marks = {}, list(SPLIT.finditer(text))
    for i, m in enumerate(marks):
        end = marks[i+1].start() if i+1 < len(marks) else len(text)
        body = text[m.end():end].strip()
        body = "\n".join(l for l in body.splitlines()
                         if not l.strip().startswith("--")).strip()
        if body:
            out[int(m.group(1))] = body.rstrip(";").strip()
    return out

# ---------- grading ----------

def compare(got, want):
    """Multiset match: row order is ignored, values and shape are not."""
    if got is None: return False
    if len(got) != len(want): return False
    if got and want and len(got[0]) != len(want[0]): return False
    return sorted(map(repr, got)) == sorted(map(repr, want))

def grade_one(con, answers, ref):
    res = {}
    for q in sorted(ref):
        want = ref[q]
        if q not in answers:
            res[q] = ("blank", None); continue
        got, err = run(con, answers[q])
        if err: res[q] = ("error", err)
        elif compare(got, want): res[q] = ("pass", None)
        else:
            res[q] = ("wrong", f"got {len(got)} rows, expected {len(want)}")
    return res

def ceiling_tier(res):
    """Highest tier where the person passed at least one question."""
    best = "-"
    for q, (st, _) in res.items():
        if st == "pass": best = max(best, TIERS[q])
    return best

# ---------- report ----------

def verdict(score, res):
    t = ceiling_tier(res)
    if score <= 2 or t in ("-", "T1"):
        return "FLOOR — exclude", "Can't clear the basics. Both arms would score ~0; no signal."
    if score >= 9 or t == "T5":
        return "CEILING — exclude", "Already fluent. Nothing left to teach; both arms score high."
    return "INCLUDE", f"Comfortable to {t}, breaks above it. Usable headroom."

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()

    con, kind = open_db()
    ref_text = open(os.path.join(HERE, "reference_queries.sql")).read()
    ref_sql = parse(ref_text)
    ref = {}
    for q, s in ref_sql.items():
        rows, err = run(con, s)
        if err: sys.exit(f"ANSWER KEY BROKEN at Q{q}: {err}")
        ref[q] = rows
    print(f"[{kind}] answer key loaded, {len(ref)} questions\n")

    if a.self_test:
        res = grade_one(con, ref_sql, ref)
        ok = sum(1 for s,_ in res.values() if s == "pass")
        print(f"self-test: {ok}/{len(ref)}")
        sys.exit(0 if ok == len(ref) else 1)

    files = sorted(glob.glob(os.path.join(HERE, "submissions", "*.sql")))
    if not files:
        sys.exit("No submissions/*.sql yet. Drop one file per person in there.")

    rows = []
    for f in files:
        who = os.path.splitext(os.path.basename(f))[0]
        res = grade_one(con, parse(open(f).read()), ref)
        score = sum(1 for s,_ in res.values() if s == "pass")
        v, why = verdict(score, res)
        rows.append((who, score, ceiling_tier(res), v, why, res))

        print(f"=== {who}: {score}/10, tops out at {ceiling_tier(res)} -> {v}")
        for q in sorted(res):
            st, note = res[q]
            mark = {"pass":"OK  ","wrong":"WRONG","error":"ERR ","blank":"--  "}[st]
            print(f"    Q{q:<2} {TIERS[q]}  {mark} {note or ''}")
        print()

    print("=" * 72)
    print(f"{'person':<20}{'score':>6}{'tops at':>10}  verdict")
    print("-" * 72)
    for who, score, tier, v, why, _ in sorted(rows, key=lambda r: -r[1]):
        print(f"{who:<20}{score:>6}{tier:>10}  {v}")
    print("=" * 72)

    keep = [r for r in rows if r[3] == "INCLUDE"]
    print(f"\nUsable: {len(keep)} of {len(rows)}")

    # Where to set the study's difficulty.
    per_tier = {t: 0 for t in TIER_LABEL}
    for *_ , res in rows:
        for q,(st,_) in res.items():
            if st == "pass": per_tier[TIERS[q]] += 1
    total = max(len(rows) * 2, 1)
    print("\nPass rate by tier (this is what sets your question difficulty):")
    for t in ["T1","T2","T3","T4","T5"]:
        pct = 100 * per_tier[t] / total
        flag = ""
        if pct >= 80: flag = "  <- too easy, they already have it"
        elif pct <= 15: flag = "  <- too hard, floor risk"
        elif 25 <= pct <= 60: flag = "  <- TEACH HERE"
        print(f"  {t} {TIER_LABEL[t]:<32} {pct:5.0f}%{flag}")

    print("\nMatched-pair split: sort by score, pair 1st+2nd, 3rd+4th, ...")
    print("then coin-flip each pair into Arm A / Arm B.")
    print("Keep your 4 ex-teammates split across both arms, not clumped.")

if __name__ == "__main__":
    main()
