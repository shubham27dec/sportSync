const Event = require("../models/event");
const mongoose = require("mongoose");

exports.addEvent = async (req, res) => {
  try {
    const { title, location, description, date, time, category } = req.body;

    if (!title || !date || !time) {
      return res
        .status(400)
        .json({ error: "Title, date, and time are required." });
    }

    const newEvent = new Event({
      title,
      location,
      description,
      date,
      time,
      category,
    });

    const savedEvent = await newEvent.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error adding event:", error);
    res
      .status(500)
      .json({ error: "Failed to add event. Please try again later." });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    const formattedEvents = events.map((event) => {
      const formattedDate = event.date
        ? event.date.toISOString().split("T")[0]
        : "No Date";
      return {
        ...event.toObject(),
        date: formattedDate,
      };
    });

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch events. Please try again later." });
  }
};

exports.editEvent = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res
      .status(500)
      .json({ error: "Failed to update event. Please try again later." });
  }
};
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error while deleting the event." });
  }
};

exports.getOutdoorEvents = async (req, res) => {
  try {
    const outdoorEvents = await Event.find({ category: "Outdoor" });
    res.status(200).json({
      success: true,
      data: outdoorEvents,
    });
  } catch (error) {
    console.error("Error fetching outdoor events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch outdoor events. Please try again later.",
    });
  }
};
exports.getIndoorEvents = async (req, res) => {
  try {
    const indoorEvents = await Event.find({ category: "Indoor" });
    res.status(200).json({
      success: true,
      data: indoorEvents,
    });
  } catch (error) {
    console.error("Error fetching indoor events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch indoor events. Please try again later.",
    });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const eventId = req.params.id;

    if (!studentId || !eventId) {
      return res.status(400).json({ message: "Invalid studentId or eventId" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId format" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!Array.isArray(event.student_id)) {
      event.student_id = [];
    }

    if (event.student_id.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    event.student_id.push(studentId);
    await event.save();

    res.status(200).json({ message: "Registration successful", event });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
