// src/pages/QuestionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { countChanges } from '../utils/countCodeChanges';
import { executeCode } from "../utils/executeCode";

function QuestionDetail() {
  const { level, id } = useParams();
  const [question, setQuestion] = useState(null);
  const [originalCode, setOriginalCode] = useState("");
  const [changeCount, setChangeCount] = useState(0);
  const [output, setOutput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/questions/${level}/${id}`);
        setQuestion(res.data);
        setOriginalCode(res.data.code);
      } catch (err) {
        console.error("Error fetching question:", err);
      }
    };
    fetchQuestion();
  }, [level, id]);

  const runCode = async () => {
    if (!question?.code?.trim()) {
      setOutput("No code to run.");
      return;
    }

    try {
      const result = await executeCode(question.language, question.code);
      setOutput(result);
    } catch (err) {
      setOutput("❌ Error running code.");
      console.error(err);
    }
  };

  const submitCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post('http://localhost:5000/api/questions/submit', {
        id: question.id,
        code: question.code,
        language: question.language
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  if (!question) return <p>Loading question...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", padding: "2rem", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* Inline Styles for Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <span>👋 Welcome, <strong>{username}</strong></span>
        <button style={{
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "0.35rem",
          cursor: "pointer",
          transition: "background 0.3s"
        }} onClick={logout}>
          Logout
        </button>
      </div>

      <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#f8fafc" }}>
        {question.title}
      </h1>
      <p style={{ fontSize: "1rem", color: "#94a3b8", marginBottom: "1rem" }}>
        Language: {question.language}
      </p>

      <div style={{
        border: "1px solid #334155",
        borderRadius: "0.5rem",
        overflow: "hidden",
        marginBottom: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}>
        <Editor
          height="300px"
          defaultLanguage={question.language.toLowerCase()}
          value={question.code}
          theme="vs-dark"
          onChange={(newValue) => {
            const changeNum = countChanges(originalCode, newValue, question.language);
            setChangeCount(changeNum);
            setQuestion((prev) => ({ ...prev, code: newValue }));
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button style={{
          padding: "0.6rem 1.2rem",
          borderRadius: "0.35rem",
          border: "none",
          cursor: "pointer",
          fontWeight: 500,
          backgroundColor: "#16a34a",
          color: "white",
          transition: "all 0.3s ease"
        }} onClick={runCode}>
          ▶️ Run Code
        </button>
        <button style={{
          padding: "0.6rem 1.2rem",
          borderRadius: "0.35rem",
          border: "none",
          cursor: "pointer",
          fontWeight: 500,
          backgroundColor: "#3b82f6",
          color: "white",
          transition: "all 0.3s ease"
        }} onClick={submitCode}>
          💾 Submit
        </button>
      </div>

      <div style={{
        backgroundColor: "#1e293b",
        padding: "1rem",
        borderRadius: "0.5rem",
        fontFamily: "'Courier New', Courier, monospace",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        marginBottom: "1rem"
      }}>
        <strong>Output:</strong> {output}
      </div>

      <p style={{ fontSize: "1rem", color: "#cbd5e1", marginBottom: "0.5rem" }}>
        <strong style={{ color: "#f1f5f9" }}>Expected Output:</strong> {question.expected}
      </p>
      <p style={{ fontSize: "1rem", color: "#cbd5e1" }}>
        <strong style={{ color: "#f1f5f9" }}>Changes Made:</strong> {changeCount}
      </p>
    </div>
  );
}

export default QuestionDetail;
