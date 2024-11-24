const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
});

const Coachs = mongoose.model("coach", coachSchema);

module.exports = Coachs;
