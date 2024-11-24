const cron = require("node-cron");
const Event = require("../models/event");
const Student = require("../models/students");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (email, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject,
      text: message,
    });
    console.log(`Email sent to ${email}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

// Notification scheduler
const notificationScheduler = () => {
  //every 10 min
  cron.schedule("*/58 * * * * ", async () => {
    try {
      const events = await Event.find({});
      for (const event of events) {
        for (const studentId of event.student_id) {
          if (mongoose.Types.ObjectId.isValid(studentId)) {
            const student = await Student.findById(studentId);
            if (student) {
              await sendMail(
                student.email,
                `Reminder: Upcoming Event - ${event.title}`,
                `Hello ${student.name},\n\nYou are registered for the event "${event.title}" which will take place at ${event.location}.\n\nEvent Details:\nDate: ${event.date}\nTime: ${event.time}\n\nThank you for participating!`
              );
            }
          } else {
            console.error(`Invalid studentId: ${studentId}`);
          }
        }
      }
    } catch (err) {
      console.error("Error in notification scheduler:", err);
    }
  });
};

module.exports = notificationScheduler;
