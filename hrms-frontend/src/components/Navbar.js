import { Link } from "react-router-dom";

function Navbar() {

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.clear(); // ✅ clears all session data
    window.location.href = "/"; // ✅ hard reset navigation
  };

  return (
    <nav>

      <Link to="/dashboard">Dashboard</Link> | 
      <Link to="/reservations">Reservations</Link> | 
      <Link to="/admin">Admin</Link> | 

      <button onClick={handleLogout}>Logout</button>

    </nav>
  );
}

export default Navbar;