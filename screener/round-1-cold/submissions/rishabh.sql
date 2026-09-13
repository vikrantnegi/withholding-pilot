-- Q1
SELECT name,city from customers orderby name;
-- Q2
SELECT name,price from products where price>5000 orderby desc;
-- Q3
-- Q4
SELECT price from products orderby category where price >5000
-- Q5
SELECT name  from customers orderby (SELECT customer_id,id,order_date from orders where status.equals('completed') orderby id)
-- Q6
-- Q7
-- Q8
SELECT name from customers(SELECT status from orders where status.equals('completed)) orderby name
-- Q9
-- Q10
