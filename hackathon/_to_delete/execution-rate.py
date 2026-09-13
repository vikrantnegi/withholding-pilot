#!/usr/bin/env python3
"""Reproduces the impact metric in SUBMISSION.md section 2.

An "attempt" is a non-blank query under a `-- Qn` label.
It "executed" if it returns a result set against schema.sql; otherwise it errored.

    python3 execution-rate.py
"""
import os, re, sqlite3, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA = open(os.path.join(HERE, 'schema.sql')).read()
SUBS = os.path.join(HERE, 'submissions')

rows, tot_att, tot_exec = [], 0, 0
for fn in sorted(os.listdir(SUBS)):
    if not fn.endswith('.sql'):
        continue
    con = sqlite3.connect(':memory:')
    con.executescript(SCHEMA)
    parts = re.split(r'--\s*Q(\d+)', open(os.path.join(SUBS, fn)).read())[1:]
    att = ex = 0
    for i in range(0, len(parts), 2):
        q = parts[i + 1].strip()
        if not q:
            continue
        att += 1
        try:
            con.execute(q).fetchall()
            ex += 1
        except Exception:
            pass
    rows.append((fn[:-4], att, ex, att - ex))
    tot_att += att
    tot_exec += ex

print(f"{'person':10} {'attempted':>9} {'executed':>8} {'errored':>8}")
for r in rows:
    print(f"{r[0]:10} {r[1]:>9} {r[2]:>8} {r[3]:>8}")
print(f"\n{'TOTAL':10} {tot_att:>9} {tot_exec:>8} {tot_att - tot_exec:>8}")
print(f"\nattempts that never reached the database: "
      f"{tot_att - tot_exec}/{tot_att} = {(tot_att - tot_exec) / tot_att * 100:.1f}%")
print(f"learners with zero executing queries: "
      f"{sum(1 for r in rows if r[2] == 0)}/{len(rows)}")
