package com.example.HRMS.service.impl;

import com.example.HRMS.entity.SpecialPricing;
import com.example.HRMS.repository.SpecialPricingRepository;
import com.example.HRMS.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final SpecialPricingRepository specialPricingRepository;

    private static final Logger logger =
            LoggerFactory.getLogger(PricingServiceImpl.class);

    @Override
    public double calculatePrice(double basePrice, LocalDate date) {

        // ✅ Step 1: Check DB for special pricing
        return specialPricingRepository.findByDate(date)
                .map(sp -> applySpecialPricing(basePrice, sp, date))
                .orElseGet(() -> applyWeekendOrDefault(basePrice, date));
    }

    // ================= SPECIAL PRICING =================

    private double applySpecialPricing(double basePrice, SpecialPricing sp, LocalDate date) {

        if (sp.getMultiplier() == null) {
            logger.warn("Multiplier is NULL for date {} → using base price", date);
            return basePrice;
        }

        double multiplier = sp.getMultiplier().doubleValue();
        double finalPrice = basePrice * multiplier;

        logger.debug("Special Pricing Applied → Date: {} | Base: {} | Multiplier: {} | Final: {}",
                date, basePrice, multiplier, finalPrice);

        return finalPrice;
    }

    // ================= WEEKEND / DEFAULT =================

    private double applyWeekendOrDefault(double basePrice, LocalDate date) {

        DayOfWeek day = date.getDayOfWeek();

        // Weekend pricing
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {

            double finalPrice = basePrice * 1.20;

            logger.debug("Weekend Pricing Applied → Date: {} | Base: {} | Final: {}",
                    date, basePrice, finalPrice);

            return finalPrice;
        }

        // Default pricing
        logger.debug("Default Pricing Applied → Date: {} | Price: {}", date, basePrice);

        return basePrice;
    }
}