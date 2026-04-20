package com.example.HRMS.service.impl;

import com.example.HRMS.dto.*;
import com.example.HRMS.entity.*;
import com.example.HRMS.enums.PaymentMode;
import com.example.HRMS.event.BookingCreatedEvent;
import com.example.HRMS.exception.BookingConflictException;
import com.example.HRMS.exception.ResourceNotFoundException;
import com.example.HRMS.repository.*;
import com.example.HRMS.service.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

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
    private final ApplicationEventPublisher publisher;

    @Override
    public ReservationResponse create(ReservationRequest request) {

        validateDates(request.getCheckInDate(), request.getCheckOutDate());

        if (request.getPaymentMode() == null) {
            throw new IllegalArgumentException("Payment mode is required");
        }

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Room room = getRoom(request.getRoomNumber());

        validateAvailability(
                room.getRoomNumber(),
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setFullName(request.getFullName());
        reservation.setEmail(request.getEmail());
        reservation.setPhone(request.getPhone());
        reservation.setBookingReference(generateReference());
        reservation.setPaymentMode(request.getPaymentMode());

        if (request.getPaymentMode() == PaymentMode.PAY_AT_HOTEL) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
        } else {
            reservation.setStatus(ReservationStatus.PENDING);
        }

        Reservation saved =
                reservationRepository.save(reservation);

        if (saved.getPaymentMode() == PaymentMode.PAY_AT_HOTEL) {
            publisher.publishEvent(
                    new BookingCreatedEvent(saved)
            );
        }

        return map(saved);
    }

    @Override
    @Transactional
    public BookingResponse createPublicBooking(
            PublicBookingRequest request
    ) {

        validateDates(
                request.getCheckIn(),
                request.getCheckOut()
        );

        Room room = getRoom(request.getRoomNumber());

        validateAvailability(
                request.getRoomNumber(),
                request.getCheckIn(),
                request.getCheckOut()
        );

        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());

        customerRepository.save(customer);

        Reservation reservation = new Reservation();

        reservation.setRoom(room);
        reservation.setCustomer(customer);
        reservation.setCheckInDate(request.getCheckIn());
        reservation.setCheckOutDate(request.getCheckOut());
        reservation.setFullName(request.getFullName());
        reservation.setEmail(request.getEmail());
        reservation.setPhone(request.getPhone());

        String reference = generateReference();

        reservation.setBookingReference(reference);
        reservation.setPaymentMode(request.getPaymentMode());

        if (request.getPaymentMode() == PaymentMode.PREPAID) {
            reservation.setStatus(ReservationStatus.PENDING);
        } else {
            reservation.setStatus(ReservationStatus.CONFIRMED);
        }

        Reservation saved =
                reservationRepository.save(reservation);

        if (saved.getPaymentMode() == PaymentMode.PAY_AT_HOTEL) {
            publisher.publishEvent(
                    new BookingCreatedEvent(saved)
            );
        }

        return BookingResponse.builder()
                .bookingId(saved.getId())
                .bookingReference(reference)
                .status(saved.getStatus().name())
                .build();
    }

    @Override
    public List<ReservationResponse> getAll() {
        return reservationRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public ReservationResponse getById(Long id) {
        return map(
                reservationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Reservation not found"
                                ))
        );
    }

    @Override
    public ReservationResponse update(
            Long id,
            ReservationRequest request
    ) {

        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Reservation not found"
                        ));

        if (request.getCheckInDate() != null)
            r.setCheckInDate(request.getCheckInDate());

        if (request.getCheckOutDate() != null)
            r.setCheckOutDate(request.getCheckOutDate());

        if (request.getPaymentMode() != null)
            r.setPaymentMode(request.getPaymentMode());

        validateDates(
                r.getCheckInDate(),
                r.getCheckOutDate()
        );

        return map(
                reservationRepository.save(r)
        );
    }

    @Override
    public ReservationResponse updateStatus(
            Long id,
            ReservationStatus status
    ) {

        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Reservation not found"
                        ));

        r.setStatus(status);

        return map(
                reservationRepository.save(r)
        );
    }

    @Override
    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public Page<ReservationResponse> getReservations(
            String username,
            LocalDate startDate,
            Pageable pageable
    ) {
        return reservationRepository
                .findAll(pageable)
                .map(this::map);
    }

    @Override
    public boolean isRoomAvailable(
            Integer roomNumber,
            LocalDate checkIn,
            LocalDate checkOut
    ) {
        return !reservationRepository
                .existsOverlappingReservation(
                        roomNumber,
                        checkIn,
                        checkOut
                );
    }

    @Override
    public List<RoomResponse> getAvailableRooms(
            LocalDate checkIn,
            LocalDate checkOut
    ) {

        return roomRepository.findAll()
                .stream()
                .filter(room ->
                        isRoomAvailable(
                                room.getRoomNumber(),
                                checkIn,
                                checkOut
                        )
                )
                .map(room -> {

                    RoomPricing pricing =
                            roomPricingRepository
                                    .findByRoomType(
                                            room.getRoomType()
                                    )
                                    .orElse(null);

                    if (pricing == null) {
                        return RoomResponse.builder()
                                .roomNumber(
                                        room.getRoomNumber()
                                )
                                .roomType(
                                        room.getRoomType()
                                                .name()
                                )
                                .price(0)
                                .totalPrice(0)
                                .nights(0)
                                .build();
                    }

                    double base =
                            pricing.getPricePerNight()
                                    .doubleValue();

                    double total = 0;
                    int nights = 0;

                    LocalDate current = checkIn;

                    while (current.isBefore(checkOut)) {
                        total += pricingService
                                .calculatePrice(
                                        base,
                                        current
                                );

                        current = current.plusDays(1);
                        nights++;
                    }

                    int avgPrice =
                            nights == 0
                                    ? 0
                                    : (int) (total / nights);

                    return RoomResponse.builder()
                            .roomNumber(
                                    room.getRoomNumber()
                            )
                            .roomType(
                                    room.getRoomType()
                                            .name()
                            )
                            .price(avgPrice)
                            .totalPrice((int) total)
                            .nights(nights)
                            .build();
                })
                .toList();
    }

    @Override
    public void cancelBooking(String reference) {

        Reservation r =
                reservationRepository
                        .findByBookingReference(reference)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found"
                                ));

        r.setStatus(
                ReservationStatus.CANCELLED
        );

        reservationRepository.save(r);
    }

    @Override
    public ReservationResponse getBookingByReference(
            String reference
    ) {
        return map(
                reservationRepository
                        .findByBookingReference(reference)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found"
                                ))
        );
    }

    @Override
    public PricePreviewResponse getPricePreview(
            Integer roomNumber,
            LocalDate checkIn,
            LocalDate checkOut
    ) {

        Room room = getRoom(roomNumber);

        RoomPricing pricing =
                roomPricingRepository
                        .findByRoomType(
                                room.getRoomType()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pricing not found"
                                ));

        double base =
                pricing.getPricePerNight()
                        .doubleValue();

        double total = 0;
        int days = 0;

        LocalDate current = checkIn;

        while (current.isBefore(checkOut)) {
            total += pricingService
                    .calculatePrice(
                            base,
                            current
                    );

            current = current.plusDays(1);
            days++;
        }

        return PricePreviewResponse.builder()
                .pricePerNight(
                        days == 0
                                ? (int) base
                                : (int) (total / days)
                )
                .totalPrice((int) total)
                .nights(days)
                .build();
    }

    @Override
    public Map<String, Long> getReservationStats() {

        Map<String, Long> stats =
                new HashMap<>();

        stats.put(
                "PENDING",
                reservationRepository.countByStatus(
                        ReservationStatus.PENDING
                )
        );

        stats.put(
                "CONFIRMED",
                reservationRepository.countByStatus(
                        ReservationStatus.CONFIRMED
                )
        );

        stats.put(
                "COMPLETED",
                reservationRepository.countByStatus(
                        ReservationStatus.COMPLETED
                )
        );

        stats.put(
                "CANCELLED",
                reservationRepository.countByStatus(
                        ReservationStatus.CANCELLED
                )
        );

        return stats;
    }

    private void validateDates(
            LocalDate checkIn,
            LocalDate checkOut
    ) {

        if (checkIn == null || checkOut == null)
            throw new IllegalArgumentException(
                    "Dates required"
            );

        if (!checkIn.isBefore(checkOut))
            throw new IllegalArgumentException(
                    "Invalid date range"
            );
    }

    private Room getRoom(Integer roomNumber) {

        return roomRepository
                .findByRoomNumber(roomNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found: "
                                        + roomNumber
                        ));
    }

    private void validateAvailability(
            Integer roomNumber,
            LocalDate checkIn,
            LocalDate checkOut
    ) {
        if (!isRoomAvailable(
                roomNumber,
                checkIn,
                checkOut
        )) {
            throw new BookingConflictException(
                    "Room already booked"
            );
        }
    }

    private String generateReference() {
        return "HRMS-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 6)
                        .toUpperCase();
    }

    private ReservationResponse map(
            Reservation r
    ) {

        return ReservationResponse.builder()
                .id(r.getId())
                .roomNumber(
                        String.valueOf(
                                r.getRoom()
                                        .getRoomNumber()
                        )
                )
                .fullName(r.getFullName())
                .email(r.getEmail())
                .phone(r.getPhone())
                .checkInDate(r.getCheckInDate())
                .checkOutDate(r.getCheckOutDate())
                .status(
                        r.getStatus()
                                .name()
                )
                .paymentMode(
                        r.getPaymentMode()
                )
                .createdBy(
                        r.getUser() != null
                                ? r.getUser()
                                .getUsername()
                                : "PUBLIC_BOOKING"
                )
                .build();
    }

    @Override
    @Transactional
    public void completePastReservations() {

        List<Reservation> reservations =
                reservationRepository
                        .findReservationsToComplete();

        for (Reservation r : reservations) {
            r.setStatus(
                    ReservationStatus.COMPLETED
            );
        }

        reservationRepository.saveAll(
                reservations
        );
    }
}