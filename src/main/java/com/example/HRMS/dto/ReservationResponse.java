package com.example.HRMS.dto;

import com.example.HRMS.enums.PaymentMode;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class ReservationResponse {

    private Long id;

    private String roomNumber;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private String status;

    private String email;
    private String phone;
    private String fullName;
    private BigDecimal totalPrice;
    private PaymentMode paymentMode;

    private String createdBy; // who created booking (admin/staff)
}