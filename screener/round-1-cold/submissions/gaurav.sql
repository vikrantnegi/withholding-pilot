-- Q1
Select name, city from customers
Where city = "Bengaluru"
Order by name "ASC"
-- Q2
Select name, price from products
Where price >5000
Order by price "DESC";
-- Q3
Select city,Count(city)
From customers
Group by city
Order by count "DESC"
-- Q4
Select category, AVG(price)
From products
Group by category
Having AVG(price) > 5000
Order By category "ASC"
-- Q5
-- Q6
-- Q7
-- Q8
-- Q9
-- Q10
