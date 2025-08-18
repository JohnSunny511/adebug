import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username); // 👈 ADD THIS LINE
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert("Login failed: " + msg);
    }
  };


  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "sans-serif",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    width: "300px",
  };

  const inputStyle = {
    padding: "0.8rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const buttonStyle = {
    padding: "0.8rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "0.9rem",
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <input
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button style={buttonStyle} onClick={login}>
          Login
        </button>
        <div style={linkStyle}>
          Don’t have an account? <Link to="/signup">Signup here</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
