//index.js in server
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const aiRoutes = require('./routes/aiRoutes'); // ✅ require instead of import

const { authenticateUser } = require('./middleware/authMiddleware');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes); // ✅ now after app is created
app.use('/api', questionRoutes);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/debug-quest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
