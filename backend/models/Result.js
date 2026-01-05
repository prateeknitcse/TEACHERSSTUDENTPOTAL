const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true
  },
  score: Number,
  answers: Array
});

// 🚨 Prevent duplicate submissions (DB-level safety)
ResultSchema.index({ studentId: 1, testId: 1 }, { unique: true });

module.exports = mongoose.model("Result", ResultSchema);
