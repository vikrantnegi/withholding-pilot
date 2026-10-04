"""Removal-test analysis, following ANALYSIS-PLAN.md checks 0a-5.

Reads the practice logs (screener/round-3-practice/logs) and the removal logs
(screener/round-4-removal/logs). Prints every number RESULTS.md quotes.
Run: python3 evals/analyse-removal.py
"""
import json, glob, re, os, statistics as st
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAMES = {"4cwkq": "nabin", "geu2z": "gaurav", "efkxn": "ritesh",
         "s6nqb": "vikash", "3b3xe": "rishabh", "gnas5": "anuj", "rqkkx": "manish"}
EXCLUDED = {"rqkkx"}  # ANALYSIS-PLAN.md section 5, decided 30 Sep before anuj's and ritesh's logs
H = [f"H{i:02d}" for i in range(1, 13)]

# sub-skill of every item, from study-questions/QUESTIONS.md headers
SKILL = {}
for line in open(os.path.join(ROOT, "study-questions/QUESTIONS.md")):
    m = re.match(r"### ([PH]\d+) · (S\d)", line)
    if m:
        SKILL[m.group(1)] = m.group(2)

def load(pattern):
    out = {}
    for f in glob.glob(os.path.join(ROOT, pattern)):
        d = json.load(open(f))
        out[d["participant"]] = d
    return out

prac = load("screener/round-3-practice/logs/*.json")
rem = load("screener/round-4-removal/logs/*.json")

def ts(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))

def per_item(d, items):
    """correct-any, first-attempt-correct, first-executing-correct, attempted, per item."""
    r = {}
    for q in items:
        ev = [e for e in d["events"] if e["type"] == "attempt" and e["q"] == q]
        exe = [e for e in ev if e["outcome"] != "error"]
        r[q] = dict(attempted=bool(ev),
                    any=any(e["outcome"] == "correct" for e in ev),
                    first=bool(ev) and ev[0]["outcome"] == "correct",
                    first_exec=bool(exe) and exe[0]["outcome"] == "correct",
                    n=len(ev))
    return r

def arm_of(pid):
    return rem[pid]["arm"]

def people(arm, include_excluded=False):
    return [p for p in rem if arm_of(p) == arm and (include_excluded or p not in EXCLUDED)]

R = {p: per_item(rem[p], H) for p in rem}

def tally(pids, key, items=H):
    return sum(R[p][q][key] for p in pids for q in items)

print("== per person (removal) ==")
for arm in "AB":
    for p in people(arm, True):
        r = R[p]
        print(f"{arm} {NAMES[p]:8} any {sum(v['any'] for v in r.values()):2}  first {sum(v['first'] for v in r.values()):2}"
              f"  first_exec {sum(v['first_exec'] for v in r.values()):2}  attempted {sum(v['attempted'] for v in r.values()):2}"
              f"  attempts {sum(v['n'] for v in r.values()):2}  minutes {(ts(rem[p]['finished'])-ts(rem[p]['started'])).seconds/60:4.1f}"
              + ("  EXCLUDED" if p in EXCLUDED else ""))

print("\n== 0b gap, practice finished -> removal started ==")
for p in rem:
    g = ts(rem[p]["started"]) - ts(prac[p]["finished"])
    print(f"{NAMES[p]:8} {g.days}d {g.seconds//3600}h {(g.seconds%3600)//60}m  {'UNDER 5 DAYS' if g.days < 5 else ''}")

print("\n== primary: correct on any attempt, per arm ==")
for arm in "AB":
    ps = people(arm); n = 12 * len(ps)
    means = [sum(R[p][q]["any"] for q in H) / 12 for p in ps]
    print(f"Arm {arm}: {tally(ps,'any')} of {n} = {100*tally(ps,'any')/n:.1f}%  learner means {[round(m,3) for m in means]}")
for key in ("first", "first_exec", "attempted"):
    print(key, {arm: f"{tally(people(arm),key)} of {12*len(people(arm))}" for arm in "AB"})

# item-level difference, SE clustered by learner (learner means, n per arm)
mA = [sum(R[p][q]["any"] for q in H) / 12 for p in people("A")]
mB = [sum(R[p][q]["any"] for q in H) / 12 for p in people("B")]
diff = st.mean(mA) - st.mean(mB)
se = (st.pvariance(mA) / len(mA) + st.pvariance(mB) / len(mB)) ** 0.5
print(f"gap A-B {100*diff:.1f} points, clustered SE {100*se:.1f} points (direction only; no p-value at n=3)")

print("\n== recovery: of items attempted and missed on the first attempt, how many ended correct ==")
for arm in "AB":
    ps = people(arm)
    miss = [(p, q) for p in ps for q in H if R[p][q]["attempted"] and not R[p][q]["first"]]
    rec = sum(R[p][q]["any"] for p, q in miss)
    print(f"Arm {arm}: {rec} of {len(miss)}")

print("\n== per sub-skill, correct-any (first) ==")
for s in ("S1", "S2", "S3", "S4"):
    items = [q for q in H if SKILL[q] == s]
    row = {arm: f"{tally(people(arm),'any',items)} ({tally(people(arm),'first',items)}) of {len(items)*len(people(arm))}" for arm in "AB"}
    gap = tally(people('A'),'any',items) - tally(people('B'),'any',items)
    print(s, row, "gap", gap)

print("\n== 1 manipulation, practice logs ==")
for p in prac:
    acts = [e.get("action") for e in prac[p]["events"] if e["type"] == "help_decided"]
    print(f"{prac[p]['arm']} {NAMES[p]:8} help_decided {len(acts):2}  hint {acts.count('hint'):2}  reveal {acts.count('reveal'):2}"
          f"  practice items attempted {len({e['q'] for e in prac[p]['events'] if e['type']=='attempt'}):2}")
A = [p for p in prac if prac[p]["arm"] == "A"]
hr = [e for p in A for e in prac[p]["events"] if e["type"] == "help_decided" and e.get("action") in ("hint", "reveal")]
print("1a Arm A HINT+REVEAL:", len(hr), "(fail below 8)")
seqs = {(p, e["q"]) for p in A for e in prac[p]["events"] if e["type"] == "help_decided" and e.get("action") == "hint"}
rev = {(p, e["q"]) for p in A for e in prac[p]["events"] if e["type"] == "help_decided" and e.get("action") == "reveal"}
print(f"1b REVEAL followed HINT in {len(seqs & rev)} of {len(seqs)} hint sequences (report above 70%)")
before = []
for p in [p for p in prac if prac[p]["arm"] == "B"]:
    for q in {e["q"] for e in prac[p]["events"] if e["type"] == "help_decided"}:
        evs = [e for e in prac[p]["events"] if e["q"] == q]
        first_help = next(i for i, e in enumerate(evs) if e["type"] == "help_decided")
        before.append(sum(1 for e in evs[:first_help] if e["type"] == "attempt"))
print(f"1c Arm B mean attempts before first help, per item: {st.mean(before):.2f} over {len(before)} items (fail at 0.5 or above)")
print("1d Arm A help_decided HINT/REVEAL per sub-skill:",
      {s: sum(1 for p in A for e in prac[p]["events"] if e["type"] == "help_decided" and e.get("action") in ("hint", "reveal") and SKILL.get(e["q"]) == s) for s in ("S1", "S2", "S3")})

print("\n== 4a practice pass rate vs held-out pass rate, per sub-skill, both arms pooled ==")
P = {p: per_item(prac[p], [k for k in SKILL if k.startswith("P")]) for p in prac if p not in EXCLUDED}
for s in ("S1", "S2", "S3"):
    pi = [k for k in SKILL if k.startswith("P") and SKILL[k] == s]
    hi = [q for q in H if SKILL[q] == s]
    pr = sum(P[p][q]["any"] for p in P for q in pi) / (len(P) * len(pi))
    hr_ = sum(R[p][q]["any"] for p in P for q in hi) / (len(P) * len(hi))
    print(f"{s}: practice {100*pr:.0f}%  held-out {100*hr_:.0f}%  drop {100*(pr-hr_):.0f} points (fail above 30)")

print("\n== 4b S4 precondition: learners correct on at least one of H10-H12 ==")
s4 = [NAMES[p] for p in rem if p not in EXCLUDED and any(R[p][q]["any"] for q in ("H10", "H11", "H12"))]
print(len(s4), "of", len([p for p in rem if p not in EXCLUDED]), s4)

print("\n== with manish included (footnote) ==")
ps = people("B", True)
print(f"Arm B: {tally(ps,'any')} of {12*len(ps)} = {100*tally(ps,'any')/(12*len(ps)):.1f}%")
