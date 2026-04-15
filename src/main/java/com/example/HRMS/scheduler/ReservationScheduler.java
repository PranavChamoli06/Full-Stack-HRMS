package com.example.HRMS.scheduler;

import com.example.HRMS.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationScheduler {

    private final ReservationService reservationService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void completeReservationsTask() {
        reservationService.completePastReservations();
        System.out.println("Auto-completed past reservations");
    }
}