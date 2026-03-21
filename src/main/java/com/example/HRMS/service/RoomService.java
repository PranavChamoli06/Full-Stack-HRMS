package com.example.HRMS.service;
import java.math.BigDecimal;

public interface RoomService {

    BigDecimal calculatePrice(Integer roomNumber, int nights);
}