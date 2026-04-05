import { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";

import {
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  previewPrice,
  checkAvailability   // 🔥 NEW
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
    const data = await getReservations(page, size);
    setReservations(data.content);
    setTotalPages(data.totalPages);
    setTotalElements(data.totalElements);
  };

  const fetchAllReservations = async () => {
    const data = await getReservations(0, 1000);
    setAllReservations(data.content);
  };

  useEffect(() => {
    fetchReservations();
  }, [page, size]);

  useEffect(() => {
    fetchAllReservations();
  }, []);

  // ================= HELPERS =================

  const parseDate = (str) => {
    const [y, m, d] = str.split("-");
    return new Date(y, m - 1, d);
  };

  const normalize = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const getCheckIn = (r) => r.checkInDate || r.check_in_date;
  const getCheckOut = (r) => r.checkOutDate || r.check_out_date;

  const getBookingsForDate = (date) => {
    const current = normalize(date);

    return allReservations.filter((r) => {

      if (!roomNumber) return false;
      if (Number(r.roomNumber) !== Number(roomNumber)) return false;

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
      icon: "warning",
      showCancelButton: true
    });

    if (!result.isConfirmed) return;

    await cancelReservation(id);
    Swal.fire("Cancelled!", "", "success");

    fetchReservations();
    fetchAllReservations();
  };

  const handlePreview = async () => {
    if (!roomNumber || !checkInDate || !checkOutDate) {
      Swal.fire("Error", "Fill all fields first", "warning");
      return;
    }

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

  // 🔥 NEW — AVAILABILITY CHECK
  const handleCheckAvailability = async () => {

    if (!roomNumber || !checkInDate || !checkOutDate) {
      Swal.fire("Error", "Fill all fields first", "warning");
      return;
    }

    try {
      await checkAvailability({
        roomNumber: Number(roomNumber),
        checkInDate,
        checkOutDate
      });

      Swal.fire("Available", "Room is available", "success");

    } catch (error) {

      if (error.response?.status === 500) {
        Swal.fire("Not Available", "Room already booked", "error");
      } else {
        Swal.fire("Error", "Something went wrong", "error");
      }

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: editingId ? "Update?" : "Create?",
      showCancelButton: true
    });

    if (!result.isConfirmed) return;

    const payload = {
      roomNumber: Number(roomNumber),
      checkInDate,
      checkOutDate,
      guestName,
      guestEmail,
      guestPhone
    };

    try {

      if (editingId) {
        await updateReservation(editingId, payload);
      } else {
        await createReservation(payload);
      }

      Swal.fire("Success", "Reservation saved successfully", "success");

      setEditingId(null);
      setRoomNumber("");
      setCheckInDate("");
      setCheckOutDate("");
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");

      fetchReservations();
      fetchAllReservations();

    } catch (error) {

      if (error.response?.status === 409) {
        Swal.fire("Booking Conflict", error.response.data, "warning");
      } else {
        Swal.fire("Error", "Something went wrong", "error");
      }

    }
  };

  // ================= UI =================

  return (
    <div className="container-fluid">

      <h2>Reservations</h2>

      {/* CALENDAR */}
      <div className="card p-3 mb-4">

        <Calendar
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setSelectedBookings(getBookingsForDate(date));
          }}

          tileDisabled={({ date, view }) => {
            if (view !== "month") return false;
            return getBookingsForDate(date).length > 0;
          }}

          tileClassName={({ date, view }) => {
            if (view !== "month") return null;

            return date.toDateString() === selectedDate.toDateString()
              ? "selected-date"
              : null;
          }}

          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const count = getBookingsForDate(date).length;

            return count > 0 ? (
              <div style={{ fontSize: "10px" }}>{count}</div>
            ) : null;
          }}
        />

      </div>

      {/* FORM */}
      <div ref={formRef} className="card p-3 mb-4">

        <form onSubmit={handleSubmit}>

          <input placeholder="Room Number" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="form-control mb-2" />
          <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} className="form-control mb-2" />
          <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} className="form-control mb-2" />

          <input placeholder="Guest Name" value={guestName} onChange={e => setGuestName(e.target.value)} className="form-control mb-2" />
          <input placeholder="Guest Email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className="form-control mb-2" />
          <input placeholder="Guest Phone" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="form-control mb-2" />

          <button type="button" className="btn btn-info me-2" onClick={handlePreview}>Preview</button>

          {/* 🔥 NEW BUTTON */}
          <button type="button" className="btn btn-warning me-2" onClick={handleCheckAvailability}>
            Check Availability
          </button>

          <button className="btn btn-primary">Save</button>

        </form>

      </div>

      {/* TABLE */}
      <div className="card p-3">

        <h5>Total: {totalElements}</h5>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Room</th>
              <th>Guest</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map(r => {

              const isCancelled = r.status === "CANCELLED";

              return (
                <tr key={r.id} style={{ background: isCancelled ? "#ffcccc" : "" }}>
                  <td>{r.id}</td>
                  <td>{r.roomNumber}</td>
                  <td>{r.guestName}</td>
                  <td>{getCheckIn(r)} → {getCheckOut(r)}</td>

                  <td>
                    {!isCancelled && (
                      <>
                        <button className="btn btn-success me-2" onClick={() => handleEdit(r)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleCancel(r.id)}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button className="btn btn-warning me-2" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <button className="btn btn-success" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>

      </div>

    </div>
  );
}

export default ReservationsPage;
