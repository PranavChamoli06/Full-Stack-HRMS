package com.example.HRMS.event;

import com.example.HRMS.entity.Reservation;

public class BookingCreatedEvent {

    private final Reservation reservation;

    public BookingCreatedEvent(Reservation reservation) {
        this.reservation = reservation;
    }

    public Reservation getReservation() {
        return reservation;
    }
}