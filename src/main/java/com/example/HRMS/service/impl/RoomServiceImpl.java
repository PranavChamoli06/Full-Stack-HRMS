package com.example.HRMS.service.impl;

import com.example.HRMS.entity.Room;
import com.example.HRMS.entity.RoomPricing;
import com.example.HRMS.repository.RoomRepository;
import com.example.HRMS.repository.RoomPricingRepository;
import com.example.HRMS.service.RoomService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomPricingRepository pricingRepository;

    public RoomServiceImpl(RoomRepository roomRepository,
                           RoomPricingRepository pricingRepository) {
        this.roomRepository = roomRepository;
        this.pricingRepository = pricingRepository;
    }

    @Override
    public BigDecimal calculatePrice(Integer roomNumber, int nights) {

        Room room = roomRepository.findById(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Room.RoomType roomType = room.getRoomType();

        RoomPricing pricing = pricingRepository.findByRoomType(roomType)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        return pricing.getPricePerNight()
                .multiply(BigDecimal.valueOf(nights));
    }
}