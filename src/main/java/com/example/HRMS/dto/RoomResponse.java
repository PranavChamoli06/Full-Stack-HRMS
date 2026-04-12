package com.example.HRMS.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomResponse {

    private Integer roomNumber;
    private String roomType;
    private Integer price;
}