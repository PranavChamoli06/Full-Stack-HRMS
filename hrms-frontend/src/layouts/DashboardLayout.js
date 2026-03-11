import { Link } from "react-router-dom";

function DashboardLayout({ children }) {

  return (

    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#2c3e50",
          color: "white",
          padding: "20px"
        }}
      >

        <h3>HRMS</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          <Link to="/dashboard" style={{ color: "white" }}>
            Dashboard
          </Link>

          <Link to="/reservations" style={{ color: "white" }}>
            Reservations
          </Link>

          <Link to="/admin" style={{ color: "white" }}>
            Admin
          </Link>

        </nav>

      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>

        {children}

      </div>

    </div>
  );
}

export default DashboardLayout;