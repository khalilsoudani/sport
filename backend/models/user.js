const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  password: String,
  role: String,
});

const user = mongoose.model("User", userSchema);

module.exports = user;
