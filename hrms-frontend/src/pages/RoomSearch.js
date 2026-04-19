import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PublicLayout from "../layouts/PublicLayout";

export default function RoomSearch() {

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {

    if (!checkIn || !checkOut) {
      Swal.fire("Error", "Select both dates", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get("/public/rooms/available", {
        params: { checkIn, checkOut }
      });

      setRooms(response.data);

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch rooms", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <h2>Search Available Rooms</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {rooms.length === 0 ? (
          <p>No rooms found</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.roomNumber}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px"
              }}
            >
              <p><strong>Room:</strong> {room.roomNumber}</p>
              <p><strong>Type:</strong> {room.roomType}</p>

              <p>
                <strong>Price/Night:</strong> ₹{room.price}
              </p>

              <p>
                <strong>Nights:</strong> {room.nights}
              </p>

              <p>
                <strong>Total:</strong> ₹{room.totalPrice}
              </p>

              <button
                onClick={() =>
                  navigate("/book", {
                    state: { room, checkIn, checkOut }
                  })
                }
                style={{
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Book Now
              </button>
            </div>
          ))
        )}
      </div>
    </PublicLayout>
  );
}