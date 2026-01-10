const router = require("express").Router();
const Test = require("../models/Test");
const Result = require("../models/Result");
const auth = require("../middleware/auth.middleware");

// 🧑‍🏫 ADMIN: CREATE TEST
router.post("/create", auth, async (req, res) => {
  try {
    const { className, title, startTime, endTime, duration, questions } = req.body;

    if (!className || !title || !startTime || !endTime || !duration || !questions) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const test = await Test.create({
      className,
      title,
      startTime,
      endTime,
      duration,
      questions,
      createdBy: req.user.id // ✅ FIX
    });

    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧑‍🎓 STUDENT: GET TESTS BY STATUS
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

// 🧑‍🎓 STUDENT: LOAD TEST BY ID
router.get("/by-id/:id", auth, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ msg: "Test not found" });
    }
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🏆 LEADERBOARD (ONLY AFTER TEST ENDS)
router.get("/leaderboard/:testId", auth, async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ msg: "Test not found" });
    }

    const now = new Date();
    if (now < test.endTime) {
      return res.status(403).json({
        msg: "Leaderboard will be available after the test ends"
      });
    }

    const results = await Result.find({ testId })
      .populate("studentId", "name")
      .sort({ score: -1, submittedAt: 1 });

    const leaderboard = results.map((r, index) => ({
      rank: index + 1,
      studentId: r.studentId._id.toString(),
      name: r.studentId.name,
      score: r.score
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
