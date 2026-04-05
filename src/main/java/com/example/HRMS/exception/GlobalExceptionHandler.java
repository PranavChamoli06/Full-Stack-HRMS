package com.example.HRMS.exception;

import com.example.HRMS.dto.ApiResponse;
import com.example.HRMS.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;


import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // RESOURCE NOT FOUND
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.builder()
                        .errorCode(ErrorCode.RESOURCE_NOT_FOUND.name())
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    // VALIDATION ERROR
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        return ResponseEntity.badRequest()
                .body(ErrorResponse.builder()
                        .errorCode(ErrorCode.VALIDATION_FAILED.name())
                        .message("Validation failed")
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, "Access denied", null));
    }


    // GENERIC ERROR
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.builder()
                        .errorCode(ErrorCode.INTERNAL_ERROR.name())
                        .message("Something went wrong")
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    // Booking Conflict Exception
    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<String> handleBookingConflict(BookingConflictException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
}
