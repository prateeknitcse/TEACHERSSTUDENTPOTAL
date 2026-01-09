const router = require("express").Router();
const News = require("../models/News");
const auth = require("../middleware/auth.middleware");

// 🧑‍🏫 ADMIN: CREATE NEWS
router.post("/create", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const news = await News.create({
      title,
      message,
      createdBy: req.user.name
    });

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create news" });
  }
});

// 🧑‍🎓 STUDENT: GET ACTIVE NEWS
router.get("/all", auth, async (req, res) => {
  const news = await News.find({ isActive: true })
    .sort({ createdAt: -1 });

  res.json(news);
});

// 🧑‍🏫 ADMIN: DELETE NEWS
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  await News.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
