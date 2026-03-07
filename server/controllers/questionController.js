const Question = require("../models/Question");
const User = require("../models/User");

function inferLanguageFromCode(value) {
  const text = String(value || "");

  const looksLikePython =
    /\bdef\s+\w+\s*\(/.test(text) ||
    /\bprint\s*\(/.test(text) ||
    /\bfor\s+\w+\s+in\b/.test(text) ||
    /\bif\s+.+:/.test(text) ||
    /\breturn\b/.test(text);
  if (looksLikePython) return "python";

  const looksLikeC =
    /#include\s*<[^>]+>/.test(text) ||
    /\bint\s+main\s*\(/.test(text) ||
    /\bprintf\s*\(/.test(text);
  if (looksLikeC) return "c";

  const looksLikeJavaScript =
    /\bfunction\s+\w+\s*\(/.test(text) ||
    /\bconsole\.log\s*\(/.test(text) ||
    /\b(let|const|var)\s+\w+/.test(text) ||
    /=>/.test(text);
  if (looksLikeJavaScript) return "javascript";

  return "text";
}

function withResolvedLanguage(question) {
  const payload = question?.toObject ? question.toObject() : question;
  if (!payload) return payload;

  const currentLanguage = String(payload.language || "").toLowerCase();
  if (currentLanguage !== "text" && currentLanguage !== "plaintext") {
    return payload;
  }

  const inferredLanguage = inferLanguageFromCode(payload.code);
  if (inferredLanguage !== "text") {
    payload.language = inferredLanguage;
  }

  return payload;
}

// GET /api/questions/:level
exports.getQuestionsByLevel = async (req, res) => {
  const { level } = req.params;
  try {
    const questions = await Question.find({ level });
    if (!questions.length) {
      return res.status(404).json({ error: "No questions found for this level" });
    }
    res.json(questions.map(withResolvedLanguage));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/questions/:level/:id
exports.getQuestionByLevel = async (req, res) => {
  const { level, id } = req.params;
  try {
    const question = await Question.findOne({ level, id });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(withResolvedLanguage(question));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/questions/submit
exports.submitHandler = async (req, res) => {
  const { id, code, level, questionId } = req.body;

  try {
    let question = null;

    if (questionId) {
      question = await Question.findById(questionId);
    } else if (id !== undefined && level) {
      question = await Question.findOne({ id, level });
    } else if (id !== undefined) {
      question = await Question.findOne({ id });
    }

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const normalize = (str) => String(str ?? "").replace(/\r/g, "").trim();
    const expectedAnswer = question.correctAnswer ?? question.expected ?? "";
    const isCorrect = normalize(code) === normalize(expectedAnswer);

    if (isCorrect) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
      return res.json({ message: "Correct! Points awarded." });
    }

    return res.json({
      message: "Incorrect. Try again!",
      correctAnswer: expectedAnswer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
