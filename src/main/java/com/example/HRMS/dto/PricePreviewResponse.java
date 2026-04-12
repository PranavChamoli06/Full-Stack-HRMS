package com.example.HRMS.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PricePreviewResponse {

    private Integer pricePerNight;
    private Integer totalPrice;
    private Integer nights;
}