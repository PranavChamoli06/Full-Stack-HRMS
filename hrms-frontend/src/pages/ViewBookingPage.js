import { useState } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";
import PublicLayout from "../layouts/PublicLayout";

import lobbyBg from "../assets/lobby-bg.jpg";
import "../styles/ViewBookingPage.css";

export default function ViewBookingPage() {
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const showError = (msg) => Swal.fire("Error", msg, "error");
  const showSuccess = (msg) => Swal.fire("Success", msg, "success");

  const confirmAction = async (msg) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: msg,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb"
    });

    return res.isConfirmed;
  };

  const handleSearch = async () => {
    if (!reference) return showError("Enter booking reference");

    setLoading(true);

    try {
      const res = await axios.get("/public/reservations", {
        params: { reference }
      });

      setBooking(res.data);

    } catch {
      showError("Booking not found");
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirm = await confirmAction("Cancel this booking?");
    if (!confirm) return;

    try {
      await axios.put("/public/reservations/cancel", null, {
        params: { reference }
      });

      showSuccess("Booking cancelled");

      setBooking((prev) => ({
        ...prev,
        status: "CANCELLED"
      }));

    } catch {
      showError("Cancellation failed");
    }
  };

  return (
    <PublicLayout>
      <div
        className="view-booking-page"
        style={{ backgroundImage: `url(${lobbyBg})` }}
      >
        <div className="view-booking-card">

          <h2>View Booking</h2>

          <input
            className="glass-input"
            placeholder="Enter Booking Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="search-btn"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          {booking && (
            <div className="booking-details">

              <p><strong>Name:</strong> {booking.fullName}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Room:</strong> {booking.roomNumber}</p>
              <p><strong>Check-in:</strong> {booking.checkInDate}</p>
              <p><strong>Check-out:</strong> {booking.checkOutDate}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    booking.status === "CANCELLED"
                      ? "status-badge cancelled"
                      : "status-badge active"
                  }
                >
                  {booking.status}
                </span>
              </p>

              {booking.status !== "CANCELLED" && (
                <button
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  Cancel Booking
                </button>
              )}

            </div>
          )}

        </div>
      </div>
    </PublicLayout>
  );
}