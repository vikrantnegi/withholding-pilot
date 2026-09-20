"""Generate the QUESTIONS array and the EXPECTED map for app/index.html.

Replaces the app-questions-snippet.js that never landed. Field names here are the
app's real ones, read off index.html, not guessed: id / ask / reference / fallbackHint.

PRACTICE ITEMS ONLY. The 12 held-out items must not appear in the page source at all —
a tester who opens view-source on 22 Sep would burn them for the 27 Sep removal test.

EXPECTED holds each item's reference result RAW — numbers as numbers, text as text.
It used to be pre-normalised into strings, which baked the app's old 2-decimal
comparison into the data. The frozen rule normalises both sides itself at compare time
(app/grade-rule.js), so the data must arrive unrounded or the rule cannot apply.

It is base64-encoded for the same reason as before: so a tester reading the page source
does not find the answers in plain text.

Run:  python3 mkappquestions.py            # prints the block
      python3 mkappquestions.py --splice   # writes it into ../app/index.html
"""
import base64, json, os, re, sqlite3, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from items import ITEMS
from hints import HINTS

APP = os.path.join(HERE, os.pardir, "app", "index.html")


def js_num(x):
    """Format a number the way JS String(Math.round(v*100)/100) does."""
    r = round(x * 100) / 100
    return str(int(r)) if r == int(r) else repr(r)


def norm(v):
    """Port of norm() in app/index.html. Must stay identical to it."""
    if v is None:
        return "∅"
    if isinstance(v, bool):
        return str(v)
    if isinstance(v, (int, float)):
        return js_num(v)
    s = str(v).strip()
    if s != "":
        try:
            return js_num(float(s))
        except ValueError:
            pass
    return s


def load_db():
    conn = sqlite3.connect(":memory:")
    with open(os.path.join(HERE, "schema.sql")) as f:
        conn.executescript(f.read())
    return conn


def practice_items():
    return [it for it in ITEMS if it[1] == "practice"]


def build():
    conn = load_db()
    questions, expected = [], {}
    for iid, _set, skill, pair, prompt, reference, _wrongs, _sortcol in practice_items():
        # Raw, not normalised. app/grade-rule.js rounds both sides at compare time.
        rows = conn.execute(reference).fetchall()
        expected[iid] = [list(r) for r in rows]
        hint = HINTS.get(iid)
        if not hint:
            raise SystemExit(f"{iid}: no fallback hint in hints.py")
        # skill and pair are deliberately NOT emitted. The app never reads them, and a
        # pair label ("H01") names a held-out item in the page source for no benefit.
        questions.append(dict(id=iid, ask=prompt, reference=reference, fallbackHint=hint))
    return questions, expected


def render(questions, expected):
    out = []
    out.append("/* =======================================================================")
    out.append(" * THE STUDY QUESTION SET. Generated — do not hand-edit.")
    out.append(" *")
    out.append(" * Source: study-questions/items.py (prompts, references) and hints.py")
    out.append(" * (fallback hints). Regenerate with:")
    out.append(" *     python3 study-questions/mkappquestions.py --splice")
    out.append(" *")
    out.append(f" * {len(questions)} practice items. The 12 held-out items are deliberately absent:")
    out.append(" * anything in this page's source is burned for the removal test.")
    out.append(" *")
    out.append(" * EXPECTED is base64 so the answers are not plain text in the source.")
    out.append(" * ======================================================================= */")
    out.append("")
    out.append("// The whole difference between the two groups. PRD-v1 §1.")
    out.append("const ARM = new URLSearchParams(location.search).get('arm') === 'B' ? 'B' : 'A';")
    out.append("")
    out.append("const QUESTIONS = [")
    for q in questions:
        out.append(f'  {{ id:{json.dumps(q["id"])},')
        out.append(f'    ask:{json.dumps(q["ask"])},')
        out.append(f'    reference:{json.dumps(q["reference"])},')
        out.append(f'    fallbackHint:{json.dumps(q["fallbackHint"])} }},')
    out.append("];")
    out.append("const Q = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));")
    blob = base64.b64encode(json.dumps(expected).encode()).decode()
    out.append(f'const EXPECTED = JSON.parse(atob("{blob}"));')
    return "\n".join(out)


START = "/* =======================================================================\n * DEV HARNESS. Not the study app."
NEW_START = "/* =======================================================================\n * THE STUDY QUESTION SET. Generated"
END = "const Q = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));"


def splice(block):
    with open(APP) as f:
        src = f.read()

    # The EXPECTED line sits above the block in the old layout and below it in the new
    # one. Drop the old line wherever it is, then replace the block.
    src = re.sub(r"^const EXPECTED = JSON\.parse\(atob\(\"[^\"]*\"\)\);\n", "", src,
                 flags=re.M)

    head = START if START in src else NEW_START
    i = src.index(head)
    j = src.index(END, i) + len(END)
    src = src[:i] + block + src[j:]

    with open(APP, "w") as f:
        f.write(src)
    print(f"spliced into {os.path.relpath(APP, HERE)}")


if __name__ == "__main__":
    qs, exp = build()
    block = render(qs, exp)
    if "--splice" in sys.argv:
        splice(block)
        print(f"items: {len(qs)}  expected: {len(exp)}")
    else:
        print(block)
