import { useState, useEffect } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/login-bg.jpg";
import "../styles/LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Auto redirect if already logged in
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

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("role", data.role);

      if (data.role === "ADMIN" || data.role === "MANAGER") {
        navigate("/dashboard");
      } else {
        navigate("/reservations");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        
        <div
          className="left-panel"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="brand-overlay">
            <h2>Login Portal</h2>
            <p>
              Smart Reservations,
              <br />
              Seamless Hospitality
            </p>
          </div>
        </div>

        <div className="right-panel">
          <h2 className="login-title">Please Login 😊</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-light">Username</label>
              <input
                className="form-control custom-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-light">Password</label>
              <input
                className="form-control custom-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn login-btn w-100" type="submit">
              Login
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;