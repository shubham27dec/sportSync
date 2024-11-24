// const dotenv = require("dotenv");
// dotenv.config();

const mongoose = require("mongoose");

const dbUrl = "mongodb://localhost:27017/MyDatabase";
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database is connected");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

module.exports = connectDB;
