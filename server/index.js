//index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require("cookie-session");
const axios = require("axios");


// Routes
const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const aiRoutes = require('./routes/aiRoutes');
const chatbotAdminRoutes = require("./routes/chatbotAdminRoutes");
const adminQuestionRoutes = require("./routes/adminQuestionRoutes");
const { authenticateUser } = require('./middleware/authMiddleware');

// DB connection
const connectDB = require('./config/db');  // ✅ import db.js

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(session({ secret: "secretkey", resave: false, saveUninitialized: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/questions", questionRoutes); 
app.use("/api/chatbot", chatbotAdminRoutes);
app.use("/api/admin/questions", adminQuestionRoutes);

// Connect DB
connectDB(); // ✅ call here

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.post("/api/execute", async (req, res) => {
  const { language_id, code } = req.body;

  const headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": process.env.JUDGE0_KEY,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  };

  try {
    // submit
    const submission = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
      {
        language_id,
        source_code: code,
        stdin: "",
      },
      { headers }
    );

    const token = submission.data.token;

    // poll
    let result;
    while (true) {
      const response = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
        { headers }
      );

      result = response.data;

      if (result.status.id > 2) break;
      await new Promise(r => setTimeout(r, 1500));
    }

    res.json({
      output: result.stdout || result.stderr || result.compile_output || "No output",
      status: result.status.description
    });

  } catch (error) {
  console.log("========= JUDGE0 ERROR =========");
  console.log(error.response?.data);
  console.log(error.message);
  console.log("================================");

  res.status(500).json({
    error: error.response?.data || error.message
  });
}
});
