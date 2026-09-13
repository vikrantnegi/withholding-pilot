-- Answer key for the mini-screen. DO NOT SEND.

-- M1
SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) >= 3 ORDER BY COUNT(*) DESC, category ASC;

-- M2
SELECT category, MAX(price) FROM products GROUP BY category HAVING MAX(price) > 10000 ORDER BY category ASC;

-- M3
SELECT o.id, c.name, c.city, o.order_date FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status='cancelled' ORDER BY o.order_date ASC, o.id ASC;
