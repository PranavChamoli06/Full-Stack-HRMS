package com.example.HRMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    private Integer roomNumber;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum RoomType {
        Standard, Deluxe, Suite
    }

    // getters & setters
}