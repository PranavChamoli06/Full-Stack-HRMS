package com.example.HRMS.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservationRequest {

    private Integer roomNumber;  // ✅ FIXED

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private String email;
    private String phone;
    private String fullName;
}