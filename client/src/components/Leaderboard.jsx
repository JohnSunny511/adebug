import React, { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/leaderboard")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch leaderboard", err));
  }, []);

  const containerStyle = {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', sans-serif"
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "28px",
    fontWeight: "600",
    color: "#2b2b2b"
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0
  };

  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    marginBottom: "8px",
    backgroundColor: "#90EE90",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#333",
    fontWeight: 500
  };

  const rankStyle = {
    fontWeight: "bold",
    color: "#5a5a5a"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🏆 Leaderboard</h2>
      <ol style={listStyle}>
        {users.map((user, index) => (
          <li key={index} style={listItemStyle}>
            <span>
              <span style={rankStyle}>#{index + 1}</span> {user.username}
            </span>
            <span>{user.points} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
