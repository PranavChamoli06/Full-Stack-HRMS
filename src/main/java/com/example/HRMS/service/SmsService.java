package com.example.HRMS.service;

import com.example.HRMS.entity.NotificationLog;
import com.example.HRMS.repository.NotificationLogRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    private final NotificationLogRepository notificationLogRepository;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    @Async
    public void sendSms(String to, String ref, String checkIn) {

        String messageText = "Booking Confirmed!\n" +
                "Ref: " + ref + "\n" +
                "Check-in: " + checkIn;

        NotificationLog log = NotificationLog.builder()
                .type("SMS")
                .recipient(to)
                .message(messageText)
                .status("PENDING")
                .build();

        notificationLogRepository.save(log);

        try {
            Message.creator(
                    new PhoneNumber("+91" + to),
                    new PhoneNumber(fromNumber),
                    messageText
            ).create();

            log.setStatus("SUCCESS");

        } catch (Exception e) {
            log.setStatus("FAILED");
            log.setErrorMessage(e.getMessage());
        }

        notificationLogRepository.save(log);
    }
}