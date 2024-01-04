CREATE DATABASE IF NOT EXISTS `marketplace`;

CREATE TABLE users (
  id binary(16) PRIMARY KEY NOT NULL DEFAULT (UUID_TO_BIN(uuid())),
  username VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  recovery_token TEXT,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  image VARCHAR(255) DEFAULT 'users-images/default.jpg'
);

-- CREATE TABLE customers (
--   user_id BINARY(16) PRIMARY KEY NOT NULL,
--   score DECIMAL(2,1) DEFAULT '0.0',
--   FOREIGN KEY(user_id) REFERENCES users(id)
-- );

-- CREATE TABLE sellers (
--   user_id BINARY(16) PRIMARY KEY NOT NULL,
--   score DECIMAL(2,1) DEFAULT '0.0',
--   sales SMALLINT DEFAULT '0',
--   FOREIGN KEY(user_id) REFERENCES users(id)
-- );

CREATE TABLE admins (
    user_id BINARY(16) PRIMARY KEY NOT NULL, 
    role VARCHAR(10) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users(id, username, name, lastname, email, password, city, state) VALUES 
(UUID_TO_BIN(UUID()), 'admin1', 'admin', 'admin', 'admin@admin.com', '$2b$12$feSQTa1FZKXhB8dI/KJCKOsugQIozFrxHVzW92xq6n9TFwzZ.yHUS', 'durango', 'durango');

-- Run this query when you get the admin's id, in order to have a superadmin role (run the login endpoint in the "auth.end-points.http" file and change the id)
-- INSERT INTO admins(user_id, role) VALUES 
-- (UUID_TO_BIN('fc8c1926-7762-11ee-8992-0242ac120002'), 'superadmin')

CREATE TABLE categories (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE products (
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name TEXT NOT NULL,
    stock SMALLINT NOT NULL,
    price FLOAT NOT NULL,
    score DECIMAL(2,1) NOT NULL,
    seller_id BINARY(16) NOT NULL,
    category_id INT NOT NULL,
    active BOOLEAN DEFAULT true,
    description TEXT,
    FOREIGN KEY(seller_id) REFERENCES users(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
);


CREATE TABLE comment (
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    body VARCHAR(255) NOT NULL, 
    is_comment BOOLEAN DEFAULT true,
    customer_id BINARY(16),
    product_id BINARY(16),
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE sales (
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    total FLOAT NOT NULL,
    sale_key VARCHAR(5) NOT NULL UNIQUE,
    seller_id BINARY(16) NOT NULL,
    customer_id BINARY(16) NOT NULL,
    created_at DATE DEFAULT (NOW()),
    FOREIGN KEY(seller_id) REFERENCES users(id),
    FOREIGN KEY(customer_id) REFERENCES users(id)
);

CREATE TABLE sales_products (
    product_id BINARY(16) NOT NULL,
    sale_id BINARY(16) NOT NULL,
    amount SMALLINT NOT NULL,
    unit_price FLOAT NOT NULL, 
    sub_total FLOAT NOT NULL,
    PRIMARY KEY(product_id, sale_id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(sale_id) REFERENCES sales(id)
);

CREATE TABLE sale_points (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    address TEXT NOT NULL,
    opening_time TIME NOT NULL,
    close_time TIME NOT NULL
);

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    image_url VARCHAR(255) NOT NULL UNIQUE,
    product_id BINARY(16),
    sale_point_id BINARY(16),
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(sale_point_id) REFERENCES sale_points(id)
); 

CREATE TABLE favorites_products (
    customer_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    PRIMARY KEY(customer_id, product_id),
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

