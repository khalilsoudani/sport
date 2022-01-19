const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  
  name: String,
  foundation: Number,
  country: String,
  stadium: String,
  img: String,
});

const team = mongoose.model("Team", teamSchema);

module.exports = team;
