package com.example.HRMS.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomResponse {

    private Integer roomNumber;
    private String roomType;

    // average price/night
    private Integer price;

    // total for selected stay
    private Integer totalPrice;

    // nights selected
    private Integer nights;
}