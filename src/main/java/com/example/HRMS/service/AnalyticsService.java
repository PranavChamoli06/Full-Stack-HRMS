package com.example.HRMS.service;

import java.math.BigDecimal;
import java.util.Map;

public interface AnalyticsService {

    BigDecimal getTotalRevenue();

    Double getOccupancyRate();

    Map<String, BigDecimal> getMonthlyRevenue();

    Double getCancellationRate();
}