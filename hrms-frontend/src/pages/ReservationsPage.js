import { useEffect, useState } from "react";
import {
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation
} from "../services/reservationService";

function ReservationsPage() {

  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const data = await getReservations(page, 10);

      setReservations(data.content);
      setTotalPages(data.totalPages);

    } catch (error) {
      console.error("Error fetching reservations", error);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const previousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  useEffect(() => {
    fetchReservations();
  }, [page]);

  const handleEdit = (reservation) => {
    setEditingId(reservation.id);
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
    setRoomNumber("");
    setCheckInDate("");
    setCheckOutDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (!roomNumber || !checkInDate || !checkOutDate) {
      alert("All fields are required");
      return;
    }

    if (new Date(checkOutDate) < new Date(checkInDate)) {
      alert("Check-out date cannot be before check-in date");
      return;
    }

    try {
      setLoading(true);

      const reservationData = {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">

      <h2 className="mb-4">Reservations</h2>

      {/* FORM CARD */}
      <div className="card p-3 mb-4">

        <h4>
          {editingId
            ? `Edit Reservation #${editingId}`
            : "Create Reservation"}
        </h4>

        <form onSubmit={handleSubmit}>

          <div className="mb-2">
            <input
              className="form-control"
              type="text"
              placeholder="Room Number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              readOnly={editingId !== null}
              style={{
                backgroundColor: editingId !== null ? "#eee" : "white",
                cursor: editingId !== null ? "not-allowed" : "text"
              }}
            />
          </div>

          <div className="mb-2">
            <input
              className="form-control"
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <input
              className="form-control"
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary me-2"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : (editingId ? "Update" : "Create")}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary"
          >
            {editingId ? "Cancel Edit" : "Clear Form"}
          </button>

        </form>

      </div>

      {/* LOADING */}
      {loading && <div className="text-center my-2">Loading...</div>}

      {/* TABLE */}
      <div className="card p-3">

        <table className="table table-bordered table-striped mb-0">

          <thead className="table-light">
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

            {reservations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No reservations found
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (

                <tr
                  key={reservation.id}
                  className={
                    reservation.status === "CANCELLED"
                      ? "table-danger text-decoration-line-through"
                      : ""
                  }
                >

                  <td>{reservation.id}</td>
                  <td>{reservation.username}</td>
                  <td>{reservation.roomNumber}</td>
                  <td>{reservation.checkInDate}</td>
                  <td>{reservation.checkOutDate}</td>

                  <td>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      disabled={reservation.status === "CANCELLED"}
                      onClick={() => handleEdit(reservation)}
                    >
                      Edit
                    </button>

                    {reservation.status !== "CANCELLED" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancel(reservation.id)}
                      >
                        Cancel
                      </button>
                    )}

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">

        <button
          className="btn btn-outline-primary"
          onClick={previousPage}
          disabled={page === 0}
        >
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          className="btn btn-outline-primary"
          onClick={nextPage}
          disabled={page === totalPages - 1}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default ReservationsPage;