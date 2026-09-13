#!/usr/bin/env python3
"""Reproduces the impact metric in SUBMISSION.md section 2.

Round 1: SQL written cold - no database, no Run button, no error messages.
Round 2: same people, same schema, new T2/T3 questions, a real SQLite engine
         in the page and a Run button.

    python3 rounds-compare.py
"""
import json, os, re, sqlite3
from statistics import median

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA = open(os.path.join(HERE, 'schema.sql')).read()

# ---------- ROUND 1: did the query even reach the database? ----------
r1 = {}
subs = os.path.join(HERE, 'submissions')
for fn in sorted(os.listdir(subs)):
    if not fn.endswith('.sql'):
        continue
    con = sqlite3.connect(':memory:'); con.executescript(SCHEMA)
    parts = re.split(r'--\s*Q(\d+)', open(os.path.join(subs, fn)).read())[1:]
    att = ex = 0
    for i in range(0, len(parts), 2):
        q = parts[i + 1].strip()
        if not q:
            continue
        att += 1
        try:
            con.execute(q).fetchall(); ex += 1
        except Exception:
            pass
    r1[fn[:-4]] = (att, ex)

t_att = sum(a for a, _ in r1.values()); t_ex = sum(e for _, e in r1.values())
print('ROUND 1 - written cold, no execution')
print(f"  attempts {t_att}, executed {t_ex}, never reached the database "
      f"{t_att - t_ex} ({(t_att - t_ex) / t_att * 100:.1f}%)")
print(f"  learners with zero executing queries: "
      f"{sum(1 for a, e in r1.values() if e == 0)}/{len(r1)}")

# ---------- ROUND 2: same people, with a Run button ----------
logs = os.path.join(HERE, 'mini-screen-submission')
r2, gate_out = {}, []
for fn in sorted(os.listdir(logs)):
    if not fn.endswith('.json'):
        continue
    d = json.load(open(os.path.join(logs, fn)))
    who = fn[:-5]
    # attempts to FIRST correct, counted from the event stream (summary['attempts']
    # is the total, which overcounts anyone who kept going after solving)
    per = {}
    for q in ('M1', 'M2', 'M3'):
        evs = [e for e in d['events'] if e.get('q') == q and e.get('outcome') != 'skipped']
        first = next((i for i, e in enumerate(evs) if e.get('outcome') == 'correct'), None)
        per[q] = {'attempts': (first + 1) if first is not None else len(evs),
                  'solved': first is not None,
                  'skipped': len(evs) == 0}
    r2[who] = per
    if not any(e.get('outcome') not in ('error', 'skipped') for e in d['events']):
        gate_out.append(who)

print('\nROUND 2 - same schema, T2/T3 questions, a Run button')
print(f"  {'person':10} {'R1 cold':>8}  M1            M2")
R1_SCORE = {'nabin': 3, 'vikash': 1, 'anuj': 0, 'gaurav': 0,
            'manish': 0, 'rishabh': 0, 'ritesh': 0}
for who, s in r2.items():
    def cell(q):
        if s[q]['skipped'] or s[q]['attempts'] == 0: return 'not attempted'
        return (f"solved in {s[q]['attempts']}" if s[q]['solved']
                else f"{s[q]['attempts']} tries, no")
    print(f"  {who:10} {R1_SCORE.get(who,'?'):>6}/10  {cell('M1'):14}{cell('M2')}")

for q in ('M1', 'M2', 'M3'):
    tried = [s for s in r2.values() if not s[q]['skipped'] and s[q]['attempts']]
    solved = [s for s in tried if s[q]['solved']]
    med = median([s[q]['attempts'] for s in solved]) if solved else '-'
    print(f"  {q}: attempted {len(tried)}/{len(r2)}, solved {len(solved)}/{len(r2)}"
          f", median attempts to solve {med}")

print(f"\nGATE CHECK - locked out by 'must produce one EXECUTING attempt': "
      f"{len(gate_out)}/{len(r2)} {gate_out}")
eligible = [w for w in r2 if R1_SCORE.get(w, 9) <= 1]
recov = [w for w in eligible if r2[w]['M1']['solved']]
print(f"\nHEADLINE: {len(eligible)}/{len(r2)} round-2 returners scored <=1/10 cold. "
      f"{len(recov)} of them solved a same-tier question with a Run button.")
