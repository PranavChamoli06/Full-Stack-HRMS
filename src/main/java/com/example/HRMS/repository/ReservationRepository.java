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

    // ================= ANALYTICS =================

    // ✅ TOTAL REVENUE (WITH NIGHTS * PRICE)
    @Query("""
    SELECT SUM(
        p.pricePerNight * 
        FUNCTION('DATEDIFF', r.checkOutDate, r.checkInDate)
    )
    FROM Reservation r
    JOIN r.room rm
    JOIN RoomPricing p ON p.roomType = rm.roomType
    WHERE r.status = 'CONFIRMED'
    """)
    BigDecimal calculateTotalRevenue();


    // ✅ COUNT DISTINCT BOOKED ROOMS
    @Query("""
    SELECT COUNT(DISTINCT rm.roomNumber)
    FROM Reservation r
    JOIN r.room rm
    WHERE r.status = 'CONFIRMED'
    """)
    long countBookedRooms();


    // ✅ TOTAL DISTINCT ROOMS USED IN RESERVATIONS
    @Query("""
    SELECT COUNT(DISTINCT rm.roomNumber)
    FROM Reservation r
    JOIN r.room rm
    """)
    long countDistinctRooms();


    // ✅ MONTHLY REVENUE (CORRECT JOIN)
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

    //
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
}