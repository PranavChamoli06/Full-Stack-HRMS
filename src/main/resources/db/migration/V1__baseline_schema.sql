-- ============================================
-- HRMS DATABASE SCHEMA
-- ============================================

-- ======================
-- USERS (STAFF / ADMIN)
-- ======================
CREATE TABLE users (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role ENUM('ADMIN','MANAGER','STAFF'),
created_at DATETIME,
updated_at DATETIME
);

-- ======================
-- CUSTOMERS (PUBLIC USERS)
-- ======================
CREATE TABLE customers (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL,
phone VARCHAR(20) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- ROOMS
-- ======================
CREATE TABLE rooms (
room_number INT PRIMARY KEY,
room_type ENUM('Standard','Deluxe','Suite') NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- RESERVATIONS (CORE TABLE)
-- ======================
CREATE TABLE reservations (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT,
customer_id BIGINT,
room_number INT,
full_name VARCHAR(100),
email VARCHAR(100),
phone VARCHAR(20),
check_in_date DATE NOT NULL,
check_out_date DATE NOT NULL,
status ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED') DEFAULT 'PENDING',
booking_reference VARCHAR(50) UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
CONSTRAINT fk_room FOREIGN KEY (room_number) REFERENCES rooms(room_number)
);

-- ======================
-- ROOM PRICING
-- ======================
CREATE TABLE room_pricing (
id INT AUTO_INCREMENT PRIMARY KEY,
room_type ENUM('Standard','Deluxe','Suite') NOT NULL,
price_per_night DECIMAL(10,2) NOT NULL,
effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
effective_to TIMESTAMP
);

-- ======================
-- SPECIAL PRICING
-- ======================
CREATE TABLE special_pricing (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
date DATE NOT NULL UNIQUE,
multiplier DECIMAL(5,2) NOT NULL,
description VARCHAR(255)
);

-- ======================
-- AUDIT LOGS
-- ======================
CREATE TABLE audit_logs (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255),
action VARCHAR(255),
entity_type VARCHAR(100),
details VARCHAR(500),
created_at DATETIME,
updated_at DATETIME
);

-- ======================
-- INDEXES (PERFORMANCE)
-- ======================
CREATE INDEX idx_reservation_dates
ON reservations (room_number, check_in_date, check_out_date);

CREATE INDEX idx_customer_email
ON customers (email);

-- ============================================
-- END OF FILE
-- ============================================


