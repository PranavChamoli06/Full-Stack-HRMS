import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";
import PublicLayout from "../layouts/PublicLayout";

export default function BookingPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const { room, checkIn, checkOut } = location.state || {};

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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
    .then(res => setPreview(res.data))
    .catch(err => console.error(err));

  }, [room, checkIn, checkOut]);

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
        checkOut
      });

      navigate("/confirmation", { state: res.data });

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
  <PublicLayout>
    <h2 style={{ textAlign: "center" }}>Book Room</h2>

    <p>Room: {room?.roomNumber}</p>
    <p>Check-in: {checkIn}</p>
    <p>Check-out: {checkOut}</p>

    {preview && (
      <div>
        <p>Price/Night: ₹{preview.pricePerNight}</p>
        <p>Nights: {preview.nights}</p>
        <p><strong>Total: ₹{preview.totalPrice}</strong></p>
      </div>
    )}

    {/* Inputs */}
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
      <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <button onClick={handleBooking}>
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  </PublicLayout>
);
}