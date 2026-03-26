package com.example.HRMS.service;

import com.example.HRMS.dto.SpecialPricingRequest;
import com.example.HRMS.dto.SpecialPricingResponse;

import java.util.List;

public interface SpecialPricingService {

    SpecialPricingResponse create(SpecialPricingRequest request);

    List<SpecialPricingResponse> getAll();

    SpecialPricingResponse update(Long id, SpecialPricingRequest request);

    void delete(Long id);
}