const Question = require('../models/Question');

// GET /api/:level
exports.getQuestionByLevel = async (req, res) => {
  const { level } = req.params;
  try {
    const question = await Question.findOne({ level });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/submit
exports.submitCodeAnswer = async (req, res) => {
  const { id, code } = req.body;

  try {
    const question = await Question.findOne({ id });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const normalize = (str) => str.replace(/\r/g, "").trim();
    const isCorrect = normalize(code) === normalize(question.correctAnswer);

    if (isCorrect) {
      res.json({ passed: true, message: "✅ Code is correct!" });
    } else {
      res.json({
        passed: false,
        message: "❌ Code is incorrect.",
        correctAnswer: question.correctAnswer
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
