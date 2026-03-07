//Signup.jsx

import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        password,
      });
      alert(res.data.message);
    } catch (err) {
  console.error("Signup error:", err); // 👈 shows error in browser console
  const msg = err.response?.data?.message || err.message || "Unknown error";
  alert("Signup failed: " + msg);
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

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
        <h2 style={{ textAlign: "center" }}>Signup</h2>
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
        <button style={buttonStyle} onClick={signup}>
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
