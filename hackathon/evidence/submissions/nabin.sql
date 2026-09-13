-- Q1
SELECT name, city FROM customers
WHERE city = 'Bengaluru'
ORDER BY name ASC;
-- Q2
SELECT name,price FROM products where price > 5000
ORDER BY price DESC;
-- Q3
SELECT city, COUNT(*) as custCount FROM customers
GROUP BY city
ORDER BY custCount DESC, city ASC;
-- Q4
SELECT category, AVG(price) as avgPrice FROM products HAVING avgPrice >5000 GROUP BY category ORDER BY category ASC;
-- Q5
SELECT orders.order_id, customers.customer_name, orders.order_date
FROM orders JOIN customers ON customers.id = orders.custmer_id
WHERE orders.status ='completed'
ORDER BY ORDERS.id ASC;
-- Q6
SELECT products.name , products.quantity
FROM order_items JOIN products;
-- Q7
-- Q8
-- Q9
-- Q10
