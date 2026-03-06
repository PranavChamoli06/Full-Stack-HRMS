import { useEffect, useState } from "react";
import {
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation
} from "../services/reservationService";

function ReservationsPage() {

  const [reservations, setReservations] = useState([]);
  const [username, setUsername] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  const handleEdit = (reservation) => {
    setEditingId(reservation.id);
    setUsername(reservation.username);
    setRoomNumber(reservation.roomNumber);
    setCheckInDate(reservation.checkInDate);
    setCheckOutDate(reservation.checkOutDate);
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmCancel) return;

    try {
      await cancelReservation(id);
      alert("Reservation cancelled successfully");
      fetchReservations();
    } catch (error) {
      console.error("Error cancelling reservation", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setUsername("");
    setRoomNumber("");
    setCheckInDate("");
    setCheckOutDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const reservationData = {
        username,
        roomId: Number(roomNumber),
        checkInDate,
        checkOutDate
      };

      if (editingId) {

        await updateReservation(editingId, reservationData);
        alert("Reservation updated successfully");

      } else {

        await createReservation(reservationData);
        alert("Reservation created successfully");

      }

      resetForm();
      fetchReservations();

    } catch (error) {
      console.error("Error saving reservation", error);
    }
  };

  return (

    <div>

      <h2>Reservations</h2>

      <h3>
        {editingId
          ? `Edit Reservation #${editingId}`
          : "Create Reservation"}
      </h3>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          readOnly={editingId !== null}
          style={{
            backgroundColor: editingId !== null ? "#eee" : "white"
          }}
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

        <button type="submit">
          {editingId ? "Update Reservation" : "Create Reservation"}
        </button>

        <button
          type="button"
          onClick={resetForm}
          style={{ marginLeft: "10px" }}
        >
          {editingId ? "Cancel Edit" : "Clear Form"}
        </button>

      </form>

      <hr />

      <table
        border="1"
        style={{
          width: "80%",
          marginTop: "20px",
          borderCollapse: "collapse"
        }}
      >

        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {reservations.map((reservation) => (

            <tr
              key={reservation.id}
              style={{
                textDecoration:
                  reservation.status === "CANCELLED"
                    ? "line-through"
                    : "none",
                color:
                  reservation.status === "CANCELLED"
                    ? "gray"
                    : "black"
              }}
            >

              <td>{reservation.id}</td>
              <td>{reservation.username}</td>
              <td>{reservation.roomNumber}</td>
              <td>{reservation.checkInDate}</td>
              <td>{reservation.checkOutDate}</td>

              <td>

                <button
                  disabled={reservation.status === "CANCELLED"}
                  onClick={() => handleEdit(reservation)}
                >
                  Edit
                </button>

                {reservation.status !== "CANCELLED" && (

                  <button
                    style={{
                      marginLeft: "10px",
                      color: "red"
                    }}
                    onClick={() =>
                      handleCancel(reservation.id)
                    }
                  >
                    Cancel
                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default ReservationsPage;