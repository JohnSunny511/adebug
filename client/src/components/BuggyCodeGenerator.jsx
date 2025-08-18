import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { countChanges } from "../utils/countCodeChanges";
import { executeCode } from "../utils/executeCode";


const AI_API_URL = "http://localhost:5000/api/ai/generate";

export default function BuggyCodeGenerator() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [originalCode, setOriginalCode] = useState("");
  const [output, setOutput] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");

  const [aiLanguage, setAiLanguage] = useState("python");
  const [aiTopic, setAiTopic] = useState("");

  async function generateAIQuestion() {
    setQuestion(null);
    setOutput("");
    setChangeCount(0);
    setSubmissionStatus("");
    setLoading(true);

    try {
      const res = await fetch(AI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: aiLanguage, topic: aiTopic }),
      });

      if (!res.ok) throw new Error("Failed to generate AI question");

      const data = await res.json();
      console.log("AI generated data:", data);

      setQuestion({
        source: "AI",
        language: data.language,
        topic: data.topic,
        code: data.buggyCode,
        correctCode: data.correctCode,
      });

      setOriginalCode(data.buggyCode);
    } catch (error) {
      console.error("Error generating AI question:", error);
      setSubmissionStatus("❌ Failed to generate AI question");
    } finally {
      setLoading(false);
    }
  }

  const runCode = async () => {
    if (!question?.code?.trim()) {
      setOutput("No code to run.");
      return;
    }
    const result = await executeCode(question.language, question.code); // ✅ dynamic
    setOutput(result);
  };


  function normalizeCode(code) {
    if (!code) return "";
    return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "").replace(/\s+/g, "").trim();
  }

  async function handleSubmit() {
  if (!question) {
    setSubmissionStatus("Please generate a question first.");
    return;
  }

  const userCode = normalizeCode(question.code);
  const correctCode = normalizeCode(question.correctCode || "");

  if (!correctCode) {
    setSubmissionStatus("⚠️ No correct code available to check against.");
    return;
  }

  if (userCode === correctCode) {
    setSubmissionStatus("✅ Correct!");
  } else {
    setSubmissionStatus("❌ Incorrect! Keep trying.");
  }
}


  return (
    <div className="App">
      {/* AI Input Section */}
      <div style={{ marginBottom: "15px", padding: "10px", border: "1px solid #444" }}>
        <h3>AI Buggy Code Generator</h3>
        <label>Language: </label>
        <select value={aiLanguage} onChange={(e) => setAiLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="c">C</option>
        </select>

        <label style={{ marginLeft: "10px" }}>Topic: </label>
        <input
          type="text"
          value={aiTopic}
          onChange={(e) => setAiTopic(e.target.value)}
          placeholder="e.g. array sorting"
        />

        <button onClick={generateAIQuestion} style={{ marginLeft: "10px" }}>
          🤖 Generate AI Question
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {question && (
        <div className="question-box">
          <h2>AI Generated Question - {question.topic}</h2>
          <p><strong>Language:</strong> {question.language}</p>

          <Editor
            height="300px"
            defaultLanguage={question.language?.toLowerCase() || "python"}
            value={question.code}
            theme="vs-dark"
            onChange={(newValue = "") => {
              const changeNum = countChanges(originalCode, newValue, question.language);
              setChangeCount(changeNum);
              setQuestion((prev) => ({ ...prev, code: newValue }));
            }}
          />

          <button onClick={handleSubmit} style={{ marginTop: "10px" }}>Submit</button>
          <button onClick={runCode}>▶️ Run Code</button>
          {submissionStatus && (
            <p style={{ display: 'inline', marginLeft: '15px' }}>
              <strong>{submissionStatus}</strong>
            </p>
          )}

          <pre><strong>Output:</strong><br />{output}</pre>
          <p><strong>Changes made:</strong> {changeCount}</p>
        </div>
      )}
    </div>
  );
}
