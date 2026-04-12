import { useState } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";

import PublicLayout from "../layouts/PublicLayout";

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

  // 🔍 SEARCH
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

  // ❌ CANCEL
  const handleCancel = async () => {

    const confirm = await confirmAction("Cancel this booking?");
    if (!confirm) return;

    try {
      await axios.put("/public/reservations/cancel", null, {
        params: { reference }
      });

      showSuccess("Booking cancelled");

      // 🔥 update UI instantly
      setBooking(prev => ({
        ...prev,
        status: "CANCELLED"
      }));

    } catch {
      showError("Cancellation failed");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "40px auto",
      padding: "25px",
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <PublicLayout>
      <h2 style={{ textAlign: "center" }}>View Booking</h2>

      <input
        placeholder="Enter Booking Reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        style={{ padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
      />

      <button
        onClick={handleSearch}
        style={{
          marginTop: "12px",
          padding: "12px",
          width: "100%",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px"
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {booking && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Name:</strong> {booking.fullName}</p>
          <p><strong>Email:</strong> {booking.email}</p>
          <p><strong>Phone:</strong> {booking.phone}</p>
          <p><strong>Room:</strong> {booking.roomNumber}</p>
          <p><strong>Check-in:</strong> {booking.checkInDate}</p>
          <p><strong>Check-out:</strong> {booking.checkOutDate}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span style={{
              background: booking.status === "CANCELLED" ? "#dc2626" : "#16a34a",
              color: "white",
              padding: "4px 10px",
              borderRadius: "5px"
            }}>
              {booking.status}
            </span>
          </p>

          {booking.status !== "CANCELLED" && (
            <button
              onClick={handleCancel}
              style={{
                marginTop: "15px",
                padding: "12px",
                width: "100%",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px"
              }}
            >
              Cancel Booking
            </button>
          )}
        </div>
      )}
      </PublicLayout>
    </div>
  );
}