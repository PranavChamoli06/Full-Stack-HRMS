package com.example.HRMS.dto;

import com.example.HRMS.enums.PaymentMode;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PublicBookingRequest {

    private String fullName;
    private String email;
    private String phone;

    private Integer roomNumber;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private PaymentMode paymentMode;
}