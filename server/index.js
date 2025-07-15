//index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const questionRoutes = require('./routes/questionRoutes');
const { authenticateUser } = require('./middleware/authMiddleware');


const app = express();
const PORT = 5000;


// Middlewares
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const leaderboardRoutes = require('./routes/leaderboardRoutes');
app.use('/api/leaderboard', leaderboardRoutes);



// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/debug-quest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});



// API Routes
app.use('/api', questionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
