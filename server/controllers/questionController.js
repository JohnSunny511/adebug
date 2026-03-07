const Question = require("../models/Question");
const User = require("../models/User");

// ✅ GET /api/questions/:level
exports.getQuestionsByLevel = async (req, res) => {
  const { level } = req.params;
  try {
    const questions = await Question.find({ level });
    if (!questions.length) {
      return res.status(404).json({ error: "No questions found for this level" });
    }
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ GET /api/questions/:level/:id
exports.getQuestionByLevel = async (req, res) => {
  const { level, id } = req.params;
  try {
    const question = await Question.findOne({ level, id });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ POST /api/questions/submit
exports.submitHandler = async (req, res) => {
  const { id, code } = req.body;

  try {
    const question = await Question.findOne({ id });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const normalize = (str) => str.replace(/\r/g, "").trim();
    const isCorrect = normalize(code) === normalize(question.correctAnswer);

    if (isCorrect) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
      return res.json({ message: "✅ Correct! Points awarded." });
    } else {
      return res.json({
        message: "❌ Incorrect. Try again!",
        correctAnswer: question.correctAnswer,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
