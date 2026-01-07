const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");

// 👩‍🏫 ADMIN: ADD STUDENT
router.post("/add-student", auth, async (req, res) => {
  try {
    // Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { name, className } = req.body;

    if (!name || !className) {
      return res.status(400).json({ msg: "Name and class are required" });
    }

    // Generate username
    const username = name.toLowerCase().replace(/\s+/g, "");

    // Auto password
    const rawPassword = username + "123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Check if student already exists
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ msg: "Student already exists" });
    }

    const student = await User.create({
      name,
      username,
      password: hashedPassword,
      role: "student",
      className
    });

    res.json({
      msg: "Student created successfully",
      username,
      password: rawPassword
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 📋 GET ALL STUDENTS
router.get("/students", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const students = await User.find({ role: "student" })
    .select("name username className");

  res.json(students);
});

// ✏️ UPDATE STUDENT
router.put("/students/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const { name, className } = req.body;

  const student = await User.findById(req.params.id);
  if (!student || student.role !== "student") {
    return res.status(404).json({ msg: "Student not found" });
  }

  student.name = name || student.name;
  student.className = className || student.className;

  await student.save();
  res.json({ msg: "Student updated" });
});

// 🗑 DELETE STUDENT
router.delete("/students/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const student = await User.findById(req.params.id);
  if (!student || student.role !== "student") {
    return res.status(404).json({ msg: "Student not found" });
  }

  await student.deleteOne();
  res.json({ msg: "Student deleted" });
});


module.exports = router;
