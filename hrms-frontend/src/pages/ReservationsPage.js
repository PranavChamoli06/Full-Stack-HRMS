import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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

  const [preview, setPreview] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ================= FETCH =================

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations(page, size);

      setReservations(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReservations = async () => {
    try {
      const data = await getReservations(0, 1000);
      setAllReservations(data.content);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchAllReservations();
  }, [page, size]);

  // ================= HELPERS =================

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-");
    return new Date(y, m - 1, d);
  };

  const normalize = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const getCheckIn = (r) =>
    r.checkInDate || r.check_in_date || r.checkIn;

  const getCheckOut = (r) =>
    r.checkOutDate || r.check_out_date || r.checkOut;

  // ================= CALENDAR LOGIC =================

  const getBookingsForDate = (date) => {
    const current = normalize(date);

    return allReservations.filter((r) => {
      const start = normalize(parseDate(getCheckIn(r)));
      const end = normalize(parseDate(getCheckOut(r)));

      return current >= start && current < end;
    });
  };

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

  const handleEdit = (r) => {
    setEditingId(r.id);

    setRoomNumber(r.roomNumber);
    setCheckInDate(getCheckIn(r));
    setCheckOutDate(getCheckOut(r));

    setGuestName(r.guestName || "");
    setGuestEmail(r.guestEmail || "");
    setGuestPhone(r.guestPhone || "");

    setPreview(null);
  };

  const handleCancel = async (id) => {
    await cancelReservation(id);
    fetchReservations();
    fetchAllReservations();
  };

  const resetForm = () => {
    setEditingId(null);
    setRoomNumber("");
    setCheckInDate("");
    setCheckOutDate("");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setPreview(null);
  };

  // ================= PREVIEW =================

  const handlePreviewPrice = async () => {
    const res = await previewPrice({
      roomNumber: Number(roomNumber),
      checkInDate,
      checkOutDate
    });

    setPreview(res.data);
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

    if (editingId) {
      await updateReservation(editingId, data);
    } else {
      await createReservation(data);
    }

    resetForm();
    fetchReservations();
    fetchAllReservations();
  };

  return (
    <div className="container-fluid">

      <h2>Reservations</h2>

      {/* 🔥 CALENDAR */}
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

      {/* 🔥 SELECTED BOOKINGS TABLE */}
      <div className="card p-3 mb-4">

        <h5>Bookings on Selected Date</h5>

        {selectedBookings.length === 0 ? (
          <p>No bookings</p>
        ) : (
          <table className="table table-sm mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room</th>
                <th>Guest</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {selectedBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.roomNumber}</td>
                  <td>{b.guestName}</td>
                  <td>{getCheckIn(b)}</td>
                  <td>{getCheckOut(b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* FORM */}
      <div className="card p-3 mb-4">

        <h4>{editingId ? "Edit" : "Create"} Reservation</h4>

        <form onSubmit={handleSubmit}>

          <input className="form-control mb-2" placeholder="Room"
            value={roomNumber} onChange={e => setRoomNumber(e.target.value)} />

          <input className="form-control mb-2" placeholder="Name"
            value={guestName} onChange={e => setGuestName(e.target.value)} />

          <input className="form-control mb-2" placeholder="Email"
            value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />

          <input className="form-control mb-2" placeholder="Phone"
            value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />

          <input type="date" className="form-control mb-2"
            value={checkInDate} onChange={e => setCheckInDate(e.target.value)} />

          <input type="date" className="form-control mb-2"
            value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} />

          <button type="button" className="btn btn-info me-2"
            onClick={handlePreviewPrice}>Preview</button>

          <button className="btn btn-primary">Save</button>

        </form>

        {preview && <div className="mt-2">₹ {preview}</div>}

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
              <th></th>
            </tr>
          </thead>

          <tbody>
            {reservations.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.roomNumber}</td>
                <td>{r.guestName}</td>
                <td>{getCheckIn(r)} → {getCheckOut(r)}</td>
                <td>
                  <button onClick={() => handleEdit(r)}>Edit</button>
                  <button onClick={() => handleCancel(r.id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        <button disabled={page === 0} onClick={previousPage}>Prev</button>
        <button disabled={page >= totalPages - 1} onClick={nextPage}>Next</button>

      </div>

    </div>
  );
}

export default ReservationsPage;