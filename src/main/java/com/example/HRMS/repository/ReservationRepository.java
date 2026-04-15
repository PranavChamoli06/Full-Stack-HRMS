package com.example.HRMS.repository;

import com.example.HRMS.entity.Reservation;
import com.example.HRMS.entity.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // ================= BASIC QUERIES =================

    Page<Reservation> findByUserUsername(String username, Pageable pageable);

    Page<Reservation> findByCheckInDateAfter(LocalDate date, Pageable pageable);

    List<Reservation> findByRoomRoomNumberAndCheckOutDateAfterAndCheckInDateBefore(
            Integer roomNumber,
            LocalDate checkIn,
            LocalDate checkOut
    );

    long countByStatus(ReservationStatus status);

    Optional<Reservation> findByBookingReference(String bookingReference);

    // ================= ANALYTICS =================

    @Query("""
    SELECT SUM(
        p.pricePerNight * 
        FUNCTION('DATEDIFF', r.checkOutDate, r.checkInDate)
    )
    FROM Reservation r
    JOIN r.room rm
    JOIN RoomPricing p ON p.roomType = rm.roomType
    WHERE r.status IN ('CONFIRMED', 'COMPLETED')
    """)
    BigDecimal calculateTotalRevenue();

    @Query("""
    SELECT COUNT(DISTINCT rm.roomNumber)
    FROM Reservation r
    JOIN r.room rm
    WHERE r.status = 'CONFIRMED'
    """)
    long countBookedRooms();

    @Query("""
    SELECT COUNT(DISTINCT rm.roomNumber)
    FROM Reservation r
    JOIN r.room rm
    """)
    long countDistinctRooms();

    @Query("""
    SELECT FUNCTION('MONTHNAME', r.checkInDate),
           SUM(
               p.pricePerNight * 
               FUNCTION('DATEDIFF', r.checkOutDate, r.checkInDate)
           )
    FROM Reservation r
    JOIN r.room rm
    JOIN RoomPricing p ON p.roomType = rm.roomType
    WHERE r.status = 'CONFIRMED'
    GROUP BY FUNCTION('MONTHNAME', r.checkInDate)
    """)
    List<Object[]> getMonthlyRevenue();

    @Query("""
    SELECT COUNT(r) > 0 FROM Reservation r
    WHERE r.room.roomNumber = :roomNumber
    AND r.status <> 'CANCELLED'
    AND r.checkInDate < :checkOutDate
    AND r.checkOutDate > :checkInDate
    """)
    boolean existsOverlappingReservation(
            Integer roomNumber,
            LocalDate checkInDate,
            LocalDate checkOutDate
    );

    @Query("""
    SELECT r FROM Reservation r
    WHERE r.status = 'CONFIRMED'
    AND r.checkOutDate < CURRENT_DATE
    """)
    List<Reservation> findReservationsToComplete();
}