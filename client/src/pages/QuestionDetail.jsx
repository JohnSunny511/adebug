// src/pages/QuestionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";

function QuestionDetail() {
  const { level, id } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/questions/${level}/${id}`);



        setQuestion(res.data);
      } catch (err) {
        console.error("Error fetching question:", err);
      }
    };
    fetchQuestion();
  }, [level, id]);

  if (!question) return <p>Loading question...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
      <p className="mb-4 text-gray-400">Language: {question.language}</p>
      
      <Editor
        height="300px"
        defaultLanguage={question.language.toLowerCase()}
        value={question.code}
        theme="vs-dark"
      />

      <p className="mt-6 text-gray-300"><strong>Expected Output:</strong> {question.expected}</p>
    </div>
  );
}

export default QuestionDetail;
