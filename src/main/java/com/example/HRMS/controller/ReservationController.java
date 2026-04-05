package com.example.HRMS.controller;

import com.example.HRMS.dto.ReservationRequest;
import com.example.HRMS.dto.ReservationResponse;
import com.example.HRMS.entity.ReservationStatus;
import com.example.HRMS.entity.Room;
import com.example.HRMS.entity.RoomPricing;
import com.example.HRMS.service.ReservationService;
import com.example.HRMS.service.PricingService;
import com.example.HRMS.repository.RoomRepository;
import com.example.HRMS.repository.RoomPricingRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 🔥 NEW DEPENDENCIES
    private final RoomRepository roomRepository;
    private final RoomPricingRepository roomPricingRepository;
    private final PricingService pricingService;

    // ================= CREATE =================

    @PostMapping
    public ReservationResponse create(@RequestBody ReservationRequest request) {
        return reservationService.create(request);
    }

    // ================= GET ALL =================

    @GetMapping
    public Page<ReservationResponse> getReservations(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) LocalDate startDate,
            Pageable pageable) {

        return reservationService.getReservations(username, startDate, pageable);
    }

    // ================= GET BY ID =================

    @GetMapping("/{id}")
    public ReservationResponse getById(@PathVariable Long id) {
        return reservationService.getById(id);
    }

    // ================= UPDATE =================

    @PutMapping("/{id}")
    public ReservationResponse update(
            @PathVariable Long id,
            @RequestBody ReservationRequest request) {

        return reservationService.update(id, request);
    }

    // ================= DELETE =================

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reservationService.delete(id);
    }

    // ================= UPDATE STATUS =================

    @PatchMapping("/{id}/status")
    public ReservationResponse updateStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {

        return reservationService.updateStatus(id, status);
    }

    // 🚀 ================= PREVIEW PRICE =================

    @GetMapping("/preview-price")
    public double previewPrice(
            @RequestParam Integer roomNumber,
            @RequestParam LocalDate checkInDate,
            @RequestParam LocalDate checkOutDate
    ) {

        // ✅ VALIDATION
        if (roomNumber == null || checkInDate == null || checkOutDate == null) {
            throw new RuntimeException("Missing required parameters");
        }

        if (!checkInDate.isBefore(checkOutDate)) {
            throw new RuntimeException("Invalid date range");
        }

        // ✅ GET ROOM
        Room room = roomRepository.findById(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // ✅ GET BASE PRICE
        RoomPricing pricing = roomPricingRepository
                .findByRoomType(room.getRoomType())
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        double total = 0;
        LocalDate currentDate = checkInDate;

        // 🔥 SAME LOGIC AS SERVICE (CONSISTENT SYSTEM)
        while (currentDate.isBefore(checkOutDate)) {

            double dailyPrice = pricingService.calculatePrice(
                    pricing.getPricePerNight().doubleValue(),
                    currentDate
            );

            total += dailyPrice;
            currentDate = currentDate.plusDays(1);
        }

        return total;
    }

    // 🚀 ================= CHECK AVAILABILITY =================

    @GetMapping("/availability")
    public String checkAvailability(
            @RequestParam Integer roomNumber,
            @RequestParam LocalDate checkInDate,
            @RequestParam LocalDate checkOutDate
    ) {

        // ✅ VALIDATION
        if (roomNumber == null || checkInDate == null || checkOutDate == null) {
            throw new RuntimeException("Missing required parameters");
        }

        if (!checkInDate.isBefore(checkOutDate)) {
            throw new RuntimeException("Invalid date range");
        }

        // 🔥 CORE LOGIC
        boolean isAvailable = reservationService.isRoomAvailable(
                roomNumber,
                checkInDate,
                checkOutDate
        );

        if (isAvailable) {
            return "AVAILABLE";
        } else {
            throw new RuntimeException("Room not available for selected dates");
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getReservationStats() {
        return ResponseEntity.ok(reservationService.getReservationStats());
    }
}