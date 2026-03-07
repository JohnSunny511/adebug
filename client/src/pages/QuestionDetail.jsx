// src/pages/QuestionDetail.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { countChanges } from "../utils/countCodeChanges";
import { executeCode } from "../utils/executeCode";

function QuestionDetail() {
  const { level, id } = useParams();
  const [question, setQuestion] = useState(null);
  const [originalCode, setOriginalCode] = useState("");
  const [changeCount, setChangeCount] = useState(0);
  const [output, setOutput] = useState("");
  const [username, setUsername] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Ask me anything about this debugging question.",
    },
  ]);
  const chatEndRef = useRef(null);

  const resolveCounterLanguage = (language, original, modified) => {
    const normalizedLang = String(language || "").toLowerCase();
    if (normalizedLang !== "text" && normalizedLang !== "plaintext") {
      return language;
    }

    const sample = `${String(original || "")}\n${String(modified || "")}`;
    const looksLikePython =
      /\bdef\s+\w+\s*\(/.test(sample) ||
      /\bprint\s*\(/.test(sample) ||
      /\bfor\s+\w+\s+in\b/.test(sample) ||
      /\bif\s+.+:/.test(sample) ||
      /\breturn\b/.test(sample);
    const looksLikeC =
      /#include\s*<[^>]+>/.test(sample) ||
      /\bint\s+main\s*\(/.test(sample) ||
      /\bprintf\s*\(/.test(sample);

    if (looksLikePython) return "python";
    if (looksLikeC) return "c";
    return "text";
  };

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const runCode = async () => {
    if (!question?.code?.trim()) {
      setOutput("No code to run.");
      return;
    }

    try {
      const result = await executeCode(question.language, question.code);
      setOutput(result);
    } catch (err) {
      setOutput("Error running code.");
      console.error(err);
    }
  };

  const submitCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/questions/submit",
        {
          questionId: question._id,
          id: question.id,
          level,
          code: question.code,
          language: question.language,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed.");
    }
  };

  const askAI = async (event) => {
    event.preventDefault();
    const prompt = chatInput.trim();
    if (!prompt || chatLoading) return;

    setChatMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/query?q=${encodeURIComponent(prompt)}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      const answer =
        typeof data?.answer === "string" && data.answer.trim()
          ? data.answer
          : "No answer returned by the AI service.";
      const score =
        data?.confidence !== undefined && data?.status
          ? `\n\nConfidence: ${data.confidence} (${data.status})`
          : "";

      setChatMessages((prev) => [...prev, { role: "assistant", text: `${answer}${score}` }]);
    } catch (err) {
      console.error("Error calling /query:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to reach the AI service. Make sure http://localhost:8000/query is running.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  if (!question) return <p>Loading question...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#f1f5f9",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: ".4rem",
        }}
      >
        <span>
          Welcome, <strong>{username}</strong>
        </span>
        <button
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.35rem",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "9rem",
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "0 1 720px", minWidth: "340px" , paddingLeft: "85px"}}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginBottom: ".5rem",
              color: "#f8fafc",
            }}
          >
            {question.title}
          </h1>
          <p style={{ fontSize: "1rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Language: {question.language}
          </p>

          <div
            style={{
              border: "1px solid #334155",
              borderRadius: "0.5rem",
              overflow: "hidden",
              marginBottom: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <Editor
              height="320px"
              defaultLanguage={question.language.toLowerCase()}
              value={question.code}
              theme="vs-dark"
              onChange={(newValue = "") => {
                const effectiveLanguage = resolveCounterLanguage(
                  question.language,
                  originalCode,
                  newValue
                );
                const rawChangeNum = countChanges(originalCode, newValue, effectiveLanguage);
                const changeNum = rawChangeNum < 0 ? 0 : rawChangeNum;
                setChangeCount(changeNum);
                setQuestion((prev) => ({ ...prev, code: newValue }));
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <button
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "0.35rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                backgroundColor: "#16a34a",
                color: "white",
                transition: "all 0.3s ease",
              }}
              onClick={runCode}
            >
              Run Code
            </button>
            <button
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "0.35rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                backgroundColor: "#3b82f6",
                color: "white",
                transition: "all 0.3s ease",
              }}
              onClick={submitCode}
            >
              Submit
            </button>
          </div>

          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "1rem",
              borderRadius: "0.5rem",
              fontFamily: "'Courier New', Courier, monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              marginBottom: "1rem",
            }}
          >
            <strong>Output:</strong> {output}
          </div>

          <p style={{ fontSize: "1rem", color: "#cbd5e1", marginBottom: "0.5rem" }}>
            <strong style={{ color: "#f1f5f9" }}>Expected Output:</strong> {question.expected}
          </p>
          <p style={{ fontSize: "1rem", color: "#cbd5e1" }}>
            <strong style={{ color: "#f1f5f9" }}>Changes Made:</strong> {changeCount}
          </p>
        </div>

        <aside
          style={{
            flex: "0 1 360px",
            minWidth: "300px",
            position: "relative",
            top: "24px",
            backgroundColor: "#1e293b",
            border: "2px solid #334155",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            maxHeight: "590px",
          }}
        >
          <h2 style={{ margin: 0, marginBottom: "0.8rem", fontSize: "1.1rem", color: "#f8fafc" }}>
            Debug Assistant
          </h2>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              backgroundColor: "#0f172a",
              borderRadius: "2rem",
              border: "10px solid #334155",
              padding: "0.75rem",
            }}
          >
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  marginBottom: "0.6rem",
                  display: "flex",
                  justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "88%",
                    padding: "0.55rem 0.7rem",
                    borderRadius: "0.5rem",
                    whiteSpace: "pre-wrap",
                    backgroundColor: message.role === "user" ? "#1d4ed8" : "#334155",
                    color: "#f8fafc",
                    fontSize: "0.9rem",
                    lineHeight: 1.35,
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {chatLoading && <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Thinking...</div>}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={askAI} style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask about this bug..."
              style={{
                flex: 1,
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "0.45rem",
                color: "#f1f5f9",
                padding: "0.55rem 0.7rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              style={{
                backgroundColor: chatLoading || !chatInput.trim() ? "#475569" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "0.45rem",
                padding: "0.55rem 0.9rem",
                cursor: chatLoading || !chatInput.trim() ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

export default QuestionDetail;
