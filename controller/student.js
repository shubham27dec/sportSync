const Students = require("../models/students");
const Coachs = require("../models/coach");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "student") {
      const existingStudent = await Students.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: "Student already exists" });
      }
      const newStudent = new Students({
        name,
        email,
        password: hashedPassword,
      });
      await newStudent.save();
      return res
        .status(201)
        .json({ message: "Student registered successfully" });
    } else if (role === "coach") {
      const existingCoach = await Coachs.findOne({ email });
      if (existingCoach) {
        return res.status(400).json({ message: "Coach already exists" });
      }
      const newCoach = new Coachs({ name, email, password: hashedPassword });
      await newCoach.save();
      return res.status(201).json({ message: "Coach registered successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const student = await Students.findOne({ email });
    if (student) {
      const match = await bcrypt.compare(password, student.password);
      if (match) {
        return res.status(200).json({
          message: "Student login successful",
          role: "student",
          name: student.name,
          id: student._id,
        });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    const coach = await Coachs.findOne({ email });
    if (coach) {
      const match = await bcrypt.compare(password, coach.password);
      if (match) {
        return res.status(200).json({
          message: "Coach login successful",
          role: "coach",
          name: coach.name,
        });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
