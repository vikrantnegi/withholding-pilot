-- Q1
Select name,city from customers where city = 'Bengaluru' ORDER BY ASC
-- Q2
Select name, price from products where price > 5000 ORDER BY DESC
-- Q3
Select name,city from customers
-- Q4
select id,AVG(price)   from Products  , GROUP BY category HAVING AVG(price) > 5000
-- Q5
Select id,order_date from orders Where status = completed
-- Q6
-- Q7
-- Q8
-- Q9
-- Q10
