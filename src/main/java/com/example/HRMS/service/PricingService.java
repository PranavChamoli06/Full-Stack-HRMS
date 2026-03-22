package com.example.HRMS.service;

import java.time.LocalDate;

public interface PricingService {

    double calculatePrice(double basePrice, LocalDate date);
}