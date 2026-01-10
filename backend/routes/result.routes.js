const router = require("express").Router();
const Result = require("../models/Result");
const Test = require("../models/Test");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");

/* ============================
   SUBMIT RESULT
============================ */
router.post("/submit", auth, async (req, res) => {
  try {
    const { testId, score, answers } = req.body;
    const studentId = req.user.id;

    // 🔒 Prevent multiple attempts
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
    if (err.code === 11000) {
      return res.status(400).json({
        msg: "Test already submitted"
      });
    }
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   STUDENT: MY LATEST RESULT
============================ */
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

/* ============================
   ✅ STUDENT: ALL MY RESULTS (REQUIRED FIX)
============================ */
router.get("/my", auth, async (req, res) => {
  try {
    const results = await Result.find({
      studentId: req.user.id
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   ADMIN ANALYTICS
============================ */
router.get("/analytics", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const tests = await Test.find().sort({ createdAt: -1 });
    const analytics = [];

    for (const test of tests) {
      const results = await Result.find({ testId: test._id })
        .populate("studentId", "name")
        .sort({ score: -1, submittedAt: 1 });

      const attempts = results.length;
      let avgScore = 0;
      let topper = null;

      if (attempts > 0) {
        avgScore =
          results.reduce((sum, r) => sum + r.score, 0) / attempts;

        topper = {
          name: results[0].studentId.name,
          score: results[0].score
        };
      }

      analytics.push({
        testId: test._id,
        title: test.title,
        className: test.className,
        attempts,
        avgScore: avgScore.toFixed(2),
        topper
      });
    }

    res.json(analytics);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
