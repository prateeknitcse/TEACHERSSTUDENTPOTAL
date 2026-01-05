const router = require("express").Router();
const Result = require("../models/Result");
const auth = require("../middleware/auth.middleware");

router.post("/submit", auth, async (req, res) => {
  try {
    const { testId, score, answers } = req.body;
    const studentId = req.user.id;

    // 🔒 CHECK IF ALREADY SUBMITTED
    const existing = await Result.findOne({ studentId, testId });

    if (existing) {
      return res.status(400).json({
        msg: "You have already attempted this test"
      });
    }

    const result = await Result.create({
      studentId,
      testId,
      score,
      answers
    });

    res.json(result);

  } catch (err) {
    // Handle duplicate key error (DB-level)
    if (err.code === 11000) {
      return res.status(400).json({
        msg: "Test already submitted"
      });
    }

    res.status(500).json({ error: err.message });
  }
});


router.get("/my-latest", auth, async (req, res) => {
  try {
    const result = await Result.findOne({ studentId: req.user.id })
      .sort({ _id: -1 })
      .populate("testId");

    if (!result) {
      return res.status(404).json({ msg: "No result found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/student/my-tests", auth, async (req, res) => {
  try {
    const className = req.user.className;
    const now = new Date();

    const tests = await Test.find({ className });

    const upcoming = [];
    const live = [];
    const ended = [];

    tests.forEach(test => {
      if (now < test.startTime) upcoming.push(test);
      else if (now >= test.startTime && now <= test.endTime) live.push(test);
      else ended.push(test);
    });

    res.json({ upcoming, live, ended });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
