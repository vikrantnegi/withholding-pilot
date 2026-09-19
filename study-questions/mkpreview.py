import os, sqlite3, sys, html
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
from items import ITEMS
c=sqlite3.connect(':memory:'); c.executescript(open(os.path.join(HERE,'schema.sql')).read())
def table(name):
    cur=c.execute(f"SELECT * FROM {name}")
    cols=[d[0] for d in cur.description]; rows=cur.fetchall()
    h=f'<h3>{name} <span class="n">{len(rows)} rows</span></h3><div class="scroll"><table><thead><tr>'+''.join(f'<th>{x}</th>' for x in cols)+'</tr></thead><tbody>'
    for r in rows: h+='<tr>'+''.join(f'<td>{html.escape(str(v))}</td>' for v in r)+'</tr>'
    return h+'</tbody></table></div>'
def qlist(kind):
    out=''
    for iid,st,sk,pair,prompt,*_ in ITEMS:
        if st!=kind: continue
        out+=f'<div class="q"><div class="meta"><span class="id">{iid}</span><span class="sk">{sk}</span></div><p>{html.escape(prompt)}</p></div>'
    return out
doc=f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Study questions — tester view</title><style>
:root{{--bg:#fbfaf8;--fg:#1c1a17;--mut:#6b6560;--line:#e2ddd6;--card:#fff;--acc:#8a5a2b}}
:root:not([data-theme="light"]){{}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#171614;--fg:#ece8e2;--mut:#9c958d;--line:#2e2b27;--card:#1f1d1a;--acc:#d79a5b}}}}
:root[data-theme="dark"]{{--bg:#171614;--fg:#ece8e2;--mut:#9c958d;--line:#2e2b27;--card:#1f1d1a;--acc:#d79a5b}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 ui-sans-serif,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px}}
.wrap{{max-width:980px;margin:0 auto}}h1{{font-size:22px;margin:0 0 4px}}.sub{{color:var(--mut);margin:0 0 20px;font-size:14px}}
h2{{font-size:17px;margin:28px 0 10px;border-bottom:1px solid var(--line);padding-bottom:6px}}h3{{font-size:14px;margin:18px 0 8px;font-weight:600}}
.n{{color:var(--mut);font-weight:400;font-size:12px}}
.scroll{{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--card);max-height:320px;overflow-y:auto}}
table{{border-collapse:collapse;width:100%;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}}
th{{position:sticky;top:0;background:var(--card);text-align:left;padding:7px 10px;border-bottom:1px solid var(--line);color:var(--mut);font-weight:600;white-space:nowrap}}
td{{padding:5px 10px;border-bottom:1px solid var(--line);white-space:nowrap}}tr:last-child td{{border-bottom:0}}
.q{{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--acc);border-radius:8px;padding:12px 14px;margin:10px 0}}
.q p{{margin:6px 0 0}}.meta{{display:flex;gap:8px;font:11px ui-monospace,monospace;color:var(--mut)}}
.id{{color:var(--acc);font-weight:700}}.tabs{{display:flex;gap:6px;margin:14px 0}}
button{{font:13px inherit;padding:6px 12px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;cursor:pointer}}
button[aria-selected="true"]{{background:var(--acc);color:var(--bg);border-color:var(--acc)}}
.hide{{display:none}}</style></head><body><div class="wrap">
<h1>Study questions — what a tester sees</h1>
<p class="sub">The three tables below are the complete data. No answers on this page.</p>
<h2>The data</h2>{table('deploys')}{table('tickets')}{table('rides')}
<h2>The questions</h2>
<div class="tabs"><button id="bp" aria-selected="true" onclick="sw('p')">Practice · 20</button><button id="bh" aria-selected="false" onclick="sw('h')">Held-out · 12</button></div>
<div id="p">{qlist('practice')}</div><div id="h" class="hide">{qlist('heldout')}</div>
</div><script>function sw(k){{p.classList.toggle('hide',k!=='p');h.classList.toggle('hide',k!=='h');bp.ariaSelected=k==='p';bh.ariaSelected=k==='h';}}</script></body></html>'''
open('/mnt/user-data/outputs/tester-view.html','w').write(doc)
print(len(doc))
