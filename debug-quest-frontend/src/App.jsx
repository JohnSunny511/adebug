import React, { useState } from "react";
import axios from "axios";
import "./App.css";

// Utility to count changes
function countCodeChanges(original, modified) {
  const normalize = (str) =>
    str
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => line.replace(/\s+$/, "")) // remove trailing space only
      .filter((line) => line.length > 0);

  // Tokenize each line into [indentation, tokens...]
  const tokenizeLine = (line) => {
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : "";
    const tokens = line
      .trim()
      .match(/[a-zA-Z_][a-zA-Z0-9_]*|\d+|==|!=|<=|>=|[+\-*/%=<>{}()[\],.:"]|".*?"|'.*?'/g) || [];
    return [indent, ...tokens];
  };

  const origTokens = normalize(original).flatMap(tokenizeLine);
  const modTokens = normalize(modified).flatMap(tokenizeLine);

  const m = origTokens.length;
  const n = modTokens.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (origTokens[i - 1] === modTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = m, j = n;
  let changes = 0;

  while (i > 0 && j > 0) {
    if (origTokens[i - 1] === modTokens[j - 1]) {
      i--;
      j--;
    } else if (dp[i][j] === dp[i - 1][j - 1]) {
      changes++; // substitution
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      changes++; // deletion
      i--;
    } else {
      changes++; // insertion
      j--;
    }
  }

  changes += i + j;

  return changes;
}













function App() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [originalCode, setOriginalCode] = useState(""); // store initial buggy code


  const fetchQuestion = async (level) => {
  setLoading(true);
  try {
    const res = await axios.get(`http://localhost:5000/api/${level}`);
    setOriginalCode(res.data.code); // save original
    setQuestion(res.data);
  } catch (err) {
    console.error("Error fetching question:", err);
  } finally {
    setLoading(false);
  }
};

  const submitCode = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/submit', {
        id: question.id,
        code: question.code,
        language: question.language
      });

      alert(res.data.message); // show success or result from backend
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed.");
    }
  };

  return (
    <div className="App">
      <h1>🧠 Debug Quest</h1>

      <div>
        <button onClick={() => fetchQuestion("easy")}>Easy</button>
      </div>

      {loading && <p>Loading...</p>}

      {question && (
        <div className="question-box">
          <h2>{question.title}</h2>
          <p><strong>Language:</strong> {question.language}</p>
          <textarea
  rows={10}
  style={{ width: "100%", fontFamily: "monospace", fontSize: "14px" }}
  value={question.code}
  onChange={(e) => {
    const newCode = e.target.value;
    const changeNum = countCodeChanges(originalCode, newCode);
    setChangeCount(changeNum);

    setQuestion((prev) => ({ ...prev, code: newCode }));
  }}
/>

          <button onClick={submitCode} style={{ marginTop: '10px' }}>Submit</button>

          <p><strong>Expected:</strong> {question.expected}</p>
          <p><strong>Changes made:</strong> {changeCount}</p>

        </div>
      )}
    </div>
  );

}

export default App;

