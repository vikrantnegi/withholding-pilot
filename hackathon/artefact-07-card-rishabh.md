# Rishabh — what your 47 minutes actually show

Written by hand, 13 Sep 2026, from your round-2 log. Nothing here is inferred; every
number is counted from the file you sent back.

---

## What the log says

- **81 runs. 80 errors. Zero queries that reached the database.**
- 09:05 to 09:52. Forty-seven minutes.
- 16 attempts on M1. **63 on M2.** Nobody else in the group went past 16.

You did not give up. You are, by some distance, the most persistent person who took this.
And you got nothing back for it. That is a failure of the tool, and I want to show you
exactly where it failed, because the fix is small and it is not in your head.

---

## The wall you were hitting

Your M1 query, run five times without a character changing:

```sql
Select category,count As prodcutcount from products
GroupBy category havingcount>=3 orderby prodcutcount DESC, category
```

The error came back: `near "category": syntax error`.

Three separate things in there, and the error message named none of them:

**1. `GroupBy` is not a word. `GROUP BY` is two words.** Same for `orderby` → `ORDER BY`.
The parser splits on whitespace before it understands anything, so `GroupBy` isn't a
misspelled keyword to it — it's an unknown word sitting where no word belongs. It then
reports the position it choked on, which is the token *after* the real problem. That is
why it kept saying `near "category"` when `category` was fine.

**2. `havingcount>=3` has two words fused too** — `HAVING count >= 3`.

**3. `count` needs its argument: `COUNT(*)` or `COUNT(category)`.** Bare `count` is the
name of a function, not a value.

Your M2 query, run three times identically at the end:

```sql
Select category,MAX(price) AS Highest FROM products
GROUPBY Highest > 10000 ORDERBY category ASC
```

Same fused keywords — and one real logic point: `GROUP BY` takes the column you are
grouping *by*, and the condition on the aggregate goes in `HAVING`:

```sql
SELECT category, MAX(price) AS Highest FROM products
GROUP BY category HAVING MAX(price) > 10000 ORDER BY category ASC
```

That is your query. Two keywords unfused, one clause moved.

**And M3:** you wrote `SELECT status.equals('cancelled')`. That's a method call — you
reached for the language you actually write every day. SQL has no methods; comparison is
`status = 'cancelled'`. That's not a gap in your reasoning, it's a model from another
language arriving first.

---

## The thing I actually owe you an apology for

Count the error messages: **37 of them said `near "highest"`. Fifteen more said
`near "Highest"`. Sixteen said `near "category"`.**

Every one of those told you *where the parser stopped*. Not one told you *what was
wrong*. You read the same sentence 37 times and it never once said "GROUP BY is two
words."

That is not you failing to learn from feedback. That is a tool emitting a string that
looks like feedback and carries no instruction. You behaved exactly correctly — you kept
trying — and the loop you were in had no exit, because the exit was a piece of
information the page was never going to give you.

---

## What this changes in what I'm building

The system I'm designing withholds help until the learner has made one attempt that
**runs**. On your log, that rule never fires. Eighty attempts, zero runs, zero help.
The person trying hardest gets locked out, and my own logs would have recorded you as
"did not engage."

I am changing that rule because of your file specifically. A failed attempt is still an
attempt. And I need a second rule I hadn't thought of until I read your log: pressing Run
on a query you haven't changed can't count as a new attempt, or the tool would have
started talking at you on your second identical press instead of your sixteenth.

You cost me an assumption. That's the most useful thing anyone gave me this week.
