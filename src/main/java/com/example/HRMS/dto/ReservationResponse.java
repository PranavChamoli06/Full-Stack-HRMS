package com.example.HRMS.dto;

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

    private String guestEmail;
    private String guestPhone;
    private String guestName;
    private BigDecimal totalPrice;

    private String createdBy; // who created booking (admin/staff)
}