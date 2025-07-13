import React, { useState } from "react";
import axios from "axios";
import '../App.css';
import { countChanges } from '../utils/countCodeChanges';
import Editor from "@monaco-editor/react";
import { executePythonCode } from '../utils/executeCode';




function App() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [changeCount, setChangeCount] = useState(0);
    const [originalCode, setOriginalCode] = useState(""); // store initial buggy code
    const [output, setOutput] = useState("");

    const runCode = async () => {
        const result = await executePythonCode(question.code);
        setOutput(result); // Now result includes actual errors or output
    };




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

