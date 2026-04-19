import axios from "../api/axios";

export const createOrder = async (reservationId) => {
    const res = await axios.post("/payment/create-order", {
        reservationId
    });
    return res.data;
};

export const verifyPayment = async (data) => {
    return axios.post("/payment/verify", data);
};

export const startPayment = async (reservationId) => {
    try {
        const order = await createOrder(reservationId);

        const options = {
            key: "rzp_test_SeCPCHimL3u54c", // 🔥 replace
            amount: order.amount,
            currency: "INR",
            name: "HRMS Booking",
            description: "Room Reservation",
            order_id: order.id,

            handler: async function (response) {
                await verifyPayment({
                    reservationId,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature
                });

                alert("Payment Successful!");
                window.location.reload();
            },

            prefill: {
                name: "Guest",
                email: "guest@example.com",
                contact: "9999999999"
            },

            theme: {
                color: "#3399cc"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on("payment.failed", function (response) {
            console.error(response.error);
            alert("Payment Failed!");
        });

    } catch (err) {
        console.error(err);
        alert("Error starting payment");
    }
};