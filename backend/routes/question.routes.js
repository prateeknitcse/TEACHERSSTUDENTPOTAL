const router = require("express").Router();
const Question = require("../models/Questions");
const auth = require("../middleware/auth.middleware");


// 🧑‍🎓 STUDENT: ASK QUESTION
router.post("/ask", auth, async (req, res) => {
  try {
    const { question, className } = req.body;

    const q = await Question.create({
      studentId: req.user.id,
      studentName: req.user.name,
      className,
      question
    });

    res.json(q);
  } catch (err) {
    res.status(500).json({ msg: "Failed to ask question" });
  }
});


// 🧑‍🎓 STUDENT: MY QUESTIONS
router.get("/my", auth, async (req, res) => {
  const questions = await Question.find({ studentId: req.user.id });

  res.json({
    all: questions,
    answered: questions.filter(q => q.isAnswered),
    pending: questions.filter(q => !q.isAnswered)
  });
});


// 🧑‍🏫 ADMIN: QUESTIONS BY CLASS
router.get("/class/:className", auth, async (req, res) => {
  const questions = await Question.find({
    className: req.params.className
  });

  res.json({
    unanswered: questions.filter(q => !q.isAnswered),
    answered: questions.filter(q => q.isAnswered)
  });
});


// 🧑‍🏫 ADMIN: ANSWER QUESTION
router.post("/answer/:id", auth, async (req, res) => {
  const { answer } = req.body;

  await Question.findByIdAndUpdate(req.params.id, {
    answer,
    isAnswered: true,
    answeredAt: new Date()
  });

  res.json({ msg: "Answered" });
});

module.exports = router;
