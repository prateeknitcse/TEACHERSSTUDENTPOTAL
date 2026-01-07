const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role, className: user.className  },
    process.env.JWT_SECRET
  );

  res.json({ token, role: user.role });
});
// ⚠️ TEMP: Seed dummy users (REMOVE LATER)
router.get("/seed", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const User = require("../models/User");

  await User.deleteMany({}); // clear old users (optional)

  const adminPass = await bcrypt.hash("admin123", 10);
  const studentPass = await bcrypt.hash("student123", 10);

  await User.create([
    {
      name: "Admin",
      username: "admin",
      password: adminPass,
      role: "admin"
    },
    {
      name: "Prateek",
      username: "student1",
      password: studentPass,
      role: "student",
      className: "Class 9A"
    },
    {
      name: "Prateeksingh",
      username: "student2",
      password: studentPass,
      role: "student",
      className: "Class 9A"
    }
  ]);

  res.json({
    msg: "Dummy users created",
    admin: { username: "admin", password: "admin123" },
    student: { username: "student1", password: "student123" }
  });
});

module.exports = router;
