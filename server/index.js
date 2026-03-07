//index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require("cookie-session");


// Routes
const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const aiRoutes = require('./routes/aiRoutes');
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

// Connect DB
connectDB(); // ✅ call here

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
