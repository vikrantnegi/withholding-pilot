"""Grade every query in items.py with grade_rule.py and emit the results as JSON.

This exists so evals/grader-conformance.mjs can check that app/grade-rule.js
reaches the same verdict on the same input. It emits the ROWS as well as the
verdict, so the JS side never needs a SQL engine — Python supplies what the
queries returned, and the JS grader is asked only to judge them.

Run: python3 emit_verdicts.py > /tmp/verdicts.json
"""
import json, os, sqlite3, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import grade_rule
from items import ITEMS


def main():
    conn = sqlite3.connect(":memory:")
    with open(os.path.join(HERE, "schema.sql")) as f:
        conn.executescript(f.read())

    cases = []

    def add(kind, iid, label, submission, reference):
        verdict, reason = grade_rule.grade(conn, submission, reference)
        want = conn.execute(reference).fetchall()
        got, error = None, None
        # The JS grader needs the same rows Python saw, or an error if there were none.
        if grade_rule.validity(submission) is None:
            try:
                got = [list(r) for r in conn.execute(submission).fetchall()]
            except Exception as e:
                error = str(e)
        else:
            # Invalid short-circuits before execution, so rows are irrelevant. Still
            # try, so the JS side is handed the same thing rather than a special case.
            try:
                got = [list(r) for r in conn.execute(submission).fetchall()]
            except Exception as e:
                error = str(e)
        cases.append(dict(kind=kind, item=iid, label=label, sql=submission,
                          got=got, error=error, want=[list(r) for r in want],
                          verdict=verdict, reason=reason))

    for iid, _set, _skill, _pair, _prompt, reference, wrongs, _sortcol in ITEMS:
        add("reference", iid, "the reference itself", reference, reference)
        for label, wrong in wrongs:
            add("wrong_model", iid, label, wrong, reference)

    json.dump(cases, sys.stdout)


if __name__ == "__main__":
    main()
