package com.example.HRMS.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialPricingRequest {

    private LocalDate date;
    private BigDecimal multiplier;
    private String description;
}