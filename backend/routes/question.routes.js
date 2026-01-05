const router = require("express").Router();
const Question = require("../models/Question");

router.post("/", async (req, res) => {
  await Question.create(req.body);
  res.json({ msg: "Question submitted" });
});

router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

router.put("/:id/reply", async (req, res) => {
  await Question.findByIdAndUpdate(req.params.id, {
    reply: req.body.reply
  });
  res.json({ msg: "Reply sent" });
});

module.exports = router;
