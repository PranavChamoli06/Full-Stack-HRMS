package com.example.HRMS.repository;

import com.example.HRMS.dto.RoomResponse;
import com.example.HRMS.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query("""
        SELECT r FROM Room r
        WHERE r.isActive = true
        AND r.roomNumber NOT IN (
            SELECT res.room.roomNumber FROM Reservation res
            WHERE res.checkInDate < :checkOut
            AND res.checkOutDate > :checkIn
        )
    """)
    List<Room> findAvailableRooms(LocalDate checkIn, LocalDate checkOut);
    Optional<Room> findByRoomNumber(Integer roomNumber);
}