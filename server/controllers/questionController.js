const Question = require('../models/Question');
const User = require('../models/User');

// GET /api/:level - fetch a question based on difficulty level
exports.getQuestionByLevel = async (req, res) => {
  const { level } = req.params;

  try {
    const question = await Question.findOne({ level });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/submit - validate answer, update points
exports.submitHandler = async (req, res) => {
  const { id, code } = req.body;

  try {
    const question = await Question.findOne({ id }); 
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Normalize both strings for comparison
    const normalize = (str) => str.replace(/\r/g, "").trim();
    const isCorrect = normalize(code) === normalize(question.correctAnswer);

    if (isCorrect) {
      // Increase user points by 10
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
      return res.json({ message: "✅ Correct! Points awarded." });
    } else {
      return res.json({
        message: "❌ Incorrect. Try again!",
        correctAnswer: question.correctAnswer
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
