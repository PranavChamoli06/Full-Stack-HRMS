package com.example.HRMS.repository;

import com.example.HRMS.entity.Room;
import com.example.HRMS.entity.RoomPricing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomPricingRepository extends JpaRepository<RoomPricing, Integer> {

    Optional<RoomPricing> findByRoomType(Room.RoomType roomType);
}