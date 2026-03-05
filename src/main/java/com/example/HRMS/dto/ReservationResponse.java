package com.example.HRMS.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ReservationResponse {

    private Long id;

    private String username;

    private String roomNumber;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private String status;
}