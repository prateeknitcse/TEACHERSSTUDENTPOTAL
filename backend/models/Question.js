const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  question: String,
  reply: String
});

module.exports = mongoose.model("Question", QuestionSchema);
