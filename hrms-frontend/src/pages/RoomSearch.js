import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PublicLayout from "../layouts/PublicLayout";

import roomSearchBg from "../assets/room-search-bg.jpg";
import "../styles/RoomSearch.css";

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
      <div
        className="room-search-page"
        style={{ backgroundImage: `url(${roomSearchBg})` }}
      >
        <div className="room-search-card">

          <h2>Search Available Rooms</h2>

          <div className="search-bar">

            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="glass-input"
            />

            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="glass-input"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="search-btn"
            >
              {loading ? "Searching..." : "Search"}
            </button>

          </div>

          {rooms.length === 0 ? (
            <p className="empty-text">No rooms found</p>
          ) : (
            rooms.map((room) => (
              <div
                key={room.roomNumber}
                className="room-card"
              >
                <p><strong>Room:</strong> {room.roomNumber}</p>
                <p><strong>Type:</strong> {room.roomType}</p>
                <p><strong>Price/Night:</strong> ₹{room.price}</p>
                <p><strong>Nights:</strong> {room.nights}</p>
                <p><strong>Total:</strong> ₹{room.totalPrice}</p>

                <button
                  onClick={() =>
                    navigate("/book", {
                      state: { room, checkIn, checkOut }
                    })
                  }
                  className="book-btn"
                >
                  Book Now
                </button>
              </div>
            ))
          )}

        </div>
      </div>
    </PublicLayout>
  );
}