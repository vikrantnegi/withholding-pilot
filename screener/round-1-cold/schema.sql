-- Screener schema: small e-commerce store.
-- Portable subset: runs on Supabase/Postgres AND on SQLite (so you can grade with zero setup).

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  city        TEXT NOT NULL,
  signup_date DATE NOT NULL
);

CREATE TABLE products (
  id       INTEGER PRIMARY KEY,
  name     TEXT NOT NULL,
  category TEXT NOT NULL,
  price    NUMERIC(10,2) NOT NULL
);

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  order_date  DATE NOT NULL,
  status      TEXT NOT NULL          -- 'completed' or 'cancelled'
);

CREATE TABLE order_items (
  id         INTEGER PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);

-- Deliberate traps in the data:
--   customers 9 and 10 have no orders at all
--   customer 7 (Priya Das) has orders, but both are cancelled  <- separates
--     "no rows in orders" from "no completed orders" in Q8
--   product 12 (Rain Jacket) was never ordered
--   Bengaluru has 3 customers; Delhi/Mumbai/Pune have 2 each   <- forces a tiebreak in Q3

INSERT INTO customers (id, name, city, signup_date) VALUES
 (1,'Aarti Menon','Bengaluru','2024-01-15'),
 (2,'Rohit Sharma','Delhi','2024-02-03'),
 (3,'Neha Gupta','Bengaluru','2024-02-20'),
 (4,'Imran Qureshi','Mumbai','2024-03-11'),
 (5,'Sneha Rao','Pune','2024-04-02'),
 (6,'Vikas Nair','Bengaluru','2024-04-18'),
 (7,'Priya Das','Chennai','2024-05-05'),
 (8,'Karan Mehta','Delhi','2024-05-22'),
 (9,'Divya Iyer','Mumbai','2024-06-09'),
 (10,'Sameer Joshi','Pune','2024-06-25');

INSERT INTO products (id, name, category, price) VALUES
 (1,'Wireless Mouse','Electronics',899.00),
 (2,'Mechanical Keyboard','Electronics',4500.00),
 (3,'27-inch Monitor','Electronics',18999.00),
 (4,'USB-C Hub','Electronics',2499.00),
 (5,'Office Chair','Furniture',12500.00),
 (6,'Standing Desk','Furniture',24999.00),
 (7,'Bookshelf','Furniture',6800.00),
 (8,'Espresso Machine','Kitchen',15999.00),
 (9,'Steel Cookware Set','Kitchen',3200.00),
 (10,'Air Fryer','Kitchen',7499.00),
 (11,'Cotton T-Shirt','Apparel',799.00),
 (12,'Rain Jacket','Apparel',3499.00);

INSERT INTO orders (id, customer_id, order_date, status) VALUES
 (1,1,'2024-03-01','completed'),
 (2,1,'2024-04-12','completed'),
 (3,2,'2024-03-15','completed'),
 (4,3,'2024-04-01','cancelled'),
 (5,3,'2024-05-10','completed'),
 (6,4,'2024-04-20','completed'),
 (7,5,'2024-05-01','completed'),
 (8,6,'2024-05-15','completed'),
 (9,7,'2024-06-01','cancelled'),
 (10,8,'2024-06-10','completed'),
 (11,1,'2024-06-20','cancelled'),
 (12,2,'2024-07-02','completed'),
 (13,4,'2024-07-15','completed'),
 (14,6,'2024-07-20','completed'),
 (15,5,'2024-08-01','completed'),
 (16,7,'2024-08-05','cancelled'),
 (17,8,'2024-08-12','completed'),
 (18,3,'2024-08-20','completed');

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
 (1,1,1,2,899.00),(2,1,4,1,2499.00),
 (3,2,5,1,12500.00),
 (4,3,3,1,18999.00),(5,3,2,1,4500.00),
 (6,4,11,3,799.00),
 (7,5,10,1,7499.00),
 (8,6,8,1,15999.00),(9,6,9,2,3200.00),
 (10,7,7,1,6800.00),
 (11,8,6,1,24999.00),
 (12,9,1,1,899.00),(13,9,11,2,799.00),
 (14,10,2,1,4500.00),(15,10,4,2,2499.00),
 (16,11,3,1,18999.00),
 (17,12,5,2,12500.00),
 (18,13,10,1,7499.00),(19,13,9,1,3200.00),
 (20,14,1,3,899.00),
 (21,15,8,1,15999.00),
 (22,16,6,1,24999.00),
 (23,17,7,2,6800.00),
 (24,18,2,1,4500.00),(25,18,11,5,799.00);
