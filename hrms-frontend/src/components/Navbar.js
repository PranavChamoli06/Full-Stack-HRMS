import { Link } from "react-router-dom";

function Navbar() {

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.clear();
    window.location.href = "/";
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