CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50),
    type VARCHAR(50),
    price_per_night DOUBLE,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    check_in_date DATE,
    check_out_date DATE,
    status VARCHAR(50),
    user_id BIGINT,
    room_id BIGINT,
    created_at DATETIME,
    updated_at DATETIME
);