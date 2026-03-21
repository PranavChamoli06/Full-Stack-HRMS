package com.example.HRMS.controller;

import com.example.HRMS.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/calculate")
    public BigDecimal calculatePrice(
            @RequestParam Integer roomNumber,
            @RequestParam int nights) {

        return roomService.calculatePrice(roomNumber, nights);
    }
}