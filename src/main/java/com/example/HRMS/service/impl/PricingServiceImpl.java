package com.example.HRMS.service.impl;

import com.example.HRMS.service.PricingService;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

@Service
public class PricingServiceImpl implements PricingService {

    private static final Set<LocalDate> FESTIVALS = Set.of(
            LocalDate.of(2026, 1, 26),
            LocalDate.of(2026, 8, 15),
            LocalDate.of(2026, 10, 24)
    );

    @Override
    public double calculatePrice(double basePrice, LocalDate date) {

        // Festival (highest priority)
        if (FESTIVALS.contains(date)) {
            return basePrice * 1.40;
        }

        // Weekend
        DayOfWeek day = date.getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return basePrice * 1.20;
        }

        // Weekday
        return basePrice;
    }
}