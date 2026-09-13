-- Q1
SELECT name,city from customers where city=="bengaluru"  ORDERBY ASC;
-- Q2
SELECT name,price from products where price > 500 ORDERBY DESC;
-- Q3
SELECT city,count(*) from customers GROUPBY ="city" ORDERBY DESC count , city;
-- Q4
SELECT avg() from product GROUPBY category HAVING avg()>5000 ORDERBY asc name,;
-- Q5
SELECT orderID,name,date from order JOIN ON customer, order where status=='completed' ORDERBY ASC;
-- Q6
SELECT name , quantity  JOIN product ON order where id='3' ;
-- Q7
-- Q8
-- Q9
-- Q10
