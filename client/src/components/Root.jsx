// Root.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "../pages/Login";
import App from "./App"; // Your Challenges page
import Leaderboard from "./Leaderboard";
import BuggyCodeGenerator from "./BuggyCodeGenerator";
import QuestionsList from "../pages/QuestionsList";
import QuestionDetail from "../pages/QuestionDetail";
import AdminChatbotSettings from "../pages/AdminChatbotSettings";
import AdminQuestionManager from "../pages/AdminQuestionManager";

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:level" element={<QuestionsList />} /> 
        <Route path="/:level/:id" element={<QuestionDetail />} />
        <Route path="/buggy" element={<BuggyCodeGenerator />} />
        <Route path="/admin/chatbot" element={<AdminChatbotSettings />} />
        <Route path="/admin/questions" element={<AdminQuestionManager />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default Root;
