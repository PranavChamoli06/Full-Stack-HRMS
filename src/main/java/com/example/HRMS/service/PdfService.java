package com.example.HRMS.service;

import com.example.HRMS.entity.Reservation;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateBookingPdf(Reservation reservation) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Hotel Booking Confirmation"));
        document.add(new Paragraph("Booking Reference: " + reservation.getBookingReference()));
        document.add(new Paragraph("Name: " + reservation.getFullName()));
        document.add(new Paragraph("Email: " + reservation.getEmail()));
        document.add(new Paragraph("Room: " + reservation.getRoom().getRoomNumber()));
        document.add(new Paragraph("Check-in: " + reservation.getCheckInDate()));
        document.add(new Paragraph("Check-out: " + reservation.getCheckOutDate()));
        document.add(new Paragraph("Status: " + reservation.getStatus()));

        document.close();

        return out.toByteArray();
    }
}