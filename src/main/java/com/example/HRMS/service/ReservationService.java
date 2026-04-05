package com.example.HRMS.service;

import com.example.HRMS.dto.ReservationRequest;
import com.example.HRMS.dto.ReservationResponse;

import com.example.HRMS.entity.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {

    ReservationResponse create(ReservationRequest request);

    List<ReservationResponse> getAll();

    ReservationResponse getById(Long id);

    ReservationResponse update(Long id, ReservationRequest request);
    ReservationResponse updateStatus(Long id, ReservationStatus status);

    void delete(Long id);

    Page<ReservationResponse> getReservations(
            String username,
            LocalDate startDate,
            Pageable pageable
    );

    boolean isRoomAvailable(Integer roomNumber, LocalDate checkIn, LocalDate checkOut);
}