package com.example.HRMS.repository;

import com.example.HRMS.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Page<Reservation> findByUserUsername(String username, Pageable pageable);

    Page<Reservation> findByCheckInDateAfter(LocalDate date, Pageable pageable);
}