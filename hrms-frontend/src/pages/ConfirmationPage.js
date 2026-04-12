import { useLocation } from "react-router-dom";

export default function ConfirmationPage() {

  const location = useLocation();
  const data = location.state || {};

  return (
    <div style={{
          maxWidth: "400px",
          margin: "60px auto",
          padding: "25px",
          textAlign: "center",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
      <h2>🎉 Booking Confirmed</h2>

      <p><strong>Booking ID:</strong> {data.bookingId}</p>
      <p><strong>Status:</strong> {data.status}</p>
      <p><strong>Reference:</strong> {data.bookingReference}</p>

      <a href="/search">
        <button style={{ padding: "10px", marginTop: "20px" }}>
          Book Another Room
        </button>
      </a>
    </div>
  );
}