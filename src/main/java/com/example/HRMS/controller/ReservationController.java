package com.example.HRMS.controller;

import com.example.HRMS.dto.ReservationRequest;
import com.example.HRMS.dto.ReservationResponse;
import com.example.HRMS.entity.ReservationStatus;
import com.example.HRMS.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;
import com.example.HRMS.entity.ReservationStatus;

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
    public Page<ReservationResponse> getReservations(

            @RequestParam(required = false) String username,
            @RequestParam(required = false) LocalDate startDate,
            Pageable pageable) {

        return reservationService.getReservations(
                username,
                startDate,
                pageable
        );
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

    @PatchMapping("/{id}/status")
    public ReservationResponse updateStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {

        return reservationService.updateStatus(id, status);
    }
}