# Learning OS: the spec (PRD v1)

**Scope locked 10 Sep 2026.** It replaced `PRD-SEED.md`, which had a four-level help ladder and a
skill estimator. Both were cut.

**Rewritten in plain English on 5 Oct 2026. The meaning is unchanged.** The 10 Sep wording is in
git history, at commit `1deb25a` and earlier. For what happened when it ran, read `RESULTS.md`.

Older files cite sections of the 10 Sep version. Most numbers still match. Two moved: the
hint writer is now §5, and the questions §6.

---

## 1. What I am building

One web page. A learner reads a question in English. They write SQL in an editor and press Run.
The page tells them right or wrong. When stuck, they press **Help**.

**What Help returns is the whole experiment.**

- **Arm A** must try first. Its first help is a hint, not the answer.
- **Arm B** gets the full answer whenever it asks.

Everything else is identical: the editor, the runner, the questions, the right-or-wrong feedback,
the look. The two arms differ by one setting in a config file.

**So what:** if anything else differed, a difference in results could come from that instead of
from the help policy.

---

## 2. The hypothesis

If the tutor withholds the answer until the learner has tried, and gives a hint before the
answer, then the learner does better 5 to 7 days later, with no tutor at all, than a learner who
got answers on demand.

**The mechanism.** Pulling an answer out of your own memory makes it stick better than reading
it. Both arms learn something. They learn it in different proportions: Arm A does more of the
hard pulling, Arm B more of the easy reading.

**The claim is deliberately weak.** A large study by Bastani and colleagues (PNAS 2025) found
that students given answers by an AI scored *below* students with no AI at all. Students given a
guarded AI only matched them. My Arm B is their answer-giving group. So a good result here means
"withholding avoids the harm that answer-giving does". It does not mean "withholding builds
skill". Proving the stronger claim needs a third group with no AI, and six people cannot fill
three groups. §7 lists that as a deliberate cut.

---

## 3. Architecture (rubric E3)

**The one claim that matters: the LLM never decides whether to help, or how much.** Plain code
decides. The LLM only writes the hint's wording, after the decision is made.

The diagrams use three colours for three kinds of part:

| colour | kind of part | what it is here |
|---|---|---|
| green | human | the learner |
| orange | deterministic, plain code | the gate, the policy, the grader, the leak guard, the log |
| purple | probabilistic, an LLM | the hint writer |

### Arm A, the tutor being tested

![Arm A architecture](diagrams/architecture-arm-a.png)

Two paths leave the learner.

1. **Run a query.** The grader checks it. Right finishes the question. Wrong sends the learner back.
2. **Ask for help.** First comes the **gate**: with no attempt yet, the learner gets nothing.
   Past the gate, the **policy** chooses hint or answer. Only then does anything reach the LLM.

The policy reads only the event log, and writes every decision back to it. So after the study,
the log can prove what each arm actually received.

### Arm B, the baseline

![Arm B architecture](diagrams/architecture-arm-b.png)

**The same drawing, with everything Arm B does not use greyed out.** No gate, no policy, no hint
writer, no leak guard. What is left is: ask for help, get the answer.

**So what:** the two arms are one system with different parts switched on. That is what makes a
difference in results attributable to the help policy.

### What "correct" means inside the grader

On 13 Sep, the grader ran the learner's query and the reference query and compared the rows.
Since 19 Sep, it uses the frozen scoring rule. The query must also be valid grouped SQL, and
numbers match to one decimal place. Two implementations exist: `study-questions/grade_rule.py`
and `app/grade-rule.js`. `evals/grader-conformance.mjs` checks they agree.

### Why the line between code and LLM sits there

The thing being tested must be under my control. Suppose an LLM judged "this learner seems
stuck, give more". Then Arm A's treatment would change from learner to learner, and I could not
say what Arm A received. Plain code makes the treatment the same for everyone, and checkable from
the log. The LLM does the one thing code cannot: write a sentence about *this* learner's mistake.

---

## 4. The policy, in full

```
when Help is pressed, for one learner on one question:
    if arm B:
        give the answer                              # the baseline: no gate
    if arm A:
        if no attempt is logged for this question:
            refuse: "give it one run first"          # the gate
        if no help given yet on this question:
            give a hint
        else if attempts since the hint >= N:
            give the answer
        else:
            refuse: "try once more with the hint"
```

**N is 2, for everyone.** It never adapts. The study tests withholding, not adaptive withholding.
With 3 people per arm, a changing N would be a second variable the data cannot separate.

### What counts as an attempt

Example first: `SELECT city, COUNT(*) FROM rides GROUP BY cty` counts, even though it errors.
`asdf` does not. Neither does pressing Run five times on the same query.

An attempt counts when all three are true:

1. **It has substance:** at least one SQL keyword **and** at least one table or column name from
   the study's database.
2. **Its text differs** from the last counted attempt.
3. **It errored, or it ran and returned different rows** from the last counted attempt.

**Why a syntax error counts.** A query that will not run can still carry a whole, wrong idea:
`SELECT customer_id, COUNT(*) FROM orders WHERE COUNT(*) > 3` fails, and it is the classic
mistake this study targets. Research by Kornell, Hays and Bjork shows a failed attempt to recall
still teaches. Whether a query parses is a fact about SQL. Whether the learner tried to recall is
a fact about the learner. The gate should test the learner.

It is also fairer. In round 2, one tester ran nothing that parsed on 3 of 3 questions. A gate
that needed a running query would never have helped the person who needed it most.

**Why the substance rule exists.** Without it, three different pieces of junk would earn a hint
with no recall at all. Learners find tricks like that reliably (Koedinger). The rule uses no
model. It matches by substring on purpose: round 2 produced `GroupBy` and `havingcount>=3`,
mangled spelling around a real idea, and a stricter match would throw them away. Names under 4
characters need a whole-word match, so `id` does not match inside `video`.

**Checked against all 128 round-2 attempts: 121 pass.** The 7 rejected are 6 empty submissions
and one bare `SELECT`. No real attempt is lost. Built as `isSubstantive()` in `app/policy.js`,
with 14 tests.

Junk gets a different message from a repeat. Junk hears "write a query against the tables above
and run it". A repeat hears "change something in the query and run it once more". The log keeps
them apart.

Syntax errors are logged as `attempt_type: syntax_error` and never blocked in the page. Blocking
them would destroy data that is itself the measurement. Help requests are logged, and never count
as attempts.

### What the treatment actually is

Arm A differs from Arm B in **two** ways at once: the gate, and a hint before the answer. Telling
them apart would need a third group, with the gate but full answers, and six people cannot fill
it.

So the treatment is one **package**: *require an attempt, then give less than the answer.* Both
halves serve one idea, making the learner produce rather than read. Bastani's guarded AI also
differed from his plain one in several ways, and was reported as one intervention.

**The limit, stated in advance:** a good result supports the package. It cannot show whether the
gate or the hint did the work.

**What the log still shows for free.** For each question, whether the learner solved it after
being refused (the gate was enough) or only after a hint. That is correlation, not cause, but it
is the detail an average over 3 people cannot carry.

### Two log entries per Help press

```
help_decided    { action, counted, sinceHelp }          written at once
help_delivered  { source, modelAttempts, rejections }   written after the leak guard
```

**Why two.** The policy decides before the hint exists. One entry, written at decision time,
would hide whether the learner got a real hint or the backup text. Those are different
treatments, and the analysis must count them apart.

**Why not one entry, filled in later.** Then the policy would wait for the LLM, and the LLM would
be in the decision path after all. Two entries keep the decision instant and LLM-free.

**The policy reads only `help_decided`.** So a learner whose hint came back weak still moves up the
ladder on the normal schedule. The arms stay comparable by rule, not by how the model behaved
that day. Built in `app/help-session.js`, with 20 tests.

**Right-or-wrong feedback is never withheld,** from either arm. Only help differs.

**"Unaided", precisely.** A question is unaided if the learner's first attempt that ran was
correct, and no help was given on it. Any help request marks the question as assisted.

---

## 5. The hint writer and its safety net

**One LLM call per hint.** It sees the reference query, the learner's query, and how their rows
differ.

**The model is pinned:** `openai/gpt-oss-120b` at temperature 0.3, on Groq. The key and the model
check live in a Supabase edge function (`supabase/functions/hint/`), so the key never reaches the
page and a tampered page cannot swap the model. Both values are logged with every hint.

**One writer, two users.** The live page and the offline evaluation (`evals/replay.js`) import
the same `app/hint-writer.js`. A separate evaluation prompt would test one thing and ship another.

**The leak guard.** A hint that contains the answer silently turns Arm A into Arm B. So plain code
rejects any hint with a runnable query, or with the reference query's key clause.

**When a hint is rejected.** The writer gets 2 tries. If both fail, the learner gets that
question's own hand-written backup hint. The log records which they got: `model` or `fallback`.

**Every question has its own backup hint, written from real attempt data.** One generic string
would either say nothing or, on a short query, be the answer. The backup hints pass the same leak
check, at authoring time and again before they are shown. A backup that leaks is replaced by a
neutral line, logged as `fallback_blocked`.

**So what:** the backup hint is the one hint a learner may certainly see, so it gets checked as
hard as a generated one.

---

## 6. The questions

**Frozen 19 Sep: 28 questions, 16 for practice and 12 held back for the test,** in
`study-questions/`. Reasons in `study-questions/DECISIONS.md`.

**One concept: `GROUP BY` and `HAVING`.** Joins were dropped: in round 2, 3 of 7 testers tried
one and none solved it.

**Four sub-skills. Three are practised. One is held back as the control.**

| | sub-skill | practised? |
|---|---|---|
| S1 | group, with one total per group | yes, 3 questions |
| S2 | filter rows **before** grouping: `WHERE` with `GROUP BY` | yes, 6 questions |
| S3 | filter groups **after** totalling: `HAVING` | yes, 7 questions |
| S4 | all three in one query, with `ORDER BY` | **no, the control** |

S4 is not new material. It is S2 and S3 combined. A learner who can do each separately may or may
not combine them, and that combining is the transfer the study looks for.

**Every test question is paired with the practice question that taught its sub-skill.** So a
result can be read as "better on this skill", not just "more comfortable with the editor".

**How the test reads.** Better on S1 to S3 with S4 flat rules out familiarity. Flat everywhere is
a null result. S4 rising with the rest means the sub-skills are not separate.

**Known weakness:** practice is uneven, 3 / 6 / 7. Three S1 candidates were cut, because round 2
showed questions solved on the first try trigger no help, so they test nothing. That leaves S1
measured on thinner practice. Recorded, not smoothed over.

Both screening rounds' questions are burned, and the study uses a different database as well.

---

## 7. Cut on purpose

| cut | why |
|---|---|
| Skill estimator | Needs many observations per skill. With 6 people and a short set, it would be noise dressed as a model |
| Four help levels | With a gate in front, a gentle nudge adds nothing. A partial solution gives away too much. Two levels |
| Changing N per learner | A second variable the sample cannot separate |
| A third group with no AI | Six people cannot fill three groups. The claim is narrowed to match (§2) |
| Re-showing unmastered questions | Would give Arm A extra practice Arm B does not get |
| Self-explanation prompts | Not on the path to the test |
| Accounts, profiles, more screens | The rubric asks that it works for someone else, not that it looks like a product |
| A database table for logs | Learners copy their log and send it. Six people pasting a file is not the bottleneck. Decided 19 Sep |

---

## 8. Decisions closed before any data

| decision | closed | answer |
|---|---|---|
| N, attempts after a hint before the answer | 13 Sep | 2, for everyone |
| Does a syntax error get past the gate? | 13 Sep, reason added 14 Sep | yes (§4) |
| What counts as a real attempt | 14 Sep | the substance rule (§4) |
| The thresholds for reading a result | 14 Sep | `ANALYSIS-PLAN.md` §4, ten checks |
| The scoring rule | 19 Sep | `study-questions/grade_rule.py` |
| Who goes in which arm | 19 Sep | `screener/ARM-ASSIGNMENT.md` |

---

## 9. Counter-metrics

**Satisfaction is not a falsifier.** The research predicts Arm A will rate the tool lower while
scoring higher. What people *do* is the falsifier: unfinished sessions, no-shows at the test.

**Losing people unevenly is the bigger threat.** Report who completed the test, per person, by arm.

Wu and colleagues found a motivation cost when help is taken away. In this design, that cost
lands on Arm B on test day: they had full answers, then lost them. Three 1-to-5 questions on test
day measure it, at almost no build cost.
