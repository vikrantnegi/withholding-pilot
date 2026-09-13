# Gaurav — what actually happened in your SQL answers

Written by hand, 13 Sep 2026. Every claim below was re-run against the real schema
before I sent it.

---

## Your score was 0 out of 10. Here is why that number is meaningless.

You answered four questions. **All four were the correct query.** Not "close" — correct.
Three of them become exactly right if you delete two characters. The fourth needs one
extra word.

The grader I wrote marks by running your query and comparing rows. Yours never ran. So
it scored them the same as four blanks, which is how you and someone who wrote nothing
ended up with the same number.

---

## The one thing that killed you

You wrote the sort direction in double quotes, every time:

```sql
Order by name "ASC"
Order by price "DESC"
Order by category "ASC"
```

In SQL, **double quotes mean "this is the name of a thing"** — a column, a table.
Single quotes mean "this is a piece of text". They are two different languages sharing
one keyboard key.

So `ORDER BY name "ASC"` doesn't read as *sort ascending*. It reads as *sort by the
column `name`, and by the way call it "ASC"* — an alias. You can't rename a column in an
ORDER BY clause, so the database stopped at that exact spot:

```
near ""ASC"": syntax error
```

`ASC` and `DESC` are instructions, not values. They are never quoted. Most of the time
you can drop them entirely — `ORDER BY name` is already ascending.

---

## Your four answers, run properly

**Q1 and Q2 — correct, quotes deleted, nothing else touched.**

```sql
Select name, city from customers Where city = "Bengaluru" Order by name ASC   -- 3 rows, exact match
Select name, price from products Where price > 5000 Order by price DESC       -- 6 rows, exact match
```

**Q4 — correct, quotes deleted, nothing else touched.** This is the hardest one you
attempted. GROUP BY with a HAVING filter on the aggregate — you had the whole shape
right, including the thing most people get wrong, which is knowing that the 5000 filter
belongs in HAVING and not in WHERE.

```sql
Select category, AVG(price) From products Group by category
Having AVG(price) > 5000 Order By category ASC                                -- 3 rows, exact match
```

**Q3 — the one that needed more than the quotes.** Your grouping was right. But after
deleting the quotes:

```sql
Order by count DESC     -->  no such column: count
```

You sorted by something you never named. `Count(city)` in the SELECT list creates a
value with no name attached, so `count` in the ORDER BY points at nothing. Either name
it, or repeat the expression:

```sql
Select city, Count(city) AS count From customers Group by city Order by count DESC
```

---

## The part worth actually remembering

Look at Q1 again. You used double quotes twice in one query:

```sql
Where city = "Bengaluru"   <- survived
Order by name "ASC"        <- fatal
```

The first one only survived because SQLite has a forgiving misfeature: if you
double-quote something that isn't a real column name, it shrugs and treats it as text.
**Postgres does not do this.** On Postgres — which is what most production databases you
will touch actually are — `WHERE city = "Bengaluru"` fails with *column "Bengaluru" does
not exist*.

So the habit didn't cost you four questions. It's carrying a bug that a real database
would have caught the first time, and a forgiving one has been hiding from you.

**Single quotes for text. Double quotes for names. Nothing at all for keywords.**

---

## And round 2 settles it

Ten days later I sent you the same schema with a Run button and three questions at the
same difficulty. You solved M1 in 3 attempts and M2 on the first try, in about two
minutes total.

Your second M1 attempt is the whole story in one line:

```sql
ORDER BY COUNT(category) DESC category ASC     -->  near "category": syntax error
```

A missing comma — the same family of slip as the quoted `ASC`. You read the error and
fixed it in 20 seconds. That is the loop round 1 took away from you.

Same person, same schema, same tier. 0/10 became solved-in-three. Nothing about you
changed in between.

---

## What I got wrong

You didn't get to run these. I asked for queries written cold, on paper, no execution —
and then graded them with a tool that only understands queries that run. That's my
design error, not your gap.

One execution cycle would have shown you `near ""ASC"": syntax error` on question one,
and you would have fixed all four before sending. The test measured your typing under a
rule I invented. It did not measure whether you can write SQL. You can.
