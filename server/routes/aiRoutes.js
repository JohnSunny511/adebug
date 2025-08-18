const express = require("express");
const router = express.Router();
const { generateBuggyAndCorrect } = require("../ai/generateBuggyCode");


// Generate AI question
router.post("/generate", async (req, res) => {
  const { language, topic } = req.body;

  if (!language || !topic) {
    return res.status(400).json({ error: "Language and topic are required" });
  }

  try {
    const codeObj = await generateBuggyAndCorrect(language, topic);
    console.log("Generated codeObj:", codeObj);  // Add this line to debug
    res.json({
      buggyCode: codeObj.buggy,
      correctCode: codeObj.correct,
      language,
      topic
    });
  } catch (err) {
    console.error("AI generation error:", err);
    res.status(500).json({ error: "Failed to generate AI question" });
  }

});

// Check correct code
router.post("/generate-correct", async (req, res) => {
  const { buggyCode, language } = req.body;

  // Here you'd run the AI to fix code — placeholder for now
  const correctCode = buggyCode.replace("retrn", "return");

  res.json({ correctCode });
});

module.exports = router;
