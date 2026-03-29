import { useEffect, useState } from "react";
import {
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  previewPrice
} from "../services/reservationService";

function ReservationsPage() {

  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);

  const [roomNumber, setRoomNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // 🔥 NEW GUEST STATES
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [editingId, setEditingId] = useState(null);

  // 🔥 PAGINATION
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 🔥 PRICE
  const [preview, setPreview] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const data = await getReservations(page, size);

      setReservations(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);

    } catch (error) {
      console.error("Error fetching reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [page, size]);

  // ================= PAGINATION =================

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const previousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handlePageSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  // ================= FORM =================

  const handleEdit = (reservation) => {
    setEditingId(reservation.id);

    setRoomNumber(reservation.roomNumber);
    setCheckInDate(reservation.checkInDate);
    setCheckOutDate(reservation.checkOutDate);

    // 🔥 NEW
    setGuestName(reservation.guestName || "");
    setGuestEmail(reservation.guestEmail || "");
    setGuestPhone(reservation.guestPhone || "");

    setPreview(null);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;

    try {
      await cancelReservation(id);
      alert("Reservation cancelled");
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

    // 🔥 NEW
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");

    setPreview(null);
  };

  // ================= PREVIEW =================

  const handlePreviewPrice = async () => {

    if (!roomNumber || !checkInDate || !checkOutDate) {
      alert("Fill all fields first");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert("Invalid dates");
      return;
    }

    try {
      const res = await previewPrice({
        roomNumber: Number(roomNumber),
        checkInDate,
        checkOutDate
      });

      setPreview(res.data);

    } catch (error) {
      console.error("Error fetching price preview", error);
      alert("Preview failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomNumber || !checkInDate || !checkOutDate) {
      alert("All fields required");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert("Invalid dates");
      return;
    }

    try {
      setLoading(true);

      const reservationData = {
        roomNumber: Number(roomNumber),
        checkInDate,
        checkOutDate,

        // 🔥 NEW
        guestName,
        guestEmail,
        guestPhone
      };

      if (editingId) {
        await updateReservation(editingId, reservationData);
        alert("Updated successfully");
      } else {
        await createReservation(reservationData);
        alert("Created successfully");
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

      {/* ================= FORM ================= */}
      <div className="card p-3 mb-4">

        <h4>
          {editingId
            ? `Edit Reservation #${editingId}`
            : "Create Reservation"}
        </h4>

        <form onSubmit={handleSubmit}>

          <input
            className="form-control mb-2"
            type="number"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            readOnly={editingId !== null}
          />

          {/* 🔥 NEW FIELDS */}
          <input
            className="form-control mb-2"
            type="text"
            placeholder="Guest Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <input
            className="form-control mb-2"
            type="email"
            placeholder="Guest Email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
          />

          <input
            className="form-control mb-2"
            type="text"
            placeholder="Guest Phone"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
          />

          <input
            className="form-control mb-2"
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />

          <input
            className="form-control mb-2"
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />

          <button
            type="button"
            className="btn btn-info mb-2 me-2"
            onClick={handlePreviewPrice}
          >
            Preview Price
          </button>

          <button className="btn btn-primary me-2" disabled={loading}>
            {loading ? "Processing..." : (editingId ? "Update" : "Create")}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary"
          >
            Clear
          </button>

        </form>

        {preview !== null && (
          <div className="alert alert-success mt-3">
            <h5>Total Price: ₹{preview}</h5>
          </div>
        )}

      </div>

      {/* ================= TABLE ================= */}
      <div className="card p-3">

        {/* HEADER */}
        <div className="d-flex justify-content-between mb-3">
          <div>
            <strong>Total Reservations: {totalElements}</strong>
          </div>

          <div>
            <label className="me-2">Page Size:</label>
            <select value={size} onChange={handlePageSizeChange}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <table className="table table-bordered table-striped">

          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Guest</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {reservations.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No reservations found
                </td>
              </tr>
            ) : (
              reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.username}</td>
                  <td>{r.roomNumber}</td>
                  <td>{r.guestName}</td>
                  <td>{r.guestEmail}</td>
                  <td>{r.guestPhone}</td>
                  <td>{r.checkInDate}</td>
                  <td>{r.checkOutDate}</td>
                  <td>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(r)}
                    >
                      Edit
                    </button>

                    {r.status !== "CANCELLED" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(r.id)}
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

        {/* PAGINATION */}
        <div className="d-flex justify-content-between mt-3">

          <button
            className="btn btn-secondary"
            onClick={previousPage}
            disabled={page === 0}
          >
            Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            className="btn btn-secondary"
            onClick={nextPage}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReservationsPage;