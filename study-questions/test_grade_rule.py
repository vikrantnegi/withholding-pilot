import os, sqlite3, sys
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
from items import ITEMS
from grade_rule import grade, validity
c=sqlite3.connect(':memory:'); c.executescript(open(os.path.join(HERE,'schema.sql')).read())
fail=0
for iid,st,sk,pair,prompt,ref,wrongs,_ in ITEMS:
    v,r = grade(c, ref, ref)
    if v!='correct': fail+=1; print("FIX", iid, "reference graded", v, r)
print("--- how each listed wrong model is now caught ---")
tally={}
for iid,st,sk,pair,prompt,ref,wrongs,_ in ITEMS:
    for name,w in wrongs:
        v,r = grade(c, w, ref)
        tally[v]=tally.get(v,0)+1
        if v=='correct': fail+=1; print("FIX", iid, "wrong model scored CORRECT:", name)
print(tally)
# the anuj case: right rows from an invalid query
anuj = "SELECT service, COUNT(*) FROM deploys GROUP BY service HAVING status = 'failed'"
print("anuj-shaped query ->", grade(c, anuj, "SELECT service, COUNT(*) FROM deploys GROUP BY service"))
# aliases in HAVING, amended 24 Sep (LEARNING-LOG.md L21)
alias_cases = [
    ("select service,count(*) deploy_count from deploys group by service having deploy_count>6", None),
    ("SELECT team, SUM(hours_to_close) as total_hours FROM tickets GROUP BY team HAVING total_hours > 300", None),
    ("SELECT city, SUM(fare) AS fare FROM rides GROUP BY city HAVING fare > 500",
     "filters groups on fare, which is a row value, not a group value"),
    ("SELECT service, COUNT(*) AS count FROM deploys GROUP BY service HAVING count > 6", None),
    ("SELECT service, COUNT(*) AS n FROM deploys GROUP BY service HAVING n > 6 AND env = 'prod'",
     "filters groups on env, which is a row value, not a group value"),
]
for q, want in alias_cases:
    got = validity(q)
    if got != want: fail += 1; print("FIX alias case:", q, "->", got)
print("problems:", fail)
