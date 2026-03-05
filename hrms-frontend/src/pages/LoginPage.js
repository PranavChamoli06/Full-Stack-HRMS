import { useState } from "react";
import { login } from "../services/authService";

function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);

      console.log("Login success:", data);

      localStorage.setItem("token", data.accessToken);

      alert("Login successful");

    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Login</button>

      </form>

    </div>
  );
}

export default LoginPage;