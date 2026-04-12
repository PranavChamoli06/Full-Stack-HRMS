import { useNavigate } from "react-router-dom";

export default function PublicHome() {

  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to HRMS Booking</h1>
      <p>Book your stay quickly and easily</p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "20px"
      }}>
        <button
          onClick={() => navigate("/search")}
          style={{
            padding: "10px 20px",
            minWidth: "150px",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Start Booking
        </button>

        <button
          onClick={() => navigate("/view-booking")}
          style={{
            padding: "10px 20px",
            minWidth: "150px",
            background: "#6c757d",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          View Booking
        </button>
      </div>
    </div>
  );
}