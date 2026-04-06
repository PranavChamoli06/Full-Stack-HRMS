-- USERS
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','MANAGER','STAFF'),
    created_at DATETIME,
    updated_at DATETIME
);

-- ROOMS
CREATE TABLE rooms (
    room_number INT PRIMARY KEY,
    room_type ENUM('Standard','Deluxe','Suite') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- RESERVATIONS
CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    room_number INT,
    guest_name VARCHAR(100),
    guest_email VARCHAR(100),
    guest_phone VARCHAR(20),
    check_in_date DATE,
    check_out_date DATE,
    status ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_number) REFERENCES rooms(room_number)
);

-- ROOM PRICING
CREATE TABLE room_pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_type ENUM('Standard','Deluxe','Suite') NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effective_to TIMESTAMP
);

-- SPECIAL PRICING
CREATE TABLE special_pricing (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    multiplier DECIMAL(5,2) NOT NULL,
    description VARCHAR(255)
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    action VARCHAR(255),
    details VARCHAR(500),
    created_at DATETIME,
    updated_at DATETIME
);