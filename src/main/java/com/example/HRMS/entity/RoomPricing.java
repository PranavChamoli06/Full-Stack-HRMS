package com.example.HRMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "room_pricing")
public class RoomPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private Room.RoomType roomType;

    private BigDecimal pricePerNight;

    private LocalDateTime effectiveFrom;
    private LocalDateTime effectiveTo;

    // getters & setters
}