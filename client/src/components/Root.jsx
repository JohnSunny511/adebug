//Root.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login"
import App from "./App"; // Your Easy/Medium/Hard code page
import Leaderboard from "./Leaderboard";
import BuggyCodeGenerator from "./BuggyCodeGenerator";



function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/buggy" element={<BuggyCodeGenerator />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default Root;
