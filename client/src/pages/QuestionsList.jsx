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

  if (loading) return <p className="text-center text-gray-400">Loading {level} questions...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 capitalize">{level} Questions</h1>
      
      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <ul className="space-y-4 w-full max-w-3xl">
          {questions.map((q) => (
            <li
              key={q._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition"
            >
              <Link to={`/${level}/${q.id}`} className="text-blue-400 hover:underline text-lg font-semibold">
                {q.title}
              </Link>
              <p className="text-gray-400 text-sm mt-1">Language: {q.language}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuestionsList;