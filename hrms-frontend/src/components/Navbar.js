import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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