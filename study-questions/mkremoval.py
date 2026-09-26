"""Generate app/removal.html, the removal-test page, from app/index.html.

    python3 study-questions/mkremoval.py

WHY GENERATED, NOT COPIED. The removal test must look and behave exactly like
practice, minus Help, so the only difference between the arms on removal day is
what happened in practice. A hand-made copy drifts the first time index.html is
touched. So every change below is a find-and-replace that must match EXACTLY
ONCE, and the script stops if any of them does not. If index.html changes shape,
this fails loudly instead of building a page that differs from practice.

WHAT CHANGES, AND NOTHING ELSE:
  - the 16 practice items become the 12 held-out items (H01-H12), in items.py order
  - Help is gone for both arms: no button, no help modules, no hint function,
    no network call except sql.js from the CDN
  - the intro and header say it is session 2
  - the send screen asks three optional 1-5 questions (PRD-v1.md, the Likert
    items on removal-test day), written into the log as `survey`
  - the log says session "removal", and the download is named for it

WHAT DOES NOT CHANGE: the editor, Run, the verdict wording, the grader
(grade-rule.js, the same file as practice), the schema panel, the rail, the log
handover. Scoring: correct on any attempt, denominator 12. Chosen 26 Sep, before
any removal-test data exists. Every attempt is logged, so first-attempt-correct
stays available as a secondary.
"""
import base64, json, os, sqlite3, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, os.pardir)
SRC = os.path.join(ROOT, "app", "index.html")
OUT = os.path.join(ROOT, "app", "removal.html")
sys.path.insert(0, HERE)
from items import ITEMS

HELP_MODULES = ["policy.js", "hint-guard.js", "hint-writer.js", "transport.js", "help-session.js"]


def once(src, old, new, what):
    n = src.count(old)
    if n != 1:
        raise SystemExit(f"mkremoval: '{what}' matched {n} times in index.html, expected 1. "
                         "index.html changed shape; update this script before building.")
    return src.replace(old, new)


def between(src, start, end, new, what):
    """Replace from `start` through `end` inclusive. Both must be unique."""
    if src.count(start) != 1 or src.count(end) < 1:
        raise SystemExit(f"mkremoval: block '{what}' not found exactly once in index.html")
    i = src.index(start)
    j = src.index(end, i) + len(end)
    return src[:i] + new + src[j:]


def heldout_block():
    conn = sqlite3.connect(":memory:")
    conn.executescript(open(os.path.join(HERE, "schema.sql")).read())
    qs, expected = [], {}
    for iid, st, _skill, _pair, prompt, reference, _w, _s in ITEMS:
        if st != "heldout":
            continue
        expected[iid] = [list(r) for r in conn.execute(reference).fetchall()]
        # The reference SQL is NOT emitted: with no Help there is nothing that reads
        # it, and it would be the answer in plain text in the page source.
        qs.append(dict(id=iid, ask=prompt))
    if len(qs) != 12:
        raise SystemExit(f"mkremoval: expected 12 held-out items, found {len(qs)}")
    lines = ["const QUESTIONS = ["]
    for q in qs:
        lines.append(f'  {{ id:{json.dumps(q["id"])}, ask:{json.dumps(q["ask"])} }},')
    lines.append("];")
    lines.append("const Q = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));")
    blob = base64.b64encode(json.dumps(expected).encode()).decode()
    lines.append(f'const EXPECTED = JSON.parse(atob("{blob}"));')
    return "\n".join(lines)


SURVEY = """      <h2>Three quick questions, then send it back</h2>
      <p>About <b>session 1</b>, the practice session. Optional, and there are no right
      answers. 1 = strongly disagree, 5 = strongly agree.</p>
      <div class="survey" id="survey"></div>
      <h2 style="margin-top:22px">Send it back</h2>"""

SURVEY_JS = """
/* ---- three optional 1-5 questions, written into the log as `survey` ----
 * PRD-v1.md: satisfaction and perceived learning are predicted to favour Arm B
 * while retention favours Arm A (ANALYSIS-PLAN.md, secondary measures). The
 * wording is identical for both arms and names neither arm's help. Unanswered
 * stays null; nothing here blocks sending the log. */
const SURVEY_ITEMS = [
  ["enjoyed",   "I enjoyed using the practice tool in session 1."],
  ["learned",   "The practice tool in session 1 helped me learn how to group and filter groups."],
  ["confident", "Today I felt confident writing these queries on my own."],
];
LOG.survey = Object.fromEntries(SURVEY_ITEMS.map(([k]) => [k, null]));
function renderSurvey(){
  const host = document.getElementById("survey");
  host.innerHTML = SURVEY_ITEMS.map(([k, text]) => `
    <fieldset class="likert"><legend>${text}</legend>
      ${[1,2,3,4,5].map(n => `<label><input type="radio" name="sv-${k}" value="${n}"> ${n}</label>`).join("")}
    </fieldset>`).join("");
  host.addEventListener("change", e => {
    const m = e.target.name && e.target.name.match(/^sv-(\\w+)$/);
    if (m) LOG.survey[m[1]] = Number(e.target.value);
  });
}
"""


def build():
    src = open(SRC).read()

    # 1. Header and intro.
    src = once(src, "<h1>SQL practice — grouping and filtering groups</h1>",
               "<h1>SQL — session 2</h1>", "h1")
    src = once(src, '<p class="sub">Practice session. 16 questions — get through what you can. No time limit.</p>',
               '<p class="sub">Session 2. 12 questions, about 30 minutes. On your own this time.</p>', "subtitle")
    src = between(src, "<h2>Before you start</h2>", "<p>When you're done, scroll to the bottom and send me the log.</p>",
        """<h2>Before you start</h2>
    <p><b>Same page as last time, minus the Help button.</b> There's no Help for anyone
    today. Write a query, run it, see what comes back, fix it, run it again. You'll still
    see whether each one is right.</p>
    <p><b>On your own</b>: no Google, no ChatGPT/Claude, no asking a colleague, and no
    looking back at anything from session 1. Do it in one sitting.</p>
    <p><b>These are new questions</b> on the same three tables. If one won't crack, move on;
    skipping is fine, and you can come back to it. About 30 minutes, but there's no timer.</p>
    <p>When you're done, answer three quick questions at the end and send me the log.</p>""",
        "intro")

    # 2. No help modules, no hint function. grade-rule.js stays: it is the same grader.
    for m in HELP_MODULES:
        src = once(src, f'<script src="{m}"></script>\n', "", f"script {m}")
    src = once(src, "<!-- The three tested modules. No logic below duplicates them. -->",
               "<!-- The grader. The same file practice used. No help modules on this page. -->",
               "modules comment")
    src = once(src, "POLICY.setSchemaIdentifiers(SCHEMA_IDENTIFIERS);\n", "", "setSchemaIdentifiers")
    src = between(src, "/* The hint writer. Same prompt and same pinned model",
                  "const callModel = WRITER.makeWriter(TRANSPORT.edgeTransport(TRANSPORT.url));",
                  "/* No hint writer on this page: removal test, no help for either arm. */",
                  "callModel")

    # 3. The question set.
    # From the QUESTIONS array through the end of the EXPECTED line, all of it:
    # the practice prompts, references, fallback hints and the base64 answers.
    k = src.index("const QUESTIONS = [")
    if src.count("const QUESTIONS = [") != 1 or src.count('const EXPECTED = JSON.parse(atob("') != 1:
        raise SystemExit("mkremoval: question block not found exactly once in index.html")
    e = src.index('const EXPECTED = JSON.parse(atob("', k)
    e = src.index('"));', e) + len('"));')
    src = src[:k] + heldout_block() + src[e:]
    src = once(src, " * 16 practice items. The 12 held-out items are deliberately absent:\n"
                    " * anything in this page's source is burned for the removal test.",
               " * REMOVAL TEST. The 12 held-out items, generated by study-questions/mkremoval.py.\n"
               " * Never host this page anywhere a tester can see before their session 2.",
               "set comment")

    # 4. The log.
    src = once(src, "/* The event log. One flat array of events, exactly the shape help-session.js\n"
                    " * reads and writes: attempt / help_decided / help_delivered. */",
               "/* The event log. Same shape as practice. On this page only `attempt` events\n"
               " * are written: there is no help to decide or deliver. */", "log comment")
    src = once(src, 'const LOG = { version:"slice-1", participant:PID || null, arm:ARM,',
               'const LOG = { version:"removal-1", session:"removal", participant:PID || null, arm:ARM,',
               "LOG")
    src = once(src, "  LOG.summary = SESSION.summarise(LOG.events);\n", "", "summary")
    src = once(src, 'a.download = `learning-os-log-${PID || "arm" + ARM}.json`;',
               'a.download = `learning-os-removal-log-${PID || "arm" + ARM}.json`;', "download name")

    # 5. No Help button.
    src = once(src, '        <button id="help-${q.id}">Help</button>\n', "", "help button")
    src = once(src, '      <div class="out" id="help-out-${q.id}"></div>\n', "", "help box")
    src = once(src, "    document.getElementById(`help-${q.id}`).onclick = () => helpQ(q.id);\n", "", "help onclick")
    src = between(src, "  /* A refusal (\"run something first\"",
                  "if (helpBox.dataset.transient) { helpBox.innerHTML = \"\"; delete helpBox.dataset.transient; }\n",
                  "", "refusal clearing")
    src = once(src, "    document.getElementById(`help-${id}`).disabled = true;\n", "", "help disable")
    src = between(src, "/* ---- HELP ---- all of the decision lives in help-session.js ---- */",
                  "  btn.textContent = label; btn.disabled = state[id].solved;\n}\n", "", "helpQ")

    # 6. The survey on the send screen.
    src = once(src, '      <h2>Send it back</h2>', SURVEY, "send heading")
    src = once(src, "/* ---- the log the learner sends back ---- */",
               SURVEY_JS + "\n/* ---- the log the learner sends back ---- */", "survey js")
    src = once(src, "    render();\n    QUESTIONS.forEach(q => counts(q.id));",
               "    render();\n    renderSurvey();\n    QUESTIONS.forEach(q => counts(q.id));", "renderSurvey call")
    src = once(src, "</style>",
               ".survey .likert{border:1px solid var(--line);border-radius:8px;margin:10px 0;padding:8px 12px}\n"
               ".survey legend{padding:0 4px;font-weight:600}\n"
               ".survey label{display:inline-block;margin:4px 14px 4px 0;cursor:pointer}\n</style>",
               "style")

    # 7. Refuse to write a page that still carries any help path or any practice item.
    banned = ["eyJQ", "helpQ", "SESSION.", "WRITER.", "TRANSPORT.", "POLICY.", "supabase", "fallbackHint",
              'id:"P', "reference:"]
    left = [b for b in banned if b in src]
    if left:
        raise SystemExit(f"mkremoval: help or practice material survived: {left}")

    open(OUT, "w").write(src)
    print(f"wrote {os.path.relpath(OUT, ROOT)}: 12 held-out items, no Help")


if __name__ == "__main__":
    build()
