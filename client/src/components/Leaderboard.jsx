import React, { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/leaderboard")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch leaderboard", err));
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "#f1f5f9",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>

      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        marginBottom: "2rem",
        color: "#f8fafc"
      }}>
        🏆 Leaderboard
      </h1>

      <div style={{
        width: "100%",
        maxWidth: "700px",
        backgroundColor: "#1e293b",
        borderRadius: "0.6rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
        padding: "1rem"
      }}>

        {/* Header row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid #334155",
          color: "#94a3b8",
          fontSize: "0.9rem",
          fontWeight: "600"
        }}>
          <span>User</span>
          <span>Score</span>
        </div>

        {/* Users */}
        {users.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
            No users yet.
          </p>
        ) : (
          users.map((user, index) => {
            // special colors for top 3
            let rankColor = "#94a3b8";
            if (index === 0) rankColor = "#facc15"; // gold
            if (index === 1) rankColor = "#cbd5f5"; // silver
            if (index === 2) rankColor = "#fdba74"; // bronze

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderBottom: "1px solid #334155",
                  transition: "all 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#334155"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    fontWeight: "bold",
                    color: rankColor,
                    fontSize: "1.1rem",
                    width: "35px"
                  }}>
                    #{index + 1}
                  </span>

                  <span style={{
                    fontSize: "1.05rem",
                    fontWeight: "600"
                  }}>
                    {user.username}
                  </span>
                </div>

                <span style={{
                  color: "#3b82f6",
                  fontWeight: "700",
                  fontSize: "1.05rem"
                }}>
                  {user.points} pts
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Leaderboard;