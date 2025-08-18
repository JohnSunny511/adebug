import React, { useEffect, useState } from "react";
import axios from "axios";
import '../App.css';
import { countChanges } from '../utils/countCodeChanges';
import Editor from "@monaco-editor/react";
import { executeCode } from "../utils/executeCode";
import { Link } from "react-router-dom";

function App() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [changeCount, setChangeCount] = useState(0);
    const [originalCode, setOriginalCode] = useState("");
    const [output, setOutput] = useState("");
    const [username, setUsername] = useState("");

    // ✅ CORRECT: placed outside any function, at top level
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/login";
    };

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



    const fetchQuestion = async (level) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/${level}`);
            setOriginalCode(res.data.code);
            setQuestion(res.data);
        } catch (err) {
            console.error("Error fetching question:", err);
        } finally {
            setLoading(false);
        }
    };

    const submitCode = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post('http://localhost:5000/api/submit', {
                id: question.id,
                code: question.code,
                language: question.language
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(res.data.message);
        } catch (err) {
            console.error("Submission failed:", err);
            alert("Submission failed.");
        }
    };





    return (
        <div className="App">
            <div style={{ textAlign: "right", marginRight: "20px" }}>
                👋 Welcome, <strong>{username}</strong>{" "}
                <button onClick={logout}>Logout</button>
            </div>
            <h1>🧠 Debug Quest</h1>

            <div>
                <button onClick={() => fetchQuestion("easy")}>Easy</button>
                <button onClick={() => fetchQuestion("medium")}>Medium</button>
                <button onClick={() => fetchQuestion("hard")}>Hard</button>
            </div>

            {loading && <p>Loading...</p>}

            {question && (
                <div className="question-box">
                    <h2>{question.title}</h2>
                    <p><strong>Language:</strong> {question.language}</p>
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

                    <button onClick={submitCode} style={{ marginTop: '10px' }}>Submit</button>
                    <button onClick={runCode}>▶️ Run Code</button>
                    <pre><strong>Output:</strong><br />{output}</pre>

                    <p><strong>Expected:</strong> {question.expected}</p>
                    <p><strong>Changes made:</strong> {changeCount}</p>
                </div>
            )}
        </div>
    );
}

export default App;



