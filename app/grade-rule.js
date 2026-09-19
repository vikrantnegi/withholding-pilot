/*
 * grade-rule.js — the frozen scoring rule, in the browser.
 *
 * A line-for-line port of study-questions/grade_rule.py. That file is the
 * source of truth for the WORDING of the rule; this file is the source of truth
 * for what a learner is told on screen. They must never disagree, so
 * evals/grader-conformance.mjs runs both over the same 75 queries and fails if
 * any verdict or reason differs. Change one, change the other, re-run that.
 *
 * Why this file exists at all: until 19 Sep the app judged a submission by
 * comparing result rows at 2 decimal places, while the scoring rule compared at
 * 1 and also checked the SQL itself. So the app called a learner wrong for
 * forgetting ROUND, and called the anuj-shaped query correct. Two graders, two
 * answers, on the shapes the study is about.
 *
 * A submission is CORRECT only if all three hold:
 *   1. it runs,
 *   2. every non-aggregated column it selects, or filters on in HAVING, also
 *      appears in GROUP BY,
 *   3. its rows equal the reference's rows, in the order the prompt asked for,
 *      with numbers compared to 1 decimal place.
 *
 * Verdicts: correct | invalid (fails 2) | error (fails 1) | wrong.
 */
const GRADE = (() => {
  'use strict';

  const AGG_SRC = '\\b(count|sum|avg|min|max|total|group_concat)\\s*\\(';
  const AGG = new RegExp(AGG_SRC, 'i');
  const AGG_AT = new RegExp(AGG_SRC, 'iy');   // sticky: matches AT a position

  const KEYWORDS = new Set([
    'select','from','where','group','by','having','order','asc','desc','and','or','not',
    'as','distinct','case','when','then','else','end','limit','offset','round','null',
    'is','in','like','between','on','join','left','inner','outer','cast','coalesce',
  ]);

  const stripLiterals = sql => String(sql).replace(/'[^']*'/g, "''");

  /* Split on commas that are not inside brackets. */
  function splitTop(s) {
    const out = [];
    let depth = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') depth += 1;
      if (ch === ')') depth -= 1;
      if (ch === ',' && depth === 0) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out;
  }

  /* Column names mentioned OUTSIDE any aggregate call. COUNT(x) hides x;
   * a bare x does not. That difference is the whole of clause 2. */
  function identifiers(expr) {
    let outside = '', i = 0;
    while (i < expr.length) {
      AGG_AT.lastIndex = i;
      const m = AGG_AT.exec(expr);
      if (m) {
        let depth = 1;
        i = AGG_AT.lastIndex;
        while (i < expr.length && depth) {
          if (expr[i] === '(') depth += 1;
          else if (expr[i] === ')') depth -= 1;
          i += 1;
        }
        continue;
      }
      outside += expr[i];
      i += 1;
    }
    const words = outside.match(/\b[a-zA-Z_][a-zA-Z_0-9]*\b/g) || [];
    return new Set(words.map(w => w.toLowerCase()).filter(w => !KEYWORDS.has(w)));
  }

  function clause(sql, name, stops) {
    const re = new RegExp(
      '\\b' + name + '\\b([\\s\\S]*?)(?=\\b(?:' + stops.join('|') + ')\\b|$)', 'i');
    const m = sql.match(re);
    return m ? m[1] : null;
  }

  const minus = (a, b) => [...a].filter(x => !b.has(x));

  /* null when the SQL is valid grouped SQL, otherwise the reason it is not. */
  function validity(sql) {
    const s = stripLiterals(sql);
    const gb = clause(s, 'GROUP BY', ['HAVING', 'ORDER BY', 'LIMIT']);
    if (gb === null) return null;      // no grouping: nothing for this rule to check

    let groupCols = new Set();
    for (const part of splitTop(gb)) for (const id of identifiers(part)) groupCols.add(id);

    const sel = clause(s, 'SELECT', ['FROM']);
    for (const part of splitTop(sel || '')) {
      if (AGG.test(part)) continue;
      const bare = minus(identifiers(part), groupCols);
      if (bare.length) return `selects ${bare.sort().join(', ')} without grouping by it`;
    }

    const hv = clause(s, 'HAVING', ['ORDER BY', 'LIMIT']);
    if (hv) {
      const bare = minus(identifiers(hv), groupCols);
      if (bare.length) {
        return `filters groups on ${bare.sort().join(', ')}, ` +
               'which is a row value, not a group value';
      }
    }
    return null;
  }

  /* One decimal place, ties away from zero, applied to the number's shortest
   * decimal form. That is what SQLite's ROUND(x,1) does, and the reference
   * queries are rounded by SQLite — so the grader has to agree with them.
   * Rounding the raw double instead would mark 194.45 as 194.4 while the
   * reference says 194.5. grade_rule.py rounds identically; the conformance
   * test is what keeps them that way. */
  function round1(v) {
    if (typeof v !== 'number' || !Number.isFinite(v)) return v;
    const s = String(Math.abs(v));
    const sign = v < 0 ? -1 : 1;
    const dot = s.indexOf('.');
    if (dot === -1 || s.length - dot - 1 <= 1) return v;
    if (s.includes('e') || s.includes('E')) return sign * Math.round(Math.abs(v) * 10) / 10;
    const frac = s.slice(dot + 1);
    const head = Number(s.slice(0, dot + 2));        // value truncated to 1 decimal
    const up = frac.charCodeAt(1) >= 53;             // first dropped digit >= '5'
    return sign * (up ? Math.round((head + 0.1) * 10) / 10 : head);
  }

  const normRows = rows => (rows || []).map(r => r.map(round1));
  const key = rows => JSON.stringify(rows);
  const bag = rows => JSON.stringify(rows.map(r => String(r)).sort());

  /*
   * grade({ sql, got, error, want }) -> { verdict, reason }
   *
   * Validity is checked BEFORE execution, exactly as grade_rule.py does it, so a
   * query that is both invalid and unrunnable grades `invalid`, not `error`.
   * `got` is the submission's rows; pass `error` instead when it did not run.
   */
  function grade({ sql, got, error, want }) {
    const bad = validity(sql);
    if (bad) return { verdict: 'invalid', reason: bad };
    if (error) return { verdict: 'error', reason: String(error) };
    const g = normRows(got), w = normRows(want);
    if (key(g) === key(w)) return { verdict: 'correct', reason: '' };
    if (bag(g) === bag(w)) return { verdict: 'wrong', reason: 'right rows, wrong order' };
    return { verdict: 'wrong', reason: `${g.length} rows returned, ${w.length} expected` };
  }

  return { grade, validity, round1, normRows, KEYWORDS };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = GRADE;
