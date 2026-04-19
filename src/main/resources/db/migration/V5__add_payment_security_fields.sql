ALTER TABLE payments
ADD COLUMN razorpay_order_id VARCHAR(100),
ADD COLUMN razorpay_signature VARCHAR(255);