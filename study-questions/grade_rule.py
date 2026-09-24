"""The scoring rule for the study. Frozen 19 Sep 2026.

A submission is CORRECT only if all three hold:

1. it runs,
2. it is valid grouped SQL — every non-aggregated column it selects or filters
   on in HAVING also appears in GROUP BY. An alias of a valid SELECT item is a
   group value (amended 24 Sep, LEARNING-LOG.md L21), unless it shadows a column,
3. its rows equal the reference's rows, in the order the prompt asked for,
   with numbers compared to 1 decimal place.

Clause 2 is the addition. SQLite accepts queries that Postgres rejects: it picks
one arbitrary row from each group to supply a bare column. That is how anuj's
`HAVING price > 10000` scored as correct in round 1 — a wrong mental model that
happened to return the right rows. Result matching alone cannot catch it,
because there is nothing wrong with the *rows*; what is wrong is the query.
"""
import re

AGG = re.compile(r'\b(count|sum|avg|min|max|total|group_concat)\s*\(', re.I)
KEYWORDS = {'select','from','where','group','by','having','order','asc','desc','and','or','not',
            'as','distinct','case','when','then','else','end','limit','offset','round','null',
            'is','in','like','between','on','join','left','inner','outer','cast','coalesce'}

def _strip_literals(sql):
    return re.sub(r"'[^']*'", "''", sql)

def _split_top(s):
    out, depth, cur = [], 0, ''
    for ch in s:
        if ch == '(': depth += 1
        if ch == ')': depth -= 1
        if ch == ',' and depth == 0: out.append(cur); cur = ''
        else: cur += ch
    if cur.strip(): out.append(cur)
    return out

def _identifiers(expr):
    # column names outside any aggregate call
    outside, depth, cur = '', 0, ''
    i = 0
    while i < len(expr):
        m = AGG.match(expr, i)
        if m:
            depth = 1; i = m.end()
            while i < len(expr) and depth:
                if expr[i] == '(': depth += 1
                elif expr[i] == ')': depth -= 1
                i += 1
            continue
        outside += expr[i]; i += 1
    words = re.findall(r'\b[a-zA-Z_][a-zA-Z_0-9]*\b', outside)
    return {w.lower() for w in words if w.lower() not in KEYWORDS and not w.isdigit()}

def _clause(sql, name, stops):
    m = re.search(rf'\b{name}\b(.*?)(?=\b(?:{"|".join(stops)})\b|$)', sql, re.I | re.S)
    return m.group(1) if m else None

AGG_NAMES = {'count','sum','avg','min','max','total','group_concat'}

def _alias_of(part):
    """The alias a SELECT item names, or None. `COUNT(*) AS n` and `COUNT(*) n`
    both name n. `DISTINCT city` and `a + b` name nothing."""
    t = part.strip()
    m = re.search(r'([\w)])\s+(as\s+)?([A-Za-z_][A-Za-z_0-9]*)$', t, re.I)
    if not m: return None
    name = m.group(3).lower()
    if name in KEYWORDS: return None
    if not m.group(2):
        before = re.search(r'([A-Za-z_][A-Za-z_0-9]*)$', t[:m.start() + 1])
        if before and before.group(1).lower() in KEYWORDS: return None
    return name

def _all_words(s):
    """Every word, minus keywords and aggregate names. An alias that is one of
    these, in its own SELECT list, shadows a real column: in HAVING, SQLite reads
    `fare` in `SUM(fare) AS fare ... HAVING fare > 500` as the ROW column."""
    return {w.lower() for w in re.findall(r'\b[a-zA-Z_][a-zA-Z_0-9]*\b', s)
            if w.lower() not in KEYWORDS and w.lower() not in AGG_NAMES}

def validity(sql):
    """Returns None if valid, or a reason string."""
    s = _strip_literals(sql)
    gb = _clause(s, 'GROUP BY', ['HAVING', 'ORDER BY', 'LIMIT'])
    if gb is None:
        return None  # no grouping: nothing for this rule to check
    group_cols = set()
    for part in _split_top(gb):
        group_cols |= _identifiers(part)
    sel = _clause(s, 'SELECT', ['FROM'])
    aliases, exprs = set(), []
    for part in _split_top(sel or ''):
        a = _alias_of(part)
        t = part.strip()
        exprs.append(t[:len(t) - len(a)] if a else t)
        if a: aliases.add(a)
        if AGG.search(part): continue
        bare = _identifiers(part) - group_cols - ({a} if a else set())
        if bare: return f"selects {', '.join(sorted(bare))} without grouping by it"
    # A SELECT item that passed the check above is a group value, so its alias
    # is one too, unless the alias shadows a column it was built from.
    group_vals = group_cols | (aliases - _all_words(' '.join(exprs)))
    hv = _clause(s, 'HAVING', ['ORDER BY', 'LIMIT'])
    if hv:
        bare = _identifiers(hv) - group_vals
        if bare: return f"filters groups on {', '.join(sorted(bare))}, which is a row value, not a group value"
    return None

def _round1(v):
    """One decimal place, ties away from zero, applied to the number's shortest
    decimal form. This is what SQLite's ROUND(x,1) does.

    It matters because the reference queries are rounded by SQLite, so the grader
    has to agree with them. Python's built-in round() works on the raw double
    instead: round(194.45, 1) is 194.4, while SQLite's ROUND(194.45, 1) is 194.5.
    A learner whose query produced 194.45 would then be marked wrong against a
    reference showing 194.5 — punished for the grader's tie-break, not for their
    SQL. The rule said "compared to 1 decimal place" and never said which way
    ties go; see DECISIONS.md section 4, dated 19 Sep, before any session ran.

    app/grade-rule.js rounds identically. evals/grader-conformance.mjs is what
    keeps the two that way."""
    if not isinstance(v, float): return v
    if v != v or v in (float('inf'), float('-inf')): return v
    sign = -1 if v < 0 else 1
    s = repr(abs(v))
    if 'e' in s or 'E' in s: return sign * (round(abs(v) * 10) / 10)
    if '.' not in s: return v
    whole, frac = s.split('.')
    if len(frac) <= 1: return v
    head = float(whole + '.' + frac[0])
    return sign * (round((head + 0.1) * 10) / 10 if frac[1] >= '5' else head)

def _norm(rows):
    return [tuple(_round1(v) for v in r) for r in rows]

def grade(conn, submission, reference, ordered=True):
    """-> (verdict, reason). verdict in {'correct','error','invalid','wrong'}"""
    bad = validity(submission)
    if bad: return 'invalid', bad
    try: got = conn.execute(submission).fetchall()
    except Exception as e: return 'error', str(e)
    want = conn.execute(reference).fetchall()
    g, w = _norm(got), _norm(want)
    if g == w: return 'correct', ''
    if sorted(map(str, g)) == sorted(map(str, w)): return 'wrong', 'right rows, wrong order'
    return 'wrong', f'{len(g)} rows returned, {len(w)} expected'
