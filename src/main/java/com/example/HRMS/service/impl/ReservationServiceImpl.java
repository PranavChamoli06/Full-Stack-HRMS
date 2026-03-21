package com.example.HRMS.service.impl;

import com.example.HRMS.dto.ReservationRequest;
import com.example.HRMS.dto.ReservationResponse;
import com.example.HRMS.entity.*;
import com.example.HRMS.repository.*;
import com.example.HRMS.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomPricingRepository roomPricingRepository; // ✅ pricing repo

    @Override
    public ReservationResponse create(ReservationRequest request) {

        if (request.getCheckInDate().isAfter(request.getCheckOutDate())) {
            throw new RuntimeException("Check-in date cannot be after check-out date");
        }

        // ✅ Logged-in user
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer roomNumber = request.getRoomNumber();

        Room room = roomRepository.findById(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // ✅ Overlap check
        List<Reservation> overlappingReservations =
                reservationRepository
                        .findByRoomRoomNumberAndCheckOutDateAfterAndCheckInDateBefore(
                                room.getRoomNumber(),
                                request.getCheckInDate(),
                                request.getCheckOutDate()
                        );

        if (!overlappingReservations.isEmpty()) {
            throw new RuntimeException("Room already booked for selected dates");
        }

        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());

        // ✅ Guest details
        reservation.setGuestName(request.getGuestName());
        reservation.setGuestEmail(request.getGuestEmail());
        reservation.setGuestPhone(request.getGuestPhone());

        reservation.setStatus(ReservationStatus.PENDING);

        Reservation saved = reservationRepository.save(reservation);

        return mapToResponse(saved);
    }

    @Override
    public List<ReservationResponse> getAll() {
        return reservationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ReservationResponse getById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        return mapToResponse(reservation);
    }

    @Override
    public ReservationResponse update(Long id, ReservationRequest request) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (request.getCheckInDate() != null) {
            reservation.setCheckInDate(request.getCheckInDate());
        }

        if (request.getCheckOutDate() != null) {
            reservation.setCheckOutDate(request.getCheckOutDate());
        }

        if (request.getGuestName() != null) {
            reservation.setGuestName(request.getGuestName());
        }

        if (request.getGuestEmail() != null) {
            reservation.setGuestEmail(request.getGuestEmail());
        }

        if (request.getGuestPhone() != null) {
            reservation.setGuestPhone(request.getGuestPhone());
        }

        if (reservation.getCheckInDate().isAfter(reservation.getCheckOutDate())) {
            throw new RuntimeException("Check-in date cannot be after check-out date");
        }

        Reservation saved = reservationRepository.save(reservation);

        return mapToResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservationRepository.delete(reservation);
    }

    @Override
    public Page<ReservationResponse> getReservations(
            String username,
            LocalDate startDate,
            Pageable pageable) {

        Page<Reservation> reservations;

        if (username != null) {
            reservations = reservationRepository.findByUserUsername(username, pageable);
        } else if (startDate != null) {
            reservations = reservationRepository.findByCheckInDateAfter(startDate, pageable);
        } else {
            reservations = reservationRepository.findAll(pageable);
        }

        return reservations.map(this::mapToResponse);
    }

    // ================= PRICE CALCULATION =================

    private BigDecimal calculateTotalPrice(Reservation reservation) {

        if (reservation.getRoom() == null) return BigDecimal.ZERO;

        // ✅ ENUM SAFE
        Room.RoomType roomType = reservation.getRoom().getRoomType();

        RoomPricing pricing = roomPricingRepository.findByRoomType(roomType)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        long nights = ChronoUnit.DAYS.between(
                reservation.getCheckInDate(),
                reservation.getCheckOutDate()
        );

        if (nights <= 0) return BigDecimal.ZERO;

        return pricing.getPricePerNight()
                .multiply(BigDecimal.valueOf(nights));
    }

    // ================= RESPONSE MAPPING =================

    private ReservationResponse mapToResponse(Reservation reservation) {

        String roomNumber = null;
        String guestName = null;
        String guestEmail = null;
        String guestPhone = null;
        String createdBy = null;

        if (reservation.getRoom() != null) {
            roomNumber = String.valueOf(reservation.getRoom().getRoomNumber());
        }

        if (reservation.getUser() != null) {
            createdBy = reservation.getUser().getUsername();
        }

        guestName = reservation.getGuestName();
        guestEmail = reservation.getGuestEmail();
        guestPhone = reservation.getGuestPhone();

        BigDecimal totalPrice = calculateTotalPrice(reservation);

        return ReservationResponse.builder()
                .id(reservation.getId())
                .roomNumber(roomNumber)
                .guestName(guestName)
                .guestEmail(guestEmail)
                .guestPhone(guestPhone)
                .createdBy(createdBy)
                .checkInDate(reservation.getCheckInDate())
                .checkOutDate(reservation.getCheckOutDate())
                .status(reservation.getStatus().name())
                .totalPrice(totalPrice)
                .build();
    }

    @Override
    public ReservationResponse updateStatus(Long id, ReservationStatus status) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        ReservationStatus currentStatus = reservation.getStatus();

        if (currentStatus == ReservationStatus.CANCELLED) {
            throw new RuntimeException("Cancelled reservations cannot be modified");
        }

        if (currentStatus == ReservationStatus.CONFIRMED
                && status == ReservationStatus.PENDING) {
            throw new RuntimeException("Invalid status transition");
        }

        reservation.setStatus(status);

        Reservation saved = reservationRepository.save(reservation);

        return mapToResponse(saved);
    }
}