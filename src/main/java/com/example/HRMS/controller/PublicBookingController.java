package com.example.HRMS.controller;

import com.example.HRMS.dto.PublicBookingRequest;
import com.example.HRMS.dto.BookingResponse;
import com.example.HRMS.dto.ReservationResponse;
import com.example.HRMS.entity.Room;
import com.example.HRMS.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicBookingController {

    private final ReservationService reservationService;

    // ✅ 1. GET AVAILABLE ROOMS
    @GetMapping("/rooms/available")
    public List<Room> getAvailableRooms(
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut
    ) {
        return reservationService.getAvailableRooms(checkIn, checkOut);
    }

    // ✅ 2. CREATE BOOKING
    @PostMapping("/reservations")
    public BookingResponse createBooking(
            @RequestBody PublicBookingRequest request
    ) {
        return reservationService.createPublicBooking(request);
    }

    @PutMapping("/reservations/cancel")
    public String cancelBooking(@RequestParam String reference) {
        reservationService.cancelBooking(reference);
        return "Booking cancelled successfully";
    }

    @GetMapping("/reservations")
    public ReservationResponse getBooking(@RequestParam String reference) {
        return reservationService.getBookingByReference(reference);
    }
}