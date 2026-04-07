package com.example.HRMS.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendBookingConfirmationWithPdf(
            String toEmail,
            String name,
            String reference,
            String checkIn,
            String checkOut,
            byte[] pdfBytes
    ) throws Exception {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("Booking Confirmed - " + reference);

        helper.setText(
                "Hello " + name + ",\n\n" +
                        "Your booking is confirmed.\n\n" +
                        "Booking Reference: " + reference + "\n" +
                        "Check-in: " + checkIn + "\n" +
                        "Check-out: " + checkOut
        );

        helper.addAttachment("booking.pdf",
                () -> new java.io.ByteArrayInputStream(pdfBytes));

        mailSender.send(message);
    }
}