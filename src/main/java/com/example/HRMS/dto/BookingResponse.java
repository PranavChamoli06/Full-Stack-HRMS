package com.example.HRMS.dto;

import lombok.Data;

@Data
public class BookingResponse {

    private Long bookingId;
    private String status;
    private String bookingReference;
}