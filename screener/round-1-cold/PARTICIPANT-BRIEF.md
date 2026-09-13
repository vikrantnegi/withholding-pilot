# SQL exercise — 30 minutes

Thanks for helping out. Please read this bit before you start, it matters.

## What this is

I'm running an experiment and I need to know where people
actually are with SQL before I design it. This is **not a test of you**

Most people will not finish all ten. That is the point. The questions get harder
on purpose so I can find where the difficulty should sit. If you get stuck
halfway down, you have given me exactly the information I need.

You can stop at any time, and you can pull out of the whole project later with
no explanation needed. Nothing about this is tied to work.

## Rules

- **On your own.** No Google, no ChatGPT/Claude, no asking a colleague, no old
  code to copy from.
- **Don't run the queries.** Just write what you think is right. If you're
  unsure, write your best attempt anyway — a wrong attempt tells me more than a
  blank.
- **30 minutes.** If you run out of time, stop and send what you have.
- Leave anything blank that you genuinely have no idea about.

## The database

Four tables. Assume they're already filled with data.

**customers**
| column | type |
|---|---|
| id | integer |
| name | text |
| city | text |
| signup_date | date |

**products**
| column | type |
|---|---|
| id | integer |
| name | text |
| category | text |
| price | number |

**orders**
| column | type |
|---|---|
| id | integer |
| customer_id | integer → customers.id |
| order_date | date |
| status | text — either `completed` or `cancelled` |

**order_items**
| column | type |
|---|---|
| id | integer |
| order_id | integer → orders.id |
| product_id | integer → products.id |
| quantity | integer |
| unit_price | number — price paid per unit |

A few things that are true about the data: some customers have never ordered
anything, some orders were cancelled, and some products have never been sold.

## The questions

Write one SQL query for each. Return exactly the columns asked for, in the order
listed.

**1.** The name and city of every customer in Bengaluru, sorted by name A–Z.

**2.** The name and price of every product costing more than 5000, most
expensive first.

**3.** How many customers are in each city. Return the city and the count.
Sort by count, highest first; where two cities tie, sort those by city name.

**4.** The average product price for each category, but only for categories
where that average is above 5000. Return the category and the average.
Sort by category name.

**5.** Every **completed** order, with the name of the customer who placed it.
Return the order id, the customer name, and the order date. Sort by order id.

**6.** For order number 3 only: the name of each product in it and how many were
ordered. Return product name and quantity.

**7.** Total revenue per customer, counting **completed orders only**. Revenue
for a line is quantity × unit_price. Return the customer name and their total.
Sort by total, highest first.

**8.** The names of customers who have never placed a completed order.
Sort by name.

**9.** For every customer who has at least one completed order: their most
recent completed order. Return the customer name, that order's date, and the
total value of that order. Sort by customer name.

**10.** Within each product category, rank the products by total quantity sold
across completed orders. Return the category, the product name, the total
quantity, and its rank within its category. Sort by category, then rank.

## Sending it back

Paste your answers in one message or file, numbered, like this:

```
-- Q1
SELECT ...;

-- Q2
SELECT ...;
```

Blank is fine. Just keep the `-- Q1` labels so I can line them up.
