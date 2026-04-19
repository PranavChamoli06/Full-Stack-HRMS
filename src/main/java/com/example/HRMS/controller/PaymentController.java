package com.example.HRMS.controller;

import com.example.HRMS.service.PaymentService;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 🔹 CREATE ORDER (UPDATED)
    @PostMapping("/create-order")
    public String createOrder(@RequestBody Map<String, Object> data) throws Exception {

        Long reservationId = Long.valueOf(data.get("reservationId").toString());

        JSONObject order = paymentService.createOrder(reservationId);

        return order.toString();
    }

    // 🔹 VERIFY PAYMENT (SECURE VERSION)
    @PostMapping("/verify")
    public String verifyPayment(@RequestBody Map<String, String> data) {

        Long reservationId = Long.valueOf(data.get("reservationId"));
        String paymentId = data.get("razorpayPaymentId");
        String orderId = data.get("razorpayOrderId");
        String signature = data.get("razorpaySignature");

        paymentService.verifyPayment(reservationId, paymentId, orderId, signature);

        return "Payment Verified Successfully";
    }
}