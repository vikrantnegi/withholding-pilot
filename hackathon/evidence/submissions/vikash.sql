-- Q1
SELECT name,city FROM customers ORDER BY city ASC;
-- Q2
SELECT name,price FROM products WHERE price>500 ORDER BY price DESC;
-- Q3
SELECT city,count FROM (SELECT city,count(*) AS count FROM customers GRPUP BY city ORDER BY count DESC) ORDER BY city;
-- Q4
SELECT category,AVG(price) AS avg FROM products GROUP BY price WHERE avg>5000 ORDER BY category;
-- Q5
SELECT o.id,c.name,o.order_date FROM orders o LEFT JOIN customers c ON o.customer_id=c.id  WHERE status='completed' ORDER BY o.id;
-- Q6
SELECT p.name,oi.quantity FROM order_items oi LEFT JOIN orders o oi.order_id=o.id LEFT JOIN products p on oi.product_id=p.id WHERE o.id=3 ORDER BY price DESC;
-- Q7
-- Q8
SELECT c.name FROM orders o oi.order_id=o.id LEFT JOIN customers c on oi.customer_id=c.id WHERE o.status!='completed' ORDER BY c.name;
-- Q9
-- Q10
