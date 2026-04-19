CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    reservation_id BIGINT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    status VARCHAR(20) NOT NULL,

    payment_mode VARCHAR(20),

    payment_gateway VARCHAR(50),

    transaction_id VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(id)
        ON DELETE CASCADE
);