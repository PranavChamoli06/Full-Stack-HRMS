import { useNavigate } from "react-router-dom";

function UnauthorizedPage() {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const goToHome = () => {
    if (role === "ADMIN" || role === "MANAGER") {
      navigate("/dashboard");
    } else {
      navigate("/reservations");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">

      <h1 className="mb-3">🚫 Access Denied</h1>
      <p className="mb-4">You do not have permission to access this page.</p>

      <div className="d-flex gap-3">
        <button className="btn btn-primary" onClick={goToHome}>
          Go to Home
        </button>

        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

    </div>
  );
}

export default UnauthorizedPage;