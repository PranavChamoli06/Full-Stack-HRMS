package com.example.HRMS.controller;

import com.example.HRMS.dto.SpecialPricingRequest;
import com.example.HRMS.dto.SpecialPricingResponse;
import com.example.HRMS.service.SpecialPricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/pricing")
@RequiredArgsConstructor
public class SpecialPricingController {

    private final SpecialPricingService service;

    // ➕ Create pricing
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SpecialPricingResponse create(@RequestBody SpecialPricingRequest request) {
        return service.create(request);
    }

    // 📄 Get all pricing
    @GetMapping
    public List<SpecialPricingResponse> getAll() {
        return service.getAll();
    }

    // ✏️ Update pricing
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SpecialPricingResponse update(
            @PathVariable Long id,
            @RequestBody SpecialPricingRequest request) {
        return service.update(id, request);
    }

    // ❌ Delete pricing
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}