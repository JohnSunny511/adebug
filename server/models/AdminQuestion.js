const mongoose = require("mongoose");

const AdminQuestionSchema = new mongoose.Schema(
  {
    questionName: { type: String, required: true, trim: true },
    questionText: { type: String, required: true, trim: true },
    answerText: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminQuestion", AdminQuestionSchema);
