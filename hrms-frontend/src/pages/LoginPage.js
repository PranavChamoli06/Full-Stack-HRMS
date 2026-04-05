import { useState, useEffect } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔥 Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "ADMIN" || role === "MANAGER") {
        navigate("/dashboard");
      } else {
        navigate("/reservations");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);

      console.log("Login success:", data);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("role", data.role);

      // 🔥 ROLE-BASED REDIRECT
      if (data.role === "ADMIN" || data.role === "MANAGER") {
        navigate("/dashboard");
      } else {
        navigate("/reservations");
      }

    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">

      <div className="card p-4 shadow" style={{ width: "350px" }}>

        <h3 className="text-center mb-3">HRMS Login</h3>

        <form onSubmit={handleLogin}>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;