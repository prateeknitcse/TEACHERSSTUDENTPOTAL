const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  studentName: String,
  className: String,

  question: {
    type: String,
    required: true
  },

  answer: {
    type: String,
    default: null
  },

  isAnswered: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  answeredAt: Date
});

module.exports = mongoose.model("Question", questionSchema);
