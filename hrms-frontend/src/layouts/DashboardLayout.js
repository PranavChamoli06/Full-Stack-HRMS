import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import "../styles/Dashboard.css";

function DashboardLayout({ children }) {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-shell">

      {/* Top Navbar */}
      <header className="top-navbar">

        <div className="nav-brand">
          HRMS
        </div>

        <nav className="top-nav-links">

          {(role === "ADMIN" || role === "MANAGER") && (
            <Link to="/dashboard" className="nav-link-item">
              Dashboard
            </Link>
          )}

          <Link to="/reservations" className="nav-link-item">
            Reservations
          </Link>

          {role === "ADMIN" && (
            <Link to="/admin" className="nav-link-item">
              Admin
            </Link>
          )}

        </nav>

        <button className="logout-icon-btn" onClick={handleLogout}>
          <FiLogOut size={22} />
        </button>

      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-glass">
          {children}
        </div>
      </main>

    </div>
  );
}

export default DashboardLayout;