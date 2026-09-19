import os, re, sys
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
from items import ITEMS
from hints import HINTS
bad=0
for iid,st,sk,pair,prompt,ref,wrongs,_ in ITEMS:
    notes=[]
    h=HINTS.get(iid)
    if not h: notes.append("MISSING hint")
    else:
        if "select" in h.lower(): notes.append("contains SELECT")
        for kw in ["GROUP BY","HAVING","WHERE","ORDER BY"]:
            if kw in h: notes.append(f"names the clause {kw}")
        for num in set(re.findall(r"\b\d+\b", ref)):
            if re.search(rf"\b{num}\b", h) and num not in prompt.split(): pass
        if len(h) > 260: notes.append(f"too long ({len(h)})")
    if notes: bad+=1; print("FIX", iid, notes)
print("items:",len(ITEMS),"hints:",len(HINTS),"problems:",bad)
