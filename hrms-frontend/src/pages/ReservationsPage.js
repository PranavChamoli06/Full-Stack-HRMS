import { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";

import {
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  previewPrice
} from "../services/reservationService";

function ReservationsPage() {

  const formRef = useRef(null);

  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);

  const [roomNumber, setRoomNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedDate, setSelectedDate] = useState(new Date());

  // ================= FETCH =================

  const fetchReservations = async () => {
    try {
      const data = await getReservations(page, size);
      setReservations(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      Swal.fire("Error", "Failed to fetch reservations", "error");
    }
  };

  const fetchAllReservations = async () => {
    const data = await getReservations(0, 1000);
    setAllReservations(data.content);
  };

  useEffect(() => {
    fetchReservations();
    fetchAllReservations();
  }, [page, size]);

  // ================= HELPERS =================

  const parseDate = (str) => {
    const [y, m, d] = str.split("-");
    return new Date(y, m - 1, d);
  };

  const normalize = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const getCheckIn = (r) =>
    r.checkInDate || r.check_in_date;

  const getCheckOut = (r) =>
    r.checkOutDate || r.check_out_date;

  const getBookingsForDate = (date) => {
    const current = normalize(date);

    return allReservations.filter((r) => {
      const start = normalize(parseDate(getCheckIn(r)));
      const end = normalize(parseDate(getCheckOut(r)));

      return current >= start && current < end;
    });
  };

  // ================= ACTIONS =================

  const handleEdit = (r) => {

    setEditingId(r.id);

    setRoomNumber(r.roomNumber);
    setCheckInDate(getCheckIn(r));
    setCheckOutDate(getCheckOut(r));

    setGuestName(r.guestName || "");
    setGuestEmail(r.guestEmail || "");
    setGuestPhone(r.guestPhone || "");

    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancel = async (id) => {

    const result = await Swal.fire({
      title: "Cancel Reservation?",
      text: "This will mark it as cancelled",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes"
    });

    if (!result.isConfirmed) return;

    try {
      await cancelReservation(id);

      Swal.fire("Cancelled!", "Reservation cancelled", "success");

      fetchReservations();
      fetchAllReservations();

    } catch {
      Swal.fire("Error", "Cancel failed", "error");
    }
  };

  const handlePreview = async () => {
    try {
      const res = await previewPrice({
        roomNumber: Number(roomNumber),
        checkInDate,
        checkOutDate
      });

      Swal.fire("Preview Price", `₹ ${res.data}`, "info");

    } catch {
      Swal.fire("Error", "Preview failed", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      roomNumber: Number(roomNumber),
      checkInDate,
      checkOutDate,
      guestName,
      guestEmail,
      guestPhone
    };

    const result = await Swal.fire({
      title: editingId ? "Update Reservation?" : "Create Reservation?",
      icon: "question",
      showCancelButton: true
    });

    if (!result.isConfirmed) return;

    try {
      if (editingId) {
        await updateReservation(editingId, data);
        Swal.fire("Updated!", "Reservation updated", "success");
      } else {
        await createReservation(data);
        Swal.fire("Created!", "Reservation created", "success");
      }

      setEditingId(null);
      setRoomNumber("");
      setCheckInDate("");
      setCheckOutDate("");
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");

      fetchReservations();
      fetchAllReservations();

    } catch {
      Swal.fire("Error", "Operation failed", "error");
    }
  };

  // ================= UI =================

  return (
    <div className="container-fluid">

      <h2>Reservations</h2>

      {/* CALENDAR */}
      <div className="card p-3 mb-4">

        <h4>Booking Calendar</h4>

        <Calendar
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setSelectedBookings(getBookingsForDate(date));
          }}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const count = getBookingsForDate(date).length;

            return count > 0 ? (
              <div style={{ fontSize: "10px", color: "red" }}>
                {count}
              </div>
            ) : null;
          }}
        />

      </div>

      {/* SELECTED BOOKINGS */}
      <div className="card p-3 mb-4">

        <h5>Bookings on Selected Date</h5>

        {selectedBookings.length === 0 ? (
          <p>No bookings</p>
        ) : (
          <table className="table table-sm">

            <thead>
              <tr>
                <th>ID</th>
                <th>Room</th>
                <th>Guest</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {selectedBookings.map((b) => {

                const isCancelled = b.status === "CANCELLED";

                return (
                  <tr key={b.id}
                    style={{
                      backgroundColor: isCancelled ? "#ffcccc" : ""
                    }}
                  >
                    <td>{b.id}</td>
                    <td>{b.roomNumber}</td>
                    <td>{b.guestName}</td>
                    <td>{getCheckIn(b)}</td>
                    <td>{getCheckOut(b)}</td>

                    <td>
                      {isCancelled ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          CANCELLED
                        </span>
                      ) : (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleEdit(b)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(b.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        )}

      </div>

      {/* FORM */}
      <div className="card p-3 mb-4" ref={formRef}>

        <h4>{editingId ? "Edit Reservation" : "Create Reservation"}</h4>

        <form onSubmit={handleSubmit}>

          <input className="form-control mb-2" placeholder="Room"
            value={roomNumber} onChange={e => setRoomNumber(e.target.value)} />

          <input className="form-control mb-2" placeholder="Guest Name"
            value={guestName} onChange={e => setGuestName(e.target.value)} />

          <input className="form-control mb-2" placeholder="Email"
            value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />

          <input className="form-control mb-2" placeholder="Phone"
            value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />

          <input type="date" className="form-control mb-2"
            value={checkInDate} onChange={e => setCheckInDate(e.target.value)} />

          <input type="date" className="form-control mb-2"
            value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} />

          <button
            type="button"
            className="btn btn-info me-2"
            onClick={handlePreview}
          >
            Preview
          </button>

          <button className="btn btn-success">
            {editingId ? "Update" : "Save"}
          </button>

        </form>

      </div>

      {/* TABLE */}
      <div className="card p-3">

        <strong>Total: {totalElements}</strong>

        <table className="table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Room</th>
              <th>Guest</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map(r => {

              const isCancelled = r.status === "CANCELLED";

              return (
                <tr key={r.id}
                  style={{
                    backgroundColor: isCancelled ? "#ffcccc" : ""
                  }}
                >
                  <td>{r.id}</td>
                  <td>{r.roomNumber}</td>
                  <td>{r.guestName}</td>
                  <td>{getCheckIn(r)} → {getCheckOut(r)}</td>

                  <td>
                    {isCancelled ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        CANCELLED
                      </span>
                    ) : (
                      <span style={{ color: "green" }}>
                        ACTIVE
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

        <button
          className="btn btn-warning me-2"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <button
          className="btn btn-success"
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default ReservationsPage;