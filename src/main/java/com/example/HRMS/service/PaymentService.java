package com.example.HRMS.service;

import com.example.HRMS.entity.*;
import com.example.HRMS.enums.PaymentMode;
import com.example.HRMS.enums.PaymentStatus;
import com.example.HRMS.event.BookingCreatedEvent;
import com.example.HRMS.repository.PaymentRepository;
import com.example.HRMS.repository.ReservationRepository;
import com.example.HRMS.repository.RoomPricingRepository;
import com.example.HRMS.service.PricingService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final RoomPricingRepository roomPricingRepository;
    private final PricingService pricingService;
    private final ApplicationEventPublisher publisher;

    public PaymentService(
            PaymentRepository paymentRepository,
            ReservationRepository reservationRepository,
            RoomPricingRepository roomPricingRepository,
            PricingService pricingService,
            ApplicationEventPublisher publisher
    ) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
        this.roomPricingRepository = roomPricingRepository;
        this.pricingService = pricingService;
        this.publisher = publisher;
    }

    // ================= CREATE ORDER =================
    public JSONObject createOrder(Long reservationId) throws Exception {

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // block duplicate success payment
        boolean alreadyPaid = paymentRepository.findAll()
                .stream()
                .anyMatch(p ->
                        p.getReservation().getId().equals(reservationId)
                                && p.getStatus() == PaymentStatus.SUCCESS
                );

        if (alreadyPaid) {
            throw new RuntimeException("Payment already completed for this reservation");
        }

        // fail old pending attempts
        List<Payment> oldPending = paymentRepository.findAll()
                .stream()
                .filter(p ->
                        p.getReservation().getId().equals(reservationId)
                                && p.getStatus() == PaymentStatus.PENDING
                )
                .toList();

        for (Payment p : oldPending) {
            p.setStatus(PaymentStatus.FAILED);
        }

        paymentRepository.saveAll(oldPending);

        // secure backend amount calculation
        Room room = reservation.getRoom();

        RoomPricing pricing = roomPricingRepository
                .findByRoomType(room.getRoomType())
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        double base = pricing.getPricePerNight().doubleValue();
        double total = 0;

        LocalDate current = reservation.getCheckInDate();

        while (current.isBefore(reservation.getCheckOutDate())) {
            total += pricingService.calculatePrice(base, current);
            current = current.plusDays(1);
        }

        BigDecimal amount = BigDecimal.valueOf(total);

        JSONObject options = new JSONObject();
        options.put("amount", amount.multiply(new BigDecimal(100)).intValue());
        options.put("currency", "INR");
        options.put("receipt", "txn_" + reservationId);

        Order order = client.orders.create(options);

        String razorpayOrderId = order.get("id");

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaymentMode(PaymentMode.PREPAID);
        payment.setPaymentGateway("RAZORPAY");
        payment.setRazorpayOrderId(razorpayOrderId);

        paymentRepository.save(payment);

        return order.toJson();
    }

    // ================= VERIFY PAYMENT =================
    public void verifyPayment(
            Long reservationId,
            String paymentId,
            String orderId,
            String signature
    ) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Payment payment = paymentRepository.findAll()
                .stream()
                .filter(p ->
                        p.getReservation().getId().equals(reservationId)
                                && p.getStatus() == PaymentStatus.PENDING
                )
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active payment found"));

        try {
            String payload = orderId + "|" + paymentId;

            boolean valid = Utils.verifySignature(payload, signature, keySecret);

            if (!valid) {
                throw new RuntimeException("Invalid payment signature");
            }

        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed");
        }

        payment.setTransactionId(paymentId);
        payment.setRazorpayOrderId(orderId);
        payment.setRazorpaySignature(signature);
        payment.setStatus(PaymentStatus.SUCCESS);

        paymentRepository.save(payment);

        // confirm booking + send notification only after successful payment
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
            reservationRepository.save(reservation);

            publisher.publishEvent(new BookingCreatedEvent(reservation));
        }
    }
}