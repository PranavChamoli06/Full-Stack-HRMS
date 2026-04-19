package com.example.HRMS.entity;

import com.example.HRMS.enums.PaymentMode;
import com.example.HRMS.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20)")
    private PaymentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode", columnDefinition = "VARCHAR(20)")
    private PaymentMode paymentMode;

    private String paymentGateway;

    private String transactionId;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String razorpayOrderId;
    private String razorpaySignature;

}