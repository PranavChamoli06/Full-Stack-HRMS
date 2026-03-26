package com.example.HRMS.service.impl;

import com.example.HRMS.dto.SpecialPricingRequest;
import com.example.HRMS.dto.SpecialPricingResponse;
import com.example.HRMS.entity.SpecialPricing;
import com.example.HRMS.repository.SpecialPricingRepository;
import com.example.HRMS.service.SpecialPricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecialPricingServiceImpl implements SpecialPricingService {

    private final SpecialPricingRepository repository;

    @Override
    public SpecialPricingResponse create(SpecialPricingRequest request) {

        SpecialPricing pricing = SpecialPricing.builder()
                .date(request.getDate())
                .multiplier(request.getMultiplier())
                .description(request.getDescription())
                .build();

        SpecialPricing saved = repository.save(pricing);

        return mapToResponse(saved);
    }

    @Override
    public List<SpecialPricingResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private SpecialPricingResponse mapToResponse(SpecialPricing sp) {
        return SpecialPricingResponse.builder()
                .id(sp.getId())
                .date(sp.getDate())
                .multiplier(sp.getMultiplier())
                .description(sp.getDescription())
                .build();
    }

    @Override
    public SpecialPricingResponse update(Long id, SpecialPricingRequest request) {

        SpecialPricing pricing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        pricing.setDate(request.getDate());
        pricing.setMultiplier(request.getMultiplier());
        pricing.setDescription(request.getDescription());

        SpecialPricing updated = repository.save(pricing);

        return mapToResponse(updated);
    }

    @Override
    public void delete(Long id) {

        SpecialPricing pricing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        repository.delete(pricing);
    }
}