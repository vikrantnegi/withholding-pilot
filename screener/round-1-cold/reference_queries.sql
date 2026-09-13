-- ANSWER KEY. Do not send this to participants.
-- All ten verified against schema.sql. Tier shown per question.
-- Grading is result-set match, so any query returning the same rows is correct.

-- Q1  [T1 single table]  -> 3 rows
SELECT name, city FROM customers WHERE city = 'Bengaluru' ORDER BY name;

-- Q2  [T1 single table]  -> 6 rows
SELECT name, price FROM products WHERE price > 5000 ORDER BY price DESC;

-- Q3  [T2 aggregate]  -> 5 rows
SELECT city, COUNT(*) AS customer_count
FROM customers GROUP BY city
ORDER BY customer_count DESC, city;

-- Q4  [T2 aggregate + HAVING]  -> 3 rows
SELECT category, AVG(price) AS avg_price
FROM products GROUP BY category HAVING AVG(price) > 5000
ORDER BY category;

-- Q5  [T3 two-table join]  -> 14 rows
SELECT o.id AS order_id, c.name AS customer_name, o.order_date
FROM orders o JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'completed'
ORDER BY o.id;

-- Q6  [T3 two-table join]  -> 2 rows
SELECT p.name AS product_name, oi.quantity
FROM order_items oi JOIN products p ON p.id = oi.product_id
WHERE oi.order_id = 3
ORDER BY p.name;

-- Q7  [T4 join + aggregate + filter]  -> 7 rows
SELECT c.name AS customer_name, SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY c.name
ORDER BY total_revenue DESC;

-- Q8  [T4 negation]  -> 3 rows: Divya Iyer, Priya Das, Sameer Joshi
--     The discriminator. Anyone who answers "customers with no rows in orders"
--     gets 2 of 3 and misses Priya Das, who has two cancelled orders.
SELECT name FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders WHERE status = 'completed')
ORDER BY name;

-- Q9  [T5 correlated subquery / window]  -> 7 rows
SELECT c.name AS customer_name, o.order_date,
       SUM(oi.quantity * oi.unit_price) AS order_value
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'completed'
  AND o.order_date = (SELECT MAX(o2.order_date) FROM orders o2
                      WHERE o2.customer_id = c.id AND o2.status = 'completed')
GROUP BY c.name, o.order_date
ORDER BY c.name;

-- Q10 [T5 window function]  -> 11 rows
SELECT p.category, p.name AS product_name,
       SUM(oi.quantity) AS total_quantity,
       RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) AS rank_in_category
FROM products p
JOIN order_items oi ON oi.product_id = p.id
JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'completed'
GROUP BY p.category, p.name
ORDER BY p.category, rank_in_category, p.name;
