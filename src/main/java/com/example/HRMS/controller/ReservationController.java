package com.example.HRMS.controller;

import com.example.HRMS.dto.ReservationRequest;
import com.example.HRMS.dto.ReservationResponse;
import com.example.HRMS.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ReservationResponse create(
            @RequestBody ReservationRequest request) {

        return reservationService.create(request);
    }

    @GetMapping
    public List<ReservationResponse> getAll() {

        return reservationService.getAll();
    }

    @GetMapping("/{id}")
    public ReservationResponse getById(@PathVariable Long id) {

        return reservationService.getById(id);
    }

    @PutMapping("/{id}")
    public ReservationResponse update(
            @PathVariable Long id,
            @RequestBody ReservationRequest request) {

        return reservationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        reservationService.delete(id);
    }
}