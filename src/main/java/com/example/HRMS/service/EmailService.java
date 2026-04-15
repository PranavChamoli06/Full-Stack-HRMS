package com.example.HRMS.service;

import com.example.HRMS.entity.NotificationLog;
import com.example.HRMS.repository.NotificationLogRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final NotificationLogRepository notificationLogRepository;

    @Async
    public void sendBookingConfirmation(String toEmail, String message) {

        NotificationLog log = new NotificationLog();
        log.setType("EMAIL");
        log.setRecipient(toEmail);
        log.setMessage(message);

        try {
            SimpleMailMessage mail = new SimpleMailMessage();

            mail.setTo(toEmail);
            mail.setSubject("Booking Confirmation");
            mail.setText(message);

            mailSender.send(mail);

            log.setStatus("SUCCESS");

        } catch (Exception e) {
            log.setStatus("FAILED");
            log.setErrorMessage(e.getMessage());
        } finally {
            notificationLogRepository.save(log);
        }
    }

    @Async
    public void sendBookingConfirmationWithPdf(
            String toEmail,
            String name,
            String reference,
            String checkIn,
            String checkOut,
            byte[] pdfBytes
    ) {

        String messageText = "Hello " + name + ",\n\n" +
                "Your booking is confirmed.\n\n" +
                "Booking Reference: " + reference + "\n" +
                "Check-in: " + checkIn + "\n" +
                "Check-out: " + checkOut;

        NotificationLog log = NotificationLog.builder()
                .type("EMAIL")
                .recipient(toEmail)
                .message(messageText)
                .status("PENDING")
                .build();

        notificationLogRepository.save(log);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Booking Confirmed - " + reference);
            helper.setText(messageText);

            helper.addAttachment("booking.pdf",
                    () -> new java.io.ByteArrayInputStream(pdfBytes));

            mailSender.send(message);

            log.setStatus("SUCCESS");

        } catch (Exception e) {
            log.setStatus("FAILED");
            log.setErrorMessage(e.getMessage());
        }

        notificationLogRepository.save(log);
    }

    public void retryFailedEmails() {

        List<NotificationLog> failedLogs =
                notificationLogRepository.findByTypeAndStatus("EMAIL", "FAILED");

        for (NotificationLog log : failedLogs) {

            try {
                SimpleMailMessage mail = new SimpleMailMessage();
                mail.setTo(log.getRecipient());
                mail.setSubject("Retry: Booking Confirmation");
                mail.setText(log.getMessage());

                mailSender.send(mail);

                log.setStatus("SUCCESS");
                log.setErrorMessage(null);

            } catch (Exception e) {
                log.setErrorMessage(e.getMessage());
            }

            notificationLogRepository.save(log);
        }
    }
}