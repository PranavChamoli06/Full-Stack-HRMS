CREATE TABLE notification_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    recipient VARCHAR(255),
    message TEXT,
    status VARCHAR(50),
    error_message TEXT,
    created_at DATETIME
);