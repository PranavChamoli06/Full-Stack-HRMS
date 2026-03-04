package com.example.HRMS.repository;

import com.example.HRMS.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {
}