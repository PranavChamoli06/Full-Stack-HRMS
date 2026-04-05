package com.example.HRMS.scheduler;

import com.example.HRMS.service.impl.ReservationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationScheduler {

    private final ReservationServiceImpl reservationService;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void completeReservationsTask() {
        reservationService.completePastReservations();
        System.out.println("Auto-completed past reservations");
    }
}