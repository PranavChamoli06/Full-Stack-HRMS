package com.example.HRMS.scheduler;

import com.example.HRMS.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationRetryScheduler {

    private final EmailService emailService;

    // Runs every 5 minutes
    @Scheduled(fixedRate = 300000)
    public void retryFailedNotifications() {

        System.out.println("Retrying failed email notifications...");

        emailService.retryFailedEmails();
    }
}