package com.example.HRMS.exception;

public class BookingConflictException extends RuntimeException {

    public BookingConflictException(String message) {
        super(message);
    }
}