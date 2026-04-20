import { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import "../styles/Reservations.css";

import {
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  previewPrice,
  checkAvailability
} from "../services/reservationService";

function ReservationsPage() {
  const formRef = useRef(null);

  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);

  const [roomNumber, setRoomNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [paymentMode, setPaymentMode] = useState("PAY_AT_HOTEL");

  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(0);
  const [size] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchReservations = async () => {
    try {
      const data = await getReservations(page, size);

      setReservations(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllReservations = async () => {
    try {
      const data = await getReservations(0, 1000);
      setAllReservations(data.content || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchAllReservations();

    const interval = setInterval(fetchReservations, 3000);

    return () => clearInterval(interval);
  }, [page]);

  const getCheckIn = (r) => r.checkInDate || r.check_in_date;
  const getCheckOut = (r) => r.checkOutDate || r.check_out_date;

  const getPaymentMode = (r) =>
    r.paymentMode || r.payment_mode || "-";

  const formatPaymentMode = (r) =>
    getPaymentMode(r) === "-"
      ? "-"
      : getPaymentMode(r).replaceAll("_", " ");

  const getStatus = (r) =>
    r.status || r.reservationStatus || "-";

  const handleEdit = (r) => {
    if (getStatus(r) === "CANCELLED") return;

    setEditingId(r.id);
    setRoomNumber(r.roomNumber || r.room_number);
    setCheckInDate(getCheckIn(r));
    setCheckOutDate(getCheckOut(r));
    setGuestName(r.fullName || r.full_name || "");
    setGuestEmail(r.email || "");
    setGuestPhone(r.phone || "");
    setPaymentMode(
      r.paymentMode ||
        r.payment_mode ||
        "PAY_AT_HOTEL"
    );

    formRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Reservation?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      await cancelReservation(id);

      Swal.fire(
        "Cancelled",
        "Reservation cancelled successfully",
        "success"
      );

      fetchReservations();
      fetchAllReservations();
    } catch (error) {
      Swal.fire("Error", "Unable to cancel", "error");
    }
  };

  const handlePreview = async () => {
    if (!roomNumber || !checkInDate || !checkOutDate) {
      Swal.fire(
        "Error",
        "Fill all fields first",
        "warning"
      );
      return;
    }

    try {
      const res = await previewPrice({
        roomNumber: Number(roomNumber),
        checkInDate,
        checkOutDate
      });

      Swal.fire(
        "Price Preview",
        `₹ ${res.data}`,
        "info"
      );
    } catch {
      Swal.fire(
        "Error",
        "Preview failed",
        "error"
      );
    }
  };

  const handleCheckAvailability = async () => {
    if (!roomNumber || !checkInDate || !checkOutDate) {
      Swal.fire(
        "Error",
        "Fill all fields first",
        "warning"
      );
      return;
    }

    try {
      await checkAvailability({
        roomNumber: Number(roomNumber),
        checkInDate,
        checkOutDate
      });

      Swal.fire(
        "Available",
        "Room is available",
        "success"
      );
    } catch {
      Swal.fire(
        "Not Available",
        "Room already booked",
        "error"
      );
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setRoomNumber("");
    setCheckInDate("");
    setCheckOutDate("");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setPaymentMode("PAY_AT_HOTEL");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      roomNumber: Number(roomNumber),
      checkInDate,
      checkOutDate,
      fullName: guestName,
      email: guestEmail,
      phone: guestPhone,
      paymentMode
    };

    try {
      if (editingId) {
        await updateReservation(editingId, payload);
      } else {
        await createReservation(payload);
      }

      Swal.fire(
        "Success",
        "Reservation saved successfully",
        "success"
      );

      resetForm();
      fetchReservations();
      fetchAllReservations();
    } catch (error) {
      if (error.response?.status === 409) {
        Swal.fire(
          "Conflict",
          error.response.data,
          "warning"
        );
      } else {
        Swal.fire(
          "Error",
          "Something went wrong",
          "error"
        );
      }
    }
  };

  const getStatusClass = (status) => {
    if (status === "CONFIRMED") return "text-success";
    if (status === "PENDING") return "text-warning";
    if (status === "CANCELLED") return "text-danger";
    if (status === "COMPLETED") return "text-info";
    return "";
  };

  return (
    <div>
      <h2 className="page-title mb-4">
        Reservations
      </h2>

      <div className="glass-chart-card mb-4">
        <Calendar
          value={selectedDate}
          onChange={(date) =>
            setSelectedDate(date)
          }
        />
      </div>

      <div
        ref={formRef}
        className="glass-chart-card mb-4"
      >
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) =>
              setRoomNumber(e.target.value)
            }
            className="form-control glass-input mb-2"
          />

          <input
            type="date"
            value={checkInDate}
            onChange={(e) =>
              setCheckInDate(e.target.value)
            }
            className="form-control glass-input mb-2"
          />

          <input
            type="date"
            value={checkOutDate}
            onChange={(e) =>
              setCheckOutDate(e.target.value)
            }
            className="form-control glass-input mb-2"
          />

          <input
            placeholder="Guest Name"
            value={guestName}
            onChange={(e) =>
              setGuestName(e.target.value)
            }
            className="form-control glass-input mb-2"
          />

          <input
            placeholder="Guest Email"
            value={guestEmail}
            onChange={(e) =>
              setGuestEmail(e.target.value)
            }
            className="form-control glass-input mb-2"
          />

          <input
            placeholder="Guest Phone"
            value={guestPhone}
            onChange={(e) =>
              setGuestPhone(e.target.value)
            }
            className="form-control glass-input mb-2"
          />

          <select
            value={paymentMode}
            onChange={(e) =>
              setPaymentMode(e.target.value)
            }
            className="form-control glass-input mb-3"
          >
            <option value="PAY_AT_HOTEL">
              Pay at Hotel
            </option>
            <option value="PREPAID">
              Prepaid
            </option>
          </select>

          <button
            type="button"
            className="btn btn-info me-2"
            onClick={handlePreview}
          >
            Preview
          </button>

          <button
            type="button"
            className="btn btn-warning me-2"
            onClick={handleCheckAvailability}
          >
            Check Availability
          </button>

          <button className="btn btn-primary">
            {editingId ? "Update" : "Save"}
          </button>
        </form>
      </div>

      <div className="glass-chart-card">
        <h4 className="mb-3">
          Total: {totalElements}
        </h4>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room</th>
                <th>Guest</th>
                <th>Dates</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((r) => {
                const status = getStatus(r);

                return (
                  <tr
                    key={r.id}
                    style={{
                      opacity:
                        status === "CANCELLED"
                          ? 0.55
                          : 1
                    }}
                  >
                    <td>{r.id}</td>

                    <td>
                      {r.roomNumber ||
                        r.room_number}
                    </td>

                    <td>
                      {r.fullName ||
                        r.full_name}
                    </td>

                    <td>
                      {getCheckIn(r)} →{" "}
                      {getCheckOut(r)}
                    </td>

                    <td>
                      {formatPaymentMode(r)}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          status
                        )}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        disabled={
                          status ===
                          "CANCELLED"
                        }
                        onClick={() =>
                          handleEdit(r)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        disabled={
                          status ===
                          "CANCELLED"
                        }
                        onClick={() =>
                          handleCancel(
                            r.id
                          )
                        }
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}

              {reservations.length ===
                0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center"
                  >
                    No Reservations Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          className="btn btn-warning me-2"
          disabled={page === 0}
          onClick={() =>
            setPage(page - 1)
          }
        >
          Prev
        </button>

        <button
          className="btn btn-success"
          disabled={
            page >= totalPages - 1
          }
          onClick={() =>
            setPage(page + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ReservationsPage;