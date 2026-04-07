package com.example.HRMS.service.impl;

import com.example.HRMS.dto.BookingResponse;
import com.example.HRMS.dto.PublicBookingRequest;
import com.example.HRMS.dto.ReservationRequest;
import com.example.HRMS.dto.ReservationResponse;
import com.example.HRMS.entity.*;
import com.example.HRMS.exception.BookingConflictException;
import com.example.HRMS.repository.*;
import com.example.HRMS.service.EmailService;
import com.example.HRMS.service.PdfService;
import com.example.HRMS.service.ReservationService;
import com.example.HRMS.service.PricingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomPricingRepository roomPricingRepository;
    private final PricingService pricingService;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;
    private final PdfService pdfService;

    private static final Logger logger =
            LoggerFactory.getLogger(ReservationServiceImpl.class);

    @Override
    public ReservationResponse create(ReservationRequest request) {

        if (request.getRoomNumber() == null) {
            throw new RuntimeException("Room number is required");
        }

        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new RuntimeException("Dates are required");
        }

        if (request.getCheckInDate().isAfter(request.getCheckOutDate())) {
            throw new RuntimeException("Check-in date cannot be after check-out date");
        }

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomNumber())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        List<Reservation> overlappingReservations =
                reservationRepository
                        .findByRoomRoomNumberAndCheckOutDateAfterAndCheckInDateBefore(
                                room.getRoomNumber(),
                                request.getCheckInDate(),
                                request.getCheckOutDate()
                        );

        if (!overlappingReservations.isEmpty()) {
            throw new BookingConflictException("Room already booked for selected dates");
        }

        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());

        // ✅ FIXED FIELDS
        reservation.setFullName(request.getFullName());
        reservation.setEmail(request.getEmail());
        reservation.setPhone(request.getPhone());

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

        if (request.getFullName() != null) {
            reservation.setFullName(request.getFullName());
        }

        if (request.getEmail() != null) {
            reservation.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) {
            reservation.setPhone(request.getPhone());
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

        Room.RoomType roomType = reservation.getRoom().getRoomType();

        RoomPricing pricing = roomPricingRepository.findByRoomType(roomType)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        LocalDate checkIn = reservation.getCheckInDate();
        LocalDate checkOut = reservation.getCheckOutDate();

        if (checkIn == null || checkOut == null || !checkIn.isBefore(checkOut)) {
            return BigDecimal.ZERO;
        }

        BigDecimal basePrice = pricing.getPricePerNight();
        BigDecimal totalPrice = BigDecimal.ZERO;

        LocalDate currentDate = checkIn;

        while (currentDate.isBefore(checkOut)) {

            double calculated;

            try {
                calculated = pricingService.calculatePrice(
                        basePrice.doubleValue(),
                        currentDate
                );
            } catch (Exception e) {
                logger.error("Pricing error for date {}: {}", currentDate, e.getMessage());
                calculated = basePrice.doubleValue();
            }

            totalPrice = totalPrice.add(BigDecimal.valueOf(calculated));
            currentDate = currentDate.plusDays(1);
        }

        return totalPrice;
    }

    // ================= RESPONSE =================

    private ReservationResponse mapToResponse(Reservation reservation) {

        String roomNumber = null;
        String fullName = null;
        String email = null;
        String phone = null;
        String createdBy = null;

        if (reservation.getRoom() != null) {
            roomNumber = String.valueOf(reservation.getRoom().getRoomNumber());
        }

        if (reservation.getUser() != null) {
            createdBy = reservation.getUser().getUsername();
        }

        fullName = reservation.getFullName();
        email = reservation.getEmail();
        phone = reservation.getPhone();

        BigDecimal totalPrice = calculateTotalPrice(reservation);

        return ReservationResponse.builder()
                .id(reservation.getId())
                .roomNumber(roomNumber)
                .fullName(fullName)
                .email(email)
                .phone(phone)
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

    @Override
    public boolean isRoomAvailable(Integer roomNumber, LocalDate checkIn, LocalDate checkOut) {
        return !reservationRepository.existsOverlappingReservation(
                roomNumber,
                checkIn,
                checkOut
        );
    }

    @Transactional
    public void completePastReservations() {

        List<Reservation> reservations = reservationRepository.findReservationsToComplete();

        for (Reservation reservation : reservations) {
            reservation.setStatus(ReservationStatus.COMPLETED);
        }

        reservationRepository.saveAll(reservations);
    }

    public Map<String, Long> getReservationStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("PENDING", reservationRepository.countByStatus(ReservationStatus.PENDING));
        stats.put("CONFIRMED", reservationRepository.countByStatus(ReservationStatus.CONFIRMED));
        stats.put("COMPLETED", reservationRepository.countByStatus(ReservationStatus.COMPLETED));
        stats.put("CANCELLED", reservationRepository.countByStatus(ReservationStatus.CANCELLED));

        return stats;
    }

    @Transactional
    public BookingResponse createPublicBooking(PublicBookingRequest request) {

        // ✅ VALIDATION
        if (request.getRoomNumber() == null) {
            throw new RuntimeException("Room number is required");
        }

        if (request.getCheckIn() == null || request.getCheckOut() == null) {
            throw new RuntimeException("Dates are required");
        }

        if (request.getCheckIn().isAfter(request.getCheckOut())) {
            throw new RuntimeException("Invalid date range");
        }

        // ✅ FETCH ROOM
        Room room = roomRepository.findById(request.getRoomNumber())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // ✅ CHECK AVAILABILITY (CRITICAL)
        boolean available = !reservationRepository.existsOverlappingReservation(
                request.getRoomNumber(),
                request.getCheckIn(),
                request.getCheckOut()
        );

        if (!available) {
            throw new RuntimeException("Room not available for selected dates");
        }

        // ✅ CREATE CUSTOMER
        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());

        customerRepository.save(customer);

        // ✅ CREATE RESERVATION
        Reservation reservation = new Reservation();
        reservation.setRoom(room);
        reservation.setCustomer(customer); // ⚠️ make sure this field exists in entity

        reservation.setCheckInDate(request.getCheckIn());
        reservation.setCheckOutDate(request.getCheckOut());

        reservation.setFullName(request.getFullName());
        reservation.setEmail(request.getEmail());
        reservation.setPhone(request.getPhone());

        String reference = "HRMS-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        reservation.setBookingReference(reference);

        reservation.setStatus(ReservationStatus.CONFIRMED);

        Reservation saved = reservationRepository.save(reservation);

        byte[] pdf = pdfService.generateBookingPdf(saved);
        try {
            emailService.sendBookingConfirmationWithPdf(
                    request.getEmail(),
                    request.getFullName(),
                    reference,
                    request.getCheckIn().toString(),
                    request.getCheckOut().toString(),
                    pdf
            );
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }

        // ✅ RESPONSE
        BookingResponse response = new BookingResponse();
        response.setBookingId(saved.getId());
        response.setStatus(saved.getStatus().name());
        response.setBookingReference(reference);

        return response;
    }

    @Override
    public List<Room> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRooms(checkIn, checkOut);
    }

    @Override
    public void cancelBooking(String reference) {

        Reservation reservation = reservationRepository
                .findByBookingReference(reference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new RuntimeException("Booking already cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);

        reservationRepository.save(reservation);
    }

    @Override
    public ReservationResponse getBookingByReference(String reference) {

        Reservation reservation = reservationRepository
                .findByBookingReference(reference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        return mapToResponse(reservation);
    }
}