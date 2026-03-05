package com.example.HRMS.service;

import com.example.HRMS.dto.ReservationRequest;
import com.example.HRMS.dto.ReservationResponse;

import java.util.List;

public interface ReservationService {

    ReservationResponse create(ReservationRequest request);

    List<ReservationResponse> getAll();

    ReservationResponse getById(Long id);

    ReservationResponse update(Long id, ReservationRequest request);

    void delete(Long id);
}