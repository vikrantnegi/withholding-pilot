import os, sqlite3, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from items import ITEMS
c=sqlite3.connect(':memory:'); c.executescript(open(os.path.join(HERE,'schema.sql')).read())
bad=0
for iid,st,sk,pair,prompt,ref,wrongs,sortcol in ITEMS:
    notes=[]; errs=[]
    r=c.execute(ref).fetchall()
    if not (2<=len(r)<=10): notes.append(f"rows={len(r)}")
    if sortcol is not None:
        keys=[x[sortcol] for x in r]
        if len(set(keys))!=len(keys): notes.append("TIE on sort key")
    for name,w in wrongs:
        try:
            wr=c.execute(w).fetchall()
            if wr==r or sorted(map(str,wr))==sorted(map(str,r)): notes.append(f"wrong '{name}' MATCHES reference")
        except Exception as e: errs.append(name)
    status="OK " if not notes else "FIX"
    if notes: bad+=1
    print(status,iid,sk,len(r),'rows',notes,'| errors in SQLite:',errs)
print("problems:",bad)
