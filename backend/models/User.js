const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: { type: String, enum: ["student", "admin"] },
  className: String
});

module.exports = mongoose.model("User", UserSchema);
