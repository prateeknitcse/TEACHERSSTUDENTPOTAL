const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  questions: [
    {
      question: String,
      options: [String],
      correct: Number
    }
  ],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
  type: Number,
  required: true // in minutes
}

}, { timestamps: true });

module.exports = mongoose.model("Test", TestSchema);
