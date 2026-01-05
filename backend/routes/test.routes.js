const router = require("express").Router();
const Test = require("../models/Test");
const auth = require("../middleware/auth.middleware");

// 🔴 STUDENT: get tests by status
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

// 🔴 STUDENT: load test by id (LIVE ONLY)
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

module.exports = router;
