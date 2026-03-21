package com.example.HRMS.service.impl;

import com.example.HRMS.entity.ReservationStatus;
import com.example.HRMS.repository.ReservationRepository;
import com.example.HRMS.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ReservationRepository reservationRepository;

    @Override
    public BigDecimal getTotalRevenue() {
        return reservationRepository.calculateTotalRevenue();
    }

    @Override
    public Double getOccupancyRate() {

        long totalRooms = reservationRepository.countDistinctRooms();
        long bookedRooms = reservationRepository.countBookedRooms();

        if (totalRooms == 0) return 0.0;

        return (double) bookedRooms / totalRooms * 100;
    }

    @Override
    public Map<String, BigDecimal> getMonthlyRevenue() {

        Map<String, BigDecimal> revenueMap = new HashMap<>();

        reservationRepository.getMonthlyRevenue()
                .forEach(row -> revenueMap.put(
                        (String) row[0],
                        (BigDecimal) row[1]
                ));

        return revenueMap;
    }

    @Override
    public Double getCancellationRate() {

        long total = reservationRepository.count();
        long cancelled = reservationRepository.countByStatus(ReservationStatus.CANCELLED);

        if (total == 0) return 0.0;

        return (double) cancelled / total * 100;
    }
}