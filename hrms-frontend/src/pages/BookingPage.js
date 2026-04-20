import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";
import PublicLayout from "../layouts/PublicLayout";

import bookBg from "../assets/book-bg.jpg";
import "../styles/BookingPage.css";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { room, checkIn, checkOut } = location.state || {};

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [paymentMode, setPaymentMode] = useState("PREPAID");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!room) return;

    axios.get("/public/price-preview", {
      params: {
        roomNumber: room.roomNumber,
        checkIn,
        checkOut
      }
    })
    .then((res) => setPreview(res.data))
    .catch((err) => console.error(err));

  }, [room, checkIn, checkOut]);

  const startPayment = async (reservationId, bookingData) => {
    try {
      const orderRes = await axios.post("/payment/create-order", {
        reservationId
      });

      const order = orderRes.data;

      const options = {
        key: "rzp_test_SeCPCHimL3u54c",
        amount: order.amount,
        currency: "INR",
        name: "HRMS Booking",
        description: "Room Reservation",
        order_id: order.id,

        handler: async function (response) {
          await axios.post("/payment/verify", {
            reservationId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });

          Swal.fire("Success", "Payment Successful!", "success");

          navigate("/confirmation", {
            state: {
              ...bookingData,
              status: "CONFIRMED"
            }
          });
        },

        prefill: {
          name: fullName,
          email,
          contact: phone
        },

        theme: {
          color: "#8e63ff"
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.open();

      rzp.on("payment.failed", function () {
        Swal.fire("Error", "Payment Failed", "error");
      });

    } catch (err) {
      Swal.fire("Error", "Payment initiation failed", "error");
    }
  };

  const handleBooking = async () => {
    if (!fullName || !email || !phone) {
      Swal.fire("Error", "All fields required", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/public/reservations", {
        fullName,
        email,
        phone,
        roomNumber: room.roomNumber,
        checkIn,
        checkOut,
        paymentMode
      });

      const bookingData = res.data;
      const reservationId = bookingData.bookingId || bookingData.id;

      if (paymentMode === "PREPAID") {
        await startPayment(reservationId, bookingData);
      } else {
        Swal.fire("Success", "Booking Confirmed!", "success");
        navigate("/confirmation", { state: bookingData });
      }

    } catch (err) {
      Swal.fire("Error", "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div
        className="booking-page"
        style={{ backgroundImage: `url(${bookBg})` }}
      >
        <div className="booking-card">

          <h2>Book Room</h2>

          <div className="booking-summary">
            <p>Room: {room?.roomNumber}</p>
            <p>Check-in: {checkIn}</p>
            <p>Check-out: {checkOut}</p>

            {preview && (
              <>
                <p>Price/Night: ₹{preview.pricePerNight}</p>
                <p>Nights: {preview.nights}</p>
                <p><strong>Total: ₹{preview.totalPrice}</strong></p>
              </>
            )}
          </div>

          <div className="booking-form">

            <input
              className="glass-input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              className="glass-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="glass-input"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <select
              className="glass-input"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="PREPAID">Pay Now (Online)</option>
              <option value="PAY_AT_HOTEL">Pay at Hotel</option>
            </select>

            <button
              onClick={handleBooking}
              disabled={loading}
              className="confirm-btn"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>

          </div>

        </div>
      </div>
    </PublicLayout>
  );
}