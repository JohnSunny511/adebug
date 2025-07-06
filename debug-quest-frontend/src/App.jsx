import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { countChanges } from './utils/countCodeChanges';



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
    const changeNum = countChanges(originalCode, newCode,question.language);
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

