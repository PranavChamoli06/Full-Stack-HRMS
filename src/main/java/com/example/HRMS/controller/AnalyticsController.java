package com.example.HRMS.controller;

import com.example.HRMS.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue")
    public BigDecimal getRevenue() {
        return analyticsService.getTotalRevenue();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/occupancy")
    public Double getOccupancy() {
        return analyticsService.getOccupancyRate();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/monthly-revenue")
    public Map<String, BigDecimal> getMonthlyRevenue() {
        return analyticsService.getMonthlyRevenue();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cancellation-rate")
    public Double getCancellationRate() {
        return analyticsService.getCancellationRate();
    }
}