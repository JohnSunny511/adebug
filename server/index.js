const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/debug-quest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', questionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
