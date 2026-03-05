package com.example.HRMS.service.impl;

import com.example.HRMS.dto.ReservationRequest;
import com.example.HRMS.dto.ReservationResponse;
import com.example.HRMS.entity.*;
import com.example.HRMS.repository.*;
import com.example.HRMS.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    @Override
    public ReservationResponse create(ReservationRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
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

        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());

        Reservation saved = reservationRepository.save(reservation);

        return mapToResponse(saved);
    }

    @Override
    public void delete(Long id) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservationRepository.delete(reservation);
    }

    private ReservationResponse mapToResponse(Reservation reservation) {

        return ReservationResponse.builder()
                .id(reservation.getId())
                .username(reservation.getUser().getUsername())
                .roomNumber(reservation.getRoom().getRoomNumber())
                .checkInDate(reservation.getCheckInDate())
                .checkOutDate(reservation.getCheckOutDate())
                .status(reservation.getStatus().name())
                .build();
    }
}