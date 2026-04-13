package com.example.HRMS.listener;

import com.example.HRMS.entity.Reservation;
import com.example.HRMS.event.BookingCreatedEvent;
import com.example.HRMS.service.EmailService;
import com.example.HRMS.service.PdfService;

import com.example.HRMS.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class BookingListener {

    @Autowired
    private EmailService emailService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private SmsService smsService;

    private static final Logger logger = LoggerFactory.getLogger(BookingListener.class);

    @EventListener
    public void handleBookingCreated(BookingCreatedEvent event) {

        Reservation r = event.getReservation();

        // EMAIL
        try {
            byte[] pdf = pdfService.generateBookingPdf(r);

            emailService.sendBookingConfirmationWithPdf(
                    r.getEmail(),
                    r.getFullName(),
                    r.getBookingReference(),
                    r.getCheckInDate().toString(),
                    r.getCheckOutDate().toString(),
                    pdf
            );
        } catch (Exception e) {
            System.err.println("Email failed: " + e.getMessage());
        }

        // SMS
        try {
            smsService.sendSms(
                    r.getPhone(),
                    r.getBookingReference(),
                    r.getCheckInDate().toString()
            );
        } catch (Exception e) {
            System.err.println("SMS failed: " + e.getMessage());
        }
    }
}