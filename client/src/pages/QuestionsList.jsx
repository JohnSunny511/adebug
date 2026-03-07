// src/pages/QuestionsList.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function QuestionsList() {
  const { level } = useParams(); // easy, medium, hard
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/questions/${level}`);
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [level]);

  if (loading) return <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading {level} questions...</p>;

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
        textTransform: "capitalize",
        color: "#f8fafc"
      }}>
        {level} Questions
      </h1>

      {questions.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "1rem" }}>No questions found.</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "700px" }}>
          {questions.map((q) => (
            <li key={q._id} style={{
              backgroundColor: "#1e293b",
              padding: "1rem 1.5rem",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#334155"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1e293b"}
            >
              <Link to={`/${level}/${q.id}`} style={{
                color: "#3b82f6",
                fontSize: "1.125rem",
                fontWeight: "600",
                textDecoration: "none"
              }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
              >
                {q.title}
              </Link>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                Language: {q.language}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuestionsList;
