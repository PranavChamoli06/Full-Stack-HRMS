import { Link, Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>

      {/* 🔵 NAVBAR */}
      <nav style={{
        background: "#1e293b",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}>
        <h3>🏨 HRMS</h3>

        <div style={{ display: "flex", gap: "15px" }}>
          <Link to="/search" style={{ color: "white", textDecoration: "none" }}>Search</Link>
          <Link to="/view-booking" style={{ color: "white", textDecoration: "none" }}>View Booking</Link>

          <button
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              border: "none",
              color: "white",
              padding: "6px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🔲 PAGE CONTENT */}
      <div style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#f1f5f9"
      }}>
        <Outlet />
      </div>

    </div>
  );
}