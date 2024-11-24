const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  student_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  category: { type: String, enum: ["Indoor", "Outdoor"], required: true },
});

const Event = mongoose.model("event", eventSchema);

module.exports = Event;
