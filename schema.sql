-- =============================================
-- Bike Service Management System — Schema
-- Database: bike_service_db
-- =============================================

CREATE DATABASE IF NOT EXISTS bike_service_db;
USE bike_service_db;

-- 1. Customer
CREATE TABLE IF NOT EXISTS customer (
    Customer_id INT PRIMARY KEY AUTO_INCREMENT,
    Name        VARCHAR(50)  NOT NULL,
    Phone       VARCHAR(15),
    Address     VARCHAR(100)
);

-- 2. Bike
CREATE TABLE IF NOT EXISTS bike (
    Bike_id         INT PRIMARY KEY AUTO_INCREMENT,
    Registration_no VARCHAR(20) UNIQUE,
    Model           VARCHAR(50),
    Brand           VARCHAR(50),
    Customer_id     INT,
    FOREIGN KEY (Customer_id) REFERENCES customer(Customer_id) ON DELETE SET NULL
);

-- 3. Mechanic
CREATE TABLE IF NOT EXISTS mechanic (
    Mechanic_id    INT PRIMARY KEY AUTO_INCREMENT,
    Name           VARCHAR(50) NOT NULL,
    Phone          VARCHAR(15),
    Specialisation VARCHAR(50)
);

-- 4. Service
CREATE TABLE IF NOT EXISTS service (
    Service_id   INT PRIMARY KEY AUTO_INCREMENT,
    Service_date DATE,
    Service_type VARCHAR(50),
    Cost         DECIMAL(10, 2),
    Problem_desc VARCHAR(200),
    Bike_id      INT,
    Mechanic_id  INT,
    FOREIGN KEY (Bike_id)     REFERENCES bike(Bike_id)         ON DELETE SET NULL,
    FOREIGN KEY (Mechanic_id) REFERENCES mechanic(Mechanic_id) ON DELETE SET NULL
);

-- 5. Payment
CREATE TABLE IF NOT EXISTS payment (
    Payment_id   INT PRIMARY KEY AUTO_INCREMENT,
    Payment_date DATE,
    Amount       DECIMAL(10, 2),
    Payment_mode VARCHAR(20),
    Service_id   INT,
    FOREIGN KEY (Service_id) REFERENCES service(Service_id) ON DELETE SET NULL
);
