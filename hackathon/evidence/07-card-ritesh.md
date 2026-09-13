# Ritesh — what actually happened in your SQL answers

Written by hand, 13 Sep 2026. Every claim below was re-run against the real schema
before I sent it.

---

## Your score was 0 out of 10. Here is what the 0 is measuring.

You attempted six questions. On **all six you picked the correct operation.** You knew
when to filter, when to group, when to join, and when a condition belonged in HAVING
rather than WHERE. That is the part that is hard to teach.

What was missing was the exact spelling of the keywords and the exact names of the
tables. That is the part a database tells you in one second, and my test forbade you
from asking it.

So I ran an experiment on your answers. **I repaired keyword spelling and table names
only. I changed none of your logic — not a column, not a condition, not a join.**

| | your operation | after form repair |
|---|---|---|
| Q1 filter + sort | right | 0 rows — see below |
| Q2 filter + sort | right | wrong threshold — see below |
| Q3 group + count + tiebreak | right | **exact match** |
| Q4 group + average + HAVING | right | right values, one column short |
| Q5 join two tables + filter | right | **exact match** |
| Q6 join two tables + filter | right | **exact match** |

**Three exact matches, including both joins.** Q5 and Q6 are tier 3 — the hardest
questions you reached, and harder than anything the people who outscored you attempted.

---

## The form problem, precisely

Three keyword pairs got fused into one word:

```sql
ORDERBY     -->  ORDER BY
GROUPBY     -->  GROUP BY
```

These are two words each. The database's parser splits on whitespace before it does
anything else, so `ORDERBY` isn't a mangled keyword to it — it's an unknown word in a
position where no word belongs. That's why every one of your six stopped at the first
one of these, and why you never saw a single result.

And the table names are plural: `customers`, `products`, `orders`, `order_items`. You
wrote `customer`, `product`, `order`. `order` is additionally a reserved word in SQL —
it's the first half of `ORDER BY` — so even the correct singular would have needed
quoting.

---

## Question by question

**Q3 — exact match.** You wrote:

```sql
SELECT city,count(*) from customers GROUPBY ="city" ORDERBY DESC count , city;
```

Repair the two fused keywords and drop the stray `=`:

```sql
SELECT city, count(*) from customers GROUP BY city ORDER BY count(*) DESC, city
```

5 rows, exactly the reference answer. Note what you did here that most people didn't:
you added `, city` as a second sort key. Three cities tie at 2 customers each, and you
were the one who noticed the tie needed breaking. That was not an accident.

**Q5 — exact match.** Your join, with table names corrected and the ON clause put in
order:

```sql
SELECT orders.id, customers.name, order_date FROM orders
JOIN customers ON customers.id = orders.customer_id
WHERE status = 'completed' ORDER BY orders.id
```

14 rows, exact. You had the right two tables, the right link between them, and the
right filter.

**Q6 — exact match.** Same story, `order_items` joined to `products`, filtered to
order 3. 2 rows, exact.

**Q4 — logic right, one column missing.** You wrote `SELECT avg()`. With `avg(price)`
and the plural table, your grouping and your HAVING produce exactly the right three
averages — 6724.25, 8899.33, 14766.33. The only thing wrong is that you never asked for
the `category` column, so the output has the numbers without their labels. The thinking
was complete; the SELECT list wasn't.

**Q1 — a real one.** You wrote `city == "bengaluru"`. Two things: `==` works in SQLite
but is not standard SQL (`=` is), and more importantly text comparison is
**case-sensitive**. `'bengaluru'` and `'Bengaluru'` are different strings. Your query is
structurally perfect and returns zero rows. This one an execution would have caught
instantly — and it is the single most common way a correct-looking query silently
returns nothing.

**Q2 — also a real one.** The question said products costing more than **5000**. You
filtered on **500**. That's a reading slip, not a SQL gap, and it returned 12 rows where
6 were wanted.

---

## What I got wrong

The exercise forbade you from running anything. Then I graded it with a tool that only
scores queries that run.

Six of your queries stopped at a missing space. You never once saw a result set, never
once saw an error message, and never got the one piece of feedback — *ORDER BY is two
words* — that would have unlocked all six. I built a test that measured your recall of
keyword spelling from memory, called the result "SQL ability", and wrote 0 next to your
name.

You can join tables. Almost nobody who took this could.
