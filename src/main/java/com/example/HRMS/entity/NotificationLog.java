package com.example.HRMS.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // EMAIL / SMS

    private String recipient;

    @Column(length = 1000)
    private String message;

    private String status; // PENDING / SUCCESS / FAILED

    @Column(length = 1000)
    private String errorMessage;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}