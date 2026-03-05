import { useEffect, useState } from "react";
import { getReservations, createReservation } from "../services/reservationService";

function ReservationsPage() {

  const [reservations, setReservations] = useState([]);
  const [username, setUsername] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data.content || data);
    } catch (error) {
      console.error("Error fetching reservations", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      let roomId = null;

      if (roomNumber === "101") roomId = 1;
      if (roomNumber === "102") roomId = 2;
      if (roomNumber === "103") roomId = 3;
      if (roomNumber === "104") roomId = 4;

      if (!roomId) {
        alert("Invalid room number");
        return;
      }
      
      const reservationData = {
          userId: 1,
          roomId: roomId,
          checkInDate,
          checkOutDate
      };

      await createReservation(reservationData);

      alert("Reservation created successfully");

      fetchReservations();

      // Clear form after submission
      setUsername("");
      setRoomNumber("");
      setCheckInDate("");
      setCheckOutDate("");

    } catch (error) {
      console.error("Error creating reservation", error);
    }
  };

  return (

    <div>

      <h2>Reservations</h2>

      <h3>Create Reservation</h3>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />

        <br /><br />

        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />

        <br /><br />

        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create Reservation</button>

      </form>

      <hr />

      <table border="1" style={{ width: "80%", marginTop: "20px", borderCollapse: "collapse" }}>

        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>

        <tbody>

          {reservations.map((reservation) => (
            <tr key={reservation.id}>

              <td>{reservation.id}</td>
              <td>{reservation.username}</td>
              <td>{reservation.roomNumber}</td>
              <td>{reservation.checkInDate}</td>
              <td>{reservation.checkOutDate}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );
}

export default ReservationsPage;